import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchAttendanceSession,
  fetchAttendanceSummary,
  fetchLeaveOverview,
  markAttendance,
  submitLeaveRequest,
  updateLeaveStatus
} from "@/lib/services/attendance-service";
import type { AttendanceSession, AttendanceSummary, LeaveOverview, LeaveRequest } from "@/types/attendance";

const ATTENDANCE_KEY = "attendance";
const LEAVE_KEY = "leave";

export function useAttendanceSummary(options?: { enabled?: boolean }) {
  return useQuery<AttendanceSummary[], Error>({
    queryKey: [ATTENDANCE_KEY, "summary"],
    queryFn: () => fetchAttendanceSummary(),
    enabled: options?.enabled ?? true
  });
}

export function useAttendanceSession(id?: string, options?: { enabled?: boolean }) {
  return useQuery<AttendanceSession, Error>({
    queryKey: [ATTENDANCE_KEY, "session", id],
    queryFn: () => fetchAttendanceSession(id!),
    enabled: (options?.enabled ?? true) && Boolean(id)
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, records }: { sessionId: string; records: AttendanceSession["roster"] }) =>
      markAttendance(sessionId, records),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_KEY, "summary"] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_KEY, "session", variables.sessionId] });
    }
  });
}

export function useLeaveOverview(options?: { enabled?: boolean }) {
  return useQuery<LeaveOverview, Error>({
    queryKey: [LEAVE_KEY],
    queryFn: () => fetchLeaveOverview(),
    enabled: options?.enabled ?? true
  });
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<LeaveRequest, "id" | "status" | "submittedAt">) =>
      submitLeaveRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_KEY] });
    }
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: LeaveRequest["status"]; comment?: string }) =>
      updateLeaveStatus(id, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_KEY] });
    }
  });
}