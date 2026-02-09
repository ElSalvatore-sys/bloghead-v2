# bloghead-v2

## Project Overview

Music booking platform connecting fans, artists, and venues. German market focus (Wiesbaden, Frankfurt, Berlin, etc.).

**Stack:** React 19 + TypeScript + Vite 7 + Supabase + TanStack Query + Zustand + Tailwind CSS 4 + React Hook Form + Zod

**Repo:** https://github.com/ElSalvatore-sys/bloghead-v2

---

## Phase Progress

- Phase 8A: Design Foundation — fonts, tokens, 5 shared components
- Phase 8B: Landing Page Redesign — hero, categories, carousels, how-it-works, footer
- Phase 8C: Discovery Pages Polish — filters, chips, cards, seed data, 492 tests, 18 E2E tests
- Phase 8D: Detail Page Enhancement — NEXT

---

## Testing

### Unit / Integration Tests
- **Runner:** Vitest with v8 coverage
- **Run:** `npm run test` (492 tests)
- **Coverage:** `npm run test:coverage` — thresholds: 80/70/75/80
- **Config:** `vitest.config.ts`
- **Test infra:** `src/test/mocks/supabase.ts` (chainable builder), `src/test/mocks/data.ts` (fixtures), `src/test/helpers.tsx` (React Query wrapper)

### E2E Tests
- **Runner:** Playwright (18 tests)
- **Run:** `npm run test:e2e` (headless) or `npm run test:e2e:headed` (visible)
- **Config:** `playwright.config.ts`, fixtures in `e2e/fixtures/`
- **CI:** `.github/workflows/test.yml`

### Playwright Visual Walkthrough Testing

For manual visual QA, use Playwright MCP in headed step-by-step mode:
- Navigate page by page through the app in a single browser window
- Take screenshots at each step
- Pause between actions so the developer can watch in real-time
- Test filters, navigation, auth flows, and responsive layouts visually
- Command to developer: "take your time between each step, one by one, so I can see it in a human way"

This is separate from automated E2E tests (`npx playwright test`) — it's a human-supervised visual walkthrough for QA after major UI phases.

### Key Commands
- Headed E2E tests: `npx playwright test --headed`
- Seed demo data: `npm run db:seed-demo`
- After seeding: hard refresh (Cmd+Shift+R) to clear React Query cache (staleTime: 60s)

---

## Supabase + Playwright Auth Gotchas

- **localStorage injection does NOT work** for Supabase auth in Playwright E2E tests
- Supabase JS v2's `getSession()` reads localStorage but the internal auth client doesn't fully initialize from it — profile fetches hang indefinitely
- **Fix:** Use UI-based login (fill email/password, click Sign In) in the fixture
- Authenticated tests must use **client-side navigation** (sidebar clicks, `page.evaluate`) — NOT `page.goto()` which causes full page reloads and re-triggers the broken auth init
- `page.goto()` on protected routes causes the ProtectedRoute loading spinner to hang

---

## Database

- **Migrations:** `supabase/migrations/` (001-020+)
- **Seed data:** Migration `009_seed_data.sql` seeds lookup tables (genres, cities, amenities)
- **Demo data:** `npm run db:seed-demo` creates 12 artists + 12 venues with auth users, profiles, junction table links, and media entries
- **Test users:** `npm run db:seed-users` creates dev-user@test.com / TestPassword123!
- **Types:** `npm run db:types` regenerates `src/types/database.ts`

---

## Vitest vi.mock() Hoisting

`vi.mock()` factories are hoisted to the top of the file, BEFORE any `const` declarations. Use `vi.hoisted()`:

```ts
const mocks = vi.hoisted(() => ({ myFn: vi.fn() }))
vi.mock('module', () => ({ thing: mocks.myFn }))
```

---

## Key Directories

| Path | Purpose |
|------|---------|
| `src/components/` | UI components (auth, booking, dashboard, discovery, layout, profile, shared, ui) |
| `src/hooks/queries/` | TanStack Query hooks (use-discovery, use-bookings, etc.) |
| `src/services/` | Supabase service layer (artists, venues, bookings, etc.) |
| `src/stores/` | Zustand stores (filter-store, auth, ui) |
| `src/pages/` | Page components organized by feature |
| `e2e/` | Playwright E2E tests |
| `scripts/` | Seed scripts (seed-test-users.ts, seed-demo-data.ts) |
| `supabase/migrations/` | Database migrations |
