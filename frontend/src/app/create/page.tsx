import { CreateReminderForm } from "@/components/create-reminder-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePage() {
    return (
        <div className="container py-8 mx-auto px-4 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Create Reminder</CardTitle>
                    <CardDescription>
                        Schedule a new call reminder. We will call you at the specified time.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateReminderForm />
                </CardContent>
            </Card>
        </div>
    );
}
