# Call Me Reminder

A full-stack reminder application that schedules and triggers automated phone calls using AI voice technology. Built with FastAPI, Next.js, PostgreSQL, and Vapi.

## 🏗️ Architecture

This project consists of two main components:

- **Backend** (`/backend`): FastAPI service handling reminder scheduling, database operations, and Vapi integration
- **Frontend** (`/frontend`): Next.js application providing a premium UI for managing reminders

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL** database
- **Vapi Account** with API key and configured assistant

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd call_reminder
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Backend Environment**:
   
   Create `backend/.env` file:
   ```env
   DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/call_reminder"
   VAPI_API_KEY="your_vapi_api_key"
   VAPI_ASSISTANT_ID="your_assistant_id"
   VAPI_PHONE_NUMBER_ID="your_vapi_phone_number_id"
   ```

4. **Run Database Migrations**:
   ```bash
   cd backend
   alembic upgrade head
   ```

5. **Start Backend Server**:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   Backend runs at `http://localhost:8000`

6. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

7. **Configure Frontend Environment** (optional):
   
   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

8. **Start Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs at `http://localhost:3000`

## 📚 Tech Stack

### Backend
- **FastAPI**: Modern, high-performance web framework
- **SQLAlchemy 2.0**: Async ORM for database operations
- **PostgreSQL**: Relational database
- **APScheduler**: Background task scheduler for reminder polling
- **Vapi**: AI voice platform for outbound calls
- **Alembic**: Database migration tool

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Premium component library (Radix UI)
- **Tanstack Query**: Data fetching and caching
- **React Hook Form + Zod**: Form handling and validation
- **Lucide React**: Icon library

## 🎯 Features

- ✅ **Schedule Call Reminders**: Set up automated phone calls with custom messages
- ✅ **Timezone Support**: Schedule calls in any timezone
- ✅ **Phone Number Validation**: E.164 format validation
- ✅ **Status Tracking**: Monitor reminder status (Scheduled, Completed, Failed)
- ✅ **Responsive Design**: Works seamlessly on mobile and desktop
- ✅ **Dark Mode**: System preference detection
- ✅ **Real-time Updates**: Auto-refresh with React Query
- ✅ **RESTful API**: Full CRUD operations for reminders

## 📖 Usage

1. **Create a Reminder**:
   - Open the frontend at `http://localhost:3000`
   - Fill in the reminder form with title, message, phone number, and scheduled time
   - Click "Schedule Reminder"

2. **View Reminders**:
   - Dashboard displays all reminders with status badges
   - Filter by status: All, Scheduled, Completed, Failed
   - Search by title or message

3. **Delete Reminders**:
   - Click the delete button on any reminder card
   - Confirm deletion in the dialog

4. **Automated Calls**:
   - Backend scheduler polls every 30 seconds for due reminders
   - When time arrives, Vapi triggers the phone call
   - Status automatically updates to "Completed" or "Failed"

## 🔧 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

- `GET /api/v1/reminders/` - List all reminders
- `POST /api/v1/reminders/` - Create a new reminder
- `PATCH /api/v1/reminders/{id}` - Update a reminder
- `DELETE /api/v1/reminders/{id}` - Delete a reminder

## 🧪 Testing

### Manual Testing Flow

1. Start both backend and frontend servers
2. Create a reminder for 2-3 minutes in the future
3. Watch the dashboard for the reminder card
4. Monitor backend logs for scheduler activity
5. Wait for the scheduled time
6. Verify the call is triggered (check Vapi dashboard)
7. Confirm status updates to "Completed"

### Postman Testing

See `backend/README.md` for detailed Postman examples.

## 📁 Project Structure

```
call_reminder/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Configuration
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── main.py       # Application entry point
│   ├── migrations/       # Alembic migrations
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API client
│   │   └── types/        # TypeScript types
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔐 Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL`: PostgreSQL connection string
- `VAPI_API_KEY`: Your Vapi API key
- `VAPI_ASSISTANT_ID`: Vapi assistant ID
- `VAPI_PHONE_NUMBER_ID`: Vapi phone number ID

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000/api/v1`)

## 🛠️ Development

### Backend Development

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Database Migrations

Create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
alembic upgrade head
```

## 📝 Design Decisions

- **Async Architecture**: Full async/await pattern for high concurrency
- **APScheduler**: In-process scheduling for simplicity (suitable for single-instance deployments)
- **React Query**: Client-side caching and automatic refetching
- **E.164 Validation**: Strict phone number format validation
- **Timezone Handling**: User's local timezone detected automatically
- **Component Library**: shadcn/ui for consistent, accessible UI components

## 🚧 Known Limitations

- **Single Instance**: APScheduler is in-process; for multi-instance deployments, consider Redis/Celery
- **No Authentication**: Currently no user authentication (suitable for demo/testing)
- **Client-Side Filtering**: Reminder filtering happens client-side (fine for small datasets)

## 📄 License

This project is part of a take-home assessment.

## 🤝 Contributing

For detailed component-specific documentation, see:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
