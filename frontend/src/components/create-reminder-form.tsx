"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateReminder } from "@/hooks/use-reminders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(50),
    message: z.string().min(5, "Message must be at least 5 characters").max(200),
    phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164 required)"),
    // Splitting date and time for better UX, then combining
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    timezone: z.string().min(1, "Timezone is required"),
});

export function CreateReminderForm() {
    const router = useRouter();
    const createMutation = useCreateReminder();

    const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            message: "",
            phone_number: "",
            date: "",
            time: "",
            timezone: defaultTimezone,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Combine date and time
        const dateTimeString = `${values.date}T${values.time}:00`;
        const scheduledDate = new Date(dateTimeString);

        // Check if in past (simple check, precise check needs timezone logic but browser handles local usually)
        if (scheduledDate < new Date()) {
            form.setError("time", { message: "Time must be in the future" });
            return;
        }

        createMutation.mutate(
            {
                title: values.title,
                message: values.message,
                phone_number: values.phone_number,
                scheduled_time: scheduledDate.toISOString(),
                timezone: values.timezone,
            },
            {
                onSuccess: () => {
                    toast.success("Reminder created successfully");
                    router.push("/");
                },
                onError: (error) => {
                    toast.error("Failed to create reminder: " + error.message);
                },
            }
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Buy Milk" {...field} />
                            </FormControl>
                            <FormDescription>A short title for your reminder.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Don't forget to buy milk on the way home." {...field} />
                            </FormControl>
                            <FormDescription>The message that will be spoken during the call.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+14155552671" type="tel" {...field} />
                            </FormControl>
                            <FormDescription>E.164 format (e.g. +1...)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a timezone" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                                    <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                                    <SelectItem value="Europe/London">London (UK)</SelectItem>
                                    <SelectItem value="Asia/Tokyo">Tokyo (Japan)</SelectItem>
                                    {/* Add more as needed or use a library to list all */}
                                </SelectContent>
                            </Select>
                            <FormDescription>The timezone for the reminder.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Reminder
                    </Button>
                </div>
            </form>
        </Form>
    );
}
