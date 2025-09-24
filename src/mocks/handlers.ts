import { http, HttpResponse } from "msw";

import {
  adminOverview,
  appendAuditEntry,
  attendanceSessions,
  attendanceSummary,
  courseDetails,
  courseSummaries,
  dashboardByRole,
  enrolmentOverview,
  identityBindings,
  leaveOverview,
  messageThreads,
  principalDashboard,
  roleAssignments,
  studentProfiles,
  teacherProfiles,
  auditLogs
} from "@/fixtures/data";
import type { AttendanceRecord, LeaveRequest } from "@/types/attendance";
import type { MessageThread } from "@/types/messages";
import type { RoleAssignment } from "@/types/admin";

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: items.slice(start, end),
    page,
    pageSize,
    total: items.length
  };
}

function toMessageSummary(message: MessageThread) {
  const { id, subject, body, preview, channel, senderId, senderName, recipientIds, createdAt, readAt, isRead, tags, roleVisibility } = message;
  return {
    id,
    subject,
    preview: preview ?? body.slice(0, 120),
    channel,
    senderId,
    senderName,
    recipientIds,
    createdAt,
    readAt,
    isRead,
    tags,
    roleVisibility
  };
}

let messagesStore = [...messageThreads];
let enrolmentStore = { ...enrolmentOverview };
let leaveStore = { ...leaveOverview };
let identityStore = [...identityBindings];
let auditStore = [...auditLogs];

export const handlers = [
  http.get("/api/dashboard/:role", ({ params }) => {
    const role = params.role as keyof typeof dashboardByRole;
    const payload = dashboardByRole[role] ?? dashboardByRole.student;
    return HttpResponse.json(payload);
  }),

  http.get("/api/dashboard/principal", () => {
    return HttpResponse.json(principalDashboard);
  }),

  http.get("/api/messages", ({ request }) => {
    const url = new URL(request.url);
    const channel = url.searchParams.get("channel");
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    let filtered = [...messagesStore];
    if (channel) {
      filtered = filtered.filter((message) => message.channel === channel);
    }
    if (unreadOnly) {
      filtered = filtered.filter((message) => !message.isRead);
    }
    const summaries = filtered.map(toMessageSummary);
    return HttpResponse.json(paginate(summaries, page, pageSize));
  }),

  http.get("/api/messages/:id", ({ params }) => {
    const message = messagesStore.find((item) => item.id === params.id);
    if (!message) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(message);
  }),

  http.patch("/api/messages/:id", async ({ params, request }) => {
    const body = (await request.json()) as { action?: string };
    const index = messagesStore.findIndex((item) => item.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    if (body?.action === "markRead") {
      messagesStore[index] = { ...messagesStore[index], isRead: true, readAt: new Date().toISOString() };
    }
    return HttpResponse.json(messagesStore[index]);
  }),

  http.post("/api/messages", async ({ request }) => {
    const payload = (await request.json()) as {
      subject: string;
      body: string;
      channel: string;
      recipients: string[];
    };
    const newMessage: MessageThread = {
      id: `msg-${crypto.randomUUID()}`,
      subject: payload.subject,
      body: payload.body,
      preview: payload.body.slice(0, 120),
      channel: payload.channel as MessageThread["channel"],
      senderId: "me",
      senderName: "Demo User",
      recipientIds: payload.recipients,
      createdAt: new Date().toISOString(),
      isRead: false,
      tags: [],
      roleVisibility: ["student", "teacher", "hod", "principal", "admin"]
    };
    messagesStore = [newMessage, ...messagesStore];
    appendAuditEntry({
      id: crypto.randomUUID(),
      actorId: "me",
      actorName: "Demo User",
      action: "send",
      entity: "message",
      metadata: { subject: payload.subject },
      timestamp: new Date().toISOString()
    });
    auditStore = [...auditLogs];
    return HttpResponse.json(newMessage, { status: 201 });
  }),

  http.get("/api/students", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const grade = url.searchParams.get("grade");
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    let results = [...studentProfiles];
    if (search) {
      results = results.filter((student) =>
        [student.displayName, student.studentNumber, student.email].join(" ").toLowerCase().includes(search)
      );
    }
    if (grade) {
      results = results.filter((student) => student.gradeLevel === grade);
    }
    return HttpResponse.json(paginate(results, page, pageSize));
  }),

  http.get("/api/students/:id", ({ params }) => {
    const student = studentProfiles.find((item) => item.id === params.id);
    if (!student) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(student);
  }),

  http.get("/api/teachers", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const department = url.searchParams.get("department");
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    let results = [...teacherProfiles];
    if (search) {
      results = results.filter((teacher) =>
        [teacher.displayName, teacher.email].join(" ").toLowerCase().includes(search)
      );
    }
    if (department) {
      results = results.filter((teacher) => teacher.department === department);
    }
    return HttpResponse.json(paginate(results, page, pageSize));
  }),

  http.get("/api/teachers/:id", ({ params }) => {
    const teacher = teacherProfiles.find((item) => item.id === params.id);
    if (!teacher) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(teacher);
  }),

  http.get("/api/courses", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const subject = url.searchParams.get("subject");
    const grade = url.searchParams.get("grade");
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
    let results = [...courseSummaries];
    if (search) {
      results = results.filter((course) =>
        [course.title, course.description, course.subject].join(" ").toLowerCase().includes(search)
      );
    }
    if (subject) {
      results = results.filter((course) => course.subject === subject);
    }
    if (grade) {
      results = results.filter((course) => course.gradeLevel === grade);
    }
    return HttpResponse.json(paginate(results, page, pageSize));
  }),

  http.get("/api/courses/:id", ({ params }) => {
    const course = courseDetails[params.id as string];
    if (!course) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(course);
  }),

  http.get("/api/enrolment", () => HttpResponse.json(enrolmentStore)),

  http.post("/api/enrolment", async ({ request }) => {
    const payload = (await request.json()) as { courseId: string };
    if (!payload.courseId) {
      return HttpResponse.json({ message: "courseId is required" }, { status: 400 });
    }
    enrolmentStore.results = [
      ...enrolmentStore.results.filter((result) => result.courseId !== payload.courseId),
      {
        id: `result-${payload.courseId}`,
        courseId: payload.courseId,
        courseTitle: courseDetails[payload.courseId]?.title ?? payload.courseId,
        status: "enrolled",
        updatedAt: new Date().toISOString()
      }
    ];
    return HttpResponse.json(enrolmentStore);
  }),

  http.get("/api/attendance/summary", () => HttpResponse.json(attendanceSummary)),

  http.get("/api/attendance/sessions/:id", ({ params }) => {
    const session = attendanceSessions[params.id as string];
    if (!session) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(session);
  }),

  http.patch("/api/attendance/sessions/:id", async ({ params, request }) => {
    const session = attendanceSessions[params.id as string];
    if (!session) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    const body = (await request.json()) as { records: AttendanceRecord[] };
    attendanceSessions[params.id as string] = { ...session, roster: body.records };
    return HttpResponse.json(attendanceSessions[params.id as string]);
  }),

  http.get("/api/leave", () => HttpResponse.json(leaveStore)),

  http.post("/api/leave", async ({ request }) => {
    const payload = (await request.json()) as Omit<LeaveRequest, "id" | "status" | "submittedAt">;
    const newRequest: LeaveRequest = {
      ...payload,
      id: crypto.randomUUID(),
      status: "pending",
      submittedAt: new Date().toISOString()
    };
    leaveStore.activeRequests = [newRequest, ...leaveStore.activeRequests];
    leaveStore.history = [newRequest, ...leaveStore.history];
    leaveStore.approvalsQueue = [newRequest, ...leaveStore.approvalsQueue];
    return HttpResponse.json(leaveStore, { status: 201 });
  }),

  http.patch("/api/leave/:id", async ({ params, request }) => {
    const payload = (await request.json()) as { status: LeaveRequest["status"]; comment?: string };
    leaveStore.activeRequests = leaveStore.activeRequests.filter((request) => request.id !== params.id);
    leaveStore.approvalsQueue = leaveStore.approvalsQueue.filter((request) => request.id !== params.id);
    leaveStore.history = leaveStore.history.map((request) =>
      request.id === params.id ? { ...request, status: payload.status } : request
    );
    return HttpResponse.json(leaveStore);
  }),

  http.get("/api/admin/overview", () => HttpResponse.json(adminOverview)),

  http.get("/api/admin/audits", () => HttpResponse.json(auditStore)),

  http.get("/api/admin/bindings", () => HttpResponse.json(identityStore)),

  http.post("/api/admin/bindings", async ({ request }) => {
    const payload = (await request.json()) as { provider: "google" | "singpass"; externalId: string; userId: string };
    const record = {
      id: crypto.randomUUID(),
      linkedAt: new Date().toISOString(),
      ...payload
    };
    identityStore = [record, ...identityStore];
    appendAuditEntry({
      id: crypto.randomUUID(),
      actorId: "me",
      actorName: "Demo Admin",
      action: "link",
      entity: "identity-binding",
      metadata: payload,
      timestamp: new Date().toISOString()
    });
    auditStore = [...auditLogs];
    return HttpResponse.json(record, { status: 201 });
  }),

  http.patch("/api/admin/bindings/:id", ({ params }) => {
    const bindingId = params.id as string;
    if (!bindingId) {
      return HttpResponse.json({ message: "Binding not found" }, { status: 404 });
    }
    identityStore = identityStore.filter((binding) => binding.id !== bindingId);
    appendAuditEntry({
      id: crypto.randomUUID(),
      actorId: "me",
      actorName: "Demo Admin",
      action: "unlink",
      entity: "identity-binding",
      metadata: { bindingId },
      timestamp: new Date().toISOString()
    });
    auditStore = [...auditLogs];
    return HttpResponse.json(identityStore);
  }),

  http.patch("/api/admin/roles", async ({ request }) => {
    const payload = (await request.json()) as { assignments: RoleAssignment[] };
    payload.assignments.forEach((assignment) => {
      const index = roleAssignments.findIndex((item) => item.userId === assignment.userId);
      if (index >= 0) {
        roleAssignments[index] = assignment;
      } else {
        roleAssignments.push(assignment);
      }
    });
    appendAuditEntry({
      id: crypto.randomUUID(),
      actorId: "me",
      actorName: "Demo Admin",
      action: "update",
      entity: "role-assignment",
      metadata: { count: payload.assignments.length },
      timestamp: new Date().toISOString()
    });
    auditStore = [...auditLogs];
    return HttpResponse.json(roleAssignments);
  })
];
