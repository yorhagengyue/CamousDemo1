import { GraduationCap, CircleCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEnrollmentOverview } from "@/hooks/use-courses";

export function EnrolmentPage() {
  const overviewQuery = useEnrollmentOverview();

  if (overviewQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading enrolment data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const overview = overviewQuery.data;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4" /> Active Tasks
          </CardTitle>
          <CardDescription>Current selection windows assigned to the learner.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {overview?.tasks.length ? (
            overview.tasks.map((task) => (
              <div key={task.id} className="rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm">
                <p className="font-medium text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">Status: {task.status}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {task.preferredCourses.map((courseId) => (
                    <Badge key={courseId} variant="outline">
                      {courseId}
                    </Badge>
                  ))}
                </div>
                <Button className="mt-3" size="sm" variant="outline">
                  Review task
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No active enrolment tasks.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleCheck className="h-4 w-4" /> Results
          </CardTitle>
          <CardDescription>Completed course selections and waitlist status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {overview?.results.length ? (
            overview.results.map((result) => (
              <div key={result.id} className="rounded-md border border-muted-foreground/40 p-4 text-sm">
                <p className="font-medium text-foreground">{result.courseTitle}</p>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground">Status: {result.status}</p>
                <p className="text-xs text-muted-foreground">Updated {new Date(result.updatedAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No results published yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}