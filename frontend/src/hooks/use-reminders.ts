import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReminders, createReminder, updateReminder, deleteReminder } from '@/lib/api';

export const useReminders = (status?: string) => {
    return useQuery({
        queryKey: ['reminders', status],
        queryFn: () => getReminders(status),
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
        },
    });
};

export const useUpdateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateReminder>[1] }) =>
            updateReminder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
        },
    });
};

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
        },
    });
};
