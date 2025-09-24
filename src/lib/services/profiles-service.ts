import type { PaginatedResponse } from "@/types/common";
import type { StudentProfile, TeacherProfile } from "@/types/profile";
import { apiGet } from "@/lib/http";

export interface ProfileQueryParams {
  search?: string;
  grade?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

export function fetchStudents(params: ProfileQueryParams) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.grade) query.append("grade", params.grade);
  if (params.page) query.append("page", String(params.page));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));
  const search = query.toString();
  return apiGet<PaginatedResponse<StudentProfile>>(`/students${search ? `?${search}` : ""}`);
}

export function fetchStudent(id: string) {
  return apiGet<StudentProfile>(`/students/${id}`);
}

export function fetchTeachers(params: ProfileQueryParams) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.department) query.append("department", params.department);
  if (params.page) query.append("page", String(params.page));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));
  const search = query.toString();
  return apiGet<PaginatedResponse<TeacherProfile>>(`/teachers${search ? `?${search}` : ""}`);
}

export function fetchTeacher(id: string) {
  return apiGet<TeacherProfile>(`/teachers/${id}`);
}