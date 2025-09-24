import { BarChart3, Hourglass } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricGrid } from "@/features/dashboard/components/metric-grid";
import { TimelineList } from "@/features/dashboard/components/timeline-list";
import { WorklistCard } from "@/features/dashboard/components/worklist-card";
import { HighlightsGrid } from "@/features/dashboard/components/highlights-grid";
import type { DashboardPayload } from "@/types/dashboard";

interface HodDashboardProps {
  data: DashboardPayload;
  escalationCount?: number;
}

export function HodDashboard({ data, escalationCount = 0 }: HodDashboardProps) {
  return (
    <div className="grid gap-6">
      <MetricGrid metrics={data.metrics} columns={4} />

      <div className="grid gap-6 md:grid-cols-2">
        <WorklistCard title="Approvals" items={data.worklist} />
        <TimelineList events={data.timeline} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hourglass className="h-4 w-4" /> Escalations Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{escalationCount}</p>
            <p className="text-sm text-muted-foreground">
              Requests awaiting Head of Department action.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" /> Department KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {data.metrics.slice(0, 3).map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <span>{metric.label}</span>
                <span className="font-medium text-foreground">{metric.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <HighlightsGrid highlights={data.highlights} />
    </div>
  );
}