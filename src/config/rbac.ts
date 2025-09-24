import type { RoleDefinition, UserRole } from "@/types/auth";

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: "student",
    label: "Student",
    description: "Access learner workflows such as courses, attendance, and messages.",
    permissions: [
      "messages:read",
      "attendance:read",
      "leave:submit",
      "course:read",
      "course:enroll"
    ]
  },
  {
    role: "teacher",
    label: "Teacher",
    description: "Manage classes, mark attendance, and communicate with students.",
    permissions: [
      "messages:read",
      "messages:write",
      "attendance:read",
      "attendance:mark",
      "leave:approve",
      "course:read"
    ]
  },
  {
    role: "hod",
    label: "HOD",
    description: "Monitor department health and handle escalated approvals.",
    permissions: [
      "messages:read",
      "attendance:read",
      "leave:approve",
      "course:read",
      "kpi:view"
    ]
  },
  {
    role: "principal",
    label: "Principal",
    description: "View school-wide KPI dashboards and governance data.",
    permissions: ["messages:read", "attendance:read", "course:read", "kpi:view"]
  },
  {
    role: "admin",
    label: "Admin",
    description: "Configure system settings, identity bindings, and audit logs.",
    permissions: [
      "messages:read",
      "course:read",
      "admin:users",
      "admin:audits",
      "admin:settings"
    ]
  }
];

export const ROLE_LABELS: Record<UserRole, string> = ROLE_DEFINITIONS.reduce(
  (acc, role) => {
    acc[role.role] = role.label;
    return acc;
  },
  {} as Record<UserRole, string>
);

export function permissionsForRole(role: UserRole) {
  return ROLE_DEFINITIONS.find((def) => def.role === role)?.permissions ?? [];
}

export function hasPermission(
  permissions: string[] | undefined,
  required: string | string[]
) {
  if (!permissions) return false;
  const list = Array.isArray(required) ? required : [required];
  return list.every((permission) => permissions.includes(permission));
}