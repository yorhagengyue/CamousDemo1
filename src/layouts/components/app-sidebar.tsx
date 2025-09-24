import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

function NavigationList() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  const items = NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(user.activeRole)
  );

  // Group navigation items
  const coreItems = items.filter(item => 
    ['/', '/messages', '/courses'].includes(item.path)
  );
  const profileItems = items.filter(item => 
    ['/students', '/teachers'].includes(item.path)
  );
  const academicItems = items.filter(item => 
    ['/enrolment', '/attendance', '/leave'].includes(item.path)
  );
  const managementItems = items.filter(item => 
    ['/reports', '/admin'].includes(item.path)
  );
  const utilityItems = items.filter(item => 
    ['/settings', '/labs'].includes(item.path)
  );

  const NavigationGroup = ({ items, title }: { items: typeof coreItems, title?: string }) => (
    <div className="space-y-1">
      {title && (
        <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110`} />
            <span className="truncate">{t(item.labelKey)}</span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-6 p-4">
        <NavigationGroup items={coreItems} />
        
        {profileItems.length > 0 && (
          <>
            <Separator />
            <NavigationGroup items={profileItems} title="Profiles" />
          </>
        )}
        
        {academicItems.length > 0 && (
          <>
            <Separator />
            <NavigationGroup items={academicItems} title="Academic" />
          </>
        )}
        
        {managementItems.length > 0 && (
          <>
            <Separator />
            <NavigationGroup items={managementItems} title="Management" />
          </>
        )}
        
        {utilityItems.length > 0 && (
          <>
            <Separator />
            <NavigationGroup items={utilityItems} title="Utilities" />
          </>
        )}
      </nav>
    </ScrollArea>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-r border-border">
          <NavigationList />
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 border-r border-border bg-sidebar lg:flex flex-col">
        <NavigationList />
      </aside>
    </>
  );
}