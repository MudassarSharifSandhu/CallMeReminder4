# Call Me Reminder - Frontend

A premium reminder application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
This frontend connects to a FastAPI backend to schedule and manage call reminders.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI)
- **State Management**: Tanstack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd call_reminder_new_fe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file (optional, defaults are set for local dev):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

## Backend Integration

This frontend expects a backend running at `http://localhost:8000/api/v1`.
Ensure the backend supports the following endpoints:
- `GET /reminders/`
- `POST /reminders/`
- `PATCH /reminders/{id}`
- `DELETE /reminders/{id}`
- `trigger_call` (handled by backend scheduler)

## Features

- **Dashboard**: View all reminders (Scheduled, Completed, Failed).
- **Create Reminder**: Schedule a new call with phone number validation and timezone support.
- **Status Tracking**: Visual badges for reminder status.
- **Delete Reminder**: Remove unwanted reminders.
- **Responsive Design**: precise layout on mobile and desktop.
- **Dark Mode Support**: System preference detection.

## Design Decisions

- **Client-Side Filtering**: For a smoother UX on small datasets, reminders are filtered client-side (Search and Status tabs).
- **React Query**: Used for data fetching to ensure fresh data and easy cache invalidation (e.g., auto-refresh after create/delete).
- **Zod Validation**: Ensures data integrity before sending to the API.
- **Timezone**: User's local timezone is detected by default to ensure calls happen at the expected time.

## Testing

1. Start the backend.
2. Start the frontend (`npm run dev`).
3. Create a reminder for 2 minutes in the future.
4. Watch the dashboard for the reminder card.
5. Wait for the call (triggered by backend).
6. Refresh or wait for status update to "Completed".
