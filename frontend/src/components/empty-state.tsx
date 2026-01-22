import { BellOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({ filter }: { filter?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-50">
            <div className="bg-muted rounded-full p-4 mb-4">
                <BellOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No reminders found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
                {filter && filter !== "all"
                    ? `You don't have any ${filter} reminders.`
                    : "You haven't created any reminders yet. Set one up to get a call!"}
            </p>
            {(!filter || filter === "all") && (
                <Link href="/create">
                    <Button>Create Reminder</Button>
                </Link>
            )}
        </div>
    );
}
