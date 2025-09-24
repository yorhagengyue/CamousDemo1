import type { PrincipalDashboardPayload, DashboardPayload } from "@/types/dashboard";
import type { UserRole } from "@/types/auth";
import { apiGet } from "@/lib/http";

export async function fetchDashboard(role: UserRole) {
  return apiGet<DashboardPayload>(`/dashboard/${role}`);
}

export interface PrincipalDashboardFilters {
  academicYear?: string;
  term?: string;
  grade?: string;
}

export async function fetchPrincipalDashboard(filters: PrincipalDashboardFilters) {
  const params = new URLSearchParams();
  if (filters.academicYear) params.append("academicYear", filters.academicYear);
  if (filters.term) params.append("term", filters.term);
  if (filters.grade) params.append("grade", filters.grade);

  const query = params.toString();
  const suffix = query ? `?${query}` : "";
  return apiGet<PrincipalDashboardPayload>(`/dashboard/principal${suffix}`);
}