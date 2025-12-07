"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PreviewMobile } from "@/components/preview-mobile";
import { createClient } from "@/lib/supabase";
import { BookOpen, Share2, Sparkles, ArrowRight, ChevronDown } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      }
    };

    checkAuth();

    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [router]);

  const scrollToPreview = () => {
    document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-sm font-medium">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center pt-36 sm:pt-32 pb-8 sm:pb-12 overflow-hidden">
        {/* Colorful Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-blue-50/30 to-blue-50/60 dark:from-blue-950/30 dark:via-blue-950/20 dark:to-blue-950/30" />

        {/* Animated Gradient Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Book Spines - Decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-4 top-1/4 w-3 h-32 bg-blue-500/40 rounded-r-sm transform -rotate-6 hidden lg:block shadow-lg" />
          <div className="absolute -left-2 top-1/3 w-2 h-24 bg-emerald-500/35 rounded-r-sm transform rotate-3 hidden lg:block shadow-lg" />
          <div className="absolute -right-4 top-1/2 w-3 h-28 bg-blue-500/40 rounded-l-sm transform rotate-6 hidden lg:block shadow-lg" />
          <div className="absolute -right-2 top-2/3 w-2 h-20 bg-blue-500/35 rounded-l-sm transform -rotate-3 hidden lg:block shadow-lg" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Overline */}
            <div
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-foreground/80 bg-blue-500/10 border border-blue-500/30 dark:border-blue-400/30 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Your personal library, online
              </span>
            </div>

            {/* Main Heading */}
            <div
              className={`space-y-1 sm:space-y-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <h1 className="text-[2.5rem] leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
                <span className="block font-bold">Your Bookshelf,</span>
                <span className="block font-serif italic text-blue-500">
                  Beautifully Online.
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p
              className={`text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              Track your reading journey and share your collection
              with a beautiful, personalized page at{' '}
              <span className="font-medium text-foreground break-all sm:break-normal">bookfolio.me/yourname</span>
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 pb-8 sm:pb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group relative text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 rounded-full font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 w-full sm:w-auto border-0"
                >
                  Create Your Bookfolio
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <button
                onClick={scrollToPreview}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                See it in action
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 md:py-28 border-t border-border/50 bg-gradient-to-b from-background via-blue-50/30 to-background dark:via-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Three steps to your bookshelf
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Get started in minutes. No credit card required.
              </p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="group">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
                    Step 1
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    Claim your URL
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Pick a username and get your own page at bookfolio.me/yourname
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
                    Step 2
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    Add your books
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Search our library of millions of titles. Add ratings, notes, and track your progress.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
                    Step 3
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    Share your shelf
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Share your beautiful bookshelf with friends, on social media, or in your bio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-gradient-to-br from-blue-50/50 via-muted/30 to-blue-50/50 dark:from-blue-950/20 dark:via-muted/30 dark:to-blue-950/20 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Feature 1 */}
              <div className="group p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Rate & Review</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      Add star ratings and personal notes to remember what you loved about each book.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Organize Your Way</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      Filter by status, sort by rating, and drag to reorder. Your shelf, your rules.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Works Offline</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      Install as an app on your phone. Access your library anywhere, even without internet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Dark & Light Modes</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      Easy on the eyes, day or night. Your bookshelf looks great in any lighting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section id="preview-section" className="py-12 sm:py-20 md:py-28 border-t border-border/50 scroll-mt-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              See it in action
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Explore a sample bookshelf. This is what your public profile could look like.
            </p>
          </div>

          {/* Phone mockup for all screen sizes */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone frame - larger on desktop */}
              <div className="relative bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl">
                {/* Phone notch / Dynamic Island */}
                <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-5 sm:h-7 bg-black rounded-full z-20" />
                {/* Phone screen */}
                <div className="relative w-[280px] sm:w-[340px] md:w-[380px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
                  {/* Scrollable content area with native mobile view */}
                  <div className="h-[560px] sm:h-[680px] md:h-[760px] overflow-y-auto overflow-x-hidden overscroll-contain">
                    <PreviewMobile />
                  </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 sm:h-1.5 bg-gray-600 rounded-full" />
              </div>
              {/* Scroll hint */}
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 flex items-center justify-center gap-1.5">
                <span className="inline-block w-4 h-4 border-2 border-muted-foreground/50 rounded-full animate-bounce" />
                Scroll inside to explore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 md:py-32 border-t border-border/50 bg-gradient-to-b from-background via-blue-50/40 to-blue-50/40 dark:via-blue-950/20 dark:to-blue-950/20 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to build your{' '}
              <span className="text-blue-500">
                bookshelf
              </span>
              ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Join readers who are tracking and sharing their literary journeys.
            </p>
            <Link href="/signup" className="inline-block w-full sm:w-auto">
              <Button
                size="lg"
                className="group text-sm sm:text-base px-8 sm:px-10 h-12 sm:h-14 rounded-full font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 w-full sm:w-auto border-0"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm">
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
                aria-label="Follow on X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Bookfolio. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
