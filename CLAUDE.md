# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Watch Next Tonight" application - a movie/TV show recommendation app built with Next.js 15 using the App Router pattern. The app guides users through a multi-step process to recommend content from various streaming platforms, using real data from the TMDB API. It also includes an MDX-powered blog (40+ articles) for SEO/content marketing.

## Tech Stack

- **Framework**: Next.js 15.5 (App Router, server-side rendering, Turbopack in dev)
- **Language**: TypeScript 5.8 with strict mode
- **UI**: React 19 with Shadcn/ui component library (Radix UI primitives)
- **Styling**: Tailwind CSS with custom theme configuration, next-themes for dark/light mode
- **State**: React hooks, TanStack React Query for server state, localStorage for user preferences
- **Content**: MDX via @next/mdx with remark-frontmatter
- **Forms**: react-hook-form + zod validation
- **Analytics**: Vercel Analytics and Speed Insights

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Lint code (or lint:fix to auto-fix)
npm run lint

# Format with Prettier
npm run format

# Type-check without emitting
npm run type-check

# Run tests (watch mode) / with coverage
npm run test
npm run test:coverage

# Full CI suite: type-check + format + lint:fix + test coverage
npm run checks

# Kill stray dev servers on ports 3000-3002
npm run killall
```

## Architecture

### Key Directories

- `app/`: Next.js App Router pages, layouts, and API routes
- `components/`: Feature components; Shadcn/ui primitives live in `components/ui/`
- `hooks/`: Custom React hooks (TMDB queries, genre lookups, search navigation, mobile detection)
- `lib/`: Utilities (TMDB client, blog parsing, genres, streaming providers, country codes)
- `providers/`: React context providers (React Query provider)
- `types/`: TypeScript type definitions (`types/tmdb.ts`)
- `content/`: MDX content files (blog posts)
- `docs/`: **Important** - Contains additional context, implementation guides, and project documentation. Always check this folder for relevant information before making changes.

### Pages

- `/` - Landing page with hero and CTA into the search wizard
- `/search` - Multi-step recommendation wizard
- `/trending` - Trending content feed
- `/blog` and `/blog/[slug]` - Blog listing and individual posts
- `/about`, `/faq`, `/contact`, `/privacy`, `/terms` - Static/info pages

### Application Flow

1. **Location Step** (`components/location-step.tsx`): User selects viewing location (geolocation supported; country preference saved to localStorage)
2. **Genre Step** (`components/genre-step.tsx`): User selects preferred genres
3. **Recency Step** (`components/recency-step.tsx`): User chooses content recency preference
4. **Results** (`components/content-display-with-query.tsx`): Displays recommended content from TMDB via React Query, with content cards (`components/content-card.tsx`), streaming provider availability (`components/watch-providers.tsx`), and trailers (`components/trailer-modal.tsx`)

### Data Handling

- Real content data from the TMDB API (no mock data)
- TMDB responses are transformed into a unified `MediaItem` format (see `types/tmdb.ts`); adult content is filtered out
- Supports filtering by genre and recency preferences
- Genre normalization across movies/TV in `lib/unified-genres.ts`; streaming provider IDs/names in `lib/streaming-providers.ts`

### Styling Approach

- Tailwind CSS with configuration in `tailwind.config.ts`
- CSS variables for theming defined in `app/globals.css`
- Shadcn/ui components use cn() utility for className merging

## Important Configuration

### Server-Side Features

The app supports full Next.js server-side capabilities:

- API Routes in `app/api/`
- Server Components with async data fetching
- Image optimization enabled (remote patterns for image.tmdb.org and images.unsplash.com)
- Security headers configured in `next.config.mjs`
- Requires Node.js hosting (deployed on Vercel)

### Environment Variables

- `TMDB_READ_ACCESS_TOKEN` (required): TMDB API Bearer token, used server-side only
- `NEXT_PUBLIC_BASE_URL`: Base URL for canonical URLs and OpenGraph metadata
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (optional): Google Analytics / AdSense

See `.env.example` for the template.

### TypeScript

Strict mode is enabled. Path aliases configured:

- `@/*` maps to project root

## API Integration

The app uses The Movie Database (TMDB) API for real content data:

- API proxy route at `/app/api/tmdb/[...path]/route.ts` - keeps the API token server-side and transforms responses into the unified `MediaItem` format
- Geocoding route at `/app/api/geocode/route.ts` - privacy-preserving reverse geocoding (takes lat/lng, returns only a country code)
- Client library at `/lib/tmdb-client.ts`
- React Query for caching and data fetching (cache times range from 5 minutes for search to 24 hours for genre lists)
- Custom hooks in `/hooks/use-tmdb.ts`

## SEO

- Dynamic sitemap (`app/sitemap.ts`) covering static pages and all blog posts
- `app/robots.ts`, PWA manifest, and generated icons
- JSON-LD structured data (WebApplication + Person schemas) in the root layout
- Generated OpenGraph and Twitter card images (`app/opengraph-image.tsx`, `app/twitter-image.tsx`)
- SEO strategy documented in `docs/seo-implementation.md`

## Blog System

The app includes an MDX-powered blog (11 consolidated articles after the June 2026 content cleanup):

- Blog posts are stored as `.mdx` files in `/content/blog/`
- Posts require frontmatter with these properties (each on a single `key: value` line):
  - `title`: Quoted, MAX 50 characters, keyword-first (a `| Watch Next Tonight` suffix is appended automatically by the root layout title template)
  - `publishedAt`: Date in YYYY-MM-DD format
  - `updatedAt`: (optional) YYYY-MM-DD; set whenever an article is substantially revised — feeds sitemap lastModified, OG modifiedTime, and BlogPosting dateModified
  - `summary`: A brief description of the post (always required)
  - `meta_description`: SEO meta description, MAX 150 characters, containing the target keyword
  - `keywords`: Comma-separated REAL search phrases (no invented head terms)
  - `author`: Always set to "Ricardo D'Alessandro"
  - `image`: `/images/blog/###-[first-four-words].jpg` — a square cover; ALSO generate a 1200x630 crop at `/images/blog/og/<same-name>.jpg` (used for OG/Twitter cards via convention in `/app/blog/[slug]/page.tsx`)
- Custom styled MDX components defined in `/mdx-components.tsx`
- Blog utilities and parsers in `/lib/blog.ts` (a malformed post is skipped with a logged error; it does not take down the blog)
- Blog pages at `/app/blog/` (listing) and `/app/blog/[slug]/` (individual posts); RSS feed at `/rss.xml`
- If a post is ever merged/deleted, add a 301 redirect for its slug in `next.config.mjs` (see the `redirects()` map)

**Mandatory Blog System Rules:**

- At least 1,800 words per article (aim for 2,000-3,000), excluding frontmatter
- Use markdown dividers (---) only twice: before and after frontmatter
- No mixing heading hashtags (#) and bold (\*\*) on same line; body headings start at ##
- Import Ricardo component at top: `import { Ricardo } from '@/components/ricardo';`
- End with "## About the Author" heading + `<Ricardo />` component
- A reader-questions section is OPTIONAL: when used, vary the question count (3-6) and the heading wording per post (e.g. "Common Questions", "Things Readers Ask Me") — never the same heading + exactly 4 questions across every post; list-style posts may skip it entirely
- Link to at least 4 other articles internally using RELATIVE paths (`/blog/<slug>`) with descriptive anchor text; verify every linked slug exists
- Include at least 2 EXTERNAL links to authoritative sources actually cited in the text (studies via DOI/Wikipedia, official tool/service sites, primary sources) — naming a source without linking it is not allowed
- Link to the app AT MOST once per article as a one-clause contextual mention with varied phrasing, never in the opening paragraphs, using RELATIVE paths (`/`, `/search`, `/trending`) — never absolute `https://watchnexttonight.com` URLs (those render with target="\_blank"). The full product pitch lives ONLY in the product post (006); do not reuse its phrasing ("tell it your country... how recent you want the content to be") elsewhere
- ONE article per topic/keyword — check existing posts before writing to avoid keyword cannibalization; if a topic is already covered, update that article (and set `updatedAt`) instead of writing a new one
- No film/show recommended as an example in more than 2 posts across the blog; no two posts may share an opening scene or anecdote

**Content Integrity Rules (AdSense/quality — non-negotiable):**

- Name real, verifiable films/TV shows (10+ per article where the topic allows) with accurate years/platforms; never invent titles or details
- NO fabricated statistics, NO invented user testimonials or metrics, NO "studies show" without a real named source (e.g., Barry Schwartz's The Paradox of Choice, the Iyengar & Lepper jam study, Zillmann's mood management theory, the Netflix Technology Blog)
- Hypothetical examples must read as hypothetical ("imagine...") — never present invented personas as real users or case studies
- Only describe app features that actually exist (no accounts, no taste-learning, no streaming-account linking — it's a stateless wizard over TMDB data)
- Avoid claiming current streaming availability for specific titles (it changes); name the original network/distributor or hedge with "at the time of writing"

**Style Rules (anti-template):**

- Warm, conversational, first-person where natural (the author built the app and is a developer)
- VARY the article structure — do not reuse the same skeleton across posts (no recurring "Your Challenge This Week/Month" sections); some posts should be list-led, some essay-led, some table/numbers-led
- Avoid AI-writing tells: no "isn't just X — it's Y", no negative parallelism ("not X; it's Y"), no stacked three-item poetic lists, no empty aphorisms, don't end every section on a polished aphorism
- Do NOT end the article on a balanced aphorism or an app plug — most posts should close on a plain, concrete final sentence; at most 2-3 posts blog-wide may end on an aphorism
- Vary internal-link transitions: never use the "I've written before/more about X in [link]" stem — prefer inline anchors mid-sentence; no transition phrasing should repeat across posts
- The "I built Watch Next Tonight" credential may appear verbatim in at most 2-3 posts; elsewhere vary or omit it (many posts need no credential at all)
- Don't reuse distinctive phrases across posts ("remains the gold standard", "stateless by design", specific clock times like "10:30 p.m.", "plus practical ways"); before publishing, grep 2-3 of a draft's distinctive phrases against `/content/blog/` and reword collisions
- Vary frontmatter summaries' opening words across posts (no shared "A practical..." openers)
- Don't band the metrics: internal links, word counts, and FAQ question counts should vary naturally between posts rather than hugging the minimums
- Em-dashes and bullet lists: use sparingly and NATURALLY — a few per article is fine; uniform absence across all posts is itself a machine fingerprint
- Never write meta-reassurances like "every pick is real" — demonstrate accuracy, don't declare it
- Demonstrate experience instead of claiming it: prefer a real screenshot (app screenshots live in `/images/blog/screenshots/`, embedded as `<img src="..." alt="..." width={1280} height={800} />` since MDX img maps to next/image), a real list, or a concrete dated detail over "in my experience" assertions
- Concrete over abstract: named titles, named tools, specific mechanics; match the format searchers want (a "save money" query needs numbers, a "best shows" query needs an actual list)

**Quality Checks:**

- Word count 2000+; title ≤50 chars; meta_description ≤150 chars
- Internal link count (4+ relative links, all targets exist)
- Frontmatter completeness; exactly 2 dividers; Ricardo component placement
- Cover image exists at the frontmatter path AND its `/images/blog/og/` 1200x630 variant exists
- No fabricated facts, stats, testimonials, or nonexistent app features

## Testing

- Unit tests with Vitest (jsdom) and React Testing Library
- Run tests: `npm run test` (watch mode) or `npm run test:coverage`
- Tests live in `__tests__/` folders alongside the code (app, components, hooks, lib, providers)
- Coverage thresholds enforced in `vitest.config.ts`: 95% statements/lines, 90% branches/functions
- Husky + lint-staged run checks on commit

## Current Limitations

- No authentication system
- No user profiles (only localStorage-based preferences like country)
