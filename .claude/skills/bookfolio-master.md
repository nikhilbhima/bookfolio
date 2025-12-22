# Bookfolio Master Skill

Central skill that orchestrates all Bookfolio-specific optimizations and improvements.

## Quick Reference

| Task | Skill to Use |
|------|--------------|
| Split large components | `bookfolio-refactor` |
| Remove duplicate code | `bookfolio-refactor` |
| Add tests | `bookfolio-testing` |
| Database optimization | `supabase-optimizer` |
| React performance | `performance-audit` |
| Error handling | `code-quality` |

## Project Overview

**Bookfolio** is a PWA for tracking and sharing reading lists.

- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase
- **State**: Zustand
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## Key Files

```
bookfolio/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Login, signup, logout
│   │   ├── books/        # Book search
│   │   └── profile/      # Public profile
│   ├── dashboard/        # Main app
│   ├── [username]/       # Public profiles
│   └── layout.tsx        # Root layout
├── components/
│   ├── books-grid.tsx    # Book display (489 lines - needs split)
│   ├── add-book-modal.tsx # Add/edit books (540 lines - needs split)
│   ├── book-card.tsx     # Individual book
│   └── ui/               # Radix UI components
├── lib/
│   ├── store.ts          # Zustand store
│   ├── database.ts       # Supabase operations
│   ├── supabase.ts       # Supabase client
│   └── auth.ts           # Auth helpers
└── .claude/skills/       # Claude skills
```

## Priority Issues

### P0 - Critical
1. **Duplicate filtering logic** - Same code in store.ts and books-grid.tsx
2. **No test coverage** - No automated tests exist
3. **Stubbed feature** - `updateBooksOrder()` not implemented

### P1 - High
4. **Large components** - books-grid.tsx and add-book-modal.tsx need splitting
5. **Missing DB indexes** - Performance impact on queries
6. **Console.error logging** - No structured error handling

### P2 - Medium
7. **No error boundaries** - App crashes on component errors
8. **No Web Vitals tracking** - Can't monitor performance
9. **Missing useCallback** - Unnecessary re-renders

### P3 - Low
10. **Bundle analysis** - Not set up
11. **Image optimization** - Using unoptimized prop
12. **Lazy loading** - Heavy modals load immediately

## Common Commands

```bash
# Development
npm run dev           # Start dev server (port 3005)
npm run build         # Production build
npm run lint          # Run ESLint

# Testing (after setup)
npx playwright test   # E2E tests
npm run test          # Unit tests

# Analysis
ANALYZE=true npm run build  # Bundle analysis
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
GOOGLE_BOOKS_API_KEY=<api-key>
```

## Database Tables

- `profiles` - User profiles (username, bio, social links)
- `books` - User's book collection
- `auth.users` - Supabase auth users

## Improvement Workflow

1. **Assess** - Read relevant files, understand current state
2. **Plan** - Use appropriate skill for guidance
3. **Implement** - Make changes incrementally
4. **Verify** - Run build, check for errors
5. **Test** - Manual or automated verification

## Notes for Claude

- Always run `npm run build` after significant changes
- The app runs on port 3005 (configured in package.json)
- Public profiles at `bookfolio.me/[username]`
- Drag-and-drop only works in grid view with no filters
