import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { cn } from "@/lib/utils";
import type { DashboardMetric } from "@/types/dashboard";

interface MetricGridProps {
  title?: string;
  metrics: DashboardMetric[];
  columns?: 2 | 3 | 4;
}

const columnClassMap = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3", 
  4: "md:grid-cols-4"
} as const;

// Icon mapping for different metric types
const getMetricIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("student") || lowerLabel.includes("enrollment")) return Users;
  if (lowerLabel.includes("course") || lowerLabel.includes("class")) return BookOpen;
  if (lowerLabel.includes("attendance")) return Calendar;
  if (lowerLabel.includes("grade") || lowerLabel.includes("score")) return Target;
  if (lowerLabel.includes("growth") || lowerLabel.includes("improvement")) return TrendingUp;
  if (lowerLabel.includes("time") || lowerLabel.includes("duration")) return Clock;
  if (lowerLabel.includes("completion") || lowerLabel.includes("progress")) return CheckCircle;
  
  return GraduationCap; // default
};

// Determine variant based on metric performance
const getMetricVariant = (metric: DashboardMetric) => {
  if (metric.trend === "up" && metric.delta && metric.delta > 0) return "success";
  if (metric.trend === "down" && metric.delta && metric.delta < 0) return "destructive";
  if (metric.trend === "up" && metric.delta && metric.delta < 0) return "warning";
  return "default";
};

export function MetricGrid({ title, metrics, columns = 3 }: MetricGridProps) {
  if (!metrics.length) return null;

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
      )}
      <div className={cn("grid gap-4", columnClassMap[columns])}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.label}
            value={metric.value}
            unit={metric.unit}
            delta={metric.delta}
            trend={metric.trend}
            context={metric.context}
            icon={getMetricIcon(metric.label)}
            variant={getMetricVariant(metric)}
          />
        ))}
      </div>
    </div>
  );
}