import type { AdminOverview, AuditLogEntry, IdentityBinding, RoleAssignment } from "@/types/admin";
import { apiGet, apiPatch, apiPost } from "@/lib/http";

export function fetchAdminOverview() {
  return apiGet<AdminOverview>("/admin/overview");
}

export function fetchAuditLogs() {
  return apiGet<AuditLogEntry[]>("/admin/audits");
}

export function fetchIdentityBindings() {
  return apiGet<IdentityBinding[]>("/admin/bindings");
}

export function linkIdentity(payload: Omit<IdentityBinding, "id" | "linkedAt">) {
  return apiPost<IdentityBinding>("/admin/bindings", payload);
}

export function unlinkIdentity(id: string) {
  return apiPatch<IdentityBinding[]>(`/admin/bindings/${id}`, { action: "unlink" });
}

export function updateRoleAssignments(assignments: RoleAssignment[]) {
  return apiPatch<RoleAssignment[]>("/admin/roles", { assignments });
}