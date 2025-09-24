import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/constants";

type Theme = "light" | "dark";

interface UIState {
  theme: Theme;
  isSidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      isSidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        set({ theme: theme === "light" ? "dark" : "light" });
      },
      setSidebarOpen: (open) => set({ isSidebarOpen: open })
    }),
    {
      name: STORAGE_KEYS.theme,
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);