import { Menu, Search, Bell, Command } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/layouts/components/theme-toggle";
import { LanguageSwitcher } from "@/layouts/components/language-switcher";
import { RoleSwitcher } from "@/layouts/components/role-switcher";
import { UserMenu } from "@/layouts/components/user-menu";
import { useUIStore } from "@/store/ui-store";

export function AppHeader() {
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-header-border bg-header/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-sidebar-accent"
          onClick={() => setSidebarOpen(true)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {t("app.title")}
          </span>
        </div>
      </div>
      
      <Separator orientation="vertical" className="hidden h-6 lg:block" />
      
      <div className="flex flex-1 items-center gap-3">
        <div className="relative hidden flex-1 max-w-md items-center lg:flex">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search modules..." 
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring/20 focus-visible:bg-background" 
            aria-label="Global search" 
          />
          <kbd className="pointer-events-none absolute right-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
        
        <div className="ml-auto flex items-center gap-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-sidebar-accent" 
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ThemeToggle />
          <LanguageSwitcher />
          <RoleSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}