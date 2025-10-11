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

- Unit tests with Vitest and React Testing Library
- Run tests: `npm run test`
- Test coverage: `npm run test:coverage`
- Tests include API routes, components, and React Query hooks

## Current Limitations

- No authentication system
- No user profiles or saved preferences
- Watch provider data not yet integrated
