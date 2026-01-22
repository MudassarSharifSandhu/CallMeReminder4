from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from datetime import datetime, timezone as dt_timezone
import pytz

from app.database import get_db
from app.schemas.reminder import Reminder, ReminderCreate, ReminderUpdate
from app.schemas.enums import ReminderStatus
from app.crud import reminder as crud_reminder

router = APIRouter()

@router.post("/", response_model=Reminder, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    *,
    db: AsyncSession = Depends(get_db),
    reminder_in: ReminderCreate
):
    """
    Create a new reminder.
    Validation: scheduled_time must be in the future.
    """
    try:
        tz = pytz.timezone(reminder_in.timezone)
    except pytz.UnknownTimeZoneError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid timezone: {reminder_in.timezone}"
        )

    # Localize naive datetime if necessary
    if reminder_in.scheduled_time.tzinfo is None:
        localized_time = tz.localize(reminder_in.scheduled_time)
    else:
        localized_time = reminder_in.scheduled_time.astimezone(tz)

    # Convert to UTC for consistency
    utc_time = localized_time.astimezone(pytz.UTC)
    
    if utc_time <= datetime.now(pytz.UTC):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reminder scheduled time must be in the future."
        )
    
    # Update input to use the normalized UTC time
    reminder_in.scheduled_time = utc_time
    
    return await crud_reminder.create_reminder(db, reminder_in)

@router.get("/", response_model=List[Reminder])
async def list_reminders(
    db: AsyncSession = Depends(get_db),
    status: Optional[ReminderStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """
    List all reminders with optional filtering by status.
    """
    return await crud_reminder.get_reminders(db, status=status, skip=skip, limit=limit)

@router.get("/{reminder_id}", response_model=Reminder)
async def get_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific reminder by ID.
    """
    db_reminder = await crud_reminder.get_reminder(db, reminder_id)
    if not db_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    return db_reminder

@router.patch("/{reminder_id}", response_model=Reminder)
async def update_reminder(
    reminder_id: uuid.UUID,
    reminder_in: ReminderUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update an existing reminder.
    """
    # If updating scheduled_time or timezone, we need to re-validate/localize
    if reminder_in.scheduled_time or reminder_in.timezone:
        db_reminder = await crud_reminder.get_reminder(db, reminder_id)
        if not db_reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reminder not found"
            )
        
        # Use new timezone if provided, otherwise existing one
        tz_str = reminder_in.timezone or db_reminder.timezone
        try:
            tz = pytz.timezone(tz_str)
        except pytz.UnknownTimeZoneError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid timezone: {tz_str}"
            )
        
        if reminder_in.scheduled_time:
            # Localize naive datetime if necessary
            if reminder_in.scheduled_time.tzinfo is None:
                localized_time = tz.localize(reminder_in.scheduled_time)
            else:
                localized_time = reminder_in.scheduled_time.astimezone(tz)
            
            # Convert to UTC
            reminder_in.scheduled_time = localized_time.astimezone(pytz.UTC)

    db_reminder = await crud_reminder.update_reminder(db, reminder_id, reminder_in)
    if not db_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    return db_reminder

@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a reminder.
    """
    success = await crud_reminder.delete_reminder(db, reminder_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    return None
