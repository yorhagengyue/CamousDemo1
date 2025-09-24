import type { ComponentType } from "react";
import {
  BarChart3,
  CalendarCheck,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  NotebookPen,
  Settings,
  ShieldCheck,
  Users,
  Waypoints
} from "lucide-react";

import type { UserRole } from "@/types/auth";

export interface NavigationItem {
  path: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    path: "/",
    labelKey: "nav.dashboard",
    icon: LayoutDashboard,
    roles: ["student", "teacher", "hod", "principal", "admin"]
  },
  {
    path: "/messages",
    labelKey: "nav.messages",
    icon: MessageSquare,
    roles: ["student", "teacher", "hod", "principal", "admin"]
  },
  {
    path: "/students",
    labelKey: "nav.students",
    icon: Users,
    roles: ["teacher", "hod", "principal", "admin"]
  },
  {
    path: "/teachers",
    labelKey: "nav.teachers",
    icon: Waypoints,
    roles: ["hod", "principal", "admin"]
  },
  {
    path: "/courses",
    labelKey: "nav.courses",
    icon: GraduationCap,
    roles: ["student", "teacher", "hod", "principal", "admin"]
  },
  {
    path: "/enrolment",
    labelKey: "nav.enrolment",
    icon: Users,
    roles: ["student", "teacher"]
  },
  {
    path: "/attendance",
    labelKey: "nav.attendance",
    icon: CalendarCheck,
    roles: ["student", "teacher", "hod"]
  },
  {
    path: "/leave",
    labelKey: "nav.leave",
    icon: NotebookPen,
    roles: ["student", "teacher", "hod"]
  },
  {
    path: "/reports",
    labelKey: "nav.reports",
    icon: BarChart3,
    roles: ["hod", "principal", "admin"]
  },
  {
    path: "/admin",
    labelKey: "nav.admin",
    icon: ShieldCheck,
    roles: ["admin"]
  },
  {
    path: "/settings",
    labelKey: "nav.settings",
    icon: Settings,
    roles: ["student", "teacher", "hod", "principal", "admin"]
  },
  {
    path: "/labs",
    labelKey: "nav.labs",
    icon: FlaskConical,
    roles: ["student", "teacher", "hod", "principal", "admin"]
  }
];