import { describe, expect, it, vi } from 'vitest';

import { parseFrontmatter } from '../blog';

describe('parseFrontmatter', () => {
  describe('Valid frontmatter parsing', () => {
    it('should parse valid frontmatter with all required fields', () => {
      const fileContent = `---
title: Test Blog Post
publishedAt: 2025-10-01
summary: This is a test summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: SEO optimized meta description for testing
keywords: test, blog, vitest
---

# Content

This is the blog post content.`;

      const result = parseFrontmatter(fileContent);

      expect(result.metadata).toEqual({
        title: 'Test Blog Post',
        publishedAt: '2025-10-01',
        summary: 'This is a test summary',
        author: "Ricardo D'Alessandro",
        image: '/images/blog/test.png',
        meta_description: 'SEO optimized meta description for testing',
        keywords: ['test', 'blog', 'vitest'],
      });
      expect(result.content).toContain('# Content');
      expect(result.content).toContain('This is the blog post content.');
    });

    it('should parse frontmatter with quoted values', () => {
      const fileContent = `---
title: "Test Blog Post with Quotes"
publishedAt: "2025-10-01"
summary: 'This is a test summary with single quotes'
author: "Ricardo D'Alessandro"
image: "/images/blog/test.png"
meta_description: "SEO optimized meta description"
keywords: test, blog, quotes
---

Content here.`;

      const result = parseFrontmatter(fileContent);

      expect(result.metadata.title).toBe('Test Blog Post with Quotes');
      expect(result.metadata.summary).toBe('This is a test summary with single quotes');
    });

    it('should handle values with colons in them', () => {
      const fileContent = `---
title: Title: With Colons
publishedAt: 2025-10-01
summary: Summary with time 12:30 PM
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description: with colons in it
keywords: test, time:12:30
---

Content.`;

      const result = parseFrontmatter(fileContent);

      expect(result.metadata.title).toBe('Title: With Colons');
      expect(result.metadata.summary).toBe('Summary with time 12:30 PM');
      expect(result.metadata.meta_description).toBe('Description: with colons in it');
    });

    it('should parse keywords as an array', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: keyword1, keyword2, keyword3, keyword with spaces
---

Content.`;

      const result = parseFrontmatter(fileContent);

      expect(result.metadata.keywords).toEqual([
        'keyword1',
        'keyword2',
        'keyword3',
        'keyword with spaces',
      ]);
    });

    it('should trim whitespace from all values', () => {
      const fileContent = `---
title:    Test with extra spaces
publishedAt:   2025-10-01
summary:   Summary with spaces
author:   Ricardo D'Alessandro
image:   /images/blog/test.png
meta_description:   Description
keywords:   keyword1  ,  keyword2  ,  keyword3
---

Content.`;

      const result = parseFrontmatter(fileContent);

      expect(result.metadata.title).toBe('Test with extra spaces');
      expect(result.metadata.publishedAt).toBe('2025-10-01');
      expect(result.metadata.keywords).toEqual(['keyword1', 'keyword2', 'keyword3']);
    });

    it('should handle empty lines in frontmatter', () => {
      const fileContent = `---
title: Test

publishedAt: 2025-10-01

summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png

meta_description: Description
keywords: test, blog
---

Content.`;

      const result = parseFrontmatter(fileContent);

      expect(result.metadata.title).toBe('Test');
      expect(result.metadata.publishedAt).toBe('2025-10-01');
    });
  });

  describe('Error handling', () => {
    it('should throw error when frontmatter block is missing', () => {
      const fileContent = `
# Blog Post

This is content without frontmatter.`;

      expect(() => parseFrontmatter(fileContent)).toThrow(
        'Frontmatter block not found or malformed'
      );
    });

    it('should throw error when frontmatter is malformed (missing closing ---)', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01

Content without closing frontmatter.`;

      expect(() => parseFrontmatter(fileContent)).toThrow(
        'Frontmatter block not found or malformed'
      );
    });

    it('should throw error when required field "title" is missing', () => {
      const fileContent = `---
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('title');
    });

    it('should throw error when required field "publishedAt" is missing', () => {
      const fileContent = `---
title: Test
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('publishedAt');
    });

    it('should throw error when required field "summary" is missing', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('summary');
    });

    it('should throw error when required field "author" is missing', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('author');
    });

    it('should throw error when required field "image" is missing', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
meta_description: Description
keywords: test
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('image');
    });

    it('should throw error when required field "meta_description" is missing', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
keywords: test
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('meta_description');
    });

    it('should throw error when required field "keywords" is missing', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      expect(() => parseFrontmatter(fileContent)).toThrow('keywords');
    });

    it('should throw error when multiple required fields are missing', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
---

Content.`;

      expect(() => parseFrontmatter(fileContent)).toThrow('Missing required frontmatter fields');
      const error = () => parseFrontmatter(fileContent);
      expect(error).toThrow('author');
      expect(error).toThrow('image');
      expect(error).toThrow('meta_description');
      expect(error).toThrow('keywords');
    });

    it('should skip malformed frontmatter lines and log warning', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const fileContent = `---
title: Test
invalid line without colon
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content.`;

      const result = parseFrontmatter(fileContent);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Skipping malformed frontmatter line: "invalid line without colon"'
      );
      expect(result.metadata.title).toBe('Test');

      consoleWarnSpy.mockRestore();
    });

    it('should skip frontmatter lines with empty values and log warning', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const fileContent = `---
title: Test
emptyfield:
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content.`;

      const result = parseFrontmatter(fileContent);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Skipping malformed frontmatter line: "emptyfield:"')
      );
      expect(result.metadata.title).toBe('Test');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Content extraction', () => {
    it('should extract content without frontmatter', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

# Main Heading

This is paragraph one.

## Sub Heading

This is paragraph two.`;

      const result = parseFrontmatter(fileContent);

      expect(result.content).not.toContain('---');
      expect(result.content).toContain('# Main Heading');
      expect(result.content).toContain('This is paragraph one.');
      expect(result.content).toContain('## Sub Heading');
    });

    it('should handle content with multiple dashes', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content with --- dashes in it.

And even more --- here.`;

      const result = parseFrontmatter(fileContent);

      expect(result.content).toContain('Content with --- dashes in it.');
      expect(result.content).toContain('And even more --- here.');
    });

    it('should preserve whitespace and formatting in content', () => {
      const fileContent = `---
title: Test
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

# Heading

- List item 1
- List item 2

\`\`\`js
const code = "example";
\`\`\``;

      const result = parseFrontmatter(fileContent);

      expect(result.content).toContain('- List item 1');
      expect(result.content).toContain('- List item 2');
      expect(result.content).toContain('```js');
      expect(result.content).toContain('const code = "example";');
    });
  });
});
