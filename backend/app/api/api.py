from fastapi import APIRouter
from app.api.v1.endpoint import reminder

api_router = APIRouter()
api_router.include_router(reminder.router, prefix="/reminders", tags=["reminders"])
