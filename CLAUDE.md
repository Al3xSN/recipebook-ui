# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint on src/
npm run format       # Prettier (writes)
npm run format:check # Prettier (check only)
```

There are no tests configured yet.

## Architecture

**RecipeBook** is a Next.js 16 frontend (App Router) for discovering, saving, and sharing recipes. It consumes a separate ASP.NET Core backend.

- `src/app/` — App Router pages and layouts. Server Components by default; add `'use client'` only when needed.
- `src/components/` — Reusable React components (empty, ready for development).
- `src/lib/` — Utilities and helpers (empty, ready for development).
- `src/types/` — TypeScript type definitions (empty, ready for development).
- `API_REFERENCE.md` — Full backend API contract (read this before implementing any data-fetching).

Path alias `@/*` maps to `./src/*`.

## Backend API

Base URL (local dev): `http://localhost:5000`  
Interactive docs: `http://localhost:5000/scalar`

**Auth:** JWT Bearer tokens. Access token expires in 60 min; refresh token expires in 7 days. On 401, call `POST /auth/refresh` with the stored refresh token to get new tokens. If refresh also 401s, redirect to login. If the username changes via `PUT /profile/info`, the response includes new tokens — replace stored tokens immediately.

All API errors return RFC 7807 `{ "status": ..., "detail": "..." }`.

**Enums are integers** in both requests and responses (e.g. `RecipeCategory`, `RecipeTag`, `MeasurementUnit`). See `API_REFERENCE.md` for the full enum tables.

## Code Style

Pre-commit hooks (Husky + lint-staged) enforce ESLint and Prettier on staged files automatically. Prettier config: single quotes, semicolons, trailing commas, 100-char print width, 2-space indent.
