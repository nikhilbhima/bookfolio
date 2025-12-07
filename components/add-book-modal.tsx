"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, Upload, Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { Book } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { StarRating } from "./star-rating";
import Image from "next/image";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: Book;
}

interface SearchResult {
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
}

export function AddBookModal({ isOpen, onClose, bookToEdit }: AddBookModalProps) {
  const addBook = useBookStore((state) => state.addBook);
  const updateBook = useBookStore((state) => state.updateBook);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [coverPreview, setCoverPreview] = useState<string | null>(bookToEdit?.cover || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: bookToEdit?.title || "",
    author: bookToEdit?.author || "",
    cover: bookToEdit?.cover || "",
    genre: bookToEdit?.genre || "",
    rating: bookToEdit?.rating || 0,
    status: bookToEdit?.status || "to-read",
    notes: bookToEdit?.notes || "",
  });

  // Pagination
  const resultsPerPage = 12; // 3 per row × 4 rows
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return searchResults.slice(startIndex, startIndex + resultsPerPage);
  }, [searchResults, currentPage]);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  // Search books with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectBook = (book: SearchResult) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      cover: book.coverLarge || book.cover,
      genre: book.genre,
      rating: 0,
      status: "to-read",
      notes: "",
    });
    setCoverPreview(book.coverLarge || book.cover);
    setSearchQuery("");
    setSearchResults([]);
    setShowManualEntry(true);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverPreview(result);
        setFormData({ ...formData, cover: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData({ ...formData, cover: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        cover: formData.cover || "https://via.placeholder.com/300x450?text=No+Cover",
        genre: formData.genre?.trim() || "",
        rating: formData.rating,
        status: formData.status as "reading" | "completed" | "to-read",
        notes: formData.notes?.trim() || "",
        customOrder: 0,
      };

      if (bookToEdit) {
        await updateBook(bookToEdit.id, bookData);
        toast.success("Book updated successfully");
      } else {
        await addBook(bookData);
        toast.success("Book added to your collection");
      }

      // Reset and close
      setFormData({
        title: "",
        author: "",
        cover: "",
        genre: "",
        rating: 0,
        status: "to-read",
        notes: "",
      });
      setCoverPreview(null);
      setSelectedBook(null);
      setSearchQuery("");
      setSearchResults([]);
      setShowManualEntry(false);
      setCurrentPage(1);
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("Failed to save book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      author: "",
      cover: "",
      genre: "",
      rating: 0,
      status: "to-read",
      notes: "",
    });
    setCoverPreview(null);
    setSelectedBook(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowManualEntry(false);
    setCurrentPage(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 overscroll-contain [&>div]:overscroll-contain [&>button]:z-20">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-3 sm:pb-4 -mt-4 -mx-4 px-4 sm:-mt-6 sm:-mx-6 sm:px-6 pt-4 sm:pt-6 border-b mb-4 backdrop-blur-sm pr-12 sm:pr-14">
          <DialogTitle className="text-lg sm:text-xl">
            {bookToEdit ? "Edit Book" : "Add Book"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Section - Always visible for new books */}
          {!bookToEdit && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm sm:text-base">Search for a book</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter book title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Search Results */}
              {isSearching && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  {/* Grid of search results */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {paginatedResults.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleSelectBook(book)}
                        className="flex flex-col gap-2 p-2 sm:p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        {book.cover ? (
                          <div className="relative w-full aspect-[2/3] bg-muted rounded overflow-hidden">
                            <Image
                              src={book.cover}
                              alt={book.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-[2/3] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            No Cover
                          </div>
                        )}
                        <div className="space-y-0.5 text-left">
                          <h4 className="font-medium text-xs sm:text-sm line-clamp-2 leading-tight">
                            {book.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {book.author}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        ←
                      </Button>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        →
                      </Button>
                    </div>
                  )}

                  {/* Search tip */}
                  <p className="text-xs text-center text-muted-foreground italic">
                    💡 Search with book name and author for better results
                  </p>
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No books found. Use manual entry below.
                </div>
              )}

              {/* Manual Entry Toggle */}
              <div className="border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  className="flex items-center justify-between w-full text-sm sm:text-base font-medium hover:text-primary transition-colors"
                >
                  <span>Or enter book details manually</span>
                  {showManualEntry ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Manual Entry Form - Collapsible for new books, always visible for edit */}
          {(bookToEdit || showManualEntry) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column - Cover */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm sm:text-base">Book Cover</Label>
                    <div className="mt-2 flex flex-col items-center gap-3">
                      {coverPreview ? (
                        <div className="relative">
                          <Image
                            src={coverPreview}
                            alt="Cover preview"
                            width={160}
                            height={240}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={handleRemoveCover}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-[160px] h-[240px] border-2 border-dashed rounded-lg flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                          No cover
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs sm:text-sm"
                        >
                          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Upload
                        </Button>
                        {selectedBook && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBook(null);
                              setFormData({
                                title: "",
                                author: "",
                                cover: "",
                                genre: "",
                                rating: 0,
                                status: "to-read",
                                notes: "",
                              });
                              setCoverPreview(null);
                            }}
                            className="text-xs sm:text-sm"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm sm:text-base">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="mt-1.5 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="author" className="text-sm sm:text-base">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                      className="mt-1.5 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre" className="text-sm sm:text-base">Genre</Label>
                    <Input
                      id="genre"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="e.g., Fiction, Mystery"
                      className="mt-1.5 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm sm:text-base">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as "reading" | "completed" | "to-read" })}
                    >
                      <SelectTrigger id="status" className="mt-1.5 text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-read">To Read</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm sm:text-base">Your Rating</Label>
                    <div className="mt-1.5 flex items-center gap-3">
                      <StarRating
                        rating={formData.rating}
                        onRatingChange={(rating) => setFormData({ ...formData, rating })}
                      />
                      {formData.rating > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, rating: 0 })}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm sm:text-base">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Your thoughts, favorite quotes..."
                  rows={3}
                  className="mt-1.5 text-sm sm:text-base"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{bookToEdit ? "Update" : "Add"} Book</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
