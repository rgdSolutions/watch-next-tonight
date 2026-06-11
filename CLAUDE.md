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

The app includes an MDX-powered blog:

- Blog posts are stored as `.mdx` files in `/content/blog/`
- Posts require frontmatter with ALL properties mandatory:
  - `title`: The blog post title
  - `publishedAt`: Date in YYYY-MM-DD format (use the date the article is generated)
  - `summary`: A brief description of the post (always required)
  - `meta_description`: SEO meta description for the post
  - `keywords`: Comma-separated keywords for SEO
  - `author`: Always set to "Ricardo D'Alessandro"
  - `image`: URL or path to cover image in the format ###-titles-first-four-words.png
- Custom styled MDX components defined in `/mdx-components.tsx`
- Blog utilities and parsers in `/lib/blog.ts`
- Blog pages at `/app/blog/` (listing) and `/app/blog/[slug]/` (individual posts)
- Only use markdown dividers (---) twice per blog; just before and just after the frontmatter properties
- Do not mix markdown headings prefixed with hashtags (#) and markdown bold (\*\*) on the same line
- Each blog article should be at least 2000 words (excluding the frontmatter data).
- All blog articles end with an "## About the Author" heading followed by the `<Ricardo />` component (defined in `/components/ricardo.tsx)
- Each article needs to internally link to at least 4 other articles

**Mandatory Blog System Rules:**

- All frontmatter fields required: title, publishedAt (YYYY-MM-DD), summary, meta_description, keywords, author ("Ricardo D'Alessandro"), image (###-titles-first-four-words.png format)
- At least 2000 words per article (excluding frontmatter)
- Use markdown dividers (---) only twice: before and after frontmatter
- No mixing heading hashtags (#) and bold (\*\*) on same line
- Import Ricardo component at top
- End with "## About the Author" heading + `<Ricardo />` component
- Link to at least 4 other articles internally
- Use paragraph-content slightly more than list-content, but do use list-content occasionally

**Style Patterns Observed:**

- Warm, empathetic, conversational tone with "you" address
- Opening hook with relatable scenario
- Mix of practical advice (lists) and philosophical reflection (longer paragraphs)
- Case studies/vignettes
- FAQ section (4 questions)
- Multiple clear section headings
- Rich, textured language in reflective sections
- Internal links to watchnexttonight.com and other blog articles

**For Each Article:**

1. Create engaging opening hook (relatable scenario)
2. Write 2000+ words with sections:
   - Problem statement
   - Practical strategies (mix lists and paragraphs, favor paragraphs)
   - Case studies/vignettes
   - Deeper philosophical reflections
   - FAQ section (4 or more questions)
   - Challenge/call-to-action
3. Link to 4+ other articles from existing or new set
4. Place CTA to Watch Next Tonight naturally in content
5. End with "## About the Author" + Ricardo component
6. Ensure proper frontmatter with today's date
7. Image path: /images/blog/###-[first-four-words].png

**Quality Checks:**

- Word count verification (2000+ words)
- Internal link count (4+ links)
- Endure all links are valid and there are no broken links
- Frontmatter completeness
- Ricardo component placement
- Markdown divider usage (exactly 2)
- No mixed heading/bold on same line
- Paragraph/list balance (favor paragraphs)

## Testing

- Unit tests with Vitest (jsdom) and React Testing Library
- Run tests: `npm run test` (watch mode) or `npm run test:coverage`
- Tests live in `__tests__/` folders alongside the code (app, components, hooks, lib, providers)
- Coverage thresholds enforced in `vitest.config.ts`: 95% statements/lines, 90% branches/functions
- Husky + lint-staged run checks on commit

## Current Limitations

- No authentication system
- No user profiles (only localStorage-based preferences like country)
