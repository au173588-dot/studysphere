# StudySphere — Learning Resource Discovery Platform

> **"Your Goals. Our Resources."** — *Study smarter, not harder.*

StudySphere is a full-stack Next.js + TypeScript + Tailwind CSS educational resource discovery platform designed to help secondary students, university learners, self-taught programmers, exam candidates, and lifelong learners find verified free educational materials in one unified workspace.

---

## Key Features

- **Unified Search & Autocomplete**: Prominent rounded search bar with instant suggestions, recent search history, example chips, keyboard shortcut (`⌘K` / `Ctrl+K` / `/`), and URL-shareable query parameters.
- **Multi-Faceted Filter Engine**: Filter across Subject, Resource Format (`video`, `course`, `pdf`, `documentation`, `interactive`, `book`, `article`), Source Website, Difficulty Level, Duration, Language, Publication Year, and Verified Free/Open-Access status.
- **Modular Source-Adapter Architecture (`src/lib/adapters/`)**:
  - **Verified Curated Index (`src/data/resources.ts`)**: Hand-verified courses, open textbooks, interactive labs, and official documentation from MIT OpenCourseWare, OpenStax (Rice University), MDN Web Docs, freeCodeCamp, Khan Academy, Harvard CS50, Python.org, CU Boulder PhET, and leading educational video playlists.
  - **Wikipedia Live Adapter**: Queries the official Wikimedia MediaWiki API with server-side caching and polite `User-Agent` headers.
  - **Open Library / Internet Archive Live Adapter**: Queries the official Open Library JSON Search & Works APIs.
  - **arXiv Live Adapter**: Queries Cornell University’s official arXiv Open-Access API for STEM papers and lecture notes.
  - **YouTube Data API v3 Adapter**: Queries YouTube’s official Education category (`videoCategoryId=27`) when `YOUTUBE_API_KEY` is provided in `.env.local`; displays an honest setup status notice otherwise (never scrapes HTML).
- **Curated Learning Paths & Progress Tracking (`/tutorials`)**: Six structured self-study roadmaps with learning objectives, step-by-step practice milestones, and persistent progress tracking.
- **Bookmarks & Study Collections (`/saved`)**: Save resources into custom folders, attach personal study notes, and export your reading list as Markdown. Works immediately in `localStorage` for guests and syncs to the backend when signed in.
- **Optional Secure Authentication & Privacy Controls (`/account`)**: Server-side `crypto.scrypt` password hashing with unique salts, signed `HttpOnly` session cookies, password reset tokens, study interest customization, and one-click local history clearing.
- **Validated Contact & Digest Backend (`/api/contact`, `/api/newsletter`)**: Server-side validation, rate limiting, honeypot spam protection, persistent server storage (`data/store.json`), and optional external forwarding via Resend (`RESEND_API_KEY`).

---

## Project Architecture

```text
├── public/images/                 # Hero carousel educational illustrations
├── src/
│   ├── config/site.ts             # Central brand name, colors, contact & monetization toggles
│   ├── types/index.ts             # Shared TypeScript interfaces
│   ├── data/
│   │   ├── subjects.ts            # 15 subject categories (11 home + extended directory)
│   │   ├── sources.ts             # Trusted educational providers & license metadata
│   │   ├── resources.ts           # Verified curated educational resource records
│   │   └── learningPaths.ts       # 6 structured step-by-step tutorial paths
│   ├── lib/
│   │   ├── search.ts              # Relevance scoring, multi-filter engine & recommendations
│   │   ├── auth.ts                # scrypt password hashing & HMAC HttpOnly sessions
│   │   ├── serverStore.ts         # Persistent JSON backend store (/data/store.json)
│   │   └── adapters/              # Wikipedia, Open Library, arXiv & YouTube API adapters
│   ├── context/
│   │   └── StudySphereContext.tsx # Bookmarks, collections, progress & auth sync provider
│   ├── components/
│   │   ├── layout/                # Header (with Cmd+K search & mobile nav) + Footer
│   │   ├── home/                  # Ordered homepage sections (Search -> Hero -> Subjects -> ...)
│   │   ├── explore/               # Advanced FilterPanel & ExploreClient
│   │   ├── resources/             # ResourceCard, ResourceThumbnail, BookmarkButton, DetailsView
│   │   ├── subjects/              # Complete SubjectDirectoryClient
│   │   ├── tutorials/             # Interactive LearningPathDetailClient
│   │   ├── saved/                 # SavedResourcesClient & Markdown exporter
│   │   ├── account/               # Auth forms, study interests & privacy controls
│   │   └── contact/               # Validated ContactForm
│   └── app/                       # Next.js App Router pages, API routes, sitemap & robots
```

---

## Quick Start (Local Development)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables (optional)**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` if you want to set a custom `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `YOUTUBE_API_KEY`, or `RESEND_API_KEY`. The platform runs out of the box without external API keys.

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

4. **Typecheck & Production Build**
   ```bash
   npm run typecheck
   npm run build
   npm start
   ```

---

## Customizing Brand, Content & Integrations

1. **Branding & Contact Info**: Edit `src/config/site.ts` to update `brandName`, `tagline`, `mainHeadline`, `colors`, `contact.supportEmail`, `socialLinks`, and ethical monetization slot toggles.
2. **Adding Curated Resources**: Append verified entries to `CURATED_RESOURCES` in `src/data/resources.ts`. Subject counts update automatically.
3. **Enabling Live YouTube Search**: Obtain a YouTube Data API v3 key in Google Cloud Console and set `YOUTUBE_API_KEY=your_key` in `.env.local` (never prefix with `NEXT_PUBLIC_`).
4. **Enabling Email Delivery for Contact Form**: Add `RESEND_API_KEY` and `CONTACT_NOTIFICATION_EMAIL` in `.env.local`.
5. **Production Database Upgrade (Optional)**: For serverless deployments such as Vercel where local disk (`data/store.json`) is ephemeral, swap `readDatabase` / `writeDatabase` in `src/lib/serverStore.ts` to PostgreSQL / Supabase while keeping all API routes and frontend components unchanged.

---

## Deployment (Vercel / Node Server)

1. Push this repository to GitHub / GitLab.
2. Import into **Vercel** (Framework Preset: **Next.js**).
3. Add environment variables in Project Settings (`NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET`, and optional `YOUTUBE_API_KEY` / `RESEND_API_KEY`).
4. Deploy—`sitemap.xml`, `robots.txt`, OpenGraph tags, and API routes work automatically.
