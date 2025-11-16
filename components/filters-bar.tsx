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
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Filter Dropdown */}
        <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="reading">Currently Reading</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="to-read">To Read</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="a-z">A - Z</SelectItem>
            <SelectItem value="z-a">Z - A</SelectItem>
            <SelectItem value="rating-high">Rating: High to Low</SelectItem>
            <SelectItem value="rating-low">Rating: Low to High</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Book Button */}
        <Button
          onClick={() => setIsAddBookOpen(true)}
          className="gap-2 bg-blue-500/15 border border-blue-500/40 text-blue-400 hover:bg-blue-500/25 hover:border-blue-500/60 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="sm:inline">Add Book</span>
        </Button>
      </div>

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
      />
    </>
  );
}
