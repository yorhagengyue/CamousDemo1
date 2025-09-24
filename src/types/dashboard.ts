import type { ISODateString } from "@/types/common";

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  trend?: "up" | "down" | "flat";
  context?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: ISODateString;
  link?: string;
  tag?: string;
}

export interface WorklistItem {
  id: string;
  title: string;
  status: "open" | "upcoming" | "completed";
  dueDate?: ISODateString;
  meta?: Record<string, string | number>;
}

export interface DashboardPayload {
  metrics: DashboardMetric[];
  timeline: TimelineEvent[];
  worklist: WorklistItem[];
  highlights: Array<{
    id: string;
    title: string;
    description: string;
    link?: string;
  }>;
}

export interface PrincipalDashboardPayload {
  kpis: DashboardMetric[];
  attendanceSeries: Array<{ date: ISODateString; rate: number }>;
  engagementSeries: Array<{ date: ISODateString; dau: number }>;
  healthIndicators: Array<{
    id: string;
    label: string;
    value: number;
    status: "good" | "warning" | "critical";
    description?: string;
  }>;
}