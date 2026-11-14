# Scholarly: Requirements

Rules for this file:
- IDs are stable. Never renumber and never reuse an ID. Dropped items stay listed under "Out of scope".
- "Verify by": code = read the code; manual = test in the browser or on a phone; measure = tool measurement (Lighthouse, devtools); UAT = ask pilot users.

## 1. Functional requirements

### Authentication
| ID | Requirement | Source | Verify by |
|---|---|---|---|
| FR-01 | A user can sign in with their Google account in one click. | Survey: friction reduction | manual |
| FR-02 | On first sign-in, a user profile is created automatically from Google data. | Auth.js behaviour | code |
| FR-03 | All dashboard pages are protected; unauthenticated users are redirected to the landing page. | Security | code + manual |
| FR-04 | A user can sign out from any page. | Basic UX | manual |
| FR-05 | The session persists so students do not sign in on every visit. | Survey: ease of use | manual |

### Task management
| ID | Requirement | Source | Verify by |
|---|---|---|---|
| FR-06 | A user can create a task with title, type, due date, category and priority. | Core, survey validated | manual |
| FR-07 | A user can view all their tasks sorted by due date. | Dashboard | manual |
| FR-08 | A user can filter tasks by status (All / Pending / Overdue / Done) and search by title. (If not built, move to Out of scope.) | Wireframe 5.3 | manual |
| FR-09 | A user can edit any task they created. | CRUD | manual |
| FR-10 | A user can permanently delete a task. | CRUD | manual |
| FR-11 | A user can mark a task completed. | Progress tracking | manual |
| FR-12 | A task whose due date has passed and is not completed is shown as overdue. It may be derived at read time or stored, but must be consistent on the dashboard, tasks list and task detail. | Automated behaviour | code |
| FR-13 | The dashboard shows today, this week and overdue tasks in separate sections. | Dashboard design | manual |

### Reminders
| ID | Requirement | Source | Verify by |
|---|---|---|---|
| FR-14 | A user can set a reminder when creating a task, choosing how many days before the deadline (including a custom number). | Survey: 47% want custom timing | manual |
| FR-15 | A user chooses the reminder channel: email, in-app, or both. | Survey: 66% want both | manual |
| FR-16 | Reminders are sent automatically at the scheduled time without user action. | Core value | code + manual |
| FR-17 | A user can update or cancel the reminder on an existing task. | UX | manual |
| FR-18 | The same reminder is never sent twice (sent flag). | Reliability | code |

### Notifications
| ID | Requirement | Source | Verify by |
|---|---|---|---|
| FR-19 | The navbar shows a bell with an unread-count badge. | Standard UX | manual |
| FR-20 | A user can view all notifications in a dropdown or dedicated page. | UX | manual |
| FR-21 | Clicking a notification marks it read and opens the related task. | UX | manual |
| FR-22 | Email reminders include task title, task type, due date, and a link to the app. | Email UX | manual |
| FR-23 | A user can mark all notifications as read in one action. | UX | manual |

### Tools hub
| ID | Requirement | Source | Verify by |
|---|---|---|---|
| FR-26 | The tools page shows a card per external student tool with a name and description. | Product addition | manual |
| FR-27 | Each tool card opens its external link in a new browser tab. | Tools hub UX | manual |

## 2. Non-functional requirements

| ID | Category | Requirement | Verify by |
|---|---|---|---|
| NFR-01 | Performance | Pages reach Largest Contentful Paint under 3 s on throttled "Slow 4G" mobile. | measure |
| NFR-02 | Performance | Task creation feels instant: no perceptible delay after submit (pending state shown immediately). | manual |
| NFR-03 | Performance | Dashboard data loads progressively; the page skeleton renders before data arrives. | manual |
| NFR-04 | Usability | A student can use the app without reading instructions. | UAT |
| NFR-05 | Usability | Every action gives clear feedback: success, error or loading state. | manual |
| NFR-06 | Usability | Forms show descriptive validation errors and never fail silently. | manual |
| NFR-07 | Responsiveness | Fully functional from 320 px wide. | manual |
| NFR-08 | Responsiveness | Tap targets are at least 44 px tall on mobile. | manual |
| NFR-09 | Responsiveness | No horizontal scrolling at any mobile width. | manual |
| NFR-10 | Security | A user can never see, edit or delete another user's tasks, reminders or notifications. | code + manual |
| NFR-11 | Security | Every API route verifies the session before reading or modifying data. | code |
| NFR-12 | Security | No passwords are stored; Google OAuth handles credentials. | code |
| NFR-13 | Security | API keys and secrets live in environment variables, never in code. | code |
| NFR-14 | Reliability | The reminder job runs reliably; a missed reminder is the most critical failure. | code + manual |
| NFR-15 | Reliability | If an email fails to send, the error is logged and the app does not crash. | code |
| NFR-16 | Reliability | Network errors produce a clear message to the user. | manual |
| NFR-17 | Maintainability | Code is organised by feature; files are findable by predictable path; no duplicated components or query helpers. | code |
| NFR-18 | Maintainability | Reusable components live in the shared components/ directory. | code |
| NFR-19 | Maintainability | No hardcoded secrets or environment-specific values (URLs, keys, config): use environment variables. **Exception:** public, non-secret links identical in every environment (the tools hub URLs) live in one typed constant, `src/lib/tools.ts`. | code |

## 3. Proposed additions (accept or delete each)

| ID | Category | Requirement | Verify by |
|---|---|---|---|
| FR-29 | Reminders | Reminders are scheduled for 08:00 Africa/Lagos on the reminder day, through one shared helper. | code + manual |
| FR-30 | Reminders | When a task's due date or its reminder timing is edited, the reminder's scheduled time is recomputed. | code + manual |
| NFR-20 | Performance | List and dashboard queries select only the fields they need, are bounded, and have indexes for their common filters (user + due date, user + read state). | code |
| NFR-21 | Performance | Independent data fetches on a page run in parallel, not one after another. | code |
| NFR-22 | Performance | `"use client"` is used only where interactivity needs it, as low in the tree as possible. | code |
| NFR-23 | Reliability | A due reminder is delivered within 60 minutes of its scheduled time (hourly job). | measure |
| NFR-24 | Reliability | Each reminder run logs counts (due, sent, failed) with no personal data. | code |
| NFR-25 | Security | The cron endpoint rejects requests without the correct secret, and fails closed if the secret is not set. | code |
| NFR-26 | Security | API inputs are validated (type, length, allowed values, unknown fields); invalid input returns 400 with a clear message. | code |
| NFR-27 | Security | Error responses and logs never expose stack traces, secrets or internal messages to the client. | code |
| NFR-28 | Accessibility | Interactive elements are keyboard-operable with visible focus, icon-only buttons are labelled, and text contrast meets WCAG AA. | manual |
| NFR-29 | Data | Deleting a task also deletes its reminders and notifications. | code |
| NFR-30 | Usability | Every page route has a loading state and an error state. | code + manual |

## 4. Out of scope for v1 (deferred on purpose)

| ID | Item | Reason |
|---|---|---|
| FR-24 | Weekly summary | Progress tab replaced by Notifications; revisit after pilot |
| FR-25 | Progress / daily progress count | Same as above |
| FR-28 | Settings page for default reminder timing and channel | Replaced by a profile dropdown |
| n/a | Shared coursemate dashboard, AI task prioritization, offline support | Survey P3 / not needed for pilot |

## 5. Known gaps (tracked, not yet fixed)

- Reminders default to midnight instead of 08:00 Lagos (FR-29).
- `scheduledAt` is not recomputed when a task is edited (FR-30).
- If delivery succeeds but marking sent fails, the next run re-sends the email (affects FR-18).
- The overlap guard and scheduler flag are per-process only.
- Notification list is capped at 20, no pagination; `GET /api/notifications` is unused by the UI and its queries are partly duplicated in `lib/notifications.ts`.
- No rate limiting; PATCH bodies are not fully validated (NFR-26).



