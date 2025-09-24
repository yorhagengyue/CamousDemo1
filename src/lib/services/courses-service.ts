import type { PaginatedResponse } from "@/types/common";
import type { CourseDetail, CourseSummary, EnrollmentOverview } from "@/types/courses";
import { apiGet, apiPost } from "@/lib/http";

export interface CourseQueryParams {
  search?: string;
  subject?: string;
  grade?: string;
  page?: number;
  pageSize?: number;
}

export function fetchCourses(params: CourseQueryParams) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.subject) query.append("subject", params.subject);
  if (params.grade) query.append("grade", params.grade);
  if (params.page) query.append("page", String(params.page));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));
  const search = query.toString();
  return apiGet<PaginatedResponse<CourseSummary>>(`/courses${search ? `?${search}` : ""}`);
}

export function fetchCourse(id: string) {
  return apiGet<CourseDetail>(`/courses/${id}`);
}

export function fetchEnrollmentOverview() {
  return apiGet<EnrollmentOverview>("/enrolment");
}

export function enrollInCourse(courseId: string) {
  return apiPost<EnrollmentOverview>("/enrolment", { courseId });
}