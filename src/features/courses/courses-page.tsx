import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourses, useCourse, useEnrollInCourse } from "@/hooks/use-courses";

const SUBJECT_OPTIONS = ["All", "Mathematics", "Science", "Languages", "Humanities", "Arts"];
const GRADE_OPTIONS = ["All", "Sec 1", "Sec 2", "Sec 3", "Sec 4"];

export function CoursesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [grade, setGrade] = useState("All");

  const coursesQuery = useCourses({
    search: search || undefined,
    subject: subject !== "All" ? subject : undefined,
    grade: grade !== "All" ? grade : undefined,
    page: 1,
    pageSize: 20
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Catalogue</CardTitle>
          <CardDescription>Browse available courses and open learning resources.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search courses"
            className="w-72"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
          >
            {GRADE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coursesQuery.data?.data.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{course.subject}</Badge>
                <Badge variant="outline">{course.gradeLevel}</Badge>
                <Badge variant="secondary">{course.credits} credits</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {course.enrolled}/{course.capacity}
                </span>
                <Button size="sm" variant="outline" onClick={() => navigate(`/courses/${course.id}`)}>
                  View details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CourseDetailPage() {
  const { id } = useParams();
  const courseQuery = useCourse(id);
  const enrollMutation = useEnrollInCourse();

  if (courseQuery.isLoading || !courseQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course details</CardTitle>
        </CardHeader>
        <CardContent>Loading course information...</CardContent>
      </Card>
    );
  }

  const course = courseQuery.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{course.subject}</Badge>
          <Badge variant="outline">{course.gradeLevel}</Badge>
          <Badge variant="secondary">{course.credits} credits</Badge>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" /> {course.enrolled}/{course.capacity}
          </span>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-3 text-sm text-muted-foreground">
            <p>{course.syllabus}</p>
            <div>
              <p className="font-medium text-foreground">Instructors</p>
              <ul>
                {course.instructors.map((instructor) => (
                  <li key={instructor.id}>{instructor.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Schedule</p>
              <ul>
                {course.schedule.map((slot, index) => (
                  <li key={`${slot.day}-${index}`}>
                    {slot.day} ? {slot.startTime} - {slot.endTime} @ {slot.location}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="resources">
            <ScrollArea className="h-60">
              <div className="space-y-2 text-sm">
                {course.resources.map((resource) => (
                  <div key={resource.id} className="rounded-md border border-dashed border-muted-foreground/40 p-3">
                    <p className="font-medium text-foreground">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">Type: {resource.type}</p>
                    <a href={resource.url} className="text-sm text-primary hover:underline">
                      Open resource
                    </a>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="related" className="space-y-2 text-sm">
            {course.relatedCourses.length ? (
              course.relatedCourses.map((related) => (
                <div key={related.id} className="rounded-md border border-muted-foreground/30 p-3">
                  <p className="font-medium">{related.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {related.subject} ? {related.gradeLevel}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No related courses found.</p>
            )}
          </TabsContent>
        </Tabs>

        <Separator />
        <Button size="lg" onClick={() => enrollMutation.mutate(course.id)} disabled={enrollMutation.isPending}>
          <BookOpen className="mr-2 h-4 w-4" />
          {enrollMutation.isPending ? "Processing..." : "Enroll in this course"}
        </Button>
      </CardContent>
    </Card>
  );
}