import type { ISODateString } from "@/types/common";
import type { UserRole } from "@/types/auth";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  metadata: Record<string, string | number>;
  timestamp: ISODateString;
}

export interface IdentityBinding {
  id: string;
  provider: "google" | "singpass";
  externalId: string;
  userId: string;
  linkedAt: ISODateString;
}

export interface RoleAssignment {
  userId: string;
  role: UserRole;
  assignedAt: ISODateString;
  assignedBy: string;
}

export interface AdminOverview {
  totalUsers: number;
  activeBindings: number;
  pendingApprovals: number;
  recentAudits: AuditLogEntry[];
  roleDistribution: Array<{
    role: UserRole;
    count: number;
  }>;
}