@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — ESLint (flat config via `eslint-config-next`)
- `npx prisma migrate dev --name <name>` — create + apply a dev migration
- `npx prisma migrate deploy` — apply pending migrations (CI/prod)
- `npx prisma generate` — regenerate the Prisma client into `src/generated/prisma`

No test runner is configured.

## Stack & versions

- Next.js **16.2.6** (App Router) — see `AGENTS.md`: this is not the Next.js in training data. Consult `node_modules/next/dist/docs/` before writing Next-specific code.
- React 19.2, TypeScript 5, Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Auth.js (`next-auth` v5 beta) with Prisma adapter, database session strategy
- Prisma **7.8** with PostgreSQL — configured via `prisma.config.ts` (not `schema.prisma` datasource URL); `DATABASE_URL` is loaded from `.env` by `dotenv/config` in that file.

## Architecture

- **Prisma client lives at `src/generated/prisma`**, not `@prisma/client`. Always import via `@/lib/prisma` (singleton at `src/lib/prisma.ts`) which prevents hot-reload connection leaks in dev. Do not instantiate `PrismaClient` elsewhere.
- **Auth is centralized in `src/lib/auth.ts`** — exports `handlers`, `auth`, `signIn`, `signOut`. The catch-all route `src/app/api/auth/[...nextauth]/route.ts` only re-exports `handlers.GET`/`handlers.POST`. Add OAuth providers inside `NextAuth({ providers: [...] })` in `src/lib/auth.ts`; the custom sign-in page is `/auth/signin`.
- Session strategy is `"database"`, so sessions/accounts/users persist via the Prisma adapter — the schema in `prisma/schema.prisma` defines the required `User`, `Account`, `Session`, `VerificationToken` models. Changing session strategy or adapter requires schema changes.
- TypeScript path alias `@/*` → `src/*`.
- App Router conventions: `src/app/layout.tsx` is the root layout (loads Geist fonts + global CSS); pages live in `src/app/<route>/page.tsx`.

## Product spec

This repo implements **FITPRISE EMS** — the ERP described in `docs/spec/`. Start at [`docs/spec/README.md`](docs/spec/README.md) for the workflow overview, cross-cutting rules (no DELETE / void-only, latest-exchange-rate, two-tier PO approval, document numbering), and the per-domain file map. Per-domain files: `profiles.md`, `sales-order.md`, `work-order.md`, `production-terminal.md`, `qc-and-ncr.md`, `purchasing.md`, `subcon.md`, `delivery-and-coc.md`, `printouts.md`, `reports.md`. Treat those files as the single source of truth; do not re-read the source PDF unless something there is ambiguous.
