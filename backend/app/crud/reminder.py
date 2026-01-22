from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.schemas.enums import ReminderStatus
from datetime import datetime, timezone as dt_timezone
import pytz
import uuid
from typing import List, Optional

async def get_reminder(db: AsyncSession, reminder_id: uuid.UUID) -> Optional[Reminder]:
    result = await db.execute(select(Reminder).where(Reminder.id == reminder_id))
    return result.scalar_one_or_none()

async def get_reminders(
    db: AsyncSession, 
    status: Optional[ReminderStatus] = None,
    skip: int = 0, 
    limit: int = 100
) -> List[Reminder]:
    query = select(Reminder)
    if status:
        query = query.where(Reminder.status == status)
    
    query = query.order_by(Reminder.scheduled_time.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())

async def create_reminder(db: AsyncSession, reminder: ReminderCreate) -> Reminder:
    db_reminder = Reminder(
        title=reminder.title,
        message=reminder.message,
        phone_number=reminder.phone_number,
        scheduled_time=reminder.scheduled_time,
        timezone=reminder.timezone,
        status=ReminderStatus.SCHEDULED
    )
    db.add(db_reminder)
    await db.flush()
    await db.refresh(db_reminder)
    return db_reminder

async def update_reminder(
    db: AsyncSession, 
    reminder_id: uuid.UUID, 
    reminder_update: ReminderUpdate
) -> Optional[Reminder]:
    db_reminder = await get_reminder(db, reminder_id)
    if not db_reminder:
        return None
    
    update_data = reminder_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reminder, key, value)
    
    await db.flush()
    await db.refresh(db_reminder)
    return db_reminder

async def delete_reminder(db: AsyncSession, reminder_id: uuid.UUID) -> bool:
    result = await db.execute(delete(Reminder).where(Reminder.id == reminder_id))
    return result.rowcount > 0

async def get_due_reminders(db: AsyncSession) -> List[Reminder]:
    """Get reminders that are scheduled and due (scheduled_time <= now)."""
    now = datetime.now(dt_timezone.utc)
    query = select(Reminder).where(
        Reminder.status == ReminderStatus.SCHEDULED,
        Reminder.scheduled_time <= now
    )
    result = await db.execute(query)
    return list(result.scalars().all())
