import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QueryProvider } from '../query-provider';

// Mock the useIsMobileScreenWidth hook
vi.mock('@/hooks/use-is-mobile-screen-width', () => ({
  useIsMobileScreenWidth: vi.fn(() => false),
}));

// Mock ReactQueryDevtools
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: vi.fn(() => null),
}));

// Test component that uses React Query
function TestComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { message: 'Test data' };
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  return <div>{data?.message}</div>;
}

describe('QueryProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should provide QueryClient to children', async () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Eventually shows data
    await waitFor(() => {
      expect(screen.getByText('Test data')).toBeInTheDocument();
    });
  });

  it('should use default query options', async () => {
    const queryFn = vi.fn().mockResolvedValue({ data: 'test' });

    function TestOptionsComponent() {
      const { data } = useQuery({
        queryKey: ['test-options'],
        queryFn,
      });

      return <div>{data ? 'Data loaded' : 'No data'}</div>;
    }

    render(
      <QueryProvider>
        <TestOptionsComponent />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });

    // Query function should only be called once due to default options
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('should configure query client with correct default options', async () => {
    let capturedClient!: QueryClient;

    function CaptureClientComponent() {
      const queryClient = useQueryClient();
      capturedClient = queryClient;
      return <div>Client captured</div>;
    }

    render(
      <QueryProvider>
        <CaptureClientComponent />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(capturedClient).toBeDefined();
    });

    const defaults = capturedClient.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(60 * 1000); // 1 minute
    expect(defaults.queries?.gcTime).toBe(5 * 60 * 1000); // 5 minutes
    expect(typeof defaults.queries?.retry).toBe('function'); // retry is now a function
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    function ErrorComponent() {
      const { error } = useQuery({
        queryKey: ['error-test'],
        queryFn: async () => {
          throw new Error('Test error');
        },
        retry: false,
      });

      if (error) return <div>Error occurred: {(error as Error).message}</div>;
      return <div>No error</div>;
    }

    render(
      <QueryProvider>
        <ErrorComponent />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error occurred: Test error')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('should support multiple concurrent queries', async () => {
    function MultiQueryComponent() {
      const query1 = useQuery({
        queryKey: ['multi', 1],
        queryFn: async () => ({ id: 1, name: 'Query 1' }),
      });

      const query2 = useQuery({
        queryKey: ['multi', 2],
        queryFn: async () => ({ id: 2, name: 'Query 2' }),
      });

      const loading = query1.isLoading || query2.isLoading;
      const allLoaded = query1.data && query2.data;

      if (loading) return <div>Loading queries...</div>;
      if (allLoaded) {
        return (
          <div>
            <div>{query1.data.name}</div>
            <div>{query2.data.name}</div>
          </div>
        );
      }
      return <div>Partial data</div>;
    }

    render(
      <QueryProvider>
        <MultiQueryComponent />
      </QueryProvider>
    );

    expect(screen.getByText('Loading queries...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Query 1')).toBeInTheDocument();
      expect(screen.getByText('Query 2')).toBeInTheDocument();
    });
  });

  describe('DevTools rendering based on mobile state', () => {
    it('should render ReactQueryDevtools when not on mobile', async () => {
      const { useIsMobileScreenWidth } = await import('@/hooks/use-is-mobile-screen-width');
      (useIsMobileScreenWidth as any).mockReturnValue(false);

      const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools');

      render(
        <QueryProvider>
          <div>Test Content</div>
        </QueryProvider>
      );

      expect(ReactQueryDevtools).toHaveBeenCalled();
      // Just check that it was called with the correct first argument
      const callArgs = (ReactQueryDevtools as any).mock.calls[0];
      expect(callArgs[0]).toMatchObject({ initialIsOpen: false });
    });

    it('should not render ReactQueryDevtools on mobile', async () => {
      const { useIsMobileScreenWidth } = await import('@/hooks/use-is-mobile-screen-width');
      (useIsMobileScreenWidth as any).mockReturnValue(true);

      const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools');
      (ReactQueryDevtools as any).mockClear();

      render(
        <QueryProvider>
          <div>Test Content</div>
        </QueryProvider>
      );

      expect(ReactQueryDevtools).not.toHaveBeenCalled();
    });
  });

  describe('Retry configuration', () => {
    it('should not retry on 404 errors', async () => {
      let capturedClient!: QueryClient;

      function CaptureRetryComponent() {
        const queryClient = useQueryClient();
        capturedClient = queryClient;
        return <div>Client captured</div>;
      }

      render(
        <QueryProvider>
          <CaptureRetryComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(capturedClient).toBeDefined();
      });

      const retryFn = capturedClient.getDefaultOptions().queries?.retry as Function;

      // Should not retry on 404 status
      expect(retryFn(1, { status: 404 })).toBe(false);

      // Should not retry on 404 in error message
      expect(retryFn(1, { message: 'Error 404: Not found' })).toBe(false);

      // Should not retry on other 4xx errors
      expect(retryFn(1, { status: 400 })).toBe(false);
      expect(retryFn(1, { status: 403 })).toBe(false);

      // Should retry on 5xx errors up to 3 times
      expect(retryFn(0, { status: 500 })).toBe(true);
      expect(retryFn(1, { status: 500 })).toBe(true);
      expect(retryFn(2, { status: 500 })).toBe(true);
      expect(retryFn(3, { status: 500 })).toBe(false);

      // Should retry on network errors
      expect(retryFn(0, { message: 'Network error' })).toBe(true);
      expect(retryFn(2, { message: 'Network error' })).toBe(true);
      expect(retryFn(3, { message: 'Network error' })).toBe(false);
    });

    it('should use exponential backoff for retry delay', async () => {
      let capturedClient!: QueryClient;

      function CaptureDelayComponent() {
        const queryClient = useQueryClient();
        capturedClient = queryClient;
        return <div>Client captured</div>;
      }

      render(
        <QueryProvider>
          <CaptureDelayComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(capturedClient).toBeDefined();
      });

      const retryDelay = capturedClient.getDefaultOptions().queries?.retryDelay as Function;

      expect(retryDelay(0)).toBe(1000); // 1 second
      expect(retryDelay(1)).toBe(2000); // 2 seconds
      expect(retryDelay(2)).toBe(4000); // 4 seconds
      expect(retryDelay(3)).toBe(8000); // 8 seconds
      expect(retryDelay(4)).toBe(16000); // 16 seconds
      expect(retryDelay(5)).toBe(30000); // Capped at 30 seconds
      expect(retryDelay(10)).toBe(30000); // Still capped at 30 seconds
    });
  });
});
