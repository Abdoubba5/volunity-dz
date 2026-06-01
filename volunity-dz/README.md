# Volunity DZ

> **AI-powered volunteering platform connecting Algerian youth with opportunities across the nation.**

## Overview

Volunity DZ is a full-stack Next.js 14 SaaS application that connects volunteers with associations, events, and social initiatives throughout Algeria. Built with cutting-edge web technologies, it offers real-time updates, AI-powered recommendations, gamification, and multilingual support (Arabic, English, French).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5.6 |
| Styling | TailwindCSS 3.4, Glassmorphism design |
| UI | shadcn/ui patterns, Framer Motion animations |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Database | Supabase PostgreSQL (RLS, triggers, functions) |
| Real-time | Supabase Realtime (WebSocket channels) |
| i18n | next-intl (Arabic RTL, English, French) |
| Forms | React Hook Form + Zod validation |
| Deployment | Vercel (serverless + edge) |

## Features

- **Authentication**: Email/password registration, Google OAuth, protected routes
- **Events**: Full CRUD, filtering, search, pagination, real-time participant counts
- **Associations**: Organization profiles, member management, impact tracking
- **Leaderboard**: Top volunteers, associations, and city rankings
- **Badges & Gamification**: 24+ badges across bronze/silver/gold tiers
- **Real-time**: Live notifications, WebSocket subscriptions via Supabase channels
- **Points System**: Automatic points and level-up triggers on attendance
- **AI Recommendations**: Event suggestions based on location and history
- **Multilingual**: Arabic (RTL, default), English, French
- **PWA-ready**: Manifest, offline-capable design, mobile-first
- **Dark/Light**: Theme via next-themes with system preference detection

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier sufficient)
- A Vercel account (for deployment)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/volunity-dz.git
cd volunity-dz

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your Supabase project details:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup

1. Go to your Supabase dashboard > SQL Editor
2. Paste and run the contents of `supabase/migrations/00001_schema.sql`
3. Paste and run `supabase/migrations/00002_seed.sql` (optional demo data)

### Development

```bash
npm run dev
```

Open http://localhost:3000 — the app defaults to Arabic (RTL).

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/           # Internationalized routes
│   │   ├── (auth)/         # Login, register (guest-only)
│   │   ├── (main)/         # Events, associations, leaderboard, profile
│   │   ├── dashboard/      # Protected dashboard
│   │   └── page.tsx        # Landing page
│   ├── api/                # API routes (auth callback, etc.)
│   ├── error.tsx           # Global error boundary
│   ├── loading.tsx         # Global loading state
│   ├── not-found.tsx       # 404 page
│   └── layout.tsx          # Root layout with SEO, fonts, providers
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── glass-card.tsx      # Glassmorphism card
│   ├── navbar.tsx          # Auth-aware navigation
│   ├── empty-state.tsx     # Empty/no-results/error states
│   ├── skeletons.tsx       # Loading skeleton components
│   └── auth-components.tsx # ProtectedRoute, GuestRoute
├── hooks/                  # React hooks
│   ├── use-events.ts       # Events + real-time subscriptions
│   ├── use-notifications.ts # Notifications + real-time
│   └── use-auth.ts         # Auth convenience wrapper
├── lib/                    # Utilities & services
│   ├── supabase/           # Client/server/middleware factories
│   ├── services/           # Domain service factories
│   ├── auth-context.tsx     # AuthProvider with full auth state
│   └── database.types.ts   # TypeScript database types
├── i18n/                   # Internationalization
│   ├── config.ts           # Locale config (ar, en, fr)
│   ├── request.ts          # next-intl request handler
│   └── messages/           # Translation JSON files
├── middleware.ts           # Auth + i18n + security headers
└── types/                  # TypeScript type definitions
```

## Database Schema

8 tables with Row-Level Security, triggers, and indexes:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `events` | Volunteering events (Algerian cities) |
| `event_participants` | Many-to-many join table |
| `associations` | Organization profiles |
| `association_members` | Organization membership |
| `badges` | Badge definitions (24 badges) |
| `user_badges` | Earned badges join table |
| `notifications` | Per-user notifications |

Triggers handle: auto-profile creation, participant count sync, points awarding, level-up calculation, badge-earned notifications, event update notifications, and timestamp management.

## API & Services

Each domain exposes a factory function via `src/lib/services/`:

- **Profile Service**: `getProfile`, `updateProfile`, `searchProfiles`, `getTopVolunteers`
- **Event Service**: Full CRUD, filtering, pagination, `joinEvent`, `leaveEvent`, `markAttendance`
- **Association Service**: CRUD, member management, verification
- **Notification Service**: CRUD, `getUnreadCount`, `markAllAsRead`, real-time subscription
- **Badge Service**: `getAllBadges`, `getUserBadges`, `checkAndAwardBadges`
- **Leaderboard Service**: `getTopVolunteers`, `getVolunteerRank`, `getTopCities`
- **Dashboard Service**: `getStats`, `getRecentActivity`, `getUpcomingEvents`, `getAIRecommendations`

## Authentication Flow

```
Register/Login → supabase.auth.signUp/signIn → DB trigger auto-creates profile
    → Cookie set by Supabase → Middleware refreshes session on each request
    → AuthProvider picks up session via onAuthStateChange
    → Profile loaded → Dashboard rendered
```

- Profiles are auto-created by a PostgreSQL trigger on `auth.users` insert
- Google OAuth via `signInWithOAuth` with `redirectTo` callback
- Protected routes redirect to login with `?redirect=` param for post-auth return

## Deployment to Vercel

### One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

1. Push your repository to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set to `https://your-domain.vercel.app`
4. Deploy — the `vercel.json` and `next.config.js` are pre-configured

### Post-Deployment

- Update `robots.txt` with your production domain
- Enable Supabase email confirmation (optional)
- Configure custom domain in Vercel dashboard

## Performance

- Static Generation (SSG) for immutable pages
- Font subsetting with `display: swap`
- Image optimization via `next/image` (WebP/AVIF)
- SWC compiler with `removeConsole` in production
- React strict mode for development safety
- Lazy-loaded components with dynamic imports
- PWA-ready with manifest.json and service-worker scope

## Security

- Row-Level Security (RLS) on all 8 tables
- HTTP security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Referrer-Policy: `strict-origin-when-cross-origin`
- Supabase anon key with RLS (no service_role key)
- Middleware-based route protection
- Input validation via Zod schemas
- No secrets in client code

## License

Private — All rights reserved.
