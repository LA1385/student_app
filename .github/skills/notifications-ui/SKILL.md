---
name: notifications-ui
description: Build the Scholarly notifications UI (nav tab, bell, notifications page, row actions). Use for any task about notifications in the UI.
---

# Notifications UI

## API (finished, do not change; all require login, else 401)
- GET /api/notifications -> { notifications: [{ id, userId, taskId, reminderId, message, read, createdAt (ISO string) }], unreadCount }  (newest first, max 20)
- PATCH /api/notifications/[id] -> the updated notification; 404 if missing or not the user's
- PATCH /api/notifications/read-all -> { count }
- DELETE /api/notifications/[id] -> { message }; 404 if missing or not the user's
- DELETE /api/notifications -> { message }

## Decisions already made
- No dropdown. The bell in the header links to /dashboard/notifications and shows the unread badge (hidden at 0, "99+" cap).
- The Notifications tab replaces the Progress tab in the sidebar and the mobile bottom nav (4 tabs).
- The page server-loads the list and count; a client component handles row actions.
- The list is capped at 20; label it "Recent notifications".
- Row click: mark read optimistically and navigate to /dashboard/tasks/[taskId] without waiting for the PATCH.
- Delete icon on each row must stop the click from reaching the row.
- "Clear all" needs a confirmation. "Mark all read" and "Clear all" are disabled when the list is empty.
- After any mutation call router.refresh() so the layout's badge updates.

## Do not
- Touch backend files or the database schema
- Add real-time features (websockets, SSE)