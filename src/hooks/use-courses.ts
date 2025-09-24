import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  enrollInCourse,
  fetchCourse,
  fetchCourses,
  fetchEnrollmentOverview,
  type CourseQueryParams
} from "@/lib/services/courses-service";
import type { PaginatedResponse } from "@/types/common";
import type { CourseDetail, CourseSummary, EnrollmentOverview } from "@/types/courses";

const COURSES_KEY = "courses";
const ENROLLMENT_KEY = "enrolment";

export function useCourses(params: CourseQueryParams, options?: { enabled?: boolean }) {
  return useQuery<PaginatedResponse<CourseSummary>, Error>({
    queryKey: [COURSES_KEY, params],
    queryFn: () => fetchCourses(params),
    enabled: options?.enabled ?? true
  });
}

export function useCourse(id?: string, options?: { enabled?: boolean }) {
  return useQuery<CourseDetail, Error>({
    queryKey: [COURSES_KEY, id],
    queryFn: () => fetchCourse(id!),
    enabled: (options?.enabled ?? true) && Boolean(id)
  });
}

export function useEnrollmentOverview(options?: { enabled?: boolean }) {
  return useQuery<EnrollmentOverview, Error>({
    queryKey: [ENROLLMENT_KEY],
    queryFn: () => fetchEnrollmentOverview(),
    enabled: options?.enabled ?? true
  });
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENROLLMENT_KEY] });
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
    }
  });
}