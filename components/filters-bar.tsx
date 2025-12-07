"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AddBookModal } from "./add-book-modal";

export function FiltersBar() {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const searchQuery = useBookStore((state) => state.searchQuery);
  const setSearchQuery = useBookStore((state) => state.setSearchQuery);
  const filter = useBookStore((state) => state.filter);
  const setFilter = useBookStore((state) => state.setFilter);
  const sortBy = useBookStore((state) => state.sortBy);
  const setSortBy = useBookStore((state) => state.setSortBy);

  return (
    <>
      <div className="flex flex-col gap-2 sm:gap-3 max-w-[90rem] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile: Search on top, filters below */}
        {/* Search Bar */}
        <div className="relative flex-1 order-first sm:order-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {/* Filters row */}
        <div className="flex gap-2 sm:gap-3">
          {/* Status Filter Dropdown */}
          <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <SelectTrigger className="flex-1 sm:flex-none sm:w-[180px] h-11 sm:h-10 text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="reading">Currently Reading</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="to-read">To Read</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="flex-1 sm:flex-none sm:w-[160px] h-11 sm:h-10 text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="a-z">A - Z</SelectItem>
              <SelectItem value="z-a">Z - A</SelectItem>
              <SelectItem value="rating-high">Rating: High</SelectItem>
              <SelectItem value="rating-low">Rating: Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Book Button */}
          <Button
            onClick={() => setIsAddBookOpen(true)}
            className="gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white h-11 sm:h-10 px-3 sm:px-4 text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Book</span>
          </Button>
        </div>
      </div>

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
      />
    </>
  );
}
