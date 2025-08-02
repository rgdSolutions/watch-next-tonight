## Introduction

We are building an app called "Watch Next Tonight" where in a few clicks, the user can quickly narrow down a list of suggested movies or tv shows to watch tonight. This means that the movies or tv shows would need to be available tonight in the user's geographic region and would be of a certain genre that the user would like to watch.

On site load, the webapp should ask the user permission to obtain their country of location via the web browser. If the user denies permission, we can assume they are in the USA. This way, we have their country.

Next, there should be a user-frienldy way for the user to multiple-choice, multi-select among popular genres, or simply choose the "any genre" answer. The experience of multi-selecting genres should be great UX and a fun, satisfying experience. This way, we have the list of possible genres to choose from.

Next, there should be a user-friendly way for the user to select how recent the movie or show needs to be. Possible options could be:

- Brand New (published in the last 3 months)
- Very Recent (published in the last 18 months)
- Recent (published in the last 5 years)
- Contemporary (published in the last 10 years)
- Classic (published in the last 20 years)
- Any (no restriction on publish date)

This way, we can filter by published date.

Finally, we will make API requests to calculate and narrow down a list movies and tv shows that are available in the geographic region, with the given genre, with the given publish date criteria and sorted by rating. The goal is to obtain at least 5 tv shows and 5 movies per streaming platform from this list:

- Apple TV
- Netflix
- Prime Video
- Disney Plus
- MAX

We will have a list, but will only initially show one movie option and one tv show option per streaming platform (so 10 items in total). They can be the options with the highest ratings for each platform. Each option should be presented with the title, cover art, and a one-click way to see the trailer in a modal.

Lastly, we will want a mechanism to reshuffle options for the user. For example, if there is a backup option for that particular format (tv show or movie) and platform, we can present an optional "X" icon hovering in the top-right corner of the cover art. If the user clicks it, we can bring up the next option (tv show or movie) for that platform replacing 1 of the 10 items on the screen. If there is no runner-up option, the "X" icon button should not be presented. There should also be a CTA button at the bottom of the page labeled "Shuffle Options" that will give all new options for all 10 items. Satisfying and pleasing animations are welcome here, but keeping them minimalist and non-distracting.

# Folder path

Inside this current folder ("\_AIAppInADay") I want you to create a subfolder called "watch-next-tonight" and put all the files inside this folder.

# Authentication

This app will use any authentication.

# APIs to use for data

1. TMDB API (The Movie Database)

- Purpose: Core metadata for movies/TV shows
- Data provided: Ratings, genres, release years, cast, images, and basic streaming
  availability
- Cost: FREE for non-commercial use
- Key features:
  - 40 requests per 10 seconds
  - Includes JustWatch streaming data (with attribution)
  - Comprehensive search by rating, genre, year
  - Multilingual support

2. Nominatim API (OpenStreetMap)

- https://nominatim.org/release-docs/latest/api/Overview/

# Filtering Data

All filtering will be done by the "server" by using valid filtering query paramenters in the API requests. No filtering will be done by the "client".

# Design

- For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.
- All screens and flows should be completely responsive and optimized for both desktop and mobile viewing
- The application should have a global toggle between "dark mode" and "light mode", and therefore all screens and components should be compatible with both themes
- All prompts to get information from the user (location, preferred genres, final choice of what to watch) should be decided with the fewest clicks possible, ideally only one click.
- The UI should be as minimalist as possible with the least amount of elements or distractions

# Infrastructure

- Install ESLint, Prettier, husky and lint-staged
- Configure husky and lint-staged to run ESLint and Prettier on commit

prettier and eslint configurations can have these options:

```
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always"
}
```

# Tech Stack

## Core Technologies

### Web Application Framework

- **Framework:** Next.js
- **Version:** Latest stable
- **Language:** TypeScript

### Database

- No database will be used since all the data will come from existing APIs and will only be stored in memory on the client

## Frontend Stack

### JavaScript Framework

- **Framework:** React
- **Version:** Latest stable
- **Build Tool:** Vite

### Import Strategy

- **Strategy:** Node.js modules using pnpm
- **Package Manager:** pnpm
- **Node Version:** Latest stable

### HTTP Requests

We will want to use @tanstack/react-query to manage and cache all api data

- **Library:** @tanstack/react-query
- **Version:** Latest

### UI Components

- **Library:** @radix-ui
- **Version:** Latest

### Testing

- **Test Runner** vitest
- **Version for Test Runner:** Latest
- **Component Testing Libraries** @testing-library/react @testing-library/dom
- **Version for Component Testing Libraries:** Latest

### Linting and Code Formatting

- **Library:** ESLint
- **Version:** Latest
- **Library:** Prettier
- **Version:** Latest

## Assets & Media

### Fonts

- **Provider:** Whatever is included with @radix-ui
- **Loading Strategy:** Self-hosted for performance

### Icons

- **Library:** Lucide React

# Development Best Practices

## Core Principles

### Keep It Simple

- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones
- User Server Side Rendering (SRR) as much as possible and only utilize the 'use client' directive when necessary

### Optimize for Readability

- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"
- Encapsulate conditionals using the "isSomething" naming convention to make conditionals easier to reason about

### DRY (Don't Repeat Yourself)

- Extract repeated business logic to private methods
- Extract repeated UI markup to reusable components
- Create utility functions for common operations

## Dependencies

### Choose Libraries Wisely

When adding third-party dependencies:

- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation

## Code Organization

### File Structure

- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions

### Testing

- Write tests for new functionality
- Maintain existing test coverage
- Test edge cases and error conditions

# Code Style Guide

## General Formatting

### Indentation

- Use 2 spaces for indentation (never tabs)
- Maintain consistent indentation throughout files
- Align nested structures for readability

### Naming Conventions

- **FolderNames and Filenames**: Use kebab-case (e.g., `user-profile.tsx`)
- **Methods and Variables**: Use cammelCase (e.g., `userProfile`, `calculateTotal`)
- **Classes, Components, Types, Interfaces and Modules**: Use PascalCase (e.g., `UserProfile`, `PaymentProcessor`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

### String Formatting

- Use single quotes for strings: `'Hello World'`
- Use double quotes only for React component props or when the string itself contains single quotes within
- Use template literals for multi-line strings or complex interpolation

## HTML/Template Formatting

### Structure Rules

- Use 2 spaces for indentation
- Place nested elements on new lines with proper indentation
- Content between tags should be on its own line when multi-line

### Attribute Formatting

- Place each HTML attribute on its own line
- Align attributes vertically
- Keep the closing `>` alone on its own line

### Example HTML Structure

```html
<div class="container">
  <header
    class="flex flex-col space-y-2
                 md:flex-row md:space-y-0 md:space-x-4"
  >
    <h1 class="text-primary dark:text-primary-300">Page Title</h1>
    <nav
      class="flex flex-col space-y-2
                md:flex-row md:space-y-0 md:space-x-4"
    >
      <a href="/" class="btn-ghost"> Home </a>
      <a href="/about" class="btn-ghost"> About </a>
    </nav>
  </header>
</div>
```

## Tailwind CSS preferences

### Multi-line CSS classes in markup

- We use a unique multi-line formatting style when writing Tailwind CSS classes in HTML markup and ERB tags, where the classes for each responsive size are written on their own dedicated line.
- The top-most line should be the smallest size (no responsive prefix). Each line below it should be the next responsive size up.
- Each line of CSS classes should be aligned vertically.
- focus and hover classes should be on their own additional dedicated lines.
- We implement one additional responsive breakpoint size called 'xs' which represents 400px.
- If there are any custom CSS classes being used, those should be included at the start of the first line.

**Example of multi-line Tailwind CSS classes:**

<div class="custom-cta bg-gray-50 dark:bg-gray-900 p-4 rounded cursor-pointer w-full
            hover:bg-gray-100 dark:hover:bg-gray-800
            xs:p-6
            sm:p-8 sm:font-medium
            md:p-10 md:text-lg
            lg:p-12 lg:text-xl lg:font-semibold lg:2-3/5
            xl:p-14 xl:text-2xl
            2xl:p-16 2xl:text-3xl 2xl:font-bold 2xl:w-3/4"
>
  I'm a call-to-action!
</div>

## Code Comments

### When to Comment

- Add brief comments above non-obvious business logic
- Document complex algorithms or calculations
- Explain the "why" behind implementation choices

### Comment Maintenance

- Never remove existing comments unless removing the associated code
- Update comments when modifying code to maintain accuracy
- Keep comments concise and relevant

### Comment Format

```typescript
// Calculate compound interest with monthly contributions
// Uses the formula: A = P(1 + r/n)^(nt) + PMT × (((1 + r/n)^(nt) - 1) / (r/n))
const calculate_compound_interest = (principal, rate, time, monthly_payment) => {
  // Implementation here
};
```
