export type UserRole = "student" | "teacher" | "hod" | "principal" | "admin";

export type UserPermission =
  | "messages:read"
  | "messages:write"
  | "attendance:read"
  | "attendance:mark"
  | "leave:submit"
  | "leave:approve"
  | "course:read"
  | "course:enroll"
  | "course:manage"
  | "kpi:view"
  | "admin:users"
  | "admin:audits"
  | "admin:settings";

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: UserPermission[];
}

export interface UserIdentity {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
}

export interface UserSession extends UserIdentity {
  roles: UserRole[];
  activeRole: UserRole;
  permissions: UserPermission[];
  locale: "en" | "zh";
  consentAccepted: boolean;
}