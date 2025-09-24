import { Lightbulb } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardPayload } from "@/types/dashboard";

interface HighlightsProps {
  highlights: DashboardPayload["highlights"];
}

export function HighlightsGrid({ highlights }: HighlightsProps) {
  if (!highlights.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4" /> Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.id} className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 p-4">
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.link ? (
              <a href={item.link} className="text-sm font-medium text-primary hover:underline">
                View more
              </a>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}