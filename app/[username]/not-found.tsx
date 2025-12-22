import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/public-nav";

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-4xl font-serif font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-md">
          The bookshelf you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Create Your Bookfolio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
