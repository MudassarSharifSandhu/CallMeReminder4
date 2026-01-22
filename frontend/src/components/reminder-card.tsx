import { format, formatDistanceToNow, parseISO } from "date-fns";
import { MoreVertical, Calendar, Phone, Clock, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/status-badge";
import { Reminder } from "@/lib/api";
import { useState } from "react";
import { useDeleteReminder } from "@/hooks/use-reminders";
import { toast } from "sonner";
import Link from "next/link";

interface ReminderCardProps {
    reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
    const deleteMutation = useDeleteReminder();
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleDelete = () => {
        deleteMutation.mutate(reminder.id, {
            onSuccess: () => {
                toast.success("Reminder deleted");
                setIsAlertOpen(false);
            },
            onError: () => {
                toast.error("Failed to delete reminder");
            },
        });
    };

    const formattedDate = format(parseISO(reminder.scheduled_time), "PPP p");
    let timeRemaining = "";
    try {
        const scheduled = parseISO(reminder.scheduled_time);
        if (scheduled > new Date() && reminder.status === 'scheduled') {
            timeRemaining = formatDistanceToNow(scheduled, { addSuffix: true });
        }
    } catch (e) {
        // invalid date
    }

    const maskPhone = (phone: string) => {
        if (phone.length < 8) return phone;
        return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">{reminder.title}</CardTitle>
                    <StatusBadge status={reminder.status} />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <Link href={`/edit/${reminder.id}`}>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link> */}
                        <DropdownMenuItem onClick={() => setIsAlertOpen(true)} className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {reminder.message}
                </p>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formattedDate}
                    </div>
                    {timeRemaining && (
                        <div className="flex items-center text-blue-600 font-medium">
                            <Clock className="mr-2 h-4 w-4" />
                            Calling {timeRemaining}
                        </div>
                    )}
                    <div className="flex items-center text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        {maskPhone(reminder.phone_number)}
                    </div>
                </div>
            </CardContent>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the reminder.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
