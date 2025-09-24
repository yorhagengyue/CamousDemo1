import type { AdminOverview, AuditLogEntry, IdentityBinding, RoleAssignment } from "@/types/admin";
import type { AttendanceSession, AttendanceSummary, LeaveOverview } from "@/types/attendance";
import type { CourseDetail, CourseSummary, EnrollmentOverview } from "@/types/courses";
import type { DashboardPayload, PrincipalDashboardPayload } from "@/types/dashboard";
import type { MessageThread } from "@/types/messages";
import type { StudentProfile, TeacherProfile } from "@/types/profile";
import type { UserRole } from "@/types/auth";

export const dashboardByRole: Record<UserRole, DashboardPayload> = {
  student: {
    metrics: [
      { id: "attendance", label: "Attendance", value: "98", unit: "%", trend: "up", delta: 2 },
      { id: "assignments", label: "Assignments Due", value: 2, trend: "flat" },
      { id: "credits", label: "Credits Earned", value: 16, unit: "pts", trend: "up" }
    ],
    timeline: [
      {
        id: "tl-1",
        title: "Physics Lab",
        description: "Submit lab reflection by 6pm",
        timestamp: new Date().toISOString()
      },
      {
        id: "tl-2",
        title: "CCA Training",
        description: "Basketball training at 4pm",
        timestamp: new Date(Date.now() + 3600 * 1000).toISOString()
      }
    ],
    worklist: [
      {
        id: "wk-1",
        title: "Mathematics Revision",
        status: "open",
        dueDate: new Date(Date.now() + 3600 * 1000).toISOString()
      },
      {
        id: "wk-2",
        title: "English Presentation",
        status: "upcoming",
        dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString()
      }
    ],
    highlights: [
      {
        id: "hl-1",
        title: "CCA Showcase",
        description: "Visit the sports hall on Friday to explore CCAs."
      },
      {
        id: "hl-2",
        title: "Scholarship Briefing",
        description: "Briefing for overseas immersion scholarships next Monday."
      }
    ]
  },
  teacher: {
    metrics: [
      { id: "sessions", label: "Sessions Today", value: 4, trend: "flat" },
      { id: "attendance-rate", label: "Attendance", value: "95", unit: "%", trend: "down", delta: -1 },
      { id: "approvals", label: "Approvals Pending", value: 3, trend: "up" }
    ],
    timeline: [
      {
        id: "tt-1",
        title: "Mark attendance",
        description: "2E Mathematics lesson",
        timestamp: new Date().toISOString()
      },
      {
        id: "tt-2",
        title: "CCA duty",
        description: "Oversee basketball training",
        timestamp: new Date(Date.now() + 5 * 3600 * 1000).toISOString()
      }
    ],
    worklist: [
      {
        id: "wk-t1",
        title: "2E Mathematics",
        status: "open",
        dueDate: new Date().toISOString()
      },
      {
        id: "wk-t2",
        title: "3N Physics",
        status: "upcoming",
        dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString()
      }
    ],
    highlights: [
      {
        id: "hl-t1",
        title: "Department Meeting",
        description: "Head to staff lounge at 3pm for curriculum planning."
      }
    ]
  },
  hod: {
    metrics: [
      { id: "attendance", label: "Avg Attendance", value: "94", unit: "%", trend: "up", delta: 1 },
      { id: "approvals", label: "Escalations", value: 4, trend: "down", delta: -2 },
      { id: "content", label: "Content Updates", value: 6, trend: "up" },
      { id: "training", label: "PD Hours", value: 12, unit: "hrs", trend: "flat" }
    ],
    timeline: [
      {
        id: "hod-1",
        title: "Approve leave",
        description: "Review 2 escalated leave requests",
        timestamp: new Date().toISOString()
      }
    ],
    worklist: [
      {
        id: "hod-w1",
        title: "Leave escalation",
        status: "open",
        meta: { staff: "Tan Mei Ling" }
      },
      {
        id: "hod-w2",
        title: "Curriculum audit",
        status: "upcoming",
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      }
    ],
    highlights: [
      {
        id: "hod-h1",
        title: "Department briefing",
        description: "Share assessment roadmap with staff next Tuesday."
      }
    ]
  },
  principal: {
    metrics: [
      { id: "attendance", label: "Daily Attendance", value: "93", unit: "%", trend: "up", delta: 1 },
      { id: "applications", label: "Leave Applications", value: 28, trend: "down", delta: -5 },
      { id: "content-updates", label: "Content Updates", value: 12, trend: "up", delta: 4 }
    ],
    timeline: [
      {
        id: "pr-1",
        title: "Monthly briefing",
        description: "Review KPI dashboard with EXCO",
        timestamp: new Date().toISOString()
      }
    ],
    worklist: [
      {
        id: "pr-w1",
        title: "Meet Education Board",
        status: "upcoming",
        dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString()
      }
    ],
    highlights: [
      {
        id: "pr-h1",
        title: "Campus upgrade",
        description: "AV lab refurbishment completed last week."
      }
    ]
  },
  admin: {
    metrics: [
      { id: "active-users", label: "Active Users", value: 1240, trend: "up", delta: 8 },
      { id: "errors", label: "System Errors", value: 1, trend: "flat" },
      { id: "audits", label: "Audit Entries", value: 42, trend: "up" }
    ],
    timeline: [
      {
        id: "ad-1",
        title: "Policy update",
        description: "Updated acceptable use policy",
        timestamp: new Date().toISOString()
      }
    ],
    worklist: [
      {
        id: "ad-w1",
        title: "Review audit alerts",
        status: "open",
        meta: { count: 4 }
      }
    ],
    highlights: [
      {
        id: "ad-h1",
        title: "SSO integration",
        description: "Testing Singpass SSO sandbox with IT security."
      }
    ]
  }
};

export const principalDashboard: PrincipalDashboardPayload = {
  kpis: [
    { id: "attendance", label: "Attendance", value: "93", unit: "%", trend: "up", delta: 1 },
    { id: "leave", label: "Leave Volume", value: 28, unit: "requests", trend: "down", delta: -5 },
    { id: "enrolment", label: "Enrolment", value: 512, unit: "students", trend: "up", delta: 3 },
    { id: "approvals", label: "Approval Time", value: 1.4, unit: "days", trend: "down", delta: -0.4 }
  ],
  attendanceSeries: Array.from({ length: 10 }).map((_, index) => ({
    date: new Date(Date.now() - (9 - index) * 24 * 3600 * 1000).toLocaleDateString(),
    rate: 90 + Math.round(Math.random() * 6)
  })),
  engagementSeries: Array.from({ length: 10 }).map((_, index) => ({
    date: new Date(Date.now() - (9 - index) * 24 * 3600 * 1000).toLocaleDateString(),
    dau: 800 + Math.round(Math.random() * 200)
  })),
  healthIndicators: [
    { id: "system", label: "System Uptime", value: 99.9, status: "good" },
    { id: "content", label: "Content Freshness", value: 87, status: "warning", description: "Update science department pages." },
    { id: "feedback", label: "Feedback Score", value: 4.6, status: "good" }
  ]
};

export const messageThreads: MessageThread[] = [
  {
    id: "msg-1",
    subject: "Welcome to Term 2",
    preview: "Term 2 kicks off with several exciting programmes...",
    body: "Dear students, Term 2 kicks off with several exciting programmes including the STEM Hackathon. Please refer to the attached schedule for week 1.",
    channel: "announcement",
    senderId: "teacher-1",
    senderName: "Ms. Lee",
    recipientIds: ["student-1", "student-2"],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isRead: false,
    tags: ["term", "announcement"],
    roleVisibility: ["student", "teacher"],
    attachments: [
      {
        id: "att-1",
        name: "Term2-Overview.pdf",
        url: "https://example.com/Term2-Overview.pdf"
      }
    ]
  },
  {
    id: "msg-2",
    subject: "CCA Trials Reminder",
    preview: "CCA trials commence this Wednesday...",
    body: "CCA trials commence this Wednesday. Ensure students have submitted the consent form before attending.",
    channel: "announcement",
    senderId: "admin-1",
    senderName: "General Office",
    recipientIds: ["student-1", "teacher-1"],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isRead: true,
    tags: ["cca"],
    roleVisibility: ["student", "teacher", "hod"]
  },
  {
    id: "msg-3",
    subject: "Leave request clarification",
    preview: "Could you provide more details on the leave request...",
    body: "Could you provide more details on the leave request submitted for 10 Apr?",
    channel: "direct",
    senderId: "hod-1",
    senderName: "Mr. Tan",
    recipientIds: ["teacher-1"],
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    isRead: false,
    tags: ["leave"],
    roleVisibility: ["teacher", "hod"]
  }
];

export const studentProfiles: StudentProfile[] = [
  {
    id: "student-1",
    displayName: "Alex Tan",
    email: "alex.tan@example.edu",
    avatarUrl: "https://i.pravatar.cc/128?img=12",
    roles: ["student"],
    gradeLevel: "Sec 2",
    homeroom: "2E",
    contactNumber: "+65 8123 4567",
    emergencyContact: {
      name: "Tan Mei Ling",
      phone: "+65 8123 7654",
      relation: "Mother"
    },
    tags: ["STEM", "Student Leader"],
    studentNumber: "S2024-1023",
    programmes: ["STEM Excellence"],
    advisorId: "teacher-1",
    advisorName: "Ms. Lee",
    attendanceRate: 96,
    gpa: 3.6,
    achievements: [
      { id: "ach-1", title: "National Robotics Silver", awardedAt: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: "student-2",
    displayName: "Nur Aisyah",
    email: "aisyah@example.edu",
    avatarUrl: "https://i.pravatar.cc/128?img=5",
    roles: ["student"],
    gradeLevel: "Sec 3",
    homeroom: "3N",
    contactNumber: "+65 8765 4321",
    emergencyContact: {
      name: "Mohd Rashid",
      phone: "+65 8765 1234",
      relation: "Father"
    },
    tags: ["Prefect", "Choir"],
    studentNumber: "S2023-2088",
    programmes: ["Humanities Plus"],
    advisorId: "teacher-2",
    advisorName: "Mr. Koh",
    attendanceRate: 92,
    gpa: 3.8,
    achievements: []
  }
];

export const teacherProfiles: TeacherProfile[] = [
  {
    id: "teacher-1",
    displayName: "Grace Lee",
    email: "grace.lee@example.edu",
    avatarUrl: "https://i.pravatar.cc/128?img=32",
    roles: ["teacher"],
    department: "Mathematics",
    subjects: ["Mathematics", "Additional Mathematics"],
    yearsOfExperience: 8,
    qualifications: ["BSc Mathematics", "PGDE"],
    tags: ["Form Teacher", "STEM"],
    employeeNumber: "T2015-0912",
    contactNumber: "+65 8345 1289",
    upcomingClasses: [
      {
        id: "cls-1",
        courseId: "course-1",
        courseTitle: "Sec 2E Mathematics",
        startTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        location: "Block A, Room 203"
      }
    ]
  },
  {
    id: "teacher-2",
    displayName: "Marcus Koh",
    email: "marcus.koh@example.edu",
    avatarUrl: "https://i.pravatar.cc/128?img=22",
    roles: ["teacher"],
    department: "Science",
    subjects: ["Physics", "Chemistry"],
    yearsOfExperience: 5,
    qualifications: ["BSc Physics", "MEd Curriculum"],
    tags: ["CCA Advisor"],
    employeeNumber: "T2018-1034",
    contactNumber: "+65 8765 9087",
    upcomingClasses: []
  }
];

export const courseSummaries: CourseSummary[] = [
  {
    id: "course-1",
    code: "MAT201",
    title: "Mathematics (Algebra II)",
    description: "Builds on algebraic concepts with focus on problem-solving",
    subject: "Mathematics",
    gradeLevel: "Sec 2",
    credits: 4,
    capacity: 30,
    enrolled: 26,
    instructors: [
      { id: "teacher-1", name: "Grace Lee" }
    ],
    schedule: [
      { day: "Monday", startTime: "08:00", endTime: "09:30", location: "Block A 203" },
      { day: "Wednesday", startTime: "09:40", endTime: "11:10", location: "Block A 203" }
    ],
    tags: ["core", "algebra"]
  },
  {
    id: "course-2",
    code: "SCI310",
    title: "Physics Laboratory",
    description: "Experimental approach to mechanics and energy.",
    subject: "Science",
    gradeLevel: "Sec 3",
    credits: 3,
    capacity: 24,
    enrolled: 20,
    instructors: [
      { id: "teacher-2", name: "Marcus Koh" }
    ],
    schedule: [
      { day: "Tuesday", startTime: "10:00", endTime: "12:00", location: "Lab B" }
    ],
    tags: ["lab", "physics"]
  }
];

export const courseDetails: Record<string, CourseDetail> = {
  "course-1": {
    ...courseSummaries[0],
    syllabus: "Week 1: Quadratic functions, Week 2: Transformations, Week 3: Inequalities",
    resources: [
      { id: "res-1", name: "Quadratics Notes", type: "pdf", url: "https://example.com/quadratics.pdf" },
      { id: "res-2", name: "Inequalities Video", type: "video", url: "https://example.com/inequalities" }
    ],
    relatedCourses: [
      { id: "course-2", title: "Physics Laboratory", subject: "Science", gradeLevel: "Sec 3" }
    ]
  },
  "course-2": {
    ...courseSummaries[1],
    syllabus: "Week 1: Measurement, Week 2: Forces, Week 3: Energy",
    resources: [
      { id: "res-3", name: "Lab Safety", type: "pdf", url: "https://example.com/lab-safety.pdf" }
    ],
    relatedCourses: [
      { id: "course-1", title: "Mathematics (Algebra II)", subject: "Mathematics", gradeLevel: "Sec 2" }
    ]
  }
};

export const enrolmentOverview: EnrollmentOverview = {
  tasks: [
    {
      id: "task-1",
      title: "STEM Elective Selection",
      description: "Rank your top 3 preferences for semester 2",
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      status: "pending",
      progress: 40,
      preferredCourses: ["course-1", "course-2"],
      assignedBy: "Education Office"
    }
  ],
  results: [
    {
      id: "result-1",
      courseId: "course-1",
      courseTitle: "Mathematics (Algebra II)",
      status: "enrolled",
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ]
};

export const attendanceSummary: AttendanceSummary[] = [
  {
    courseId: "course-1",
    courseTitle: "Mathematics (Algebra II)",
    present: 24,
    absent: 1,
    late: 2,
    excused: 1,
    totalSessions: 12
  },
  {
    courseId: "course-2",
    courseTitle: "Physics Laboratory",
    present: 18,
    absent: 2,
    late: 1,
    excused: 1,
    totalSessions: 10
  }
];

export const attendanceSessions: Record<string, AttendanceSession> = {
  "course-1": {
    id: "course-1",
    courseId: "course-1",
    courseTitle: "Mathematics (Algebra II)",
    date: new Date().toISOString(),
    startTime: "08:00",
    endTime: "09:30",
    roster: studentProfiles.map((student, index) => ({
      id: `session-1-${index}`,
      studentId: student.id,
      studentName: student.displayName,
      classId: "2E",
      className: "2E",
      date: new Date().toISOString(),
      status: index % 4 === 0 ? "late" : "present"
    }))
  },
  "course-2": {
    id: "course-2",
    courseId: "course-2",
    courseTitle: "Physics Laboratory",
    date: new Date().toISOString(),
    startTime: "10:00",
    endTime: "12:00",
    roster: studentProfiles.map((student, index) => ({
      id: `session-2-${index}`,
      studentId: student.id,
      studentName: student.displayName,
      classId: "3N",
      className: "3N",
      date: new Date().toISOString(),
      status: index % 3 === 0 ? "excused" : "present"
    }))
  }
};

export const leaveOverview: LeaveOverview = {
  activeRequests: [
    {
      id: "leave-1",
      requesterId: "student-1",
      requesterName: "Alex Tan",
      type: "medical",
      status: "pending",
      startDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      submittedAt: new Date().toISOString()
    }
  ],
  history: [
    {
      id: "leave-h1",
      requesterId: "student-1",
      requesterName: "Alex Tan",
      type: "school",
      status: "approved",
      startDate: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      submittedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      approverId: "teacher-1",
      approverName: "Grace Lee"
    }
  ],
  approvalsQueue: [
    {
      id: "leave-2",
      requesterId: "student-2",
      requesterName: "Nur Aisyah",
      type: "personal",
      status: "pending",
      startDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(),
      submittedAt: new Date().toISOString()
    }
  ]
};

export const adminOverview: AdminOverview = {
  totalUsers: 1240,
  activeBindings: 1120,
  pendingApprovals: 6,
  recentAudits: [],
  roleDistribution: [
    { role: "student", count: 900 },
    { role: "teacher", count: 120 },
    { role: "hod", count: 10 },
    { role: "principal", count: 2 },
    { role: "admin", count: 5 }
  ]
};

export const auditLogs: AuditLogEntry[] = [
  {
    id: "audit-1",
    actorId: "admin-1",
    actorName: "System Admin",
    action: "update",
    entity: "role-assignment",
    metadata: { userId: "teacher-1", newRole: "hod" },
    timestamp: new Date().toISOString()
  },
  {
    id: "audit-2",
    actorId: "admin-1",
    actorName: "System Admin",
    action: "link",
    entity: "identity-binding",
    metadata: { userId: "student-1", provider: "google" },
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString()
  }
];

export const identityBindings: IdentityBinding[] = [
  {
    id: "bind-1",
    provider: "google",
    externalId: "alex.tan@example.edu",
    userId: "student-1",
    linkedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "bind-2",
    provider: "singpass",
    externalId: "S9012345A",
    userId: "teacher-1",
    linkedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  }
];

export const roleAssignments: RoleAssignment[] = [
  {
    userId: "teacher-1",
    role: "teacher",
    assignedAt: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
    assignedBy: "admin-1"
  }
];

export function appendAuditEntry(entry: AuditLogEntry) {
  auditLogs.unshift(entry);
  adminOverview.recentAudits = auditLogs.slice(0, 10);
}

adminOverview.recentAudits = auditLogs.slice(0, 10);
