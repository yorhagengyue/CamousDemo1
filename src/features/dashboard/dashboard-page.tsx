import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { StudentDashboard } from "@/features/dashboard/components/student-dashboard";
import { TeacherDashboard } from "@/features/dashboard/components/teacher-dashboard";
import { HodDashboard } from "@/features/dashboard/components/hod-dashboard";
import { PrincipalDashboard } from "@/features/dashboard/components/principal-dashboard";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { useDashboard, usePrincipalDashboard } from "@/hooks/use-dashboard-data";
import { useEnrollmentOverview } from "@/hooks/use-courses";
import { useLeaveOverview } from "@/hooks/use-attendance";
import { useUnreadMessagesCount } from "@/hooks/use-messages";
import { useAdminOverview } from "@/hooks/use-admin";
import { useAuthStore } from "@/store/auth-store";
import type { PrincipalDashboardFilters } from "@/lib/services/dashboard-service";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const activeRole = user?.activeRole ?? "student";
  const [principalFilters, setPrincipalFilters] = useState<PrincipalDashboardFilters>({});

  const dashboardQuery = useDashboard(activeRole);
  const principalDashboardQuery = usePrincipalDashboard(principalFilters, {
    enabled: activeRole === "principal"
  });

  const enrolmentOverviewQuery = useEnrollmentOverview({
    enabled: activeRole === "student"
  });

  const leaveOverviewQuery = useLeaveOverview({
    enabled: ["student", "teacher", "hod"].includes(activeRole)
  });

  const unreadMessagesQuery = useUnreadMessagesCount(["student", "teacher"].includes(activeRole));

  const adminOverviewQuery = useAdminOverview({
    enabled: activeRole === "admin"
  });

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load dashboard</AlertTitle>
        <AlertDescription>Refresh the page or try again later.</AlertDescription>
      </Alert>
    );
  }

  const dashboardData = dashboardQuery.data;

  switch (activeRole) {
    case "student":
      return (
        <StudentDashboard
          data={dashboardData}
          enrolment={enrolmentOverviewQuery.data}
          leave={leaveOverviewQuery.data}
          unreadMessagesCount={unreadMessagesQuery.data ?? 0}
        />
      );
    case "teacher":
      return (
        <TeacherDashboard
          data={dashboardData}
          leave={leaveOverviewQuery.data}
          pendingApprovalsCount={leaveOverviewQuery.data?.approvalsQueue?.length ?? 0}
        />
      );
    case "hod":
      return (
        <HodDashboard
          data={dashboardData}
          escalationCount={leaveOverviewQuery.data?.approvalsQueue?.length ?? 0}
        />
      );
    case "principal":
      if (principalDashboardQuery.isLoading || !principalDashboardQuery.data) {
        return <DashboardSkeleton />;
      }
      return (
        <PrincipalDashboard
          data={principalDashboardQuery.data}
          filters={principalFilters}
          onFiltersChange={setPrincipalFilters}
        />
      );
    case "admin":
      return <AdminDashboard data={dashboardData} overview={adminOverviewQuery.data} />;
    default:
      return <StudentDashboard data={dashboardData} />;
  }
}