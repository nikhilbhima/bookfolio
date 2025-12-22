# Bookfolio Refactor Skill

Skill for refactoring and optimizing Bookfolio React components.

## Known Issues to Fix

### 1. Duplicate Filtering Logic
The book filtering/sorting logic is duplicated in two places:
- `lib/store.ts` lines 189-227 (`getFilteredBooks`)
- `components/books-grid.tsx` lines 29-66 (`filteredBooks` useMemo)

**Fix**: Remove the duplicate in `books-grid.tsx` and use `getFilteredBooks()` from the store.

### 2. Large Components to Split
Components exceeding 400 lines that need splitting:
- `components/add-book-modal.tsx` (540 lines) - Split into:
  - `AddBookSearch` - Search functionality
  - `AddBookForm` - Manual entry form
  - `BookCoverUpload` - Cover upload section
- `components/books-grid.tsx` (489 lines) - Split into:
  - `BooksGrid` - Main grid container
  - `BooksPagination` - Pagination controls
  - `DragDropHandler` - Drag and drop logic (custom hook)
  - `MoveMode` - Mobile move mode UI

### 3. Missing useCallback Optimizations
Add `useCallback` for event handlers in:
- `books-grid.tsx`: `handleMouseDown`, `handleMouseMove`, `handleMouseUp`
- `add-book-modal.tsx`: `handleSelectBook`, `handleCoverUpload`, `handleSubmit`

### 4. Stubbed Feature
`lib/database.ts` line 286-289: `updateBooksOrder()` is not implemented.
Needs: Add `custom_order` column to books table and implement the function.

## Refactoring Commands

When asked to refactor, follow this order:
1. Remove duplicate code first
2. Extract reusable hooks
3. Split large components
4. Add memoization (useCallback, useMemo)
5. Verify no breaking changes

## File Locations

- Store: `lib/store.ts`
- Database: `lib/database.ts`
- Components: `components/`
- API Routes: `app/api/`
