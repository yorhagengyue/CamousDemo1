import { Clock, Circle, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WorklistItem } from "@/types/dashboard";

interface WorklistProps {
  title?: string;
  items: WorklistItem[];
}

const statusConfig = {
  open: {
    icon: Circle,
    variant: "default" as const,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  upcoming: {
    icon: AlertCircle,
    variant: "secondary" as const,
    color: "text-warning",
    bg: "bg-warning/10"
  },
  completed: {
    icon: CheckCircle,
    variant: "outline" as const,
    color: "text-success",
    bg: "bg-success/10"
  }
};

export function WorklistCard({ title = "Tasks", items }: WorklistProps) {
  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Circle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">No tasks at the moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;
          const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== "completed";
          
          return (
            <div 
              key={item.id} 
              className={cn(
                "group rounded-lg border border-border/50 p-3 transition-all duration-200 hover:border-border hover:shadow-sm",
                config.bg
              )}
            >
              <div className="flex items-start gap-3">
                <StatusIcon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium leading-tight group-hover:text-foreground transition-colors">
                      {item.title}
                    </h4>
                    <Badge 
                      variant={config.variant} 
                      className={cn(
                        "capitalize text-xs",
                        isOverdue && "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {isOverdue ? "overdue" : item.status}
                    </Badge>
                  </div>
                  
                  {item.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Due {formatDistanceToNow(new Date(item.dueDate), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                  
                  {item.meta && Object.keys(item.meta).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.meta).map(([key, value]) => (
                        <span 
                          key={key} 
                          className="inline-flex items-center rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          <span className="font-medium">{key}:</span>
                          <span className="ml-1">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}