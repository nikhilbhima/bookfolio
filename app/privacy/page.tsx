import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Information Collected</h2>
              <p>
                When creating an account on Bookfolio, information provided includes email address, username, and any profile information chosen to add. Information about books added to collections and reading preferences is also collected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">How Information is Used</h2>
              <p className="mb-2">Collected information is used to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and maintain Bookfolio accounts</li>
                <li>Display book collections on public profiles</li>
                <li>Send important updates about the service</li>
                <li>Improve the platform and develop new features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Data Sharing</h2>
              <p>
                Personal information is not sold. Profile information and book collections are only visible to others if profiles are set to public. Supabase is used for data storage and Google for authentication, both of which have their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">User Rights</h2>
              <p>
                Users have the right to access, update, or delete personal information at any time through account settings. Data copies can be requested or accounts can be permanently deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                Essential cookies are used to maintain sessions and provide authentication. These cookies are necessary for the service to function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                Questions about this Privacy Policy can be directed to{" "}
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
                <strong>Last updated:</strong> December 2025
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
