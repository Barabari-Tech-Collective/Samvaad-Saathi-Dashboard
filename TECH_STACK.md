# Samvaad Saathi Dashboard - Tech Stack

This document outlines the complete technology stack used in the **Samvaad Saathi Dashboard** frontend application.

## Core Architecture
- **Framework:** [Next.js](https://nextjs.org/) (v16.1.7) - Utilizing App Router and Server Components.
- **Library:** [React](https://react.dev/) (v19.2.4)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (v5.9.3) - For static typing and enhanced developer experience.

## Styling & UI Foundation
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/) (v4.2.1) - Utility-first styling framework.
- **Component Library / Design System:** [shadcn/ui](https://ui.shadcn.com/) - Reusable components built with Radix UI and Tailwind CSS.
- **UI Primitives:** [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components.
- **Styling Utilities:**
  - `clsx` & `tailwind-merge` - For conditional class name resolution and avoiding style conflicts.
  - `class-variance-authority` (CVA) - For creating variant-driven components.
- **Icons:** [Tabler Icons](https://tabler.io/icons) (`@tabler/icons-react`)
- **Theming:** `next-themes` - For dark/light mode switching.

## State Management & Data Fetching
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest) (`@tanstack/react-query` v5) - Server state management and caching.
- **Query Utilities:** `react-query-ease`
- **HTTP Client:** [Axios](https://axios-http.com/) - Promise-based HTTP client for API requests.
- **Cookies:** `cookies-next` - For client and server-side cookie management.

## Forms & Data Validation
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) - Performant, flexible, and extensible forms with easy-to-use validation.
- **Schema Validation:** [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation.
- **Resolver:** `@hookform/resolvers` - Integrating Zod with React Hook Form.

## Advanced UI Features
- **Data Tables:** [TanStack Table](https://tanstack.com/table/latest) - Headless UI for building powerful tables and datagrids.
- **Data Visualization:** [Recharts](https://recharts.org/) - Composable charting library built on React components.
- **Drag & Drop:** [dnd-kit](https://dndkit.com/) (`@dnd-kit/core`, `modifiers`, `sortable`, `utilities`) - Lightweight, accessible, and extensible drag & drop toolkit.
- **Animations & Transitions:**
  - `motion` (Framer Motion v12) - Production-ready animation and gesture library.
  - `next-view-transitions` - View Transitions API integration for Next.js.
  - `tw-animate-css` - Tailwind animation utilities.
- **Notifications/Toasts:** [Sonner](https://sonner.emilkowal.ski/) - An opinionated toast component for React.
- **Drawers:** `vaul` - An unstyled drawer component for React.

## Date & Time Handling
- **Utilities:** `date-fns` & `dayjs` - Modern JavaScript date utility libraries.
- **Date Picker UI:** `react-day-picker` - A date picker component used in conjunction with shadcn/ui.

## Tooling & Quality Assurance
- **Linter:** [ESLint](https://eslint.org/) (v9) - With Next.js configuration.
- **Formatter:** [Prettier](https://prettier.io/) - With `prettier-plugin-tailwindcss` for automatic class sorting.
- **Package Manager / Environment:** Node.js (v25 runtime types supported).
