import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QueryProvider } from '../query-provider';

// Mock ReactQueryDevtools to avoid issues in test environment
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

describe('QueryProvider - Comprehensive Tests', () => {
  describe('Retry Logic', () => {
    it('should not retry on 404 errors', async () => {
      const queryFn = vi.fn().mockRejectedValue({ status: 404 });

      function TestComponent() {
        const { error, failureCount } = useQuery({
          queryKey: ['test-404'],
          queryFn,
        });

        return (
          <div>
            {error && <div>Error: 404</div>}
            <div data-testid="failure-count">{failureCount}</div>
          </div>
        );
      }

      render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Error: 404')).toBeInTheDocument();
      });

      // Should not retry on 404, so queryFn should only be called once
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should not retry on 404 message in error', async () => {
      const queryFn = vi.fn().mockRejectedValue(new Error('Not found: 404'));

      function TestComponent() {
        const { error } = useQuery({
          queryKey: ['test-404-message'],
          queryFn,
        });

        return <div>{error && <div>Error occurred</div>}</div>;
      }

      render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
      });

      // Should not retry when error message contains 404
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should not retry on 4xx client errors', async () => {
      const queryFn = vi.fn().mockRejectedValue({ status: 400 });

      function TestComponent() {
        const { error } = useQuery({
          queryKey: ['test-400'],
          queryFn,
        });

        return <div>{error && <div>Client Error</div>}</div>;
      }

      render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Client Error')).toBeInTheDocument();
      });

      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should not retry on 403 forbidden errors', async () => {
      const queryFn = vi.fn().mockRejectedValue({ status: 403 });

      function TestComponent() {
        const { error } = useQuery({
          queryKey: ['test-403'],
          queryFn,
        });

        return <div>{error && <div>Forbidden</div>}</div>;
      }

      render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Forbidden')).toBeInTheDocument();
      });

      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff for retry delay', async () => {
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
      const retryDelay = defaults.queries?.retryDelay as Function;

      // Test exponential backoff
      expect(retryDelay(0)).toBe(1000); // 1 second
      expect(retryDelay(1)).toBe(2000); // 2 seconds
      expect(retryDelay(2)).toBe(4000); // 4 seconds
      expect(retryDelay(3)).toBe(8000); // 8 seconds
      expect(retryDelay(10)).toBe(30000); // Max 30 seconds
    });

    it('should handle 499 client error without retry', async () => {
      const queryFn = vi.fn().mockRejectedValue({ status: 499 });

      function TestComponent() {
        const { error } = useQuery({
          queryKey: ['test-499'],
          queryFn,
        });

        return <div>{error && <div>Client Closed Request</div>}</div>;
      }

      render(
        <QueryProvider>
          <TestComponent />
        </QueryProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Client Closed Request')).toBeInTheDocument();
      });

      // Should not retry on 4xx errors
      expect(queryFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('QueryClient Configuration', () => {
    it('should maintain the same QueryClient instance across re-renders', () => {
      const clients: QueryClient[] = [];

      function CaptureClientComponent({ index }: { index: number }) {
        const queryClient = useQueryClient();
        clients[index] = queryClient;
        return <div>Client {index}</div>;
      }

      const { rerender } = render(
        <QueryProvider>
          <CaptureClientComponent index={0} />
        </QueryProvider>
      );

      rerender(
        <QueryProvider>
          <CaptureClientComponent index={1} />
        </QueryProvider>
      );

      expect(clients[0]).toBe(clients[1]);
    });

    it('should disable refetchOnWindowFocus', async () => {
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
      expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    });
  });
});
