# Bookfolio Testing Skill

Skill for adding comprehensive tests to the Bookfolio app using Playwright and Vitest.

## Setup Required

```bash
npm install -D @playwright/test vitest @testing-library/react @testing-library/jest-dom
npx playwright install
```

## Test Structure

```
__tests__/
├── e2e/                    # Playwright E2E tests
│   ├── auth.spec.ts        # Login, signup, logout flows
│   ├── books.spec.ts       # Book CRUD operations
│   ├── profile.spec.ts     # Profile editing
│   └── public-profile.spec.ts  # Public profile viewing
├── unit/                   # Vitest unit tests
│   ├── store.test.ts       # Zustand store tests
│   ├── database.test.ts    # Database function tests
│   └── utils.test.ts       # Utility function tests
└── components/             # Component tests
    ├── BookCard.test.tsx
    ├── AddBookModal.test.tsx
    └── FiltersBar.test.tsx
```

## Critical Test Scenarios

### Authentication (Priority: High)
1. User can sign up with valid credentials
2. User cannot sign up with existing username
3. User can login with email or username
4. User is redirected after login
5. User can logout
6. Password reset flow works

### Book Management (Priority: High)
1. User can search for books via API
2. User can add a book from search results
3. User can add a book manually
4. User can edit book details
5. User can delete a book
6. Book filters work correctly
7. Book sorting works correctly
8. Pagination works correctly

### Profile (Priority: Medium)
1. User can edit profile info
2. User can upload profile photo
3. User can add/remove social links
4. Public profile displays correctly
5. Share URL works

### Drag and Drop (Priority: Medium)
1. Books can be reordered via drag
2. Reorder persists after refresh
3. Drag is disabled when filters active

## Playwright Config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  baseURL: 'http://localhost:3005',
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: 3005,
    reuseExistingServer: true,
  },
});
```

## Test Data

Use test accounts:
- Email: `test@bookfolio.me`
- Username: `testuser`
- Password: Use environment variable `TEST_PASSWORD`

## Running Tests

```bash
# E2E tests
npx playwright test

# Unit tests
npm run test

# Watch mode
npm run test:watch
```
