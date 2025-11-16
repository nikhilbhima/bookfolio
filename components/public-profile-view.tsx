"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Book, UserProfile } from "@/lib/mock-data";
import { ProfileCard } from "./profile-card";
import { BookCard } from "./book-card";
import { PublicFiltersBar } from "./public-filters-bar";
import { BookOpen, CheckCircle2, Clock, BookMarked } from "lucide-react";

interface PublicProfileViewProps {
  profile: UserProfile;
  books: Book[];
}

export function PublicProfileView({ profile, books }: PublicProfileViewProps) {
  const [filter, setFilter] = useState<"all" | "reading" | "completed" | "to-read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a" | "rating-high" | "rating-low">("newest");

  // Calculate stats
  const totalBooks = books.length;
  const completedBooks = books.filter((b) => b.status === "completed").length;
  const readingBooks = books.filter((b) => b.status === "reading").length;
  const toReadBooks = books.filter((b) => b.status === "to-read").length;

  // Filter and search books
  const filteredBooks = useMemo(() => {
    let filtered = books;

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
          book.author.toLowerCase().includes(query) ||
          book.genre?.toLowerCase().includes(query)
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
  }, [books, filter, searchQuery, sortBy]);


  return (
    <>
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Profile Section */}
        <div className="max-w-4xl mx-auto">
          <ProfileCard profile={profile} isPublic />
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative p-2 sm:p-5 transition-all border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm glow-blue-hover flex flex-col items-center md:items-start justify-center md:justify-start rounded-lg sm:rounded-2xl">
              <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-3 w-full">
                <div className="p-1 sm:p-2.5 rounded-md sm:rounded-xl bg-blue-500/10 border border-blue-500/30 shrink-0">
                  <BookOpen className="w-3 h-3 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <p className="text-base sm:text-3xl font-bold">{totalBooks}</p>
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
                  <p className="text-base sm:text-3xl font-bold">{readingBooks}</p>
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
                  <p className="text-base sm:text-3xl font-bold">{completedBooks}</p>
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
                  <p className="text-base sm:text-3xl font-bold">{toReadBooks}</p>
                  <p className="text-[9px] sm:text-sm text-muted-foreground truncate mt-0">To Read</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold">Book Collection</h2>
            <p className="text-sm text-muted-foreground">
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <PublicFiltersBar
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No books in collection yet</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No books found matching your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} view="grid" isPublic />
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="flex justify-center pt-8 pb-12">
            <Link
              href="/"
              className="relative overflow-hidden px-8 py-3 text-base sm:text-lg font-semibold rounded-lg bg-gradient-to-r from-[#3b82f6]/20 to-pink-500/20 border border-[#3b82f6]/40 hover:border-[#3b82f6]/60 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Create Your Bookfolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6]/20 to-[#3b82f6]/0 animate-shimmer" />
            </Link>
          </div>
        </div>
      </main>

    </>
  );
}
