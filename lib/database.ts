import { supabase } from './supabase';
import { Book, UserProfile, SocialLink } from './mock-data';
import { getCurrentUserId } from './auth';

// Profile operations
export async function getProfile(userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  // Handle both old object format and new array format for socialLinks
  let socialLinks: SocialLink[] = [];

  if (data.social_links) {
    // If it's an old object format, convert to array
    if (!Array.isArray(data.social_links) && typeof data.social_links === 'object') {
      socialLinks = Object.entries(data.social_links)
        .filter(([, value]) => value)
        .map(([platform, value], index) => ({
          id: `${Date.now()}-${index}`,
          platform,
          value: value as string,
        }));
    } else if (Array.isArray(data.social_links)) {
      socialLinks = data.social_links;
    }
  }

  return {
    username: data.username,
    name: data.name || '',
    bio: data.bio || '',
    favoriteGenres: data.favorite_genres || [],
    profilePhoto: data.profile_photo || '',
    socialLinks: socialLinks,
  } as UserProfile;
}

export async function updateProfile(updates: Partial<UserProfile>, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: updates.username,
      name: updates.name,
      bio: updates.bio,
      profile_photo: updates.profilePhoto,
      favorite_genres: updates.favoriteGenres,
      social_links: updates.socialLinks,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  // Handle both old object format and new array format for socialLinks
  let socialLinks: SocialLink[] = [];

  if (data.social_links) {
    // If it's an old object format, convert to array
    if (!Array.isArray(data.social_links) && typeof data.social_links === 'object') {
      socialLinks = Object.entries(data.social_links)
        .filter(([, value]) => value)
        .map(([platform, value], index) => ({
          id: `${Date.now()}-${index}`,
          platform,
          value: value as string,
        }));
    } else if (Array.isArray(data.social_links)) {
      socialLinks = data.social_links;
    }
  }

  return {
    username: data.username,
    name: data.name || '',
    bio: data.bio || '',
    favoriteGenres: data.favorite_genres || [],
    profilePhoto: data.profile_photo || '',
    socialLinks: socialLinks,
  } as UserProfile;
}

export async function createProfile(profile: UserProfile, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      profile_photo: profile.profilePhoto,
      favorite_genres: profile.favoriteGenres,
      social_links: profile.socialLinks,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

// ==============================================
// BOOK OPERATIONS - REBUILT FROM SCRATCH
// ==============================================

/**
 * Get all books for a user
 */
export async function getBooks(userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('[GET BOOKS] No authenticated user');
      return [];
    }
  }

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[GET BOOKS] Error:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover || '',
    rating: book.rating || 0,
    status: book.status as 'reading' | 'completed' | 'to-read',
    notes: book.notes || '',
    genre: book.genre || '',
    customOrder: 0,
  })) as Book[];
}

/**
 * Create a new book
 */
export async function createBook(book: Omit<Book, 'id'>, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('[CREATE BOOK] No authenticated user');
      throw new Error('You must be logged in to add books');
    }
  }

  const { data, error } = await supabase
    .from('books')
    .insert({
      user_id: userId,
      title: book.title,
      author: book.author,
      cover: book.cover || '',
      genre: book.genre || '',
      rating: book.rating || 0,
      status: book.status || 'to-read',
      notes: book.notes || '',
    })
    .select()
    .single();

  if (error) {
    console.error('[CREATE BOOK] Error:', error);
    throw new Error(error.message || 'Failed to create book');
  }

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    cover: data.cover || '',
    rating: data.rating || 0,
    status: data.status as 'reading' | 'completed' | 'to-read',
    notes: data.notes || '',
    genre: data.genre || '',
    customOrder: 0,
  } as Book;
}

/**
 * Update an existing book
 */
export async function updateBook(id: string, updates: Partial<Book>) {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('[UPDATE BOOK] No authenticated user');
    return null;
  }

  const updateData: Record<string, string | number | undefined> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.author !== undefined) updateData.author = updates.author;
  if (updates.cover !== undefined) updateData.cover = updates.cover;
  if (updates.genre !== undefined) updateData.genre = updates.genre;
  if (updates.rating !== undefined) updateData.rating = updates.rating;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('[UPDATE BOOK] Error:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    cover: data.cover || '',
    rating: data.rating || 0,
    status: data.status as 'reading' | 'completed' | 'to-read',
    notes: data.notes || '',
    genre: data.genre || '',
    customOrder: 0,
  } as Book;
}

/**
 * Delete a book
 */
export async function deleteBook(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('[DELETE BOOK] No authenticated user');
    return false;
  }

  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('[DELETE BOOK] Error:', error);
    return false;
  }

  return true;
}

/**
 * Update book order (placeholder for future drag-and-drop)
 */
export async function updateBooksOrder(_books: Array<{ id: string; customOrder: number }>) {
  // Not implemented yet - would need custom_order column in DB
  return true;
}
