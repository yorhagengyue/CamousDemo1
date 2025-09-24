# Demo QA Checklist

Use this checklist to verify the main demo flows before sharing a build.

- **Login & RBAC**
  - Launch dev server and confirm Google/Singpass mock sign-in switches identity/role.
  - Cycle through Student, Teacher, HOD, Principal, Admin roles and ensure sidebar entries respect permissions.
- **Dashboard Widgets**
  - Student view shows enrolment tasks and leave summaries populated from fixtures.
  - Teacher view highlights pending approvals; submitting attendance updates charts.
  - Principal report filters update the Recharts graphs without errors.
- **Messaging**
  - Filter and search inbox items; open a thread and mark it as read (badge updates).
  - Compose a new announcement and confirm it appears at the top of the list.
- **Profiles**
  - Search Student directory and open a detail page to view achievements/contacts.
  - Filter Teacher directory by department and view a teacher profile.
- **Courses & Enrolment**
  - Filter course catalogue, open a course page, and trigger the enrol action.
  - Review the enrolment task/result cards for updated status.
- **Attendance & Leave**
  - Select a course from the summary, change a few roster statuses, and submit.
  - Submit a new leave request; approve/reject through the approvals tab.
- **Admin Console**
  - Link a mock identity and verify it appears in the list and audit log.
  - Unlink an identity and verify the audit entry and counts update.
- **Settings & Reset**
  - Toggle theme/language preferences; use Reset Demo Data to clear state and reload.

> If any data becomes stale during testing, clear local storage or use the reset button to return to the initial seed state.
