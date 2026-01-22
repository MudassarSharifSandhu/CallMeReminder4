from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.database import SessionLocal
from app.crud.reminder import get_due_reminders, update_reminder
from app.schemas.reminder import ReminderUpdate
from app.schemas.enums import ReminderStatus
from app.services.vapi import vapi_service
import logging
import asyncio
import pytz

logger = logging.getLogger(__name__)

async def process_reminders():
    """
    Background job to find due reminders and trigger calls.
    """
    logger.info("Checking for due reminders...")
    async with SessionLocal() as db:
        due_reminders = await get_due_reminders(db)
        if not due_reminders:
            return

        logger.info(f"Found {len(due_reminders)} due reminders.")
        for reminder in due_reminders:
            try:
                # Trigger the call
                success = await vapi_service.trigger_call(
                    phone_number=reminder.phone_number,
                    message=reminder.message
                )
                
                # Update status
                status = ReminderStatus.COMPLETED if success else ReminderStatus.FAILED
                await update_reminder(
                    db, 
                    reminder.id, 
                    ReminderUpdate(status=status)
                )
                await db.commit()
                logger.info(f"Reminder {reminder.id} processed with status: {status}")
            except Exception as e:
                logger.error(f"Error processing reminder {reminder.id}: {str(e)}")
                await db.rollback()

class SchedulerService:
    def __init__(self):
        # Explicitly set timezone to UTC to avoid tzlocal crashing on system misconfigurations
        self.scheduler = AsyncIOScheduler(timezone=pytz.utc)

    def start(self):
        self.scheduler.add_job(
            process_reminders,
            IntervalTrigger(seconds=30, timezone=pytz.utc),  # Check every 30 seconds
            id="process_reminders",
            name="Process due reminders and trigger calls",
            replace_existing=True
        )
        self.scheduler.start()
        logger.info("Scheduler started.")

    def stop(self):
        self.scheduler.shutdown()
        logger.info("Scheduler stopped.")

scheduler_service = SchedulerService()
