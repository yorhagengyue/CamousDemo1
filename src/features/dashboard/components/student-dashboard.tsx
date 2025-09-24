import { GraduationCap, MessageSquare, NotebookPen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { FadeIn } from "@/components/ui/fade-in";
import { MetricGrid } from "@/features/dashboard/components/metric-grid";
import { TimelineList } from "@/features/dashboard/components/timeline-list";
import { WorklistCard } from "@/features/dashboard/components/worklist-card";
import { HighlightsGrid } from "@/features/dashboard/components/highlights-grid";
import type { DashboardPayload } from "@/types/dashboard";
import type { EnrollmentOverview } from "@/types/courses";
import type { LeaveOverview } from "@/types/attendance";

interface StudentDashboardProps {
  data: DashboardPayload;
  enrolment?: EnrollmentOverview;
  leave?: LeaveOverview;
  unreadMessagesCount?: number;
}

export function StudentDashboard({ data, enrolment, leave, unreadMessagesCount = 0 }: StudentDashboardProps) {
  return (
    <div className="space-y-8">
      <MetricGrid metrics={data.metrics} columns={3} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WorklistCard title="Today's Schedule" items={data.worklist} />
        <TimelineList events={data.timeline} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard
          title="Unread Messages"
          value={unreadMessagesCount}
          context="New announcements awaiting review"
          icon={MessageSquare}
          variant={unreadMessagesCount > 0 ? "warning" : "default"}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4" /> Enrolment Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enrolment?.tasks?.length ? (
              enrolment.tasks.map((task) => (
                <div key={task.id} className="group rounded-lg border border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-3 transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Status: {task.status}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">No active tasks.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <NotebookPen className="h-4 w-4" /> Leave Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leave?.activeRequests?.length ? (
              leave.activeRequests.map((request) => (
                <div key={request.id} className="group rounded-lg border border-border/50 bg-gradient-to-r from-warning/5 to-transparent p-3 transition-all duration-200 hover:border-warning/20 hover:shadow-sm">
                  <p className="text-sm font-medium group-hover:text-warning transition-colors">
                    {request.type.charAt(0).toUpperCase() + request.type.slice(1)} leave
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Status: {request.status}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <NotebookPen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">No pending leave requests.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <HighlightsGrid highlights={data.highlights} />
    </div>
  );
}