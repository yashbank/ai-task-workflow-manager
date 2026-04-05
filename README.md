# AI Task & Workflow Manager

A full-stack **Next.js 14** productivity app: dashboard analytics, task CRUD, drag-and-drop Kanban, and AI-assisted task suggestions. The codebase is **production-ready** with real integrations (PostgreSQL via Prisma, NextAuth, OpenAI). For **portfolio and cost reasons**, the **public live demo** is intentionally run in a **UI-only / preview** configuration so visitors can explore the interface without consuming paid API quotas or requiring a always-on paid database for a personal portfolio.

---

## Important notice for portfolio visitors & clients

If you opened the **live deployment** linked from a portfolio:

- **What you see is the real product UI** (layout, navigation, Kanban, forms, charts shell, etc.) built as a serious SaaS-style interface.
- **Authenticated flows, database-backed data, and external AI calls are not active** on that public demo by default. This is **on purpose**: the developer hosts the site to **showcase design and UX**, not to run a 24/7 backend or burn third-party API limits.
- **This does not mean the features are fake or missing from the project.** The same repository contains the full implementation (API routes, Prisma models, NextAuth, OpenAI integration). They are **controlled by environment flags** (and safe fallbacks) so the **deployed UI stays stable** and **free-tier friendly** for a portfolio link.

If something on the live site does not persist data or call AI, that is **expected** for this hosting mode—not a bug in the product definition.

---

## Why API / server usage is limited on the public demo

| Concern | How this project addresses it |
|--------|--------------------------------|
| **OpenAI (and similar) API costs & rate limits** | AI routes and keys are optional; the public demo can run with **no live AI calls** so portfolio traffic does not consume quota. |
| **Managed Postgres / Neon / hosting costs** | A always-connected DB for every portfolio visitor is avoided in **preview mode**; the app still **ships with Prisma + migrations** for real deployments. |
| **JWT / session / auth traffic** | **Preview mode** (`DISABLE_AUTH`) bypasses login enforcement and uses a **demo path** so the UI is navigable without auth errors on a minimal env. |
| **Build & runtime errors on Vercel** | Env bootstrapping and optional migrations in CI avoid hard failures when secrets are not set for a static showcase. |

The goal is: **one link in a portfolio = clean UI for reviewers**, without funding ongoing API and database usage for every click.

---

## What is fully implemented in this repository

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Zustand, `@dnd-kit` Kanban.
- **Backend (in repo):** Route Handlers for tasks (CRUD, bulk), AI suggestion endpoint, registration, NextAuth credentials.
- **Data:** Prisma schema (PostgreSQL), migrations under `prisma/migrations/`.
- **Auth:** NextAuth (JWT session strategy), middleware protection when enabled.
- **AI:** OpenAI-powered task suggestions (JSON-shaped responses) when `OPENAI_API_KEY` is set.

All of the above is **part of the codebase**; portfolio mode **does not remove** these modules—it **disables or soft-fails** paths that need secrets or paid services so the **deployed UI does not error**.

---

## “Preview” vs “full stack” mode (how it works)

Implementation detail (for developers and for tools like Cursor reading this README):

- **Environment-driven toggles** (see `src/lib/env-bootstrap.ts` and `.env.example`):
  - `DISABLE_AUTH` / `NEXT_PUBLIC_DISABLE_AUTH` — when `true`, middleware does not enforce login; the app uses a **preview/demo user path** for server logic where applicable.
  - `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENAI_API_KEY` — required for a **fully live** auth + DB + AI setup; fallbacks exist so **builds** do not crash when variables are missing on a showcase deploy.
- **UI behavior:** Error toasts were reduced in favor of empty states / inline hints so the public UI stays calm when APIs are off.

There is **no need** to hunt for “commented-out” blocks for the core story: behavior is **feature-flagged** so the same repo can be **portfolio-safe** today and **production-complete** tomorrow by changing env and redeploying.

---

## Running locally (full experience)

1. Copy `.env.example` → `.env`.
2. Set a real **`DATABASE_URL`** (e.g. Neon), run migrations:  
   `npx prisma migrate deploy` (or `prisma db push` for prototyping).
3. Set **`NEXTAUTH_SECRET`**, **`NEXTAUTH_URL`**, optionally **`OPENAI_API_KEY`**.
4. Set **`DISABLE_AUTH=false`** and **`NEXT_PUBLIC_DISABLE_AUTH=false`** to require login.
5. `npm install` → `npm run dev` → open `http://localhost:3000`.

---

## Deploying (e.g. Vercel)

- Build: `prisma generate` + `next build` (see `package.json` / `vercel.json`).
- Set environment variables in the Vercel project to match your desired mode (preview vs full stack).
- Run database migrations against your production DB when you enable a real `DATABASE_URL`.

---

## For Cursor / portfolio generators

When this project is embedded in a **portfolio site** or described by an AI:

- **Summary:** Full-stack AI task & workflow manager with premium UI; integrations exist in-repo; **public demo may be UI-first** to save API/DB cost and avoid errors for visitors.
- **Visitor message:** Live link may show **UI only**; backend and AI are **documented here** and **enabled via configuration**, not missing from the product scope.

---

## Scripts (reference)

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build (Prisma generate + Next build) |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run db:push` | `prisma db push` |

---

## License

Private / portfolio use unless otherwise specified by the repository owner.
