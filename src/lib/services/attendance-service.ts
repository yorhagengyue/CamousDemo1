import type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceSummary,
  LeaveOverview,
  LeaveRequest
} from "@/types/attendance";
import { apiGet, apiPatch, apiPost } from "@/lib/http";

export interface AttendanceQueryParams {
  courseId?: string;
  date?: string;
}

export function fetchAttendanceSummary() {
  return apiGet<AttendanceSummary[]>("/attendance/summary");
}

export function fetchAttendanceSession(sessionId: string) {
  return apiGet<AttendanceSession>(`/attendance/sessions/${sessionId}`);
}

export function markAttendance(sessionId: string, records: AttendanceRecord[]) {
  return apiPatch<AttendanceSession>(`/attendance/sessions/${sessionId}`, { records });
}

export function fetchLeaveOverview() {
  return apiGet<LeaveOverview>("/leave");
}

export function submitLeaveRequest(payload: Omit<LeaveRequest, "id" | "status" | "submittedAt">) {
  return apiPost<LeaveOverview>("/leave", payload);
}

export function updateLeaveStatus(id: string, status: LeaveRequest["status"], comment?: string) {
  return apiPatch<LeaveOverview>(`/leave/${id}`, { status, comment });
}