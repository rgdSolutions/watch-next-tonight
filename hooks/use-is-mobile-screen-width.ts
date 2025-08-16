import { useEffect, useState } from 'react';

/**
 * React hook for mobile detection with automatic updates
 */
export const useIsMobileScreenWidth = (): boolean => {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < MOBILE_BREAKPOINT_PX;
  });

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mobile;
};

const MOBILE_BREAKPOINT_PX = 640;
