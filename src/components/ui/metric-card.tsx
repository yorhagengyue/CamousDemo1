import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  unit?: string;
  delta?: number;
  trend?: "up" | "down" | "flat";
  context?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

const variantStyles = {
  default: {
    card: "border-border/50",
    icon: "text-primary",
    trend: {
      up: "text-success",
      down: "text-destructive", 
      flat: "text-muted-foreground"
    }
  },
  success: {
    card: "border-success/20 bg-success/5",
    icon: "text-success",
    trend: {
      up: "text-success",
      down: "text-success/70",
      flat: "text-success/70"
    }
  },
  warning: {
    card: "border-warning/20 bg-warning/5",
    icon: "text-warning",
    trend: {
      up: "text-warning",
      down: "text-warning/70",
      flat: "text-warning/70"
    }
  },
  destructive: {
    card: "border-destructive/20 bg-destructive/5",
    icon: "text-destructive",
    trend: {
      up: "text-destructive/70",
      down: "text-destructive",
      flat: "text-destructive/70"
    }
  }
};

export function MetricCard({
  title,
  value,
  unit,
  delta,
  trend = "flat",
  context,
  icon: Icon,
  variant = "default",
  className
}: MetricCardProps) {
  const styles = variantStyles[variant];
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <Card className={cn(styles.card, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
          {title}
        </h3>
        {Icon && (
          <Icon className={cn("h-4 w-4", styles.icon)} />
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground font-medium">
              {unit}
            </span>
          )}
        </div>
        
        {(delta !== undefined || context) && (
          <div className="flex items-center gap-2 text-xs">
            {delta !== undefined && (
              <div className={cn("flex items-center gap-1", styles.trend[trend])}>
                <TrendIcon className="h-3 w-3" />
                <span className="font-medium">
                  {delta > 0 ? "+" : ""}{delta}%
                </span>
              </div>
            )}
            {context && (
              <span className="text-muted-foreground">
                {context}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
