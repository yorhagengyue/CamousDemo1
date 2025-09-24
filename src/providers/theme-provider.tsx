import { useEffect, type PropsWithChildren } from "react";

import { STORAGE_KEYS } from "@/config/constants";
import { useUIStore } from "@/store/ui-store";

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    if (!stored) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const nextTheme = prefersDark ? "dark" : "light";
      if (theme !== nextTheme) {
        setTheme(nextTheme);
      }
    }
  }, [setTheme, theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return children;
}