import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export type ReminderStatus = 'scheduled' | 'completed' | 'failed';

export interface Reminder {
    id: number;
    title: string;
    message: string;
    phone_number: string;
    scheduled_time: string; // ISO string
    timezone: string;
    status: ReminderStatus;
    created_at?: string;
}

export interface CreateReminderPayload {
    title: string;
    message: string;
    phone_number: string;
    scheduled_time: string; // ISO string
    timezone: string;
}

export interface UpdateReminderPayload {
    title?: string;
    message?: string;
    phone_number?: string;
    scheduled_time?: string;
    timezone?: string;
}

export const getReminders = async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get<Reminder[]>('/reminders/', { params });
    return response.data;
};

export const createReminder = async (data: CreateReminderPayload) => {
    const response = await api.post<Reminder>('/reminders/', data);
    return response.data;
};

export const updateReminder = async (id: number, data: UpdateReminderPayload) => {
    const response = await api.patch<Reminder>(`/reminders/${id}`, data);
    return response.data;
};

export const deleteReminder = async (id: number) => {
    await api.delete(`/reminders/${id}`);
};
