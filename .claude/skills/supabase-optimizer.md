# Supabase Optimizer Skill

Skill for optimizing Supabase database queries and schema for Bookfolio.

## Current Schema Issues

### Missing Indexes
Add indexes for frequently queried columns:

```sql
-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(user_id, status);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
```

### Missing custom_order Column
The drag-and-drop reordering needs a `custom_order` column:

```sql
-- Add custom_order column for book ordering
ALTER TABLE books ADD COLUMN IF NOT EXISTS custom_order INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_books_custom_order ON books(user_id, custom_order);
```

### Missing Constraints
Add constraints to prevent data issues:

```sql
-- Prevent duplicate books for same user
ALTER TABLE books ADD CONSTRAINT unique_user_book
  UNIQUE (user_id, title, author);

-- Ensure status values are valid
ALTER TABLE books ADD CONSTRAINT valid_status
  CHECK (status IN ('reading', 'completed', 'to-read'));
```

## Query Optimizations

### Current Issues in database.ts

1. **Line 14-18**: Profile query lacks caching
2. **Line 154-158**: Books query could use cursor pagination for large collections
3. **Line 240-245**: Update query fetches all columns, should only fetch needed

### Recommended Changes

```typescript
// Use .select() with specific columns instead of '*'
const { data } = await supabase
  .from('books')
  .select('id, title, author, cover, rating, status, notes, genre, custom_order')
  .eq('user_id', userId)
  .order('custom_order', { ascending: true })
  .order('created_at', { ascending: false });

// Add cursor-based pagination for large collections
const { data } = await supabase
  .from('books')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1);
```

## RLS Policies

Verify these RLS policies exist:

```sql
-- Users can only see their own books
CREATE POLICY "Users can view own books" ON books
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own books
CREATE POLICY "Users can insert own books" ON books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own books
CREATE POLICY "Users can update own books" ON books
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own books
CREATE POLICY "Users can delete own books" ON books
  FOR DELETE USING (auth.uid() = user_id);

-- Public profiles are viewable by anyone
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (true);
```

## Implementation Priority

1. Add `custom_order` column (unblocks drag-and-drop)
2. Add database indexes (performance)
3. Implement `updateBooksOrder()` function
4. Add cursor pagination for books
5. Add unique constraints
