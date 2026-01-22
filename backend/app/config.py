from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Call Me Reminder"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # Vapi
    VAPI_API_KEY: str
    VAPI_ASSISTANT_ID: str
    VAPI_PHONE_NUMBER_ID: str
    
    # Twilio (Optional, depending on Vapi setup)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
