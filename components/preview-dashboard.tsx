"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PREVIEW_BOOKS, PREVIEW_PROFILE } from "@/lib/preview-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Moon, Sun, BookOpen, BookMarked, CheckCircle2, Clock, Instagram } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { XIcon } from "@/components/icons/x-icon";

type BookStatus = "all" | "reading" | "completed" | "to-read";
type SortBy = "newest" | "a-z" | "z-a" | "rating-high" | "rating-low";

export function PreviewDashboard() {
  const [filter, setFilter] = useState<BookStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("dark");
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert preview books to match Book type format
  const convertedBooks = PREVIEW_BOOKS.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover_url,
    status: book.status === "currently_reading" ? "reading" as const :
            book.status === "to_read" ? "to-read" as const :
            book.status as "reading" | "completed" | "to-read",
    rating: book.rating || 0,
    notes: book.notes || "",
    genre: "",
  }));

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = convertedBooks;

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter((book) => book.status === filter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // Apply sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "a-z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-high":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "newest":
      default:
        break;
    }

    return sorted;
  }, [convertedBooks, filter, searchQuery, sortBy]);

  const stats = {
    all: PREVIEW_BOOKS.length,
    currently_reading: PREVIEW_BOOKS.filter((b) => b.status === "currently_reading").length,
    completed: PREVIEW_BOOKS.filter((b) => b.status === "completed").length,
    to_read: PREVIEW_BOOKS.filter((b) => b.status === "to_read").length,
  };

  return (
    <div className="space-y-4">
      {/* Preview Label */}
      <div className="text-center px-4">
        <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full">
          <span className="text-[10px] sm:text-xs font-medium text-blue-700 dark:text-blue-300">
            Interactive preview of a Bookfolio user
          </span>
        </div>
      </div>

      {/* Preview Dashboard Card with Animated Neon Border */}
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(37,99,235,0.5)] animate-gradient-border bg-[length:600%_600%]">
        <style jsx>{`
          @keyframes gradient-border {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-border {
            animation: gradient-border 2s ease infinite;
          }
        `}</style>
        <div
          className={`w-full rounded-2xl overflow-hidden`}
          style={{
            // Inline CSS variables for isolated theme
            ...(previewTheme === "dark" ? {
              '--background': '#0a0a0a',
              '--foreground': '#fafafa',
              '--card': '#171717',
              '--card-foreground': '#fafafa',
              '--popover': '#171717',
              '--popover-foreground': '#fafafa',
              '--primary': '#fafafa',
              '--primary-foreground': '#0a0a0a',
              '--secondary': '#262626',
              '--secondary-foreground': '#fafafa',
              '--muted': '#262626',
              '--muted-foreground': '#a3a3a3',
              '--accent': '#262626',
              '--accent-foreground': '#fafafa',
              '--destructive': '#dc2626',
              '--border': 'rgba(255, 255, 255, 0.1)',
              '--input': 'rgba(255, 255, 255, 0.15)',
              '--ring': '#737373',
            } : {
              '--background': '#fafafa',
              '--foreground': '#0a0a0a',
              '--card': '#ffffff',
              '--card-foreground': '#0a0a0a',
              '--popover': '#ffffff',
              '--popover-foreground': '#0a0a0a',
              '--primary': '#0a0a0a',
              '--primary-foreground': '#fafafa',
              '--secondary': '#f5f5f5',
              '--secondary-foreground': '#0a0a0a',
              '--muted': '#f5f5f5',
              '--muted-foreground': '#737373',
              '--accent': '#f5f5f5',
              '--accent-foreground': '#0a0a0a',
              '--destructive': '#ef4444',
              '--border': '#e5e5e5',
              '--input': '#e5e5e5',
              '--ring': '#a3a3a3',
            })
          } as React.CSSProperties}
        >
          <div className="bg-background text-foreground transition-colors duration-300">
            {/* Public Nav - matches actual user preview page */}
            <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
              <div className="px-3 sm:px-4">
                <div className="flex h-14 sm:h-16 items-center justify-between">
                  {/* Logo & Username */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-lg"
                      >
                        <rect width="32" height="32" rx="7" fill="url(#logo-gradient)" />
                        <rect x="6" y="10" width="11" height="15" rx="3.5" fill="white" opacity="0.95" />
                        <rect x="18" y="7" width="8" height="8" rx="2.5" fill="#ff8a80" opacity="0.9" />
                        <rect x="18" y="17" width="8" height="8" rx="2.5" fill="#69f0ae" opacity="0.85" />
                        <defs>
                          <linearGradient
                            id="logo-gradient"
                            x1="0"
                            y1="0"
                            x2="32"
                            y2="32"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#3b82f6" />
                            <stop offset="0.5" stopColor="#2563eb" />
                            <stop offset="1" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg font-serif font-semibold">Bookfolio</span>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewTheme(previewTheme === "light" ? "dark" : "light")}
                      className="rounded-full h-8 w-8"
                    >
                      {previewTheme === "light" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </nav>

            <main className="px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6 bg-background">
              {/* Profile Section */}
              <div className="max-w-4xl mx-auto">
                <Card className="p-5 sm:p-8 py-6 sm:py-10">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-border">
                      <AvatarImage src={PREVIEW_PROFILE.avatar_url} alt={PREVIEW_PROFILE.display_name} />
                      <AvatarFallback>{PREVIEW_PROFILE.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 w-full">
                      <h2 className="text-xl sm:text-2xl font-serif font-semibold truncate">
                        {PREVIEW_PROFILE.display_name}
                      </h2>
                      <p className="text-sm text-muted-foreground truncate mb-3">
                        @{PREVIEW_PROFILE.username}
                      </p>
                      <p className="text-sm text-foreground mb-3 leading-relaxed">{PREVIEW_PROFILE.bio}</p>

                      {/* Favorite Genres */}
                      {PREVIEW_PROFILE.favoriteGenres.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1.5">Favorite Genres</p>
                          <div className="flex flex-wrap gap-1.5">
                            {PREVIEW_PROFILE.favoriteGenres.map((genre) => (
                              <span
                                key={genre}
                                className="px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Instagram"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                        <a
                          href="https://x.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="X (Twitter)"
                        >
                          <XIcon className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Stats Section - Neon Styled */}
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="relative p-2 sm:p-5 transition-all border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm glow-blue-hover flex flex-col items-center md:items-start justify-center md:justify-start rounded-lg sm:rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-3 w-full">
                      <div className="p-1 sm:p-2.5 rounded-md sm:rounded-xl bg-blue-500/10 border border-blue-500/30 shrink-0">
                        <BookOpen className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <p className="text-base sm:text-3xl font-bold">{stats.all}</p>
                        <p className="text-[9px] sm:text-sm text-muted-foreground truncate mt-0">All Books</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-2 sm:p-5 transition-all border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm glow-amber-hover flex flex-col items-center md:items-start justify-center md:justify-start rounded-lg sm:rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-3 w-full">
                      <div className="p-1 sm:p-2.5 rounded-md sm:rounded-xl bg-amber-500/10 border border-amber-500/30 shrink-0">
                        <BookMarked className="w-3 h-3 sm:w-5 sm:h-5 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <p className="text-base sm:text-3xl font-bold">{stats.currently_reading}</p>
                        <p className="text-[9px] sm:text-sm text-muted-foreground truncate mt-0">Currently Reading</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-2 sm:p-5 transition-all border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm glow-emerald-hover flex flex-col items-center md:items-start justify-center md:justify-start rounded-lg sm:rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-3 w-full">
                      <div className="p-1 sm:p-2.5 rounded-md sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                        <CheckCircle2 className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <p className="text-base sm:text-3xl font-bold">{stats.completed}</p>
                        <p className="text-[9px] sm:text-sm text-muted-foreground truncate mt-0">Completed</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-2 sm:p-5 transition-all border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm glow-purple-hover flex flex-col items-center md:items-start justify-center md:justify-start rounded-lg sm:rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-3 w-full">
                      <div className="p-1 sm:p-2.5 rounded-md sm:rounded-xl bg-purple-500/10 border border-purple-500/30 shrink-0">
                        <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <p className="text-base sm:text-3xl font-bold">{stats.to_read}</p>
                        <p className="text-[9px] sm:text-sm text-muted-foreground truncate mt-0">To Read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Books Section */}
              <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-serif font-semibold">Book Collection</h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
                  </p>
                </div>

                {/* Filters Bar - Pill Style */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                      className={`text-xs sm:text-sm ${
                        filter === "all"
                          ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                          : "border-blue-500/20 text-blue-500 hover:bg-blue-500/10 glow-blue-hover"
                      }`}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === "completed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("completed")}
                      className={`text-xs sm:text-sm ${
                        filter === "completed"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                          : "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 glow-emerald-hover"
                      }`}
                    >
                      Completed
                    </Button>
                    <Button
                      variant={filter === "reading" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("reading")}
                      className={`text-xs sm:text-sm ${
                        filter === "reading"
                          ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                          : "border-amber-500/20 text-amber-500 hover:bg-amber-500/10 glow-amber-hover"
                      }`}
                    >
                      Reading
                    </Button>
                    <Button
                      variant={filter === "to-read" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("to-read")}
                      className={`text-xs sm:text-sm ${
                        filter === "to-read"
                          ? "bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
                          : "border-purple-500/20 text-purple-500 hover:bg-purple-500/10 glow-purple-hover"
                      }`}
                    >
                      To Read
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="newest">Newest First</option>
                      <option value="a-z">A-Z</option>
                      <option value="z-a">Z-A</option>
                      <option value="rating-high">Rating: High to Low</option>
                      <option value="rating-low">Rating: Low to High</option>
                    </select>
                  </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {(isMobile && !showAllBooks ? filteredBooks.slice(0, 6) : filteredBooks).map((book) => (
                    <BookCard key={book.id} book={book} view="grid" isPublic />
                  ))}
                </div>

                {/* Show More/Less Button - Mobile Only */}
                {filteredBooks.length > 6 && (
                  <div className="flex justify-center sm:hidden">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllBooks(!showAllBooks)}
                      className="text-sm"
                    >
                      {showAllBooks ? "Show Less" : "Show More"}
                    </Button>
                  </div>
                )}

                {/* CTA Button */}
                <div className="flex justify-center pt-8 pb-4">
                  <Link
                    href="/signup"
                    className="relative overflow-hidden px-8 py-3 text-base sm:text-lg font-semibold rounded-lg bg-gradient-to-r from-[#3b82f6]/20 to-pink-500/20 border border-[#3b82f6]/40 hover:border-[#3b82f6]/60 hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10">Create Your Bookfolio</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6]/20 to-[#3b82f6]/0 animate-shimmer" />
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
