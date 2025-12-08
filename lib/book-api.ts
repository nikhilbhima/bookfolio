// Book search API utilities for Google Books and OpenLibrary

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  cover: string;
  coverLarge?: string;
  genre?: string;
  description?: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  source: "google" | "openlibrary";
  ratingsCount?: number;
  averageRating?: number;
}

/**
 * Get a fallback cover URL from OpenLibrary by ISBN
 */
export function getOpenLibraryCoverByISBN(isbn: string, size: "S" | "M" | "L" = "L"): string {
  if (!isbn) return "";
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

/**
 * Check if a cover URL is likely valid (not empty or placeholder)
 */
export function isValidCover(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes("placeholder") || url.includes("no-cover")) return false;
  return url.length > 0;
}

/**
 * Get the best available cover with fallbacks
 * Priority: provided cover -> OpenLibrary by ISBN -> placeholder
 */
export function getCoverWithFallback(cover: string | undefined, isbn?: string): string {
  if (isValidCover(cover)) {
    return cover!;
  }
  if (isbn) {
    return getOpenLibraryCoverByISBN(isbn);
  }
  return ""; // Will show "No Cover" placeholder in UI
}

/**
 * Search books using secure server-side API route
 * This protects the API key from client-side exposure
 */
export async function searchBooks(
  query: string
): Promise<BookSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/books/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Book search API request failed");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Book search error:", error);
    return [];
  }
}

/**
 * Debounce utility for search input
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
