"use client";

import { useBookStore } from "@/lib/store";
import { Card } from "./ui/card";
import { BookOpen, BookMarked, CheckCircle2, Clock } from "lucide-react";

export function StatsBoxes() {
  const books = useBookStore((state) => state.books);
  const filter = useBookStore((state) => state.filter);
  const setFilter = useBookStore((state) => state.setFilter);

  const stats = {
    all: books.length,
    reading: books.filter((b) => b.status === "reading").length,
    completed: books.filter((b) => b.status === "completed").length,
    toRead: books.filter((b) => b.status === "to-read").length,
  };

  const statItems = [
    {
      label: "All Books",
      value: stats.all,
      icon: BookOpen,
      filter: "all" as const,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      hoverClass: "glow-blue-hover",
      activeRing: "ring-blue-500/60",
    },
    {
      label: "Currently Reading",
      value: stats.reading,
      icon: BookMarked,
      filter: "reading" as const,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      hoverClass: "glow-amber-hover",
      activeRing: "ring-amber-500/60",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      filter: "completed" as const,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      hoverClass: "glow-emerald-hover",
      activeRing: "ring-emerald-500/60",
    },
    {
      label: "To Read",
      value: stats.toRead,
      icon: Clock,
      filter: "to-read" as const,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      hoverClass: "glow-purple-hover",
      activeRing: "ring-purple-500/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isActive = filter === item.filter;

        return (
          <Card
            key={item.filter}
            onClick={() => setFilter(item.filter)}
            className={`relative p-2 sm:p-3 md:p-5 cursor-pointer transition-all duration-200 border ${item.borderColor} ${item.bgColor} backdrop-blur-sm ${
              item.hoverClass
            } ${isActive ? `ring-2 ${item.activeRing} shadow-lg` : ""} flex flex-col items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl hover:scale-[1.02]`}
          >
            <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-2 w-full">
              <div
                className={`p-1 sm:p-1.5 md:p-2.5 rounded-md sm:rounded-lg md:rounded-xl ${item.bgColor} border ${item.borderColor} shrink-0`}
              >
                <Icon className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${item.color}`} />
              </div>
              <div className="text-center w-full">
                <p className="text-sm sm:text-xl md:text-3xl font-bold">{item.value}</p>
                <p className="text-[8px] sm:text-[10px] md:text-sm text-muted-foreground truncate leading-tight">
                  {item.label}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
