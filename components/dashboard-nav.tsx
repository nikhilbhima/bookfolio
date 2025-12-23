"use client";

import { useState } from "react";
import { Eye, Upload } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SettingsMenu } from "./settings-menu";
import { Button } from "./ui/button";
import { ShareModal } from "./share-modal";
import { useBookStore } from "@/lib/store";

export function DashboardNav() {
  const profile = useBookStore((state) => state.profile);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handlePreview = () => {
    // Open public profile page in new tab
    window.open(`/${profile.username}`, "_blank");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-1 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            className="gap-2 px-2 sm:px-4"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Share your Bookfolio
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            className="sm:hidden px-2"
          >
            <Upload className="w-4 h-4" />
          </Button>

          <ThemeToggle />

          <SettingsMenu />
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        username={profile.username}
      />
    </nav>
  );
}
