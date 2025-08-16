import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider, useTheme } from '../theme-provider';

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  describe('useTheme hook', () => {
    it('should return theme context when used within ThemeProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('setTheme');
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('Theme management', () => {
    it('should use system theme by default', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('system');
    });

    it('should use defaultTheme when provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('dark');
    });

    it('should read theme from localStorage if available', () => {
      localStorage.setItem('theme', 'light');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('light');
    });

    it('should use custom storage key when provided', () => {
      localStorage.setItem('custom-theme-key', 'dark');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider storageKey="custom-theme-key">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('DOM class manipulation', () => {
    it('should add dark class when theme is dark', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      renderHook(() => useTheme(), { wrapper });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should add light class when theme is light', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      );

      renderHook(() => useTheme(), { wrapper });
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should use system preference when theme is system', () => {
      const matchMediaMock = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      window.matchMedia = matchMediaMock;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      );

      renderHook(() => useTheme(), { wrapper });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should clean up previous theme classes when changing theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.classList.contains('light')).toBe(true);

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  describe('setTheme functionality', () => {
    it('should update theme and save to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should use custom storage key when saving', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider storageKey="custom-key">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('light');
      });

      expect(localStorage.getItem('custom-key')).toBe('light');
    });
  });
});
