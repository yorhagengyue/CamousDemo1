import { ShieldCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricGrid } from "@/features/dashboard/components/metric-grid";
import { HighlightsGrid } from "@/features/dashboard/components/highlights-grid";
import type { DashboardPayload } from "@/types/dashboard";
import type { AdminOverview } from "@/types/admin";

interface AdminDashboardProps {
  data: DashboardPayload;
  overview?: AdminOverview;
}

export function AdminDashboard({ data, overview }: AdminDashboardProps) {
  return (
    <div className="grid gap-6">
      <MetricGrid metrics={data.metrics} columns={3} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> User Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Total users</span>
              <span className="font-medium">{overview?.totalUsers ?? "¡ª"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active bindings</span>
              <span className="font-medium">{overview?.activeBindings ?? "¡ª"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending approvals</span>
              <span className="font-medium">{overview?.pendingApprovals ?? "¡ª"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" /> Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {overview?.roleDistribution?.map((role) => (
              <div key={role.role} className="flex items-center justify-between">
                <span className="capitalize">{role.role}</span>
                <span className="font-medium">{role.count}</span>
              </div>
            )) ?? <p className="text-muted-foreground">No role data.</p>}
          </CardContent>
        </Card>
      </div>

      <HighlightsGrid highlights={data.highlights} />
    </div>
  );
}