import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QueryProvider } from '../query-provider';

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
    expect(defaults.queries?.retry).toBe(3);
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
});
