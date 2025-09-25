# Digital Campus Demo

Digital Campus Demo is a front-end only showcase of a modern, role-aware campus management experience. It is built with Vite, React 19, and TypeScript to demonstrate dashboards, workflows, and governance tooling for students, teachers, heads of department, principals, and administrators.

## Project Highlights
- End-to-end mock experience with role switching, protected routes, and granular RBAC permissions.
- Feature-rich modules covering dashboards, messaging, profiles, courses, enrolment, attendance, leave, governance, and innovation labs.
- Interactive UI built with Tailwind CSS and a curated component library (shadcn-inspired) featuring dark mode, glassmorphism, and micro-interactions.
- Data and API layer fully simulated with Mock Service Worker (MSW) and seed fixtures for realistic behaviour.
- Persistent client state via Zustand stores (session, UI theme) plus TanStack Query for server state caching.
- Bilingual groundwork with i18next, language detection, and runtime locale switching.

## Tech Stack
- React 19 + TypeScript, Vite 7
- Tailwind CSS with custom design tokens and PostCSS
- Zustand for client state, TanStack React Query for async workflows
- Mock Service Worker (MSW) with rich fixtures under `src/fixtures`
- i18next with English and Chinese resource bundles

## Getting Started
1. Ensure Node.js 18 or newer is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (MSW boots automatically in dev):
   ```bash
   npm run dev
   ```
4. Visit the printed URL (default `http://localhost:5173`) and sign in with a mock identity to explore each role.

## Available Scripts
- `npm run dev` - start the Vite development server with MSW.
- `npm run build` - type-check and produce a production build.
- `npm run preview` - serve the built assets locally.

## Project Structure
```
src/
  app/                Application bootstrap and router definition.
  components/ui/      Shared UI primitives (buttons, cards, data display).
  config/             Constants, navigation, and RBAC definitions.
  features/           Feature modules (dashboard, messaging, attendance, etc.).
  fixtures/           Seed data consumed by MSW handlers.
  hooks/              React Query hooks that wrap service calls per domain.
  layouts/            Shell layout, header, sidebar, and role-aware chrome.
  lib/                Cross-cutting utilities (HTTP client, i18n bootstrap).
  locales/            English and Chinese translation resources.
  mocks/              MSW browser worker and request handlers.
  providers/          Global providers for theming, query client, and i18n.
  routes/             Route guards, error boundaries, and status pages.
  store/              Persisted Zustand stores for auth session and UI state.
  styles/             Tailwind setup and global design tokens.
  types/              Shared domain models used across services and fixtures.
```
Additional documentation lives at the repository root (`ENCODING_FIXES.md`, `ENHANCED_FEATURES.md`, etc.) and under `docs/` for QA flows.

## Mock Data and API Layer
- All network calls hit MSW handlers defined in `src/mocks/handlers.ts`.
- Fixtures in `src/fixtures/data.ts` provide realistic dashboard metrics, messages, attendance rosters, leave requests, audit logs, and more.
- Mutations update in-memory stores to mimic CRUD operations; refresh the page or use **Reset demo data** in Settings to return to the seed state.
- During local development the worker script is served from `public/mockServiceWorker.js`; production builds omit MSW by default.

## State, Permissions, and Localization
- `src/store/auth-store.ts` persists the active user, roles, and consent state. Permissions derive from `src/config/rbac.ts` and gate routes through `ProtectedRoute`.
- `src/store/ui-store.ts` controls sidebar visibility and theme, persisted to local storage for continuity.
- Domain hooks (e.g. `useDashboard`, `useMessages`) wrap service functions in `src/lib/services/*` to keep data-fetch logic consistent and cache-aware.
- i18n is initialized in `src/lib/i18n.ts` with language detection; `LanguageSwitcher` and Settings allow runtime switching between English and Chinese resources.

## Feature Walkthrough
- **Authentication & Role Switching:** Mock providers (Google Workspace, Singpass) let you assume any role and drive RBAC-aware layouts.
- **Dashboards:** Role-specific widgets for students, teachers, HODs, principals, and admins, including KPI filters and charts.
- **Messaging:** Inbox with filters, pagination, thread view, compose flow, and read/unread state management.
- **Profiles:** Student and teacher directories with advanced filtering and rich profile panels.
- **Courses & Enrolment:** Course catalogue, detail pages, and enrolment workflow tied to dashboards.
- **Attendance & Leave:** Session roster editing, status updates, leave submission, approvals, and history.
- **Admin Console:** Identity bindings, role assignments, and audit log viewer with mutation feedback.
- **Innovation Labs:** Showcase of forward-looking initiatives with progress tracking and call-to-action demos.
- **Settings:** Theme toggle, language selection, consent simulation, and data reset utilities.

## Design System Notes
- Tailwind tokens in `src/styles/global.css` implement light/dark palettes, glassmorphism effects, and motion defaults.
- UI primitives extend shadcn components for consistent spacing, focus states, and accessibility.
- Recharts drives interactive visualizations inside dashboards and reports.

## Quality Assurance
A curated smoke-test checklist is available at `docs/qa-checklist.md`. Use it before sharing demo builds to confirm role flows, data refreshes, and UI interactions.

## Troubleshooting
- If data looks stale, clear browser storage or click **Reset demo data** on the Settings page.
- MSW requires secure contexts in some browsers; when previewing a production build, ensure the worker script is reachable or disable mocking as needed.
- TypeScript path aliases use the `@/` prefix (configured in `tsconfig.json` and `vite.config.ts`). Ensure your editor respects the configuration for proper IntelliSense.

## Related Documents
- `docs/qa-checklist.md` - manual test coverage for the demo flows.
- `ENHANCED_FEATURES.md` - deep dive into interactive enhancements shipped with this build.
- `UI_IMPROVEMENTS.md` and `ISSUE_FIXES.md` - change history for UI polish and bug fixes.

This README is intended as the starting point for maintainers, designers, and demo facilitators who need to understand how the Digital Campus experience is assembled and how to extend it further.
