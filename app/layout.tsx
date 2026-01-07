import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { InstallAppBanner } from "@/components/install-app-banner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bookfolio - Track, Organize & Share Your Book Collection Online",
  description: "Track your reading journey, organize your book collection, and share your beautiful bookshelf with the world. A free, modern alternative to Goodreads with personalized profiles.",
  keywords: ["book tracking", "reading tracker", "bookshelf", "book collection", "reading list", "book reviews", "goodreads alternative", "reading journal", "book organizer"],
  metadataBase: new URL('https://bookfolio.me'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bookfolio',
  },
  applicationName: 'Bookfolio',
  authors: [{ name: 'Bookfolio' }],
  creator: 'Bookfolio',
  publisher: 'Bookfolio',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Bookfolio - Track, Organize & Share Your Book Collection Online",
    description: "Track your reading journey, organize your book collection, and share your beautiful bookshelf with the world. A free, modern alternative to Goodreads with personalized profiles.",
    url: 'https://bookfolio.me',
    siteName: 'Bookfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://bookfolio.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bookfolio - Your Bookshelf, Beautifully Online',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bookfolio - Track, Organize & Share Your Book Collection Online",
    description: "Track your reading journey, organize your book collection, and share your beautiful bookshelf with the world. A free, modern alternative to Goodreads.",
    creator: '@nikhilbhima',
    images: ['https://bookfolio.me/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://bookfolio.me',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {/* Skip Navigation Link for Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <InstallAppBanner />
          <main id="main-content">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
