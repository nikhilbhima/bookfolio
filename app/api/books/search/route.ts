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

// Helper to get OpenLibrary cover by ISBN
async function getOpenLibraryCoverByISBN(isbn: string): Promise<string> {
  if (!isbn) return "";
  // OpenLibrary covers API - returns image directly, no API call needed
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

// Helper to check if a cover URL is likely valid (not a placeholder)
function isValidCoverUrl(url: string): boolean {
  if (!url) return false;
  // Filter out known placeholder patterns
  if (url.includes("no-cover") || url.includes("placeholder")) return false;
  return true;
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
    // Build optimized search query
    // If query contains common patterns like "author name - book" or "book by author", parse them
    let searchQuery = validatedQuery;

    // Check if query might contain author info (common patterns)
    const byPattern = /(.+?)\s+by\s+(.+)/i;
    const dashPattern = /(.+?)\s*-\s*(.+)/;

    const byMatch = validatedQuery.match(byPattern);
    const dashMatch = validatedQuery.match(dashPattern);

    if (byMatch) {
      // "book title by author name" format
      searchQuery = `intitle:${byMatch[1].trim()}+inauthor:${byMatch[2].trim()}`;
    } else if (dashMatch && dashMatch[2].split(' ').length <= 3) {
      // "author - book" or "book - author" format (author usually has fewer words)
      const part1 = dashMatch[1].trim();
      const part2 = dashMatch[2].trim();
      // Assume shorter part is author
      if (part1.split(' ').length <= part2.split(' ').length) {
        searchQuery = `inauthor:${part1}+intitle:${part2}`;
      } else {
        searchQuery = `intitle:${part1}+inauthor:${part2}`;
      }
    }

    // Search Google Books API with higher limit to filter later
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      searchQuery
    )}&maxResults=40&printType=books&orderBy=relevance&langRestrict=en${apiKey ? `&key=${apiKey}` : ""}`;

    const googleResponse = await fetch(googleBooksUrl);

    if (!googleResponse.ok) {
      throw new Error("Google Books API request failed");
    }

    const googleData = await googleResponse.json();
    const googleResults = googleData.items || [];

    // Transform Google Books results
    const transformedGoogleResults: TransformedBook[] = await Promise.all(
      googleResults.map(async (item: GoogleBooksItem) => {
        const volumeInfo = item.volumeInfo;
        const imageLinks = volumeInfo.imageLinks || {};

        // Get best available cover from Google
        let cover =
          imageLinks.extraLarge ||
          imageLinks.large ||
          imageLinks.medium ||
          imageLinks.thumbnail ||
          imageLinks.smallThumbnail ||
          "";

        // Get ISBN for fallback
        const isbn13 = volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier;
        const isbn10 = volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier;
        const isbn = isbn13 || isbn10 || "";

        // If no Google cover, try OpenLibrary by ISBN
        if (!cover && isbn) {
          cover = await getOpenLibraryCoverByISBN(isbn);
        }

        const secureCover = cover.replace("http://", "https://");
        const largeCover = secureCover
          .replace("&zoom=1", "&zoom=3") // Request larger zoom
          .replace("&edge=curl", ""); // Remove page fold

        return {
          id: item.id,
          title: volumeInfo.title || "Unknown Title",
          author: volumeInfo.authors?.join(", ") || "Unknown Author",
          cover: largeCover,
          coverLarge: largeCover,
          genre: volumeInfo.categories?.[0] || "",
          description: volumeInfo.description || "",
          isbn,
          publishedDate: volumeInfo.publishedDate || "",
          pageCount: volumeInfo.pageCount || 0,
          source: "google",
          ratingsCount: volumeInfo.ratingsCount || 0,
          averageRating: volumeInfo.averageRating || 0,
        };
      })
    );

    // Filter: prefer books WITH covers, but keep some without if needed
    const booksWithCovers = transformedGoogleResults.filter((book) => isValidCoverUrl(book.cover));
    const booksWithoutCovers = transformedGoogleResults.filter((book) => !isValidCoverUrl(book.cover));

    // Sort by relevance: exact matches first, then by popularity
    const queryLower = validatedQuery.toLowerCase();
    const sortResults = (results: TransformedBook[]) => {
      return results.sort((a, b) => {
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

        // Check if title contains query words
        const queryWords = queryLower.split(' ').filter(w => w.length > 2);
        const containsAllA = queryWords.every(w => titleA.includes(w));
        const containsAllB = queryWords.every(w => titleB.includes(w));

        if (containsAllA && !containsAllB) return -1;
        if (!containsAllA && containsAllB) return 1;

        // Sort by popularity (ratings × average rating)
        const popularityA = (a.ratingsCount || 0) * (a.averageRating || 0);
        const popularityB = (b.ratingsCount || 0) * (b.averageRating || 0);
        return popularityB - popularityA;
      });
    };

    const sortedWithCovers = sortResults(booksWithCovers);
    const sortedWithoutCovers = sortResults(booksWithoutCovers);

    // Combine: books with covers first, then without (up to limit)
    let combinedGoogle = [...sortedWithCovers];
    if (combinedGoogle.length < 30) {
      combinedGoogle = [...combinedGoogle, ...sortedWithoutCovers.slice(0, 30 - combinedGoogle.length)];
    }

    // If we have enough results with covers, return them
    if (sortedWithCovers.length >= 12) {
      return NextResponse.json(combinedGoogle.slice(0, 40));
    }

    // Otherwise, fetch OpenLibrary results to supplement
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      validatedQuery
    )}&limit=40&sort=editions&language=eng`;

    const openLibraryResponse = await fetch(openLibraryUrl);

    if (!openLibraryResponse.ok) {
      // If OpenLibrary fails, just return Google results
      return NextResponse.json(combinedGoogle.slice(0, 40));
    }

    const openLibraryData = await openLibraryResponse.json();
    const openLibraryDocs = openLibraryData.docs || [];

    // Transform OpenLibrary results - only those with covers
    const transformedOpenLibraryResults: TransformedBook[] = openLibraryDocs
      .filter((doc: OpenLibraryDoc) => doc.cover_i) // Only books with covers
      .map((doc: OpenLibraryDoc) => {
        const coverId = doc.cover_i;
        const cover = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

        return {
          id: doc.key || `ol-${coverId}`,
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
          ratingsCount: 0,
          averageRating: 0,
        };
      });

    // Combine results, avoiding duplicates
    const combined = [...combinedGoogle];
    const seenTitles = new Set(combined.map(b => `${b.title.toLowerCase()}|${b.author.toLowerCase()}`));

    for (const olBook of transformedOpenLibraryResults) {
      const key = `${olBook.title.toLowerCase()}|${olBook.author.toLowerCase()}`;
      if (!seenTitles.has(key)) {
        combined.push(olBook);
        seenTitles.add(key);
      }
      if (combined.length >= 40) break;
    }

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
