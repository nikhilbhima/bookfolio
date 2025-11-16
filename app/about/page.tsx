import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Link href="/"><Button variant="ghost" size="sm">Back to Home</Button></Link>
        </div>
      </nav>
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">About Bookfolio</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">Bookfolio is a personal digital bookshelf—a beautiful way to track, organize, and share reading journeys with the world.</p>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Mission</h2>
            <p>Every reader&apos;s journey is unique and worth sharing. Bookfolio empowers readers to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Track books read, currently reading, or want to read</li>
              <li>Rate and review favorite (or not-so-favorite) books</li>
              <li>Organize collections by genre, status, or custom preferences</li>
              <li>Share reading journeys with personalized public profiles</li>
            </ul>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Why Bookfolio?</h2>
            <p>Built for readers, by readers. A clean, intuitive platform that focuses on what matters most—books and reading experiences.</p>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Get Started</h2>
            <p>Ready to create your digital bookshelf? <Link href="/signup" className="text-primary hover:underline font-medium">Sign up now</Link> and start building your Bookfolio today.</p>
          </div>
        </div>
      </div>
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">© 2025 Bookfolio. All rights reserved.</div>
      </footer>
    </div>
  );
}
