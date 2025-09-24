import { NotebookPen, Users2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricGrid } from "@/features/dashboard/components/metric-grid";
import { TimelineList } from "@/features/dashboard/components/timeline-list";
import { WorklistCard } from "@/features/dashboard/components/worklist-card";
import { HighlightsGrid } from "@/features/dashboard/components/highlights-grid";
import type { DashboardPayload } from "@/types/dashboard";
import type { LeaveOverview } from "@/types/attendance";

interface TeacherDashboardProps {
  data: DashboardPayload;
  leave?: LeaveOverview;
  pendingApprovalsCount?: number;
}

export function TeacherDashboard({ data, leave, pendingApprovalsCount = 0 }: TeacherDashboardProps) {
  return (
    <div className="grid gap-6">
      <MetricGrid metrics={data.metrics} columns={3} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <WorklistCard title="Today's Classes" items={data.worklist} />
          <TimelineList events={data.timeline} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users2 className="h-4 w-4" /> Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{pendingApprovalsCount}</p>
            <p className="text-sm text-muted-foreground">Leave requests awaiting review.</p>
            <div className="mt-3 space-y-2 text-sm">
              {leave?.approvalsQueue?.length ? (
                leave.approvalsQueue.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-md border border-dashed border-muted-foreground/40 p-3">
                    <p className="font-medium">{item.requesterName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} ? {item.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No pending approvals.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <NotebookPen className="h-4 w-4" /> Recent Leave Decisions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          {leave?.history?.length ? (
            leave.history.slice(0, 6).map((request) => (
              <div key={request.id} className="rounded-md border border-dashed border-muted-foreground/40 p-3">
                <p className="font-medium">{request.requesterName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">Status: {request.status}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent decisions.</p>
          )}
        </CardContent>
      </Card>

      <HighlightsGrid highlights={data.highlights} />
    </div>
  );
}