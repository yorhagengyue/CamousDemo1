import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchAdminOverview,
  fetchAuditLogs,
  fetchIdentityBindings,
  linkIdentity,
  unlinkIdentity,
  updateRoleAssignments
} from "@/lib/services/admin-service";
import type { AdminOverview, AuditLogEntry, IdentityBinding, RoleAssignment } from "@/types/admin";

const ADMIN_KEY = "admin";

export function useAdminOverview(options?: { enabled?: boolean }) {
  return useQuery<AdminOverview, Error>({
    queryKey: [ADMIN_KEY, "overview"],
    queryFn: () => fetchAdminOverview(),
    enabled: options?.enabled ?? true
  });
}

export function useAuditLogs(options?: { enabled?: boolean }) {
  return useQuery<AuditLogEntry[], Error>({
    queryKey: [ADMIN_KEY, "audits"],
    queryFn: () => fetchAuditLogs(),
    enabled: options?.enabled ?? true
  });
}

export function useIdentityBindings(options?: { enabled?: boolean }) {
  return useQuery<IdentityBinding[], Error>({
    queryKey: [ADMIN_KEY, "bindings"],
    queryFn: () => fetchIdentityBindings(),
    enabled: options?.enabled ?? true
  });
}

export function useLinkIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<IdentityBinding, "id" | "linkedAt">) => linkIdentity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "bindings"] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "overview"] });
    }
  });
}

export function useUnlinkIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unlinkIdentity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "bindings"] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "overview"] });
    }
  });
}

export function useUpdateRoleAssignments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignments: RoleAssignment[]) => updateRoleAssignments(assignments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "overview"] });
    }
  });
}