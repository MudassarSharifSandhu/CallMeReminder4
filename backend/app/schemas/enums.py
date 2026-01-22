from enum import Enum

class ReminderStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    FAILED = "failed"
