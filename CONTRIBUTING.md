# Contributing to Bookfolio

Thanks for your interest in contributing to Bookfolio! This document outlines areas where help is needed.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/bookfolio.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run lint: `npm run lint`
7. Build to verify: `npm run build`
8. Submit a PR

## Areas for Contribution

### Performance Improvements

| Issue | Priority | Description |
|-------|----------|-------------|
| Lazy load modals | Medium | Use `next/dynamic` to lazy load `AddBookModal`, `EditProfileModal`, `ImageCropModal` for faster initial page load |
| Add `useCallback` optimizations | Medium | Event handlers in `books-grid.tsx` (`handleMouseDown`, `handleMouseMove`, `handleMouseUp`) should use `useCallback` |
| Zustand shallow selectors | Low | Use `shallow` comparison for multi-value selectors to reduce re-renders |

### Code Quality

| Issue | Priority | Description |
|-------|----------|-------------|
| Centralize error handling | Medium | Create `lib/errors.ts` with typed `BookfolioError` class instead of raw `console.error` calls |
| Type safety improvements | Medium | Create `lib/types/supabase.ts` with proper database response types |
| Remove duplicate social links transform | Low | Deduplicate social links transformation in `lib/database.ts` (lines 26-41 and 80-96) |

### Component Refactoring

| Issue | Priority | Complexity |
|-------|----------|------------|
| Split `add-book-modal.tsx` (540 lines) | Medium | Medium - Split into `AddBookSearch`, `AddBookForm`, `BookCoverUpload` |
| Split `books-grid.tsx` (489 lines) | Medium | Medium - Extract `BooksPagination`, `DragDropHandler` hook, `MoveMode` component |

### Database & Scalability

| Issue | Priority | Description |
|-------|----------|-------------|
| Add database indexes | High | Add indexes on `books(user_id)`, `books(status)`, `profiles(username)` for query performance |
| Implement `updateBooksOrder()` | Medium | Function in `lib/database.ts:286-289` is stubbed - implement proper book reordering persistence |

### Testing

| Issue | Priority | Description |
|-------|----------|-------------|
| Add Playwright E2E tests | High | Set up Playwright for login flow, book CRUD, drag-drop, public profile tests |
| Add Vitest unit tests | Medium | Unit tests for `lib/store.ts`, `lib/database.ts`, utility functions |

### New Features

| Feature | Complexity | Description |
|---------|------------|-------------|
| Reading statistics | Medium | Track pages read, reading pace, completion rates |
| Book recommendations | High | Suggest books based on genres and ratings |
| Export data | Low | Export book list to CSV/JSON |
| Reading goals | Medium | Set and track annual reading goals |

## Code Style

- TypeScript strict mode
- ESLint with React Hooks rules
- Tailwind CSS for styling
- Zustand for state management

## Questions?

Open an issue or reach out on [Twitter/X @nikhilbhima](https://x.com/nikhilbhima).
