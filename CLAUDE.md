# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Watch Next Tonight" application - a movie/TV show recommendation app built with Next.js 13+ using the App Router pattern. The app guides users through a multi-step process to recommend content from various streaming platforms.

## Tech Stack

- **Framework**: Next.js 13.5.1 (App Router, static export mode)
- **Language**: TypeScript with strict mode
- **UI**: React 18 with Shadcn/ui component library
- **Styling**: Tailwind CSS with custom theme configuration
- **State**: React hooks (useState)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build static site
npm run build

# Lint code
npm run lint

# Start production server (after build)
npm run start
```

## Architecture

### Key Directories

- `app/`: Next.js App Router pages and layouts
- `components/`: React components including UI library from Shadcn/ui
- `lib/`: Utilities and mock data
- `content/`: MDX content files (blog posts)
- `docs/`: **Important** - Contains additional context, implementation guides, and project documentation. Always check this folder for relevant information before making changes.

### Application Flow

1. **Location Step** (`components/location-step.tsx`): User selects viewing location
2. **Genre Step** (`components/genre-step.tsx`): User selects preferred genres
3. **Recency Step** (`components/recency-step.tsx`): User chooses content recency preference
4. **Results** (`components/content-display.tsx`): Displays recommended content from mock data

### Data Handling

- Currently uses mock data from `lib/mock-data.ts`
- Content includes properties: title, year, rating, duration, genres, platforms, images, trailer URL
- Supports filtering by genre and recency preferences

### Styling Approach

- Tailwind CSS with configuration in `tailwind.config.ts`
- CSS variables for theming defined in `app/globals.css`
- Shadcn/ui components use cn() utility for className merging

## Important Configuration

### Server-Side Features

The app now supports full Next.js server-side capabilities:

- API Routes can be added in `app/api/`
- Server Components with async data fetching
- Dynamic rendering and middleware support
- Image optimization enabled
- Requires Node.js hosting (Vercel, AWS, etc.)

### TypeScript

Strict mode is enabled. Path aliases configured:

- `@/*` maps to project root

## API Integration

The app uses The Movie Database (TMDB) API for real content data:

- API proxy route at `/app/api/tmdb/[...path]/route.ts`
- Client library at `/lib/tmdb-client.ts`
- React Query for caching and data fetching
- Custom hooks in `/hooks/use-tmdb.ts`

## Blog System

The app includes an MDX-powered blog:

- Blog posts are stored as `.mdx` files in `/content/blog/`
- Posts require frontmatter with ALL properties mandatory:
  - `title`: The blog post title
  - `publishedAt`: Date in YYYY-MM-DD format (use the date the article is generated)
  - `summary`: A brief description of the post (always required)
  - `author`: Always set to "Ricardo D'Alessandro"
  - `image`: URL or path to cover image (generate with AI for every post)
- Custom styled MDX components defined in `/mdx-components.tsx`
- Blog utilities and parsers in `/lib/blog.ts`
- Blog pages at `/app/blog/` (listing) and `/app/blog/[slug]/` (individual posts)

## Testing

- Unit tests with Vitest and React Testing Library
- Run tests: `npm run test`
- Test coverage: `npm run test:coverage`
- Tests include API routes, components, and React Query hooks

## Current Limitations

- No authentication system
- No user profiles or saved preferences
- Watch provider data not yet integrated
