import { NextRequest, NextResponse } from "next/server";
import { searchQuerySchema } from "@/lib/validations";

interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  categories?: string[];
  description?: string;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
  publishedDate?: string;
  pageCount?: number;
  ratingsCount?: number;
  averageRating?: number;
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

interface TransformedBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  coverLarge: string;
  genre: string;
  description: string;
  isbn: string;
  publishedDate: string;
  pageCount: number;
  source: string;
  ratingsCount?: number;
  averageRating?: number;
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  // Validate query with Zod
  const validation = searchQuerySchema.safeParse({ q: query });
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const validatedQuery = validation.data.q;

  try {
    // Search Google Books API
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      validatedQuery
    )}&maxResults=40&printType=books&orderBy=relevance${apiKey ? `&key=${apiKey}` : ""}`;

    const googleResponse = await fetch(googleBooksUrl);

    if (!googleResponse.ok) {
      throw new Error("Google Books API request failed");
    }

    const googleData = await googleResponse.json();
    const googleResults = googleData.items || [];

    // Transform Google Books results
    const transformedGoogleResults: TransformedBook[] = googleResults.map((item: GoogleBooksItem) => {
      const volumeInfo = item.volumeInfo;
      const imageLinks = volumeInfo.imageLinks || {};

      const cover =
        imageLinks.extraLarge ||
        imageLinks.large ||
        imageLinks.medium ||
        imageLinks.thumbnail ||
        imageLinks.smallThumbnail ||
        "";

      const secureCover = cover.replace("http://", "https://");
      const largeCover = secureCover
        .replace("&zoom=1", "&zoom=2")
        .replace("&edge=curl", ""); // Remove page fold

      return {
        id: item.id,
        title: volumeInfo.title || "Unknown Title",
        author: volumeInfo.authors?.join(", ") || "Unknown Author",
        cover: largeCover,
        coverLarge: largeCover,
        genre: volumeInfo.categories?.[0] || "",
        description: volumeInfo.description || "",
        isbn:
          volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")
            ?.identifier ||
          volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")
            ?.identifier ||
          "",
        publishedDate: volumeInfo.publishedDate || "",
        pageCount: volumeInfo.pageCount || 0,
        source: "google",
        ratingsCount: volumeInfo.ratingsCount || 0,
        averageRating: volumeInfo.averageRating || 0,
      };
    });

    // Sort by relevance: exact matches first, then by popularity
    const queryLower = validatedQuery.toLowerCase();
    const sortedGoogleResults = transformedGoogleResults.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      // Check for exact matches
      const exactMatchA = titleA === queryLower;
      const exactMatchB = titleB === queryLower;

      if (exactMatchA && !exactMatchB) return -1;
      if (!exactMatchA && exactMatchB) return 1;

      // Check if title starts with query
      const startsWithA = titleA.startsWith(queryLower);
      const startsWithB = titleB.startsWith(queryLower);

      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;

      // Otherwise sort by popularity (ratings × average rating)
      const popularityA = (a.ratingsCount || 0) * (a.averageRating || 0);
      const popularityB = (b.ratingsCount || 0) * (b.averageRating || 0);
      return popularityB - popularityA;
    });

    // If we have enough results, return them
    if (sortedGoogleResults.length >= 10) {
      return NextResponse.json(sortedGoogleResults);
    }

    // Otherwise, fetch OpenLibrary results
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      validatedQuery
    )}&limit=40&sort=editions`;

    const openLibraryResponse = await fetch(openLibraryUrl);

    if (!openLibraryResponse.ok) {
      // If OpenLibrary fails, just return Google results
      return NextResponse.json(sortedGoogleResults);
    }

    const openLibraryData = await openLibraryResponse.json();
    const openLibraryDocs = openLibraryData.docs || [];

    // Transform OpenLibrary results
    const transformedOpenLibraryResults: TransformedBook[] = openLibraryDocs.map((doc: OpenLibraryDoc) => {
      const coverId = doc.cover_i;
      const cover = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : "";

      return {
        id: doc.key || "",
        title: doc.title || "Unknown Title",
        author: doc.author_name?.join(", ") || "Unknown Author",
        cover,
        coverLarge: cover,
        genre: doc.subject?.[0] || "",
        description: "",
        isbn: doc.isbn?.[0] || "",
        publishedDate: doc.first_publish_year?.toString() || "",
        pageCount: doc.number_of_pages_median || 0,
        source: "openlibrary",
      };
    });

    // Combine results
    const combined = [...sortedGoogleResults];

    transformedOpenLibraryResults.forEach((olBook) => {
      const isDuplicate = combined.some(
        (gBook) =>
          gBook.title.toLowerCase() === olBook.title.toLowerCase() &&
          gBook.author.toLowerCase() === olBook.author.toLowerCase()
      );

      if (!isDuplicate) {
        combined.push(olBook);
      }
    });

    return NextResponse.json(combined.slice(0, 40));
  } catch (error) {
    console.error("Book search error:", error);
    // Don't expose internal error details to clients
    return NextResponse.json(
      { error: "Failed to search books. Please try again." },
      { status: 500 }
    );
  }
}
