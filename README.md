# Bookfolio

**Your BookShelf, Beautifully Online.**

A modern web app for tracking your reading journey and sharing your book collection with the world.

**Live at [bookfolio.me](https://www.bookfolio.me)**

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

## Features

- **Track Your Books** - Organize books by reading status (reading, completed, to-read)
- **Public Profiles** - Share your collection via a unique profile URL
- **Smart Search** - Find books using Google Books and OpenLibrary APIs
- **Drag & Drop** - Reorder your collection (desktop: click & drag, mobile: hold & drag)
- **Dark/Light Mode** - Automatic theme switching with manual override
- **PWA Support** - Install on iOS and Android for native app experience
- **Responsive Design** - Works beautifully on all devices

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| State | Zustand |
| Deployment | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account ([create one free](https://supabase.com))
- Google Books API key (optional, for enhanced search)

### Installation

```bash
git clone https://github.com/nikhilbhima/bookfolio.git
cd bookfolio
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### Database Setup

Create these tables in your Supabase dashboard:

<details>
<summary>profiles table</summary>

```sql
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  username text unique not null,
  name text,
  bio text,
  profile_photo text,
  favorite_genres text[],
  social_links jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
</details>

<details>
<summary>books table</summary>

```sql
create table books (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  author text not null,
  cover text,
  genre text,
  rating integer,
  status text not null,
  notes text,
  pages integer,
  date_started date,
  date_finished date,
  custom_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
</details>

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bookfolio/
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   └── [username]/        # Public profile pages (SSR)
├── components/            # React components
├── lib/                   # Database, store, utilities
└── public/               # Static assets
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to help.

## Security

- Row Level Security (RLS) enabled in Supabase
- Server-side authentication checks
- Environment variables for sensitive data
- HTTPS enforced in production

## License

MIT License - feel free to use this project for learning or building your own book tracking app.

## Author

**Nikhil Bhima**
- [Twitter/X](https://x.com/nikhilbhima)
- [GitHub](https://github.com/nikhilbhima)
