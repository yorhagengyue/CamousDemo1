import { CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TimelineEvent } from "@/types/dashboard";

interface TimelineProps {
  events: TimelineEvent[];
}

export function TimelineList({ events }: TimelineProps) {
  if (!events.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{event.title}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            {event.link ? (
              <a
                href={event.link}
                className="text-sm font-medium text-primary hover:underline"
              >
                View details
              </a>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}