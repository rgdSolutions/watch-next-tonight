## Introduction

We are building an app where in a few clicks, the user can quickly narrow down a list of suggested movies or tv shows to watch tonight. This means that the movies or tv shows would need to be available tonight in their geographic region and would be of a certain genre that the user would like to watch.

This proposed app has heavy data requirements. We would like you to find, optimize and give us the list of no more than three APIs required to obtain all the data.

## What data is required

- Convert geolocation to country code
- List of movies and tv shows currently available for a given geographic location on Apple TV
- List of movies and tv shows currently available for a given geographic location on Netflix
- List of movies and tv shows currently available for a given geographic location on Prime Video
- List of movies and tv shows currently available for a given geographic location on Disney Plus
- List of movies and tv shows currently available for a given geographic location on MAX
- User ratings for movies and tv shows
- Genres for movies and tv shows
- Year that a movie or the first episode of a tv show was published
- Cover art for movies and tv shows

## Guidance and requirements for APIs to choose

- Free or low cost publically available APIs
- Ability to pay for increased request limits
- Titles of movies and tv shows should be query-able by rating, genre and year

## Results

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

2. Streaming Availability API (Movie of the Night)

- Purpose: Real-time streaming availability across all platforms
- Data provided: Netflix, Prime Video, Disney+, MAX, Apple TV availability by region
- Cost: FREE tier with 100 requests/day
- Key features:
  - Covers 60 countries
  - Deep links to native apps
  - Expiry dates for content
  - Price info for rentals/purchases

3. Watchmode API (Backup option)

- Purpose: Alternative streaming availability if you need higher volume
- Data provided: Same platforms plus 100+ smaller services
- Cost: Low-cost paid tiers (more affordable than enterprise solutions)
- Key features:
  - More comprehensive coverage
  - iOS/Android deep links
  - Free content filtering

4. OMDb API (Optional enhancement)

- Purpose: Additional ratings data (IMDb, Rotten Tomatoes)
- Data provided: IMDb ratings, Metacritic scores, plot summaries
- Cost: FREE tier with 1,000 requests/day
- Key features:
  - Simple REST API
  - Lightweight responses
  - Good for rating validation

Recommended Implementation:

1. Use TMDB as your primary database for all metadata
2. Use Streaming Availability API for real-time platform availability
3. Keep Watchmode as backup if you exceed free limits
4. Add OMDb only if you need additional rating sources

This combination gives you everything needed while staying within free/low-cost
tiers.
