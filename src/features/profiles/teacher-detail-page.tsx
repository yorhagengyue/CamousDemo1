import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CalendarClock, Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacher } from "@/hooks/use-profiles";

export function TeacherDetailPage() {
  const { id } = useParams();
  const teacherQuery = useTeacher(id);
  const teacher = teacherQuery.data;
  const upcomingClasses = useMemo(() => teacher?.upcomingClasses ?? [], [teacher]);

  if (teacherQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-36 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teacher not found</CardTitle>
          <CardDescription>The requested teacher profile could not be located.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{teacher.displayName}</CardTitle>
          <CardDescription>{teacher.employeeNumber}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1 text-sm">
            <p className="font-medium">Contact</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {teacher.email}
            </p>
            {teacher.contactNumber ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {teacher.contactNumber}
              </p>
            ) : null}
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Department</p>
            <p className="text-muted-foreground">{teacher.department}</p>
            <p className="text-muted-foreground">Experience: {teacher.yearsOfExperience} years</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Subjects</p>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <Badge key={subject} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Qualifications</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {teacher.qualifications.map((qualification) => (
            <Badge key={qualification} variant="outline">
              {qualification}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>Classes scheduled over the next week.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {upcomingClasses.length ? (
            upcomingClasses.map((session) => (
              <div key={session.id} className="rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm">
                <p className="font-medium">{session.courseTitle}</p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="h-4 w-4" /> {new Date(session.startTime).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Location: {session.location}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
