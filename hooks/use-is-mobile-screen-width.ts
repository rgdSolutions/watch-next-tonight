import { useEffect, useState } from 'react';

/**
 * React hook for mobile detection with automatic updates
 */
export const useIsMobileScreenWidth = (): boolean => {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth < 640;
  });

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mobile;
};
