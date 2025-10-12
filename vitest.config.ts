import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 90,
        lines: 95,
      },
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        'build/',
        '.next/',
        'out/',
        'app/',
        'components/ui/',
        'tests/**/*.test.*',
        'tests/**/*.spec.*',
        '.lintstagedrc.js',
      ],
      include: ['**/*.{js,jsx,ts,tsx}', 'tests/utils/**/*.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
