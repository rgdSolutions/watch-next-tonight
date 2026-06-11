'use client';

import { Moon, Sun } from 'lucide-react';
import * as React from 'react';

import { useTheme } from '@/components/theme-provider';
import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const isMobile = useIsMobileScreenWidth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'fixed z-50 rounded-full border border-keyline bg-background/70 p-2 text-primary backdrop-blur supports-[backdrop-filter]:bg-background/55 hover:border-keyline-bright hover:bg-primary/10 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-200 shadow-md',
        isMobile && 'bottom-2 right-2',
        !isMobile && 'top-20 right-4'
      )}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
