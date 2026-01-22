import httpx
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class VapiService:
    def __init__(self):
        self.api_key = settings.VAPI_API_KEY
        self.base_url = "https://api.vapi.ai"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def trigger_call(self, phone_number: str, message: str) -> bool:
        """
        Triggers a call via Vapi.
        Uses the assistant and phone number ID from settings.
        """
        payload = {
            "assistantId": settings.VAPI_ASSISTANT_ID,
            "phoneNumberId": settings.VAPI_PHONE_NUMBER_ID,
            "customer": {
                "number": phone_number
            },
            "assistantOverrides": {
                "variableValues": {
                    "reminder_message": message
                }
            }
        }

        # Alternative: Using direct 'assistant' object if assistantId is not pre-configured
        # payload = {
        #     "assistant": {
        #         "firstMessage": f"Hello, this is your reminder: {message}",
        #         "model": {"provider": "openai", "model": "gpt-3.5-turbo"},
        #         "voice": {"provider": "playht", "voiceId": "jennifer"}
        #     },
        #     "phoneNumberId": settings.VAPI_PHONE_NUMBER_ID,
        #     "customer": {"number": phone_number}
        # }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/call/phone",
                    json=payload,
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                logger.info(f"Vapi call triggered successfully: {data.get('id')}")
                return True
            except httpx.HTTPStatusError as e:
                logger.error(f"Vapi API error: {e.response.text}")
                return False
            except Exception as e:
                logger.error(f"Unexpected error triggering Vapi call: {str(e)}")
                return False

vapi_service = VapiService()
