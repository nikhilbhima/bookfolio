import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "Bookfolio Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
  const { username } = params;

  // Fetch profile and books
  const { data: profileData } = await supabase
    .from("profiles")
    .select("username, name, bio, profile_photo")
    .eq("username", username.toLowerCase())
    .single();

  if (!profileData) {
    // Fallback for non-existent profiles
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            fontFamily: "system-ui",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: "bold", color: "#fff" }}>
            Profile Not Found
          </div>
          <div style={{ fontSize: 24, color: "#888", marginTop: 16 }}>
            bookfolio.me
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Fetch user's books for cover display
  const { data: booksData } = await supabase
    .from("books")
    .select("cover, title")
    .eq("user_id", (await supabase.from("profiles").select("user_id").eq("username", username.toLowerCase()).single()).data?.user_id)
    .limit(5);

  const displayName = profileData.name || profileData.username;
  const books = booksData || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui",
          padding: 60,
        }}
      >
        {/* Top section with profile info */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          {/* Profile photo */}
          {profileData.profile_photo && (
            <img
              src={profileData.profile_photo}
              alt=""
              width={100}
              height={100}
              style={{
                borderRadius: "50%",
                marginRight: 24,
                border: "3px solid #3b82f6",
              }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 48, fontWeight: "bold", color: "#fff" }}>
              {displayName}&apos;s Bookshelf
            </div>
            <div style={{ fontSize: 24, color: "#3b82f6", marginTop: 8 }}>
              bookfolio.me/{profileData.username}
            </div>
          </div>
        </div>

        {/* Book covers */}
        {books.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
            {books.slice(0, 5).map((book, i) => (
              <div
                key={i}
                style={{
                  width: 120,
                  height: 180,
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt=""
                    width={120}
                    height={180}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ color: "#666", fontSize: 12, textAlign: "center", padding: 8 }}>
                    {book.title?.slice(0, 30)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>
            📚 Bookfolio
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
