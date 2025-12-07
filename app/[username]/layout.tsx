import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  try {
    // Fetch profile data for metadata
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, name, bio")
      .ilike("username", username.toLowerCase())
      .single();

    if (!profileData) {
      return {
        title: "Profile Not Found - Bookfolio",
        description: "This profile does not exist.",
      };
    }

    const displayName = profileData.name || profileData.username;
    const bio = profileData.bio || `Check out ${displayName}'s book collection on Bookfolio`;

    return {
      title: `${displayName}'s Bookshelf - Bookfolio`,
      description: bio.slice(0, 160),
      openGraph: {
        title: `${displayName}'s Bookshelf - Bookfolio`,
        description: bio.slice(0, 160),
        url: `https://bookfolio.me/${profileData.username}`,
        siteName: "Bookfolio",
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: `${displayName}'s Bookshelf - Bookfolio`,
        description: bio.slice(0, 160),
      },
    };
  } catch {
    return {
      title: "Bookshelf - Bookfolio",
      description: "Explore book collections on Bookfolio",
    };
  }
}

export default function ProfileLayout({ children }: Props) {
  return children;
}
