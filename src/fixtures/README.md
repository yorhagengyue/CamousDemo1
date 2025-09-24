# Fixtures Overview

This directory contains the seed data used by the Mock Service Worker (MSW) layer. All API handlers read and mutate the in-memory objects exported from `src/fixtures/data.ts`.

## Contents
- `data.ts`: exports domain fixtures for dashboards, messages, profiles, courses, enrolment, attendance, leave, and admin features. Helper utilities keep audit logs in sync.

## Updating Fixtures
1. Modify the structures in `data.ts` and ensure they continue to satisfy the type contracts under `src/types`.
2. If new endpoints are introduced, add corresponding handlers in `src/mocks/handlers.ts`.
3. Restart the dev server to reload the worker when fixtures change.

## Known Limitations
- State is shared across the session: reloading the page resets any mutations because the data is held in memory.
- Authentication is simulated; `userId` references in the fixtures are purely illustrative.
