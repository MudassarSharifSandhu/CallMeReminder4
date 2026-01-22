from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional
from app.schemas.enums import ReminderStatus
import uuid
import phonenumbers

class ReminderBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    phone_number: str = Field(..., description="E.164 format recommended")
    scheduled_time: datetime
    timezone: str = Field(..., description="User's local timezone")

    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        try:
            parsed = phonenumbers.parse(v)
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number format")
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except Exception:
            raise ValueError("Invalid phone number format")

    @field_validator('scheduled_time')
    @classmethod
    def validate_time(cls, v: datetime) -> datetime:
        # Pydantic doesn't know the current time without a helper or context,
        # but we can do a basic check. Actual validation might happen in CRUD/API.
        return v

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    message: Optional[str] = Field(None, min_length=1)
    phone_number: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    timezone: Optional[str] = None
    status: Optional[ReminderStatus] = None

    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        try:
            parsed = phonenumbers.parse(v)
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number format")
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except Exception:
            raise ValueError("Invalid phone number format")

class Reminder(ReminderBase):
    id: uuid.UUID
    status: ReminderStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
