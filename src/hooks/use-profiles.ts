import { useQuery } from "@tanstack/react-query";

import { fetchStudent, fetchStudents, fetchTeacher, fetchTeachers, type ProfileQueryParams } from "@/lib/services/profiles-service";
import type { PaginatedResponse } from "@/types/common";
import type { StudentProfile, TeacherProfile } from "@/types/profile";

const STUDENTS_KEY = "students";
const TEACHERS_KEY = "teachers";

export function useStudents(params: ProfileQueryParams) {
  return useQuery<PaginatedResponse<StudentProfile>, Error>({
    queryKey: [STUDENTS_KEY, params],
    queryFn: () => fetchStudents(params)
  });
}

export function useStudent(id?: string) {
  return useQuery<StudentProfile, Error>({
    queryKey: [STUDENTS_KEY, id],
    queryFn: () => fetchStudent(id!),
    enabled: Boolean(id)
  });
}

export function useTeachers(params: ProfileQueryParams) {
  return useQuery<PaginatedResponse<TeacherProfile>, Error>({
    queryKey: [TEACHERS_KEY, params],
    queryFn: () => fetchTeachers(params)
  });
}

export function useTeacher(id?: string) {
  return useQuery<TeacherProfile, Error>({
    queryKey: [TEACHERS_KEY, id],
    queryFn: () => fetchTeacher(id!),
    enabled: Boolean(id)
  });
}