"use client";

import React, { useState, useEffect, useRef } from "react";
import { Grid3x3, List, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { Button } from "./ui/button";
import { BookCard } from "./book-card";
import { AddBookModal } from "./add-book-modal";

export function BooksGrid() {
  const view = useBookStore((state) => state.view);
  const setView = useBookStore((state) => state.setView);
  const books = useBookStore((state) => state.books);
  const reorderBooks = useBookStore((state) => state.reorderBooks);
  const filter = useBookStore((state) => state.filter);
  const searchQuery = useBookStore((state) => state.searchQuery);
  const sortBy = useBookStore((state) => state.sortBy);
  const isLoading = useBookStore((state) => state.isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [movingBookId, setMovingBookId] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState<number | null>(null);

  // Check if drag should be enabled
  const isDragEnabled = filter === "all" && !searchQuery && sortBy === "newest" && view === "grid";

  // Compute filtered books
  const filteredBooks = React.useMemo(() => {
    let filtered = books;

    if (filter !== "all") {
      filtered = filtered.filter((book) => book.status === filter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.genre && book.genre.toLowerCase().includes(query))
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "a-z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-high":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-low":
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "newest":
      default:
        break;
    }

    return sorted;
  }, [books, filter, searchQuery, sortBy]);

  // Pagination
  const booksPerPage = 36;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);
  const shouldShowPagination = filteredBooks.length > booksPerPage;

  // Vanilla JavaScript Drag and Drop
  useEffect(() => {
    if (!isDragEnabled || !gridRef.current) return;

    const grid = gridRef.current;
    let draggedElement: HTMLElement | null = null;
    let ghostElement: HTMLElement | null = null;
    let offsetX = 0;
    let offsetY = 0;
    let draggedBookId: string | null = null;
    let startIndex = -1;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Don't start drag if clicking on a button, checkbox, or interactive element
      if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('input')) {
        return;
      }

      const bookCard = target.closest('[data-book-card]') as HTMLElement;

      if (!bookCard) return;

      draggedElement = bookCard;
      draggedBookId = bookCard.getAttribute('data-book-id');
      startIndex = parseInt(bookCard.getAttribute('data-book-index') || '-1');

      const rect = bookCard.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Create ghost element
      ghostElement = bookCard.cloneNode(true) as HTMLElement;
      ghostElement.style.position = 'fixed';
      ghostElement.style.left = `${e.clientX - offsetX}px`;
      ghostElement.style.top = `${e.clientY - offsetY}px`;
      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.pointerEvents = 'none';
      ghostElement.style.zIndex = '1000';
      ghostElement.style.transform = 'scale(1.05)';
      ghostElement.style.filter = 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5)) brightness(1.1)';
      ghostElement.style.transition = 'none';
      document.body.appendChild(ghostElement);

      // Make original semi-transparent
      bookCard.style.opacity = '0.3';

      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedElement || !ghostElement) return;

      // Move ghost element with cursor
      ghostElement.style.left = `${e.clientX - offsetX}px`;
      ghostElement.style.top = `${e.clientY - offsetY}px`;

      // Find drop target
      const cards = grid.querySelectorAll('[data-book-card]');
      let dropTarget: HTMLElement | null = null;

      cards.forEach((card) => {
        if (card === draggedElement) return;

        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          dropTarget = card as HTMLElement;
        }
      });

      // Highlight drop target
      cards.forEach((card) => {
        if (card === draggedElement) return;
        if (card === dropTarget) {
          (card as HTMLElement).style.outline = '2px solid rgb(59, 130, 246)';
          (card as HTMLElement).style.outlineOffset = '2px';
        } else {
          (card as HTMLElement).style.outline = '';
          (card as HTMLElement).style.outlineOffset = '';
        }
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!draggedElement || !ghostElement) return;

      // Find where we dropped
      const cards = grid.querySelectorAll('[data-book-card]');
      let dropIndex = -1;

      cards.forEach((card) => {
        if (card === draggedElement) return;

        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          dropIndex = parseInt((card as HTMLElement).getAttribute('data-book-index') || '-1');
        }
      });

      // Reorder if dropped on different position
      if (dropIndex !== -1 && dropIndex !== startIndex && draggedBookId) {
        // Work with the full books array, not just currentBooks
        const newBooks = [...books];

        // Find the actual books being moved
        const draggedBook = currentBooks[startIndex];
        const targetBook = currentBooks[dropIndex];

        // Find their positions in the full array
        const draggedIndex = newBooks.findIndex(b => b.id === draggedBook.id);
        const targetIndex = newBooks.findIndex(b => b.id === targetBook.id);

        if (draggedIndex !== -1 && targetIndex !== -1) {
          // Remove from old position
          newBooks.splice(draggedIndex, 1);

          // Find new position after removal
          const newTargetIndex = newBooks.findIndex(b => b.id === targetBook.id);

          // Insert at new position (after the target if moving forward, before if moving backward)
          const insertIndex = draggedIndex < targetIndex ? newTargetIndex + 1 : newTargetIndex;
          newBooks.splice(insertIndex, 0, draggedBook);

          // Update the full books array
          reorderBooks(newBooks);
        }
      }

      // Cleanup
      if (ghostElement && ghostElement.parentNode) {
        ghostElement.parentNode.removeChild(ghostElement);
      }
      if (draggedElement) {
        draggedElement.style.opacity = '';
      }

      // Remove all outlines
      cards.forEach((card) => {
        (card as HTMLElement).style.outline = '';
        (card as HTMLElement).style.outlineOffset = '';
      });

      draggedElement = null;
      ghostElement = null;
      draggedBookId = null;
      startIndex = -1;
    };

    // Only enable drag and drop on desktop (mouse events only)
    grid.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      grid.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragEnabled, books, currentBooks, reorderBooks]);

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {/* View Switcher */}
      <div className="flex justify-between items-center max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {!isDragEnabled && view === "grid" && (
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
              Drag disabled when filters/search/sort are active
            </p>
          )}
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-muted rounded-md sm:rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("grid")}
            className={`gap-1 sm:gap-2 px-2 sm:px-3 h-7 sm:h-9 ${
              view === "grid" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            <Grid3x3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-sm">Grid</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("list")}
            className={`gap-1 sm:gap-2 px-2 sm:px-3 h-7 sm:h-9 ${
              view === "list" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-sm">List</span>
          </Button>
        </div>
      </div>

      {/* Books Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm sm:text-base text-muted-foreground">Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm sm:text-base text-muted-foreground">No books found</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-4">
            Try adjusting your filters or add a new book
          </p>
          <Button onClick={() => setIsAddBookOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>
      ) : (
        <>
          <div
            ref={gridRef}
            className={
              view === "grid"
                ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4 relative max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8"
                : "space-y-2 max-w-4xl mx-auto px-3 sm:px-0"
            }
          >
            {currentBooks.map((book, index) => (
              <div
                key={book.id}
                data-book-card
                data-book-id={book.id}
                data-book-index={index}
                className={`
                  ${isDragEnabled && view === "grid" ? "cursor-grab active:cursor-grabbing" : ""}
                  transition-opacity duration-200
                  ${movingBookId === book.id ? "opacity-50" : ""}
                  ${targetPosition === index && movingBookId ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                `}
                onClick={() => {
                  if (movingBookId && movingBookId !== book.id) {
                    setTargetPosition(index);
                  }
                }}
              >
                <BookCard
                  book={book}
                  view={view}
                  isMoveMode={movingBookId === book.id}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {shouldShowPagination && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages: (number | string)[] = [];
                  const maxVisible = 5;

                  if (totalPages <= maxVisible + 2) {
                    // Show all pages if total is small
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    // Always show first page
                    pages.push(1);

                    if (currentPage > 3) {
                      pages.push('...');
                    }

                    // Show pages around current
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      if (!pages.includes(i)) pages.push(i);
                    }

                    if (currentPage < totalPages - 2) {
                      pages.push('...');
                    }

                    // Always show last page
                    if (!pages.includes(totalPages)) pages.push(totalPages);
                  }

                  return pages.map((page, idx) =>
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                        className="h-9 w-9 p-0"
                      >
                        {page}
                      </Button>
                    )
                  );
                })()}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Move Mode UI */}
          {movingBookId && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background border-2 border-border px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
              <p className="text-sm font-medium text-foreground">
                {targetPosition !== null ? "Tap Confirm to move" : "Tap where you want to move the book"}
              </p>
              <div className="flex gap-2">
                {targetPosition !== null && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      if (targetPosition !== null) {
                        const startIndex = currentBooks.findIndex((b) => b.id === movingBookId);
                        if (startIndex !== -1 && startIndex !== targetPosition) {
                          // Work with the full books array
                          const newBooks = [...books];

                          // Find the actual books being moved
                          const draggedBook = currentBooks[startIndex];
                          const targetBook = currentBooks[targetPosition];

                          // Find their positions in the full array
                          const draggedIndex = newBooks.findIndex(b => b.id === draggedBook.id);
                          const targetIndex = newBooks.findIndex(b => b.id === targetBook.id);

                          if (draggedIndex !== -1 && targetIndex !== -1) {
                            // Remove from old position
                            newBooks.splice(draggedIndex, 1);

                            // Find new position after removal
                            const newTargetIndex = newBooks.findIndex(b => b.id === targetBook.id);

                            // Insert at new position
                            const insertIndex = draggedIndex < targetIndex ? newTargetIndex + 1 : newTargetIndex;
                            newBooks.splice(insertIndex, 0, draggedBook);

                            reorderBooks(newBooks);
                          }
                        }
                      }
                      setMovingBookId(null);
                      setTargetPosition(null);
                    }}
                  >
                    Confirm
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMovingBookId(null);
                    setTargetPosition(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Drag Instructions */}
          {isDragEnabled && view === "grid" && currentBooks.length > 0 && !movingBookId && (
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Click and drag any book to reorder your collection
              </p>
            </div>
          )}
        </>
      )}

      <AddBookModal isOpen={isAddBookOpen} onClose={() => setIsAddBookOpen(false)} />
    </div>
  );
}
