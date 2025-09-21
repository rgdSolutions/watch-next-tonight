'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';
import { cn } from '@/lib/utils';

export const ScrollToTop = () => {
  const isMobile = useIsMobileScreenWidth();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle scroll visibility for back to top button
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear existing timeout
      clearTimeout(timeoutId);

      // Throttle scroll events for performance
      timeoutId = setTimeout(() => {
        setShowBackToTop(window.scrollY > 400);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <button
      onClick={handleScrollToTop}
      className={cn(
        'fixed z-50 rounded-md border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-md hover:shadow-lg',
        isMobile && 'bottom-14 right-2',
        !isMobile && 'bottom-4 right-4',
        // Visibility transitions
        showBackToTop
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      )}
      aria-label="Scroll to top"
      role="button"
      tabIndex={showBackToTop ? 0 : -1}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};
