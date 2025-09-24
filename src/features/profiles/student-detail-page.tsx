import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, GraduationCap, Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudent } from "@/hooks/use-profiles";

export function StudentDetailPage() {
  const { id } = useParams();
  const studentQuery = useStudent(id);

  const student = studentQuery.data;

  const achievements = useMemo(() => student?.achievements ?? [], [student]);

  if (studentQuery.isLoading) {
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

  if (!student) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student not found</CardTitle>
          <CardDescription>The requested student profile could not be located.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{student.displayName}</CardTitle>
          <CardDescription>{student.studentNumber}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1 text-sm">
            <p className="font-medium">Contact</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {student.email}
            </p>
            {student.contactNumber ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {student.contactNumber}
              </p>
            ) : null}
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Academic</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" /> {student.programmes.join(", ")}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> {student.gradeLevel ?? "！"}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Advisor</p>
            <p className="text-muted-foreground">{student.advisorName ?? "！"}</p>
            <p className="text-muted-foreground">Attendance: {student.attendanceRate ? `${student.attendanceRate}%` : "！"}</p>
            <p className="text-muted-foreground">GPA: {student.gpa ?? "！"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Attributes and pastoral notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {student.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {student.emergencyContact ? (
              <div>
                <p>{student.emergencyContact.name}</p>
                <p>{student.emergencyContact.relation}</p>
                <p>{student.emergencyContact.phone}</p>
              </div>
            ) : (
              <p>No emergency contact on file.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Recent awards and recognition.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {achievements.length ? (
            achievements.map((achievement) => (
              <div key={achievement.id} className="rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm">
                <p className="font-medium">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">
                  Awarded {new Date(achievement.awardedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recorded achievements.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}