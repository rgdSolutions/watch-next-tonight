import type { CSSProperties } from 'react';

import Link from 'next/link';

import { SearchButton } from '@/components/search-button';

// Static page - no revalidation needed
export const revalidate = false;

/**
 * "After Hours" hero ambience: out-of-focus poster shapes drifting in a dark
 * lounge. Layout/size/gradient per tile; the slow drift animation is gated
 * behind prefers-reduced-motion in the <style> tag below.
 */
const POSTER_TILES: Array<{
  left: string;
  top: string;
  width: string;
  height: string;
  gradient: string;
  drift: string;
}> = [
  {
    left: '3%',
    top: '6%',
    width: '18%',
    height: '46%',
    gradient: 'linear-gradient(160deg, #c97b3a, #5e2a17 70%)',
    drift: 'lp-drift-a 46s ease-in-out infinite alternate',
  },
  {
    left: '24%',
    top: '38%',
    width: '14%',
    height: '38%',
    gradient: 'linear-gradient(200deg, #1d5e57, #0a2e33 75%)',
    drift: 'lp-drift-b 52s ease-in-out infinite alternate',
  },
  {
    left: '41%',
    top: '2%',
    width: '16%',
    height: '44%',
    gradient: 'linear-gradient(170deg, #7a1f2b, #2b0d14 70%)',
    drift: 'lp-drift-a 58s 4s ease-in-out infinite alternate-reverse',
  },
  {
    left: '58%',
    top: '42%',
    width: '13%',
    height: '36%',
    gradient: 'linear-gradient(150deg, #2e7d9e, #0e2c44 75%)',
    drift: 'lp-drift-b 49s 2s ease-in-out infinite alternate',
  },
  {
    left: '74%',
    top: '8%',
    width: '17%',
    height: '48%',
    gradient: 'linear-gradient(190deg, #b9923c, #4a3210 72%)',
    drift: 'lp-drift-a 55s 1s ease-in-out infinite alternate',
  },
  {
    left: '88%',
    top: '50%',
    width: '12%',
    height: '32%',
    gradient: 'linear-gradient(160deg, #3c8d6e, #10342a 75%)',
    drift: 'lp-drift-b 44s 3s ease-in-out infinite alternate-reverse',
  },
  {
    left: '12%',
    top: '58%',
    width: '12%',
    height: '30%',
    gradient: 'linear-gradient(175deg, #9e3b2e, #33100c 75%)',
    drift: 'lp-drift-a 60s 5s ease-in-out infinite alternate',
  },
  {
    left: '48%',
    top: '60%',
    width: '11%',
    height: '30%',
    gradient: 'linear-gradient(185deg, #23677d, #0a2330 75%)',
    drift: 'lp-drift-b 57s 6s ease-in-out infinite alternate',
  },
];

export default function LandingPage() {
  return (
    <div className="relative isolate overflow-hidden flex-1 flex items-center justify-center px-4 py-0 sm:py-4">
      <style>{`
        .lp-tile { animation: none; }
        @media (prefers-reduced-motion: no-preference) {
          .lp-tile { animation: var(--lp-drift); }
          @keyframes lp-drift-a {
            from { transform: translate3d(0, 0, 0) rotate(-1.5deg); }
            to { transform: translate3d(3.5%, 6%, 0) rotate(1.5deg); }
          }
          @keyframes lp-drift-b {
            from { transform: translate3d(0, 0, 0) rotate(2deg); }
            to { transform: translate3d(-4%, -5%, 0) rotate(-1deg); }
          }
        }
      `}</style>

      {/* Drifting blurred poster wall */}
      <div aria-hidden="true" className="absolute -z-20" style={{ inset: '-10%' }}>
        {POSTER_TILES.map((tile, index) => (
          <span
            key={index}
            className="lp-tile absolute block rounded-2xl blur-3xl opacity-25 dark:opacity-50 will-change-transform"
            style={
              {
                left: tile.left,
                top: tile.top,
                width: tile.width,
                height: tile.height,
                backgroundImage: tile.gradient,
                '--lp-drift': tile.drift,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Vignette so the type stays crisp over the poster wall */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(85% 75% at 50% 40%, transparent 0%, hsl(var(--background) / 0.55) 55%, hsl(var(--background) / 0.92) 100%)',
        }}
      />

      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div aria-hidden="true" className="mx-auto h-1 w-16 rounded-full bg-aurora" />
          <h1 className="font-display text-4xl md:text-7xl font-bold text-foreground tracking-tight">
            Watch Next Tonight
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto hidden sm:block">
            Discover your perfect movie or show from all of your favorite streaming services in
            seconds
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          <SearchButton />

          <Link href="/trending" className="group block w-full md:w-96">
            <div className="glass-panel rounded-3xl px-6 sm:px-12 py-6 sm:py-16 h-full flex flex-col justify-center transition-all duration-300 transform hover:scale-105 hover:border-keyline-bright hover:shadow-[0_18px_48px_-12px_var(--glow)]">
              <div className="space-y-3 sm:space-y-6">
                <div className="bg-[hsl(var(--accent)/0.12)] border border-keyline rounded-full p-3 sm:p-6 mx-auto w-fit group-hover:scale-110 transition-transform">
                  <svg
                    className="w-10 sm:w-16 h-10 sm:h-16 text-accent"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44.35 2.18-1.39 1.38-1.95c-.69-.48-1.94-.48-2.63 0c-.79.56-.06 2.3 1.25 1.95z" />
                  </svg>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-accent transition-colors">
                    Trending Now
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    In a hurry? See what&apos;s
                    <br />
                    hot globally right now
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center gap-2 text-accent">
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
          </Link>
        </div>

        <footer className="space-y-4">
          <div className="hidden justify-center text-muted-foreground text-sm sm:flex sm:divide-x sm:divide-keyline">
            <div className="flex items-center gap-2 px-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Personalized Recommendations</span>
            </div>
            <div className="flex items-center gap-2 px-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>20+ Streaming Platforms</span>
            </div>
            <div className="flex items-center gap-2 px-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span>Quick & Easy</span>
            </div>
          </div>
          <div className="border-t border-keyline pt-4 text-center text-xs text-muted-foreground/60 flex flex-wrap justify-center gap-4 sm:gap-8">
            <Link href="/about" className="hover:text-primary hover:underline transition-colors">
              About
            </Link>
            <Link href="/faq" className="hover:text-primary hover:underline transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary hover:underline transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-primary hover:underline transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary hover:underline transition-colors">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
