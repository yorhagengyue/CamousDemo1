import type { ISODateString } from "@/types/common";
import type { UserRole } from "@/types/auth";

export interface CourseSummary {
  id: string;
  code: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  credits: number;
  capacity: number;
  enrolled: number;
  instructors: Array<{
    id: string;
    name: string;
  }>;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    location: string;
  }>;
  tags: string[];
}

export interface CourseDetail extends CourseSummary {
  syllabus: string;
  resources: Array<{
    id: string;
    name: string;
    type: "pdf" | "link" | "video" | "doc";
    url: string;
  }>;
  relatedCourses: Array<Pick<CourseSummary, "id" | "title" | "subject" | "gradeLevel" >>;
}

export interface EnrollmentTask {
  id: string;
  title: string;
  description: string;
  dueDate: ISODateString;
  status: "pending" | "submitted" | "completed";
  progress: number;
  preferredCourses: string[];
  assignedBy: string;
}

export interface EnrollmentResult {
  id: string;
  courseId: string;
  courseTitle: string;
  status: "enrolled" | "waitlisted" | "dropped";
  updatedAt: ISODateString;
}

export interface EnrollmentOverview {
  tasks: EnrollmentTask[];
  results: EnrollmentResult[];
}

export interface CoursePermission {
  role: UserRole;
  canEdit: boolean;
  canApprove: boolean;
}