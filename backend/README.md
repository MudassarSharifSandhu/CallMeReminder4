# Call Me Reminder Backend (FastAPI)

A robust backend service for scheduling phone call reminders using FastAPI, PostgreSQL, and Vapi.

## Tech Stack
- **FastAPI**: Modern, high-performance web framework for Python.
- **SQLAlchemy 2.0**: Database toolkit and ORM (Async support).
- **PostgreSQL**: Reliable relational database.
- **APScheduler**: Lightweight background task scheduler.
- **Vapi**: Voice AI platform for triggering outbound calls.

## Prerequisites
- Python 3.12+
- PostgreSQL database
- Vapi API Key and configured Assistant.

## Setup Instructions

1. **Clone the Repository** (or use the provided structure).
2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Migrations**:
   The project uses Alembic for database migrations. To run the migrations and create the tables:
   ```bash
   alembic upgrade head
   ```

5. **Configure Environment Variables**:
   Create a `.env` file in the root directory (using `.env.example` or the template below):
   ```env
   DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/call_reminder"
   VAPI_API_KEY="your_vapi_api_key"
   VAPI_ASSISTANT_ID="your_assistant_id"
   VAPI_PHONE_NUMBER_ID="your_vapi_phone_number_id"
   ```
5. **Run the Application**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The server will start at `http://localhost:8000`.

## Key Design Decisions
- **Async Execution**: Used `SQLAlchemy` async support and `FastAPI` async endpoints for high concurrency.
- **APScheduler**: Chosen for its simplicity in handling in-process background tasks without requiring Redis/Celery for a take-home test scope.
- **Vapi Integration**: Dynamic message passing via assistant overrides for personalized call content.
- **E.164 Validation**: Strict phone number validation using the `phonenumbers` library.

## API Documentation
Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## How to Test in Postman

### 1. Create a Reminder
- **Method**: `POST`
- **URL**: `http://localhost:8000/api/v1/reminders/`
- **Body** (JSON):
  ```json
  {
    "title": "Milk Reminder",
    "message": "Don't forget to buy milk on your way home!",
    "phone_number": "+14155552671",
    "scheduled_time": "2026-01-22T21:00:00", 
    "timezone": "UTC"
  }
  ```
  *Note: Ensure `scheduled_time` is in the future.*

### 2. List Reminders
- **Method**: `GET`
- **URL**: `http://localhost:8000/api/v1/reminders/`
- **Query Params (Optional)**: `status=scheduled`, `limit=10`

### 3. Update a Reminder
- **Method**: `PATCH`
- **URL**: `http://localhost:8000/api/v1/reminders/{reminder_id}`
- **Body** (JSON):
  ```json
  {
    "title": "Updated Title"
  }
  ```

### 4. Delete a Reminder
- **Method**: `DELETE`
- **URL**: `http://localhost:8000/api/v1/reminders/{reminder_id}`

### 5. Triggering Workflow
1. Create a reminder for 2 minutes from now.
2. Check the logs/console. Every 30 seconds, the scheduler polls for due reminders.
3. When the time hits, you'll see a log: `Vapi call triggered successfully`.
4. The reminder status will automatically change from `scheduled` to `completed` (or `failed`).
