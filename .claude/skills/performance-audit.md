# Performance Audit Skill

Skill for auditing and optimizing React performance in Bookfolio.

## Quick Wins

### 1. Memoization Opportunities

**books-grid.tsx**
```typescript
// Add useCallback for drag handlers
const handleMouseDown = useCallback((e: MouseEvent) => {
  // ... existing code
}, [isDragEnabled]);

const handleMouseMove = useCallback((e: MouseEvent) => {
  // ... existing code
}, []);

const handleMouseUp = useCallback((e: MouseEvent) => {
  // ... existing code
}, [books, currentBooks, reorderBooks]);
```

**add-book-modal.tsx**
```typescript
// Memoize search results processing
const paginatedResults = useMemo(() => {
  const startIndex = (currentPage - 1) * resultsPerPage;
  return searchResults.slice(startIndex, startIndex + resultsPerPage);
}, [searchResults, currentPage, resultsPerPage]);

// Add useCallback for handlers
const handleSelectBook = useCallback((book: SearchResult) => {
  // ... existing code
}, []);
```

### 2. Component Lazy Loading

```typescript
// In dashboard/page.tsx - lazy load heavy modals
const AddBookModal = dynamic(() => import('@/components/add-book-modal'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});

const EditProfileModal = dynamic(() => import('@/components/edit-profile-modal'), {
  loading: () => <Skeleton className="h-96 w-full" />,
});

const ImageCropModal = dynamic(() => import('@/components/image-crop-modal'), {
  loading: () => <Skeleton className="h-64 w-64" />,
});
```

### 3. Image Optimization

```typescript
// Use Next.js Image with proper sizing
<Image
  src={book.cover}
  alt={book.title}
  width={150}
  height={225}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 150px"
/>
```

### 4. Zustand Store Selectors

```typescript
// Current: Causes re-render on any state change
const books = useBookStore((state) => state.books);
const filter = useBookStore((state) => state.filter);

// Better: Use shallow comparison for multiple values
import { shallow } from 'zustand/shallow';

const { books, filter, sortBy } = useBookStore(
  (state) => ({
    books: state.books,
    filter: state.filter,
    sortBy: state.sortBy,
  }),
  shallow
);
```

## Bundle Size Optimizations

### 1. Lucide Icons
```typescript
// Instead of importing all icons
import { Grid3x3, List, ChevronLeft } from "lucide-react";

// Verify only used icons are imported (tree-shaking)
// Check bundle with: npx @next/bundle-analyzer
```

### 2. Add Bundle Analyzer
```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

## Metrics to Track

1. **First Contentful Paint (FCP)**: Target < 1.8s
2. **Largest Contentful Paint (LCP)**: Target < 2.5s
3. **Time to Interactive (TTI)**: Target < 3.8s
4. **Cumulative Layout Shift (CLS)**: Target < 0.1

### Add Web Vitals Tracking

```typescript
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}
```

## Error Boundaries

Add error boundaries for crash protection:

```typescript
// components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

## Audit Checklist

- [ ] Remove duplicate filtering logic
- [ ] Add useCallback to event handlers
- [ ] Lazy load modals
- [ ] Add error boundaries
- [ ] Optimize image loading
- [ ] Use shallow Zustand selectors
- [ ] Analyze bundle size
- [ ] Add Web Vitals tracking
