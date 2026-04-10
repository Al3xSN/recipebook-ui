# recipebook-ui

A Next.js application for discovering, saving, and sharing recipes.

## Tech Stack

- [Next.js](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- ESLint + Prettier
- Husky + lint-staged (pre-commit hooks)

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start dev server with Turbopack  |
| `npm run build`        | Production build                 |
| `npm run start`        | Start production server          |
| `npm run lint`         | Run ESLint                       |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |
