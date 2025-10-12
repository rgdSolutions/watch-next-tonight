import { describe, expect, it } from 'vitest';

import { capitalizeFirstLetter, cn, formatDate, returnFirstWord } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('combines single class name', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('combines multiple class names', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
    });

    it('merges conflicting Tailwind classes', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('handles conditional classes', () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn('base', isTrue && 'true-class', isFalse && 'false-class')).toBe('base true-class');
    });

    it('handles undefined and null values', () => {
      expect(cn('foo', undefined, 'bar', null, 'baz')).toBe('foo bar baz');
    });

    it('handles empty strings', () => {
      expect(cn('', 'foo', '')).toBe('foo');
    });

    it('handles array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles object with boolean values', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('capitalizes first letter of lowercase string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('capitalizes first letter of all lowercase string', () => {
      expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
    });

    it('handles already capitalized string', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    });

    it('capitalizes single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('handles empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('handles string starting with number', () => {
      expect(capitalizeFirstLetter('1hello')).toBe('1hello');
    });

    it('handles all uppercase string', () => {
      expect(capitalizeFirstLetter('HELLO')).toBe('HELLO');
    });
  });

  describe('returnFirstWord', () => {
    it('returns first word from multi-word string', () => {
      expect(returnFirstWord('hello world')).toBe('hello');
    });

    it('returns single word in lowercase', () => {
      expect(returnFirstWord('Hello')).toBe('hello');
    });

    it('returns empty string for empty input', () => {
      expect(returnFirstWord('')).toBe('');
    });

    it('handles non-string input', () => {
      expect(returnFirstWord(123 as any)).toBe('');
    });

    it('handles string with multiple spaces', () => {
      expect(returnFirstWord('hello   world   test')).toBe('hello');
    });

    it('handles string with leading spaces', () => {
      expect(returnFirstWord('  hello world')).toBe('');
    });

    it('handles uppercase first word', () => {
      expect(returnFirstWord('HELLO world')).toBe('hello');
    });

    it('handles string with special characters', () => {
      expect(returnFirstWord('Hello! World')).toBe('hello!');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const result = formatDate('2024-01-15T12:00:00Z');
      expect(result).toMatch(/January \d{1,2}, 2024/);
    });

    it('formats date with proper month name', () => {
      const result = formatDate('2024-06-15T12:00:00Z');
      expect(result).toContain('June');
      expect(result).toContain('2024');
    });

    it('returns string in expected format', () => {
      const result = formatDate('2023-12-25T12:00:00Z');
      expect(result).toMatch(/[A-Z][a-z]+ \d{1,2}, \d{4}/);
    });

    it('handles different months', () => {
      const result = formatDate('2024-03-15T12:00:00Z');
      expect(result).toContain('March');
    });

    it('formats year correctly', () => {
      const result = formatDate('2023-06-15T12:00:00Z');
      expect(result).toContain('2023');
    });
  });
});
