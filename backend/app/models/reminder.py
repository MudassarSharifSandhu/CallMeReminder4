from sqlalchemy import String, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from app.schemas.enums import ReminderStatus
from datetime import datetime, timezone as dt_timezone
import uuid

class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    scheduled_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    timezone: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[ReminderStatus] = mapped_column(
        SQLEnum(ReminderStatus), 
        default=ReminderStatus.SCHEDULED,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(dt_timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(dt_timezone.utc), 
        onupdate=lambda: datetime.now(dt_timezone.utc)
    )
