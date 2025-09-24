import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { SupportedLocale } from "@/config/constants";
import { STORAGE_KEYS } from "@/config/constants";
import { permissionsForRole } from "@/config/rbac";
import type { UserRole, UserSession } from "@/types/auth";

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  signIn: (payload: Omit<UserSession, "permissions">) => void;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
  updateConsent: (accepted: boolean) => void;
  updateLocale: (locale: SupportedLocale) => void;
}

function withRolePermissions(user: Omit<UserSession, "permissions">): UserSession {
  const permissions = Array.from(
    new Set(user.roles.flatMap((role) => permissionsForRole(role)))
  );
  return { ...user, permissions };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      signIn: (payload) => {
        const next = withRolePermissions(payload);
        set({ user: next, isAuthenticated: true });
      },
      signOut: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role) => {
        const { user } = get();
        if (!user || !user.roles.includes(role)) return;
        set({ user: withRolePermissions({ ...user, activeRole: role }) });
      },
      updateConsent: (accepted) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, consentAccepted: accepted } });
      },
      updateLocale: (locale) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, locale } });
      }
    }),
    {
      name: STORAGE_KEYS.session,
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export function getActiveRole(): UserRole | null {
  const state = useAuthStore.getState();
  return state.user?.activeRole ?? null;
}

export function getUserPermissions() {
  const state = useAuthStore.getState();
  return state.user?.permissions ?? [];
}