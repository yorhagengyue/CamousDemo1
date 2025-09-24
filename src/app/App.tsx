import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AppLayout } from "@/layouts/app-layout";
import { ProtectedRoute } from "@/routes/protected-route";
import { UnauthorizedPage } from "@/routes/unauthorized";
import { NotFoundPage } from "@/routes/not-found";
import { AppErrorBoundary } from "@/routes/app-error";
import { LoginPage } from "@/features/auth/login-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { MessagesPage } from "@/features/messages/messages-page";
import { StudentListPage } from "@/features/profiles/student-list-page";
import { StudentDetailPage } from "@/features/profiles/student-detail-page";
import { TeacherListPage } from "@/features/profiles/teacher-list-page";
import { TeacherDetailPage } from "@/features/profiles/teacher-detail-page";
import { CoursesPage, CourseDetailPage } from "@/features/courses/courses-page";
import { EnrolmentPage } from "@/features/enrolment/enrolment-page";
import { AttendancePage } from "@/features/attendance/attendance-page";
import { LeavePage } from "@/features/leave/leave-page";
import { ReportsPage } from "@/features/reports/reports-page";
import { AdminPage } from "@/features/admin/admin-page";
import { SettingsPage } from "@/features/settings/settings-page";
import { LabsPage } from "@/features/labs/labs-page";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <AppErrorBoundary />
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
    errorElement: <AppErrorBoundary />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <AppErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "messages",
        element: <MessagesPage />
      },
      {
        path: "students",
        element: (
          <ProtectedRoute allowedRoles={["teacher", "hod", "principal", "admin"]}>
            <StudentListPage />
          </ProtectedRoute>
        )
      },
      {
        path: "students/:id",
        element: (
          <ProtectedRoute allowedRoles={["teacher", "hod", "principal", "admin"]}>
            <StudentDetailPage />
          </ProtectedRoute>
        )
      },
      {
        path: "teachers",
        element: (
          <ProtectedRoute allowedRoles={["hod", "principal", "admin"]}>
            <TeacherListPage />
          </ProtectedRoute>
        )
      },
      {
        path: "teachers/:id",
        element: (
          <ProtectedRoute allowedRoles={["hod", "principal", "admin"]}>
            <TeacherDetailPage />
          </ProtectedRoute>
        )
      },
      {
        path: "courses",
        element: <CoursesPage />
      },
      {
        path: "courses/:id",
        element: <CourseDetailPage />
      },
      {
        path: "enrolment",
        element: (
          <ProtectedRoute allowedRoles={["student", "teacher"]}>
            <EnrolmentPage />
          </ProtectedRoute>
        )
      },
      {
        path: "attendance",
        element: (
          <ProtectedRoute allowedRoles={["student", "teacher", "hod"]}>
            <AttendancePage />
          </ProtectedRoute>
        )
      },
      {
        path: "leave",
        element: (
          <ProtectedRoute allowedRoles={["student", "teacher", "hod"]}>
            <LeavePage />
          </ProtectedRoute>
        )
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={["hod", "principal", "admin"]}>
            <ReportsPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        )
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "labs",
        element: <LabsPage />
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}