# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without writing
```

Pre-commit hooks (Husky + lint-staged) automatically run ESLint and Prettier on staged files.

## Architecture

RecipeBook is a **social recipe-sharing platform** built with Next.js 16 App Router, React 19, Prisma 7 + PostgreSQL, and NextAuth 5 (beta).

### Route Groups

- `(auth)/` — Login and Register pages. Layout redirects already-authenticated users to `/recipes`.
- `(protected)/` — All post-login pages (Recipes, Explore, Friends, Profile, Notifications). Layout redirects unauthenticated users to `/`.
- `api/` — REST route handlers. All require authentication via `requireAuth()`.

### Data Flow

1. User authenticates with NextAuth credentials provider (email + bcrypt password).
2. Session is stored as a JWT cookie; the token carries `id`, `username`, and `displayName`.
3. Client pages (`'use client'`) call API routes via the `apiFetch<T>()` wrapper (`src/lib/api.ts`).
4. API route handlers call `requireAuth()` (`src/lib/server/require-auth.ts`) — returns 401 if no session.
5. Handlers query PostgreSQL through the global PrismaClient singleton (`src/lib/db.ts`) using the `@prisma/adapter-pg` connection-pooling adapter.
6. Server-only utilities live under `src/lib/server/`: `password.ts` (bcrypt), `recipe-mapper.ts` (Prisma → DTO), `friendship-helpers.ts`, `api-error.ts`.

### Key Conventions

- **Error responses**: `{ status, detail }` — use `apiError()` from `src/lib/server/api-error.ts`.
- **Validation failures**: HTTP 422; bad requests: 400; missing auth: 401.
- **DTOs**: Convert Prisma models to typed DTOs via `recipe-mapper.ts` before returning from API routes.
- **Enums**: Recipe categories, tags, units, and visibility are numeric enums defined in `src/lib/recipe-enums.ts`. Use these constants — never hardcode integers.
- **Visibility**: Public = 1, Friends Only = 2, Private = 3.
- **Path alias**: `@/*` maps to `src/*`.

### Prisma

Schema lives in `prisma/schema.prisma`. Generated types output to `src/generated/prisma/`. Run `npx prisma generate` after schema changes and `npx prisma migrate dev` to apply migrations.

### Environment Variables

```
DATABASE_URL         # PostgreSQL connection string
AUTH_SECRET          # NextAuth secret
NEXT_PUBLIC_APP_NAME # Displayed app name (client-safe)
```
