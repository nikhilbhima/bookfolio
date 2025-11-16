import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Acceptance of Terms</h2>
              <p>
                By accessing and using Bookfolio, users agree to be bound by these Terms of Use. If there is disagreement with any part of these terms, the service should not be used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">User Accounts</h2>
              <p className="mb-2">When creating an account, users agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of account credentials</li>
                <li>Not share accounts with others</li>
                <li>Report any unauthorized access immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Acceptable Use</h2>
              <p className="mb-2">Users agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Upload malicious code or attempt to compromise systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate others or misrepresent affiliations</li>
                <li>Scrape or copy content without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Content Ownership</h2>
              <p>
                Users retain ownership of content posted on Bookfolio, including book reviews and notes. By making profiles public, permission is granted to display this content on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Service Availability</h2>
              <p>
                Efforts are made to keep Bookfolio available at all times, but uninterrupted access is not guaranteed. The service may be modified, suspended, or discontinued at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Termination</h2>
              <p>
                Accounts may be suspended or terminated if these terms are violated or if behavior harms the service or other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>
                Bookfolio is provided as-is without warranties of any kind. No liability is accepted for any damages arising from use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Changes to Terms</h2>
              <p>
                These terms may be updated from time to time. Users will be notified of significant changes through email or a notice on the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                Questions about these terms can be directed to{" "}
                <a
                  href="https://x.com/nikhilbhima"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Twitter/X
                </a>.
              </p>
            </section>

            <section>
              <p className="text-sm">
                <strong>Last updated:</strong> November 2025
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Bookfolio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
