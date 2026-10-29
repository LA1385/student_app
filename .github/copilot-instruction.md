# Scholarly: Copilot instructions

## What this is
Scholarly is a mobile-first deadline and reminder web app for university students. A student developer is building it solo and learning as he goes. Keep code simple and readable, and explain non-obvious choices briefly in your reply.

## Stack
- Next.js 16.2.3 (App Router), TypeScript strict, Tailwind CSS
- Prisma with the client generated into `generated/prisma`; import types from "@generated/prisma/client"; SQLite in development
- NextAuth for auth. `requireUser()` from "@/lib/auth_helpers" returns the signed-in user or null
- Prisma client singleton: `prisma` from "@/lib/prisma"
- Path alias: "@/" = `src/`

## Commands
- `npm run dev`, `npm run build` (must pass; it type-checks)
- There is no test framework. Do not add one. Verify with the build and the manual checks in the task.

## Layout
- Protected pages: `src/app/(pages)/(protected)/dashboard/...` (covered by the proxy matcher /dashboard/:path*)
- API routes: `src/app/api/...`
- Components: `src/components/{dashboard,landing,providers,shared, tasks, ui}`
- Colors/Design tokens: `src/app/global.css`

## Hard rules
- Do NOT edit: src/app/api/**, src/lib/reminder.ts, src/lib/cron.ts, src/instrumentation.ts, prisma/**, proxy.ts, any .env file
- Do NOT run: prisma migrate, prisma db push, anything that deletes data, git commit, git push, git reset
- Do not install packages without asking first
- Never read or print secrets
- Stay inside the task. No refactors elsewhere.

## Next.js 16 conventions
- `params` is a Promise: always `await params`
- Server components read data with `prisma`, scoped by the signed-in user's id
- Client components call the API routes and use "use client" only where needed

## UI rules
- Mobile first. Works at 320px, tap targets at least 44px, no horizontal scroll
- Real <button> elements with aria-labels for icon buttons
- Optimistic updates with rollback on failure, then `router.refresh()`
- Never copy a server prop into useState (it goes stale). Render the prop.
- No `any`, no ts-ignore

## Definition of done
`npm run build` passes. Report: files changed, files created, anything you were unsure about.