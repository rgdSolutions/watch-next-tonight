'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const isMobile = useIsMobileScreenWidth();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: (failureCount, error: any) => {
              // Don't retry on 404s
              if (error?.status === 404 || error?.message?.includes('404')) {
                return false;
              }
              // Don't retry on client errors (4xx)
              if (error?.status && error.status >= 400 && error.status < 500) {
                return false;
              }
              // Only retry up to 3 times for other errors (network issues, 5xx, etc)
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {!isMobile && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
