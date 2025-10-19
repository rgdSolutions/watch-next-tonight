'use client';

import { useSearchNavigation } from '@/hooks/use-search-navigation';

export function SearchButton() {
  const { navigateToSearch } = useSearchNavigation();

  return (
    <button
      onClick={navigateToSearch}
      className="group block w-full md:w-96 appearance-none border-none bg-transparent p-0 m-0 cursor-pointer text-left"
    >
      <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-1 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 h-full">
        <div className="bg-background dark:bg-slate-900 rounded-3xl px-6 sm:px-12 py-6 sm:py-16 border border-purple-500/20 h-full flex flex-col justify-center items-center">
          <div className="space-y-3 sm:space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3 sm:p-6 mx-auto w-fit group-hover:scale-110 transition-transform">
              <svg
                className="w-10 sm:w-16 h-10 sm:h-16 text-white"
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
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all text-center">
                Start Searching
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground text-center">
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
    </button>
  );
}
