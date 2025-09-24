import type { ISODateString } from "@/types/common";
import type { UserRole } from "@/types/auth";

export interface PersonProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  roles: UserRole[];
  gradeLevel?: string;
  homeroom?: string;
  contactNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  tags: string[];
}

export interface StudentProfile extends PersonProfile {
  studentNumber: string;
  programmes: string[];
  advisorId: string;
  advisorName: string;
  attendanceRate: number;
  gpa: number;
  achievements: Array<{
    id: string;
    title: string;
    awardedAt: ISODateString;
  }>;
}

export interface TeacherProfile extends PersonProfile {
  employeeNumber: string;
  department: string;
  subjects: string[];
  yearsOfExperience: number;
  qualifications: string[];
  upcomingClasses: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    startTime: ISODateString;
    location: string;
  }>;
}