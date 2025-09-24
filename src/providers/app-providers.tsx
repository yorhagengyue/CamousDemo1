import { Suspense, type PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { initI18n } from "@/lib/i18n";
import { ThemeProvider } from "@/providers/theme-provider";

const i18nInstance = initI18n();
const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}