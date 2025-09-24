import { useQuery } from "@tanstack/react-query";

import { fetchDashboard, fetchPrincipalDashboard, type PrincipalDashboardFilters } from "@/lib/services/dashboard-service";
import type { DashboardPayload, PrincipalDashboardPayload } from "@/types/dashboard";
import type { UserRole } from "@/types/auth";

const DASHBOARD_QUERY_KEY = "dashboard";

export function useDashboard(role: UserRole, options?: { enabled?: boolean }) {
  return useQuery<DashboardPayload, Error>({
    queryKey: [DASHBOARD_QUERY_KEY, role],
    queryFn: () => fetchDashboard(role),
    enabled: options?.enabled ?? true
  });
}

export function usePrincipalDashboard(filters: PrincipalDashboardFilters, options?: { enabled?: boolean }) {
  return useQuery<PrincipalDashboardPayload, Error>({
    queryKey: [DASHBOARD_QUERY_KEY, "principal", filters],
    queryFn: () => fetchPrincipalDashboard(filters),
    enabled: options?.enabled ?? true
  });
}