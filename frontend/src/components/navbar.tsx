import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between mx-auto px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Bell className="h-6 w-6 text-primary" />
                    <span>CallMeReminder</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link href="/create">
                        <Button>Create Reminder</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
