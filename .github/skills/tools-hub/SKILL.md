---
name: tools-hub
description: Work on the Student Tools hub (/dashboard/tools), the dashboard Tools zone, the existing ToolCard, and the shared TOOLS constant. Use for adding tools, changing the grid, or fixing the card.
---

## Scope
`/dashboard/tools` page, the dashboard Tools zone, the EXISTING `ToolCard`, and `src/lib/tools.ts`.
Never edit: src/app/api, reminder.ts, cron.ts, instrumentation.ts, prisma/, proxy.ts, .env.
Do not create a second card component. Reuse and fix `ToolCard`.

## Single source of truth
- All tools live in ONE exported constant `TOOLS` in `src/lib/tools.ts`.
- Entry shape: `{ id, name, description, href, icon }`, typed with an exported `Tool` type.
- `DASHBOARD_TOOLS_LIMIT` is exported from the same file. The dashboard renders `TOOLS.slice(0, DASHBOARD_TOOLS_LIMIT)`; the tools page renders all of `TOOLS`.
- Never keep a second copy of the tools list anywhere.
- Adding a tool = adding one entry to `TOOLS`. No other file changes.
- Names, descriptions and URLs come only from the user. Never invent tools or URLs, and never change an href.
- Every `href` is an absolute https URL to an external site.

## ToolCard rules
- Server Component. No state, no "use client".
- The whole card is one real `<a>` (not next/link, not onClick/window.open) with `target="_blank"` and `rel="noopener noreferrer"`.
- Shows: icon, name, description clamped to 2 lines, external-link icon (aria-hidden), plus sr-only text "opens in a new tab".
- Tap target >= 44px. Visible keyboard focus.
- Change only what violates these rules. Do not restyle the card.

## Layout
- Tools page grid: 2 columns on mobile, 3 on desktop, switching at the same breakpoint the sidebar/bottom-nav uses.
- The dashed placeholder card appears ONLY on the tools page, as the last grid item. It is a non-interactive div, not focusable, text "More tools coming soon".
- Styling uses existing tokens in globals.css (light and dark). Read globals.css and ToolCard before writing classes.

## Constraints
- No new dependencies, no client JS, no link health checks.
- No horizontal scroll from 320px up.
- Do not change the dashboard's appearance unless the task says so.

## Done when
- `npm run build` passes.
- Dashboard and tools page both render from `TOOLS`.
- Links open a new tab. Tab + Enter works. Dark mode is correct.
- 320 / 375 / 1280px checked.