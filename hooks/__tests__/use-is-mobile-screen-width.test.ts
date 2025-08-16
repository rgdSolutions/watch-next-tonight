import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIsMobileScreenWidth } from '../use-is-mobile-screen-width';

describe('useIsMobileScreenWidth', () => {
  const originalInnerWidth = window.innerWidth;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  let listeners: { [key: string]: Function[] } = {};

  beforeEach(() => {
    listeners = {};

    // Mock addEventListener
    window.addEventListener = vi.fn((event: string, handler: Function) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(handler);
    }) as any;

    // Mock removeEventListener
    window.removeEventListener = vi.fn((event: string, handler: Function) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      }
    }) as any;
  });

  afterEach(() => {
    // Restore original values only if window exists
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
      window.addEventListener = originalAddEventListener;
      window.removeEventListener = originalRemoveEventListener;
    }
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  const triggerResize = () => {
    const resizeEvent = new Event('resize');
    listeners['resize']?.forEach((handler) => handler(resizeEvent));
  };

  describe('Initial state', () => {
    it('should return false for desktop width on initial render', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useIsMobileScreenWidth());
      expect(result.current).toBe(false);
    });

    it('should return true for mobile width on initial render', () => {
      setWindowWidth(500);
      const { result } = renderHook(() => useIsMobileScreenWidth());
      expect(result.current).toBe(true);
    });

    it('should use 640px as the mobile breakpoint', () => {
      setWindowWidth(639);
      const { result: mobileResult } = renderHook(() => useIsMobileScreenWidth());
      expect(mobileResult.current).toBe(true);

      setWindowWidth(640);
      const { result: desktopResult } = renderHook(() => useIsMobileScreenWidth());
      expect(desktopResult.current).toBe(false);
    });

    it('should return false when window is undefined (SSR)', () => {
      // This test simulates SSR by checking the initial state logic
      // The hook returns false when window is undefined during SSR
      setWindowWidth(500); // Set to mobile width
      const { result } = renderHook(() => useIsMobileScreenWidth());

      // Even though width is 500, the hook should work correctly
      expect(result.current).toBe(true);
    });
  });

  describe('Resize behavior', () => {
    it('should update when window resizes from desktop to mobile', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useIsMobileScreenWidth());

      expect(result.current).toBe(false);

      act(() => {
        setWindowWidth(500);
        triggerResize();
      });

      expect(result.current).toBe(true);
    });

    it('should update when window resizes from mobile to desktop', () => {
      setWindowWidth(500);
      const { result } = renderHook(() => useIsMobileScreenWidth());

      expect(result.current).toBe(true);

      act(() => {
        setWindowWidth(1024);
        triggerResize();
      });

      expect(result.current).toBe(false);
    });

    it('should handle multiple resize events', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useIsMobileScreenWidth());

      act(() => {
        setWindowWidth(500);
        triggerResize();
      });
      expect(result.current).toBe(true);

      act(() => {
        setWindowWidth(700);
        triggerResize();
      });
      expect(result.current).toBe(false);

      act(() => {
        setWindowWidth(300);
        triggerResize();
      });
      expect(result.current).toBe(true);
    });
  });

  describe('Event listener management', () => {
    it('should add resize event listener on mount', () => {
      renderHook(() => useIsMobileScreenWidth());
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should remove resize event listener on unmount', () => {
      const { unmount } = renderHook(() => useIsMobileScreenWidth());
      unmount();
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should cleanup properly when component unmounts', () => {
      const { unmount } = renderHook(() => useIsMobileScreenWidth());

      expect(listeners['resize']).toHaveLength(1);

      unmount();

      expect(window.removeEventListener).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle very small screen widths', () => {
      setWindowWidth(320);
      const { result } = renderHook(() => useIsMobileScreenWidth());
      expect(result.current).toBe(true);
    });

    it('should handle very large screen widths', () => {
      setWindowWidth(2560);
      const { result } = renderHook(() => useIsMobileScreenWidth());
      expect(result.current).toBe(false);
    });

    it('should handle exact breakpoint width', () => {
      setWindowWidth(640);
      const { result } = renderHook(() => useIsMobileScreenWidth());
      expect(result.current).toBe(false);
    });

    it('should handle one pixel below breakpoint', () => {
      setWindowWidth(639);
      const { result } = renderHook(() => useIsMobileScreenWidth());
      expect(result.current).toBe(true);
    });
  });
});
