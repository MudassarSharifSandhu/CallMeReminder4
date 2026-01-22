import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReminderStatus } from "@/lib/api";

interface StatusBadgeProps {
    status: ReminderStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const variants = {
        scheduled: "bg-blue-500 hover:bg-blue-600 text-white",
        completed: "bg-green-500 hover:bg-green-600 text-white",
        failed: "bg-red-500 hover:bg-red-600 text-white",
    };

    const labels = {
        scheduled: "Scheduled",
        completed: "Completed",
        failed: "Failed",
    };

    return (
        <Badge className={cn(variants[status], className)} variant="secondary">
            {labels[status]}
        </Badge>
    );
}
