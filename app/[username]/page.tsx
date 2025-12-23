import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { PublicProfileView } from "@/components/public-profile-view";
import { PublicNav } from "@/components/public-nav";
import { Book, UserProfile, SocialLink } from "@/lib/mock-data";

// Username validation regex
const usernameRegex = /^[a-z0-9_-]{3,20}$/;

interface SupabaseBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating?: number;
  status: string;
  notes?: string;
  genre?: string;
}

async function fetchPublicProfile(username: string): Promise<{ profile: UserProfile; books: Book[] } | null> {
  const lowerUsername = username.toLowerCase();

  if (!usernameRegex.test(lowerUsername)) {
    return null;
  }

  try {
    // Fetch profile by username (use eq for indexed lookup, store lowercase)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, username, name, bio, favorite_genres, profile_photo, social_links")
      .eq("username", lowerUsername)
      .single();

    if (profileError || !profileData) {
      return null;
    }

    // Fetch books (uses user_id index)
    const { data: booksData } = await supabase
      .from("books")
      .select("id, title, author, cover, rating, status, notes, genre")
      .eq("user_id", profileData.user_id)
      .order("created_at", { ascending: false })
      .limit(100);

    // Transform social links
    let socialLinks: SocialLink[] = [];
    if (profileData.social_links) {
      if (!Array.isArray(profileData.social_links) && typeof profileData.social_links === "object") {
        socialLinks = Object.entries(profileData.social_links)
          .filter(([, value]) => value)
          .map(([platform, value], index) => ({
            id: `${Date.now()}-${index}`,
            platform,
            value: value as string,
          }));
      } else if (Array.isArray(profileData.social_links)) {
        socialLinks = profileData.social_links;
      }
    }

    const profile: UserProfile = {
      username: profileData.username,
      name: profileData.name || "",
      bio: profileData.bio || "",
      favoriteGenres: profileData.favorite_genres || [],
      profilePhoto: profileData.profile_photo || "",
      socialLinks: socialLinks,
    };

    const books: Book[] = booksData?.map((book: SupabaseBook) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      rating: book.rating || 0,
      status: book.status as "reading" | "completed" | "to-read",
      notes: book.notes || "",
      genre: book.genre || "",
      customOrder: 0,
    })) || [];

    return { profile, books };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}

// Cache the profile data for 60 seconds
const getPublicProfile = unstable_cache(
  fetchPublicProfile,
  ["public-profile"],
  { revalidate: 60 }
);

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPublicProfile(username);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PublicNav />
      <PublicProfileView profile={data.profile} books={data.books} />
    </div>
  );
}
