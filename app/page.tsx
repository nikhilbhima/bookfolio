"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PreviewMobile } from "@/components/preview-mobile";
import { createClient } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Bookfolio",
  "url": "https://bookfolio.me",
  "description": "Track your reading journey, organize your book collection, and share your bookshelf with the world. A beautiful, free alternative to Goodreads.",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Track books you're reading, completed, or want to read",
    "Rate and review books",
    "Share your bookshelf with a personalized public profile",
    "Works offline as a Progressive Web App",
    "Dark and light mode support"
  ]
};

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

    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-background noise-overlay">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium border-0">
                Sign up
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-14">
        {/* Subtle ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/[0.04] dark:bg-blue-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div className="space-y-6 sm:space-y-8">
              <div
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-400/20 text-[11px] font-medium tracking-wide uppercase text-foreground/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </span>
                  Free to use
                </span>
              </div>

              <h1
                className={`transition-all duration-500 delay-75 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <span className="block text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.08]">
                  Your bookshelf,
                </span>
                <span className="block text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-serif italic text-blue-600 dark:text-blue-400 tracking-[-0.01em] leading-[1.08]">
                  beautifully online.
                </span>
              </h1>

              <p
                className={`text-[17px] sm:text-lg text-muted-foreground max-w-[420px] leading-relaxed transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                Track what you read, rate your favorites, and share your collection with a simple link.
              </p>

              <div
                className={`flex flex-wrap items-center gap-4 pt-1 transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="group text-[15px] px-7 h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium border-0 glow-accent-hover transition-all duration-200"
                  >
                    Create your bookfolio
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Social proof hint */}
              <div
                className={`flex items-center gap-3 pt-4 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Joined by readers everywhere
                </span>
              </div>
            </div>

            {/* Right: Phone preview - iPhone 16 Pro style */}
            <div
              className={`hidden lg:flex flex-col items-center transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="relative scale-[0.85] origin-center">
                {/* Phone frame - Titanium style */}
                <div className="relative rounded-[3rem] p-[3px] bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 shadow-2xl shadow-black/20 dark:shadow-black/50">
                  {/* Inner bezel */}
                  <div className="relative bg-black rounded-[2.8rem] p-[10px]">
                    {/* Dynamic Island */}
                    <div className="absolute top-[22px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                      <div className="w-[90px] h-[28px] bg-black rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-800" />
                      </div>
                    </div>
                    {/* Screen */}
                    <div className="relative w-[272px] rounded-[2.2rem] overflow-hidden bg-background">
                      <div className="h-[588px] overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth">
                        <PreviewMobile />
                      </div>
                    </div>
                  </div>
                  {/* Side button - Power */}
                  <div className="absolute right-[-2px] top-[120px] w-[3px] h-[60px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 rounded-r-sm" />
                  {/* Side buttons - Volume */}
                  <div className="absolute left-[-2px] top-[100px] w-[3px] h-[28px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 rounded-l-sm" />
                  <div className="absolute left-[-2px] top-[140px] w-[3px] h-[50px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 rounded-l-sm" />
                </div>
                {/* Subtle reflection */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Interactive hint */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 -mt-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-50 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                </span>
                <span>Live preview · scroll to explore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Simple by design
            </h2>
            <p className="text-muted-foreground text-[15px] sm:text-base">
              Everything you need to track your reading, nothing you don't.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Wide card */}
            <div className="sm:col-span-2 group p-6 sm:p-8 rounded-2xl bg-card border border-subtle hover:border-blue-500/20 transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Your personal library</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Search millions of titles. Organize by reading status. Add ratings and notes. Watch your collection grow over time.
              </p>
            </div>

            {/* Card */}
            <div className="group p-6 rounded-2xl bg-card border border-subtle hover:border-blue-500/20 transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px] text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Share your shelf</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get a clean link at bookfolio.me/you
              </p>
            </div>

            {/* Card */}
            <div className="group p-6 rounded-2xl bg-card border border-subtle hover:border-blue-500/20 transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Rate & review</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Stars and notes for every book
              </p>
            </div>

            {/* Card */}
            <div className="group p-6 rounded-2xl bg-card border border-subtle hover:border-blue-500/20 transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px] text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Works offline</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Install as an app on any device
              </p>
            </div>

            {/* Card */}
            <div className="group p-6 rounded-2xl bg-card border border-subtle hover:border-blue-500/20 transition-colors duration-200">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px] text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Light & dark</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Comfortable reading, any time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile preview */}
      <section className="lg:hidden py-12 sm:py-16 border-t border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">See it in action</h2>
            <p className="text-muted-foreground text-sm">Scroll to explore</p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              {/* Phone frame - Titanium style */}
              <div className="relative rounded-[2.5rem] sm:rounded-[3rem] p-[3px] bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 shadow-2xl shadow-black/20">
                {/* Inner bezel */}
                <div className="relative bg-black rounded-[2.3rem] sm:rounded-[2.8rem] p-[8px] sm:p-[10px]">
                  {/* Dynamic Island */}
                  <div className="absolute top-[18px] sm:top-[22px] left-1/2 -translate-x-1/2 z-20">
                    <div className="w-[75px] sm:w-[90px] h-[24px] sm:h-[28px] bg-black rounded-full flex items-center justify-center">
                      <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-neutral-900 border border-neutral-800" />
                    </div>
                  </div>
                  {/* Screen */}
                  <div className="relative w-[240px] sm:w-[272px] rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden bg-background">
                    <div className="h-[520px] sm:h-[588px] overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth">
                      <PreviewMobile />
                    </div>
                  </div>
                </div>
                {/* Side buttons */}
                <div className="absolute right-[-2px] top-[100px] sm:top-[120px] w-[3px] h-[50px] sm:h-[60px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 rounded-r-sm" />
                <div className="absolute left-[-2px] top-[85px] sm:top-[100px] w-[3px] h-[24px] sm:h-[28px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 rounded-l-sm" />
                <div className="absolute left-[-2px] top-[120px] sm:top-[140px] w-[3px] h-[42px] sm:h-[50px] bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 rounded-l-sm" />
              </div>
              {/* Subtle reflection */}
              <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-28 border-t border-subtle relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/[0.03] dark:bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Start your <span className="font-serif italic text-blue-600 dark:text-blue-400">bookshelf</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
            Free forever. No ads. No catch.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="group text-sm sm:text-[15px] px-6 sm:px-8 h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium border-0 glow-accent-hover transition-all duration-200"
            >
              Get started — it's free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:gap-5">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-5 text-xs sm:text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/feature-request" className="hover:text-foreground transition-colors">Feature request</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>

            <a
              href="https://x.com/nikhilbhima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow on X"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <span className="text-xs sm:text-sm text-muted-foreground">© {new Date().getFullYear()} Bookfolio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
