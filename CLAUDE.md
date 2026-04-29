# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style

Respond like a caveman. No articles, no filler words, no pleasantries.
Short. Direct. Code speaks for itself.
If asked for code, give code. No explain unless asked.
No sycophancy. No restating the question. No sign-offs.

## Commands

```bash
npm run dev        # Start dev server (Next.js + Turbopack)
npm run build      # Production build
npm run lint       # ESLint
npm run format     # Prettier (writes .ts/.tsx)
npm run typecheck  # tsc --noEmit
```

Env var required: `NEXT_PUBLIC_API_BASE_URL` — points to the backend REST API.

## Architecture

**Next.js 16 App Router** dashboard for interview practice analytics (Barabari / Samvaad Saathi platform).

### Route structure

```
/                          → Login page (redirects to /dashboard if tokens exist)
/dashboard                 → Overview with date-range-filtered KPIs and charts
/dashboard/students        → Students list
/dashboard/students/[id]   → Student detail
/dashboard/colleges        → Colleges list
/dashboard/colleges/[collegeName]  → College detail
/dashboard/interviews      → Interviews list
/dashboard/interviews/[id] → Interview detail
/dashboard/alerts          → Alerts
/dashboard/roles           → Roles analytics
/dashboard/rankings        → Student rankings
```

Each route segment keeps its page-specific components in a co-located `_components/` directory.

### Data fetching — `react-query-ease` + TanStack Query

All API calls go through `src/lib/api/config.ts`, which exports a single `api` client built with `react-query-ease`. This client wraps axios and handles token refresh automatically via `createAuthInterceptor`.

Hook files live in `src/lib/api/hooks/analytics/` — one file per domain (`useColleges.ts`, `useDashboard.ts`, `useStudentDetail.ts`, etc.). Each hook:

- calls `api.useQuery` with a URL, method, and a query key from `analyticsKey()` (defined in `query-keys.ts`)
- strips null/undefined params with `compactParams()` before passing to the request
- returns a named alias for `data` and `isLoading` alongside the raw query object

All response shapes are typed in `src/lib/api/hooks/analytics/types.ts`.

### Auth

Tokens stored in cookies: `SSA_Tk` (access) and `SSA_RTk` (refresh). Helpers in `src/lib/token-cookies.utils.ts`. On refresh failure, cookies are cleared and the user is redirected to `/`. Login page checks for existing tokens on mount and skips the form if both are present.

### UI

- **shadcn/ui** components in `src/components/ui/` — add new ones with `npx shadcn@latest add <name>`
- **Tailwind CSS v4** with `tw-animate-css`
- Icons from `@tabler/icons-react`
- Charts via **Recharts** (`src/components/ui/chart.tsx` wraps it)
- Animations: **Motion** (Framer Motion v12) + `BlurFade`, `MagicCard`, `LightRays` custom components
- Page transitions: `next-view-transitions` + `PageTransition` wrapper in the dashboard layout

### Dashboard layout shell

`src/app/dashboard/layout.tsx` wraps all dashboard routes with `SidebarProvider` → `AppSidebar` + `SidebarInset` + `SiteHeader`. The sidebar nav is statically defined in `app-sidebar.tsx`.

### Shared filter context

`DashboardOverviewProvider` (in `dashboard-overview-context.tsx`) holds the date-range preset (`7d` / `30d` / `90d` / `all`) for the overview page and exposes `dateFilters` (formatted `start_date` / `end_date` strings) to child components via `useDashboardOverviewRange()`.

### Path aliases

`@/` maps to `src/`. Use it for all internal imports.
