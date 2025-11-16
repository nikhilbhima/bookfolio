import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function FeatureRequestPage() {
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
          <h1 className="text-4xl font-bold mb-6">Feature Request</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">Feedback helps build a better Bookfolio for everyone.</p>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Have an idea?</h2>
            <p>Feature requests, suggestions, or thoughts about Bookfolio are always welcome!</p>
            <div className="bg-card border border-border rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Get in Touch</h3>
              <p className="mb-4">Reach out on X (Twitter):</p>
              <a href="https://x.com/nikhilbhima" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                @nikhilbhima
              </a>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Looking for</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>New features that would enhance reading tracking experience</li>
              <li>Improvements to existing functionality</li>
              <li>Bug reports or issues encountered</li>
              <li>Design suggestions or UI/UX improvements</li>
              <li>Integration ideas with other book-related services</li>
            </ul>
            <p className="mt-6">Thank you for helping make Bookfolio better! 📚</p>
          </div>
        </div>
      </div>
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">© 2025 Bookfolio. All rights reserved.</div>
      </footer>
    </div>
  );
}
