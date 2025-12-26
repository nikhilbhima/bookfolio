"use client";

import { useState } from "react";
import Link from "next/link";
import { PREVIEW_BOOKS, PREVIEW_PROFILE } from "@/lib/preview-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, BookOpen, BookMarked, CheckCircle2, Clock, Instagram, Search, Grid3x3, List } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { XIcon } from "@/components/icons/x-icon";
import Image from "next/image";

type BookStatus = "all" | "reading" | "completed" | "to-read";

export function PreviewMobile() {
  const [filter, setFilter] = useState<BookStatus>("all");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("dark");
  const [view, setView] = useState<"grid" | "list">("grid");

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
  }));

  // Filter books
  const filteredBooks = filter === "all"
    ? convertedBooks
    : convertedBooks.filter((book) => book.status === filter);

  const stats = {
    all: PREVIEW_BOOKS.length,
    reading: PREVIEW_BOOKS.filter((b) => b.status === "currently_reading").length,
    completed: PREVIEW_BOOKS.filter((b) => b.status === "completed").length,
    toRead: PREVIEW_BOOKS.filter((b) => b.status === "to_read").length,
  };

  return (
    <div className={`min-h-full ${previewTheme === "dark" ? "dark bg-zinc-950 text-zinc-50" : "bg-white text-zinc-950"}`}>
      {/* Nav - exact copy from public-nav.tsx */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur ${previewTheme === "dark" ? "border-zinc-800 bg-zinc-950/95" : "border-zinc-200 bg-white/95"}`}>
        <div className="px-3">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  <rect width="32" height="32" rx="7" fill="url(#logo-gradient-preview)" />
                  <rect x="6" y="10" width="11" height="15" rx="3.5" fill="white" opacity="0.95" />
                  <rect x="18" y="7" width="8" height="8" rx="2.5" fill="#ff8a80" opacity="0.9" />
                  <rect x="18" y="17" width="8" height="8" rx="2.5" fill="#69f0ae" opacity="0.85" />
                  <defs>
                    <linearGradient id="logo-gradient-preview" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" />
                      <stop offset="0.5" stopColor="#2563eb" />
                      <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-base font-serif font-semibold">Bookfolio</span>
            </div>

            {/* Right Side Actions - Local theme toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                className={`inline-flex items-center justify-center rounded-md p-2 transition-colors ${previewTheme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
              >
                {previewTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - exact copy from public-profile-view.tsx */}
      <main className="px-3 py-4 space-y-4">
        {/* Profile Card - exact copy from profile-card.tsx mobile styling */}
        <div className="max-w-4xl mx-auto">
          <div className={`p-4 py-5 rounded-lg border ${previewTheme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex flex-row items-start gap-3">
              {/* Profile Photo */}
              <Avatar className={`w-16 h-16 border-2 shrink-0 ${previewTheme === "dark" ? "border-zinc-700" : "border-zinc-200"}`}>
                <AvatarImage src={PREVIEW_PROFILE.avatar_url} alt={PREVIEW_PROFILE.display_name} />
                <AvatarFallback className="text-lg">{PREVIEW_PROFILE.display_name[0]}</AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <h2 className="text-xl font-serif font-bold truncate">{PREVIEW_PROFILE.display_name}</h2>
                  <p className={`text-xs truncate ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>@{PREVIEW_PROFILE.username}</p>
                </div>

                <p className="text-xs mb-2 leading-relaxed line-clamp-2">{PREVIEW_PROFILE.bio}</p>

                {/* Favorite Genres */}
                <div className="mb-2">
                  <p className={`text-[10px] mb-1 ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>Favorite Genres</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PREVIEW_PROFILE.favoriteGenres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="px-2.5 py-1 text-[10px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2.5">
                  <Instagram className={`w-3.5 h-3.5 ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`} />
                  <XIcon className={`w-3.5 h-3.5 ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - clickable to filter */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`relative p-2 transition-all border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm glow-blue-hover flex flex-col items-center justify-center rounded-lg cursor-pointer ${filter === "all" ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-background" : ""}`}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="p-1 rounded-md bg-blue-500/10 border border-blue-500/30 shrink-0">
                  <BookOpen className="w-3 h-3 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold">{stats.all}</p>
                  <p className="text-[9px] text-muted-foreground mt-0">All Books</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setFilter("reading")}
              className={`relative p-2 transition-all border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm glow-amber-hover flex flex-col items-center justify-center rounded-lg cursor-pointer ${filter === "reading" ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-background" : ""}`}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30 shrink-0">
                  <BookMarked className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold">{stats.reading}</p>
                  <p className="text-[9px] text-muted-foreground mt-0">Currently Reading</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setFilter("completed")}
              className={`relative p-2 transition-all border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm glow-emerald-hover flex flex-col items-center justify-center rounded-lg cursor-pointer ${filter === "completed" ? "ring-2 ring-emerald-500 ring-offset-1 ring-offset-background" : ""}`}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold">{stats.completed}</p>
                  <p className="text-[9px] text-muted-foreground mt-0">Completed</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setFilter("to-read")}
              className={`relative p-2 transition-all border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm glow-purple-hover flex flex-col items-center justify-center rounded-lg cursor-pointer ${filter === "to-read" ? "ring-2 ring-purple-500 ring-offset-1 ring-offset-background" : ""}`}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="p-1 rounded-md bg-purple-500/10 border border-purple-500/30 shrink-0">
                  <Clock className="w-3 h-3 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold">{stats.toRead}</p>
                  <p className="text-[9px] text-muted-foreground mt-0">To Read</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Books Grid - exact copy from public-profile-view.tsx */}
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-semibold">Book Collection</h2>
            <p className={`text-xs ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            {/* Filter Pills - horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => setFilter("all")}
                className={`text-[10px] h-7 px-2 shrink-0 rounded-md font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : `border ${previewTheme === "dark" ? "border-blue-500/30" : "border-blue-500/20"} text-blue-500 hover:bg-blue-500/10`
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("reading")}
                className={`text-[10px] h-7 px-2 shrink-0 rounded-md font-medium transition-colors ${
                  filter === "reading"
                    ? "bg-amber-500 text-white"
                    : `border ${previewTheme === "dark" ? "border-amber-500/30" : "border-amber-500/20"} text-amber-500 hover:bg-amber-500/10`
                }`}
              >
                Reading
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`text-[10px] h-7 px-2 shrink-0 rounded-md font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-emerald-500 text-white"
                    : `border ${previewTheme === "dark" ? "border-emerald-500/30" : "border-emerald-500/20"} text-emerald-500 hover:bg-emerald-500/10`
                }`}
              >
                Done
              </button>
              <button
                onClick={() => setFilter("to-read")}
                className={`text-[10px] h-7 px-2 shrink-0 rounded-md font-medium transition-colors ${
                  filter === "to-read"
                    ? "bg-purple-500 text-white"
                    : `border ${previewTheme === "dark" ? "border-purple-500/30" : "border-purple-500/20"} text-purple-500 hover:bg-purple-500/10`
                }`}
              >
                To Read
              </button>
            </div>

            {/* Search + View Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`} />
                <input
                  placeholder="Search books..."
                  className={`w-full pl-8 h-8 text-xs rounded-md border ${previewTheme === "dark" ? "bg-zinc-900 border-zinc-700 placeholder:text-zinc-500" : "bg-white border-zinc-200 placeholder:text-zinc-400"}`}
                  readOnly
                />
              </div>
              {/* View Toggle */}
              <div className={`flex items-center gap-0.5 p-0.5 rounded-md ${previewTheme === "dark" ? "bg-zinc-800" : "bg-zinc-100"}`}>
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    view === "grid"
                      ? previewTheme === "dark" ? "bg-zinc-700 shadow-sm" : "bg-white shadow-sm"
                      : previewTheme === "dark" ? "hover:bg-zinc-700/50" : "hover:bg-zinc-200/50"
                  }`}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded transition-colors ${
                    view === "list"
                      ? previewTheme === "dark" ? "bg-zinc-700 shadow-sm" : "bg-white shadow-sm"
                      : previewTheme === "dark" ? "hover:bg-zinc-700/50" : "hover:bg-zinc-200/50"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Books Display - Grid or List */}
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredBooks.slice(0, 6).map((book) => (
                <div key={book.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-lg border ${previewTheme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <div className={`relative aspect-[2/3] cursor-pointer overflow-hidden rounded-t-lg ${previewTheme === "dark" ? "bg-zinc-800" : "bg-zinc-100"}`}>
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-semibold text-[11px] truncate leading-tight" title={book.title}>
                      {book.title}
                    </h3>
                    <p className={`text-[10px] truncate mt-0.5 ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`} title={book.author}>
                      {book.author}
                    </p>
                    {book.rating > 0 && (
                      <div className="mt-1.5">
                        <StarRating rating={book.rating} readonly size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBooks.slice(0, 6).map((book) => (
                <div key={book.id} className={`flex gap-3 p-2.5 rounded-lg border transition-all duration-300 hover:shadow-md ${previewTheme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <div className={`relative w-12 h-[72px] shrink-0 rounded overflow-hidden ${previewTheme === "dark" ? "bg-zinc-800" : "bg-zinc-100"}`}>
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-semibold text-[11px] truncate leading-tight" title={book.title}>
                      {book.title}
                    </h3>
                    <p className={`text-[10px] truncate mt-0.5 ${previewTheme === "dark" ? "text-zinc-400" : "text-zinc-500"}`} title={book.author}>
                      {book.author}
                    </p>
                    {book.rating > 0 && (
                      <div className="mt-1">
                        <StarRating rating={book.rating} readonly size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button - exact copy from public-profile-view.tsx */}
          <div className="flex justify-center pt-8 pb-4">
            <Link
              href="/signup"
              className="relative overflow-hidden px-6 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#3b82f6]/20 to-pink-500/20 border border-[#3b82f6]/40 hover:border-[#3b82f6]/60 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Create Your Bookfolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6]/20 to-[#3b82f6]/0 animate-shimmer" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
