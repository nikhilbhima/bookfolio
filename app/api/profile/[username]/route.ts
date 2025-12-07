import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface SocialLink {
  id: string;
  platform: string;
  value: string;
}

interface SupabaseBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating?: number;
  status: string;
  notes?: string;
  genre?: string;
  date_started?: string;
  date_finished?: string;
  pages?: number;
}

// Username validation regex - must match validations.ts
const usernameRegex = /^[a-z0-9_-]{3,20}$/;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  // Validate username format
  const lowerUsername = username.toLowerCase();
  if (!usernameRegex.test(lowerUsername)) {
    return NextResponse.json(
      { error: "Invalid username format" },
      { status: 400 }
    );
  }

  try {
    // Fetch profile by username (case-insensitive)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", lowerUsername)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Fetch books for this user
    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", profileData.user_id)
      .order("created_at", { ascending: false });

    if (booksError) {
      console.error("Error fetching books:", booksError);
    }

    // Transform profile data
    let socialLinks: SocialLink[] = [];
    if (profileData.social_links) {
      if (
        !Array.isArray(profileData.social_links) &&
        typeof profileData.social_links === "object"
      ) {
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

    const profile = {
      username: profileData.username,
      name: profileData.name || "",
      bio: profileData.bio || "",
      favoriteGenres: profileData.favorite_genres || [],
      profilePhoto: profileData.profile_photo || "",
      socialLinks: socialLinks,
    };

    // Transform books data
    const books =
      booksData?.map((book: SupabaseBook) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        rating: book.rating || 0,
        status: book.status,
        notes: book.notes || "",
        genre: book.genre || "",
        dateStarted: book.date_started,
        dateFinished: book.date_finished,
        pages: book.pages,
      })) || [];

    return NextResponse.json({
      profile,
      books,
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
