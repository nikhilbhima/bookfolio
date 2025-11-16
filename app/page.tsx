"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PreviewDashboard } from "@/components/preview-dashboard";
import { createClient } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // User is logged in, redirect to dashboard
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm px-2 md:px-4">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs md:text-sm px-2 md:px-4">
                <span className="hidden sm:inline">Create Your Bookfolio</span>
                <span className="sm:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Preview */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Neon Gradient Orbs - Dark Mode */}
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>

        {/* Neon Gradient Orbs - Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/8 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>

        <div className="container mx-auto px-4 relative z-10 space-y-16">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight">
                <span className="block font-bold">Your BookShelf,</span>
                <span className="block font-serif">
                  Beautifully <span className="italic">Online</span>.
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your books and share your reading journey with the world.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center items-center pt-1">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-base px-8 py-5 h-12 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-900 text-white border-0 shadow-[0_8px_30px_rgb(29,78,216,0.4)] dark:shadow-[0_8px_30px_rgb(37,99,235,0.5)] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(29,78,216,0.5)] dark:hover:shadow-[0_12px_40px_rgb(37,99,235,0.6)] hover:scale-105 font-semibold"
                >
                  Create Your Bookfolio
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-base font-semibold mb-2">Track Your Books</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Keep a record of every book you&apos;ve read, are reading, or want to read.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="text-base font-semibold mb-2">Share Your Journey</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Showcase your collection and reading progress with friends or the world.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-base font-semibold mb-2">Discover & Organize</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Easily organize your books by genre, status, or personal rating—your shelf, your way.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Preview Dashboard */}
          <div className="max-w-5xl mx-auto px-0 md:px-8 lg:px-16 scale-[0.82] sm:scale-90 md:scale-95 lg:scale-100 origin-top">
            <PreviewDashboard />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/feature-request" className="text-muted-foreground hover:text-foreground transition-colors">
                Feature Request
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Use
              </Link>
            </div>

            {/* Social */}
            <div className="flex justify-center mb-6">
              <a
                href="https://x.com/nikhilbhima"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                © 2025 Bookfolio. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
