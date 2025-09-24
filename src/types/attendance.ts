import type { ISODateString } from "@/types/common";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: ISODateString;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  courseId: string;
  courseTitle: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  totalSessions: number;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseTitle: string;
  date: ISODateString;
  startTime: string;
  endTime: string;
  roster: AttendanceRecord[];
}

export interface LeaveRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  type: "medical" | "personal" | "school";
  status: "draft" | "pending" | "approved" | "rejected";
  startDate: ISODateString;
  endDate: ISODateString;
  submittedAt: ISODateString;
  approverId?: string;
  approverName?: string;
  comments?: string;
}

export interface LeaveOverview {
  activeRequests: LeaveRequest[];
  history: LeaveRequest[];
  approvalsQueue: LeaveRequest[];
}