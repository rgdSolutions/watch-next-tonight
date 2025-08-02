# Watch Next Tonight 🎬

A modern movie and TV show recommendation app built with Next.js 15, helping you find the perfect content to watch based on your location, genre preferences, and recency choices.

## 🚀 Features

- **Multi-step Wizard Interface**: Intuitive flow guiding users through preferences
- **Location-based Recommendations**: Content filtered by available streaming services in your country
- **Genre Selection**: Choose from 20+ genres including movies and TV shows
- **Recency Filters**: Find content from brand new releases to classic favorites
- **Real-time Data**: Powered by The Movie Database (TMDB) API
- **Streaming Platform Integration**: Shows where content is available (Netflix, Disney+, etc.)
- **Responsive Design**: Beautiful UI that works on all devices
- **Loading Animations**: Smooth transitions between steps
- **Error Handling**: Graceful fallbacks and error boundaries

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.4](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [React Query (TanStack Query)](https://tanstack.com/query)
- **API**: [TMDB API](https://www.themoviedb.org/documentation/api) with proxy routes
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Analytics**: Vercel Analytics & Speed Insights

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- TMDB API key (get one [here](https://www.themoviedb.org/settings/api))

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/watch-next-tonight.git
   cd watch-next-tonight
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
npm run checks       # Run all checks (types, format, lint, tests)

# Testing
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate test coverage report
```

## 🏗️ Project Structure

```
watch-next-tonight/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API proxy routes for TMDB
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page with wizard flow
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── location-step.tsx # Location selection
│   ├── genre-step.tsx    # Genre selection
│   ├── recency-step.tsx  # Recency preference
│   └── content-display-with-query.tsx # Results display
├── hooks/                # Custom React hooks
│   ├── use-tmdb.ts      # TMDB API hooks
│   └── use-unified-genres.ts # Genre mapping hooks
├── lib/                  # Utility functions and data
│   ├── tmdb-client.ts   # TMDB API client
│   ├── country-codes.ts # Country data
│   └── streaming-providers.ts # Platform mappings
├── providers/           # React context providers
├── types/              # TypeScript type definitions
└── tests/             # Test configuration and utilities
```

## 🎯 Core Features Explained

### 1. Location Step

Users select their country to ensure recommendations are available in their region.

### 2. Genre Selection

Choose from a unified list of genres that maps to both movie and TV show categories:

- Action & Adventure
- Comedy
- Drama
- Horror & Thriller
- Science Fiction & Fantasy
- And many more...

### 3. Recency Preferences

Filter content by release date:

- **Brand New**: Released in the last 3 months
- **Very Recent**: Last 6 months
- **Recent**: Last year
- **Contemporary**: Last 5 years
- **Any Time**: All content

### 4. Smart Recommendations

The app uses TMDB's discover API to find content matching all preferences, with fallback strategies for better results.

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

Test files are located alongside components in `__tests__` directories.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Environment Variables

| Variable       | Description       | Required |
| -------------- | ----------------- | -------- |
| `TMDB_API_KEY` | Your TMDB API key | Yes      |

### Customization

- **Themes**: Modify `app/globals.css` for color schemes
- **Components**: All UI components are in `components/ui/`
- **Genres**: Update `lib/unified-genres.ts` for genre mappings
- **Providers**: Modify `lib/streaming-providers.ts` for platform data

### Development Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all checks pass (`npm run checks`)

## 📝 License

This project is proprietary and confidential. All rights reserved.

**No Permission Granted**: This codebase is not open source. No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software. The code is provided for viewing purposes only.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the comprehensive movie/TV database
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for hosting and analytics

## 📞 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/yourusername/watch-next-tonight/issues) page.

---

Built with ❤️ by Ricardo D'Alessandro
