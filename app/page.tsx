import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            Watch Next Tonight
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto hidden sm:block">
            Discover your perfect movie or show from all of your favorite streaming services in
            seconds
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          <Link href="/search" className="group block w-full md:w-96">
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-1 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 h-full">
              <div className="bg-background dark:bg-slate-900 rounded-3xl px-6 sm:px-12 py-8 sm:py-16 border border-purple-500/20 h-full flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-6 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                      Start Searching
                    </p>
                    <p className="text-base text-muted-foreground">
                      Share your location for
                      <br />
                      personalized recommendations
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                    <span className="text-sm">Click to begin</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/trending" className="group block w-full md:w-96">
            <div className="relative bg-gradient-to-br from-orange-600 to-red-600 p-1 rounded-3xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 h-full">
              <div className="bg-background dark:bg-slate-900 rounded-3xl px-6 sm:px-12 py-8 sm:py-16 border border-orange-500/20 h-full flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-6 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44.35 2.18-1.39 1.38-1.95c-.69-.48-1.94-.48-2.63 0c-.79.56-.06 2.3 1.25 1.95z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 transition-all">
                      Trending Now
                    </p>
                    <p className="text-base text-muted-foreground">
                      In a hurry? See what&apos;s
                      <br />
                      hot globally right now
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
                    <span className="text-sm">Quick pick</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden justify-center gap-8 text-muted-foreground text-sm sm:flex">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Personalized Recommendations</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>All Streaming Platforms</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span>Quick & Easy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
