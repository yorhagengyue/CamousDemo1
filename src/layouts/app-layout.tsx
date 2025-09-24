import { Outlet } from "react-router-dom";

import { AppHeader } from "@/layouts/components/app-header";
import { AppSidebar } from "@/layouts/components/app-sidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-muted/30 via-background to-muted/20 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}