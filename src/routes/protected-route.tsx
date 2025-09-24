import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { hasPermission } from "@/config/rbac";
import { useAuthStore } from "@/store/auth-store";
import type { UserPermission, UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  requiredPermissions?: UserPermission[];
  redirectTo?: string;
  children?: ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  requiredPermissions,
  redirectTo = "/login",
  children
}: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requiredPermissions &&
    !requiredPermissions.every((permission) => hasPermission(user.permissions, permission))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}