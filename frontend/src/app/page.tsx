"use client";

import { useState } from "react";
import { useReminders } from "@/hooks/use-reminders";
import { ReminderCard } from "@/components/reminder-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Search } from "lucide-react";
import { Reminder } from "@/lib/api";

export default function Dashboard() {
  const { data: reminders, isLoading, isError } = useReminders();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredReminders = reminders?.filter((reminder: Reminder) => {
    const matchesFilter = filter === "all" || reminder.status === filter;
    const matchesSearch =
      reminder.title.toLowerCase().includes(search.toLowerCase()) ||
      reminder.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedReminders = filteredReminders?.sort((a, b) => {
    // Sort by scheduled_time ascending (soonest first)
    return new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime();
  });

  if (isError) {
    return (
      <div className="container py-8 mx-auto px-4 text-center text-red-500">
        Failed to load reminders. Please try again later.
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your upcoming call reminders.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedReminders && sortedReminders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50">
          {sortedReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      ) : (
        <EmptyState filter={filter} />
      )}
    </div>
  );
}
