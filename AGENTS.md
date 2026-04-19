# Agent Guidelines for samvaad-saathi-dashboard

## Project Overview

This is a Next.js 16 dashboard application using React 19, TypeScript (strict mode), and Tailwind CSS v4 with shadcn/ui components.

## Build Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack

# Production
npm run build                  # Build for production
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run format                 # Format all .ts/.tsx files with Prettier
npm run typecheck              # Run TypeScript type checking (no emit)

# Individual File Linting (if needed)
npx eslint "src/path/to/file.tsx"
npx prettier --write "src/path/to/file.tsx"
npx tsc --noEmit "src/path/to/file.tsx"
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - No implicit any, strict null checks
- Use explicit types for function parameters and return values
- Prefer `type` over `interface` for object types unless declaration merging is needed
- Use `Readonly<T>` for immutable types
- Avoid `any` - use `unknown` with type guards when type is uncertain

### Imports

```typescript
// React - use namespace import for React hooks
import * as React from "react"

// Path aliases - use @/ for src imports
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Group imports: external → internal → relative
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import "./button.css"
```

### Naming Conventions

- **Components**: PascalCase (`DashboardPage`, `DataTable`)
- **Hooks**: camelCase with `use` prefix (`useIsMobile`, `useMediaQuery`)
- **Utilities**: camelCase (`cn`, `formatDate`, `generateId`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse<T>`)
- **CSS classes**: Use Tailwind utility classes, avoid custom CSS when possible
- **Files**: kebab-case for pages (`students/page.tsx`), PascalCase for components (`DataTable.tsx`)

### Component Patterns

#### shadcn/ui Components

- Use `data-slot` attribute for slot-based composition
- Use `cn()` utility for merging classNames
- Destructure props with defaults

```typescript
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

#### Variant Pattern (class-variance-authority)

- Define variants using `cva()` with `variants` object
- Export both component and variant function
- Support `asChild` prop with Slot from Radix UI when semantically appropriate

### State Management

- Use React hooks (`useState`, `useReducer`) for local state
- Server components by default; add `"use client"` directive only when needed
- Keep client components at leaf nodes in component tree

### Error Handling

```typescript
// For async operations
try {
  const data = await fetchData()
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific error type
  }
  throw error // Re-throw if can't be handled
}

// Never swallow errors silently
```

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── dashboard/        # Dashboard routes
│       ├── layout.tsx
│       ├── page.tsx
│       └── _components/   # Dashboard-specific components
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── app-sidebar.tsx   # App-level components
│   └── ...
├── hooks/                # Custom React hooks
│   └── use-*.ts
└── lib/                  # Utilities, constants, types
    ├── api/              # API client and analytics hooks
    ├── kpi-format.ts     # KPI display helpers
    └── utils.ts          # cn() utility
```

### Tailwind CSS (v4)

- Use CSS variables from design system (`--radius-*`, `--ring`, etc.)
- Use arbitrary values sparingly (`[&_svg]:size-4`)
- Group related utilities
- Use `dark:` prefix for dark mode styles
- Prefer semantic color tokens (`bg-primary`, `text-foreground`)

### Next.js Specifics

- Use `next/font/google` for fonts with CSS variables
- Server Components by default; `"use client"` only when needed
- Use `Readonly<{...}>` for layout/page props
- Use `suppressHydrationWarning` on html/body for theme toggles

## Pre-commit Checklist

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run format` applied (or consistent with Prettier)
- [ ] No TypeScript errors
- [ ] No hardcoded sensitive values
