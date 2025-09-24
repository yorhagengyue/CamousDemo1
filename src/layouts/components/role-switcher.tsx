import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_DEFINITIONS } from "@/config/rbac";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types/auth";

export function RoleSwitcher() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);

  const roleOptions = useMemo(() => {
    if (!user) return [];
    return ROLE_DEFINITIONS.filter((role) => user.roles.includes(role.role as UserRole));
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Select onValueChange={(value) => switchRole(value as UserRole)} value={user.activeRole}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("actions.switchRole")} />
      </SelectTrigger>
      <SelectContent>
        {roleOptions.map((role) => (
          <SelectItem key={role.role} value={role.role}>
            {t(`roles.${role.role}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}