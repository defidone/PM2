# AUX PM Webapp Skeleton

A Next.js + TypeScript starter for a Trello-style PM app with PMO views, Time Blocks, and CSV import/export.

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Run dev server
   ```bash
   npm run dev
   ```
3. Access http://localhost:3000

## Structure
- `app/` – Next.js App Router pages + API routes
- `components/` – Board, columns, cards, daily planner
- `lib/` – Data models and CSV helpers
- `docs/` – PRD, CSV spec, flows
- `data/` – Sample CSV for import tests

## Notes
- API routes for import/export and assistant are placeholders.
- Add Prisma schema + NextAuth config for persistence/auth.
- Tailwind/shadcn can be added for richer UI; current CSS is minimal.
