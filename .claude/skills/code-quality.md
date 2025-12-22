# Code Quality Skill

Skill for improving code quality, error handling, and consistency in Bookfolio.

## Error Handling Issues

### Current Problems
Found 16+ `console.error` calls that should use structured error handling.

### Locations to Fix

| File | Line | Issue |
|------|------|-------|
| `lib/store.ts` | 78 | Generic error log, no user feedback |
| `lib/store.ts` | 144 | Error thrown but not typed |
| `lib/database.ts` | 10, 21, 57, 75, 113, 130, 149, 160, 189, 209, 248, 274 | console.error without error codes |
| `components/add-book-modal.tsx` | 101, 190 | catch block logs, should show toast |

### Recommended Error Structure

```typescript
// lib/errors.ts
export class BookfolioError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'BookfolioError';
  }
}

export const ErrorCodes = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  BOOK_NOT_FOUND: 'BOOK_NOT_FOUND',
  BOOK_CREATE_FAILED: 'BOOK_CREATE_FAILED',
  PROFILE_UPDATE_FAILED: 'PROFILE_UPDATE_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// Usage
throw new BookfolioError(
  'Failed to create book',
  ErrorCodes.BOOK_CREATE_FAILED,
  'Unable to add this book. Please try again.'
);
```

### Error Handling Pattern

```typescript
// In database.ts
export async function createBook(book: Omit<Book, 'id'>) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new BookfolioError(
        'No authenticated user',
        ErrorCodes.AUTH_REQUIRED,
        'Please log in to add books'
      );
    }

    const { data, error } = await supabase
      .from('books')
      .insert({ /* ... */ })
      .select()
      .single();

    if (error) {
      throw new BookfolioError(
        error.message,
        ErrorCodes.BOOK_CREATE_FAILED,
        'Failed to add book. Please try again.'
      );
    }

    return transformBook(data);
  } catch (error) {
    if (error instanceof BookfolioError) throw error;
    throw new BookfolioError(
      error.message,
      ErrorCodes.NETWORK_ERROR,
      'A network error occurred. Please check your connection.'
    );
  }
}
```

## Type Safety Improvements

### 1. Centralize Book Type
Currently defined in multiple places. Create single source of truth:

```typescript
// lib/types.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  rating: number;
  status: BookStatus;
  notes: string;
  customOrder: number;
}

export type BookStatus = 'reading' | 'completed' | 'to-read';

export interface UserProfile {
  username: string;
  name: string;
  bio: string;
  profilePhoto: string;
  favoriteGenres: string[];
  socialLinks: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  value: string;
}
```

### 2. Database Response Types

```typescript
// lib/types/supabase.ts
export interface SupabaseBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover: string | null;
  genre: string | null;
  rating: number | null;
  status: string;
  notes: string | null;
  custom_order: number | null;
  created_at: string;
}

// Transform function
export function toBook(data: SupabaseBook): Book {
  return {
    id: data.id,
    title: data.title,
    author: data.author,
    cover: data.cover || '',
    genre: data.genre || '',
    rating: data.rating || 0,
    status: data.status as BookStatus,
    notes: data.notes || '',
    customOrder: data.custom_order || 0,
  };
}
```

## ESLint Configuration

Add stricter rules:

```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
```

## Code Duplication to Remove

### 1. Social Links Transformation
Duplicated in `lib/database.ts` at lines 26-41 and 80-96.

```typescript
// Create helper function
function transformSocialLinks(data: unknown): SocialLink[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data as SocialLink[];
  }

  if (typeof data === 'object') {
    return Object.entries(data)
      .filter(([, value]) => value)
      .map(([platform, value], index) => ({
        id: `${Date.now()}-${index}`,
        platform,
        value: value as string,
      }));
  }

  return [];
}
```

## Checklist

- [ ] Create centralized error types
- [ ] Replace console.error with structured errors
- [ ] Centralize type definitions
- [ ] Add transform functions for DB responses
- [ ] Remove duplicate helper code
- [ ] Add stricter ESLint rules
- [ ] Add error boundary components
