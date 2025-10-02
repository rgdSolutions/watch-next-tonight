import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBlogPosts } from '../blog';

// Mock fs and path modules
vi.mock('fs');
vi.mock('path');

// Mock dynamic imports
vi.mock('@/content/blog/test-post.mdx', () => ({
  default: () => 'Test Content Component',
}));

vi.mock('@/content/blog/another-post.mdx', () => ({
  default: () => 'Another Content Component',
}));

describe('getBlogPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(process.cwd).mockReturnValue('/test/path');
  });

  describe('Normal operation', () => {
    it('should return empty array when blog directory does not exist', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = await getBlogPosts();

      expect(result).toEqual([]);
      expect(fs.existsSync).toHaveBeenCalledWith('/test/path/content/blog');
    });

    it('should return empty array when blog directory is empty', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);

      const result = await getBlogPosts();

      expect(result).toEqual([]);
      expect(fs.readdirSync).toHaveBeenCalledWith('/test/path/content/blog');
    });

    it('should filter out non-MDX files', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'test-post.mdx',
        'readme.md',
        'test.txt',
        'image.png',
      ] as any);
      vi.mocked(path.extname)
        .mockReturnValueOnce('.mdx')
        .mockReturnValueOnce('.md')
        .mockReturnValueOnce('.txt')
        .mockReturnValueOnce('.png');

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Test Post
publishedAt: 2025-10-01
summary: Test summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Test meta description
keywords: test, blog
---

Content`);

      vi.mocked(path.basename).mockReturnValue('test-post');

      const result = await getBlogPosts();

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('test-post');
    });

    it('should parse frontmatter correctly from MDX files', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['test-post.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      const frontmatter = `---
title: Amazing Blog Post
publishedAt: 2025-10-15
summary: This is an amazing summary
author: Ricardo D'Alessandro
image: /images/blog/amazing.png
meta_description: SEO optimized description
keywords: amazing, blog, test
---

# Blog Content

This is the blog content.`;

      vi.mocked(fs.readFileSync).mockReturnValue(frontmatter);
      vi.mocked(path.basename).mockReturnValue('test-post');

      const result = await getBlogPosts();

      expect(result).toHaveLength(1);
      expect(result[0].metadata).toEqual({
        title: 'Amazing Blog Post',
        publishedAt: '2025-10-15',
        summary: 'This is an amazing summary',
        author: "Ricardo D'Alessandro",
        image: '/images/blog/amazing.png',
        meta_description: 'SEO optimized description',
        keywords: ['amazing', 'blog', 'test'],
      });
      expect(result[0].slug).toBe('test-post');
    });

    it('should handle multiple blog posts', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['test-post.mdx', 'another-post.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: First Post
publishedAt: 2025-10-01
summary: First summary
author: Ricardo D'Alessandro
image: /images/blog/first.png
meta_description: First meta description
keywords: first
---

Content 1`).mockReturnValueOnce(`---
title: Second Post
publishedAt: 2025-10-15
summary: Second summary
author: Ricardo D'Alessandro
image: /images/blog/second.png
meta_description: Second meta description
keywords: second
---

Content 2`);

      vi.mocked(path.basename).mockReturnValueOnce('test-post').mockReturnValueOnce('another-post');

      const result = await getBlogPosts();

      expect(result).toHaveLength(2);
      expect(result[0].metadata.title).toBe('Second Post'); // Sorted by date, newest first
      expect(result[1].metadata.title).toBe('First Post');
    });

    it('should sort posts by publishedAt date (newest first)', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'old-post.mdx',
        'new-post.mdx',
        'middle-post.mdx',
      ] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: Old Post
publishedAt: 2025-01-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/old.png
meta_description: Description
keywords: old
---

Content`).mockReturnValueOnce(`---
title: New Post
publishedAt: 2025-12-31
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/new.png
meta_description: Description
keywords: new
---

Content`).mockReturnValueOnce(`---
title: Middle Post
publishedAt: 2025-06-15
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/middle.png
meta_description: Description
keywords: middle
---

Content`);

      vi.mocked(path.basename)
        .mockReturnValueOnce('old-post')
        .mockReturnValueOnce('new-post')
        .mockReturnValueOnce('middle-post');

      const result = await getBlogPosts();

      expect(result).toHaveLength(3);
      expect(result[0].metadata.title).toBe('New Post');
      expect(result[1].metadata.title).toBe('Middle Post');
      expect(result[2].metadata.title).toBe('Old Post');
    });

    it('should extract slug from filename without extension', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['my-awesome-blog-post.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: My Awesome Blog Post
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/awesome.png
meta_description: Description
keywords: awesome
---

Content`);

      vi.mocked(path.basename).mockReturnValue('my-awesome-blog-post');

      const result = await getBlogPosts();

      expect(result[0].slug).toBe('my-awesome-blog-post');
    });

    it('should include content component from dynamic import', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['test-post.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Test Post
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/test.png
meta_description: Description
keywords: test
---

Content`);

      vi.mocked(path.basename).mockReturnValue('test-post');

      const result = await getBlogPosts();

      expect(result[0].content).toBeDefined();
      expect(typeof result[0].content).toBe('function');
    });
  });

  describe('Error handling', () => {
    it('should return empty array and log error when reading blog posts fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await getBlogPosts();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading blog posts:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array when frontmatter is malformed', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['bad-post.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      // Missing frontmatter
      vi.mocked(fs.readFileSync).mockReturnValue('# Just content without frontmatter');
      vi.mocked(path.basename).mockReturnValue('bad-post');

      const result = await getBlogPosts();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array when required frontmatter fields are missing', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['incomplete-post.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      // Missing required fields
      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Incomplete Post
publishedAt: 2025-10-01
---

Content`);
      vi.mocked(path.basename).mockReturnValue('incomplete-post');

      const result = await getBlogPosts();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('should handle posts with same publication date', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['post-a.mdx', 'post-b.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: Post A
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/a.png
meta_description: Description
keywords: a
---

Content A`).mockReturnValueOnce(`---
title: Post B
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/b.png
meta_description: Description
keywords: b
---

Content B`);

      vi.mocked(path.basename).mockReturnValueOnce('post-a').mockReturnValueOnce('post-b');

      const result = await getBlogPosts();

      expect(result).toHaveLength(2);
      // Both have same date, order doesn't matter but should be stable
      expect(result.map((p) => p.metadata.title)).toContain('Post A');
      expect(result.map((p) => p.metadata.title)).toContain('Post B');
    });

    it('should handle special characters in filenames', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['post-with-special-chars-$@!.mdx'] as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      vi.mocked(fs.readFileSync).mockReturnValue(`---
title: Special Post
publishedAt: 2025-10-01
summary: Summary
author: Ricardo D'Alessandro
image: /images/blog/special.png
meta_description: Description
keywords: special
---

Content`);

      vi.mocked(path.basename).mockReturnValue('post-with-special-chars-$@!');

      const result = await getBlogPosts();

      expect(result[0].slug).toBe('post-with-special-chars-$@!');
    });

    it('should handle very long file lists', async () => {
      vi.mocked(path.join).mockReturnValue('/test/path/content/blog');
      vi.mocked(fs.existsSync).mockReturnValue(true);

      // Generate 100 blog posts
      const files = Array.from({ length: 100 }, (_, i) => `post-${i}.mdx`);
      vi.mocked(fs.readdirSync).mockReturnValue(files as any);
      vi.mocked(path.extname).mockReturnValue('.mdx');

      // Mock readFileSync for all files
      files.forEach((_, i) => {
        vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: Post ${i}
publishedAt: 2025-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}
summary: Summary ${i}
author: Ricardo D'Alessandro
image: /images/blog/post-${i}.png
meta_description: Description ${i}
keywords: post, ${i}
---

Content ${i}`);

        vi.mocked(path.basename).mockReturnValueOnce(`post-${i}`);
      });

      const result = await getBlogPosts();

      expect(result).toHaveLength(100);
      // Check that posts are sorted by date (newest first)
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].metadata.publishedAt);
        const nextDate = new Date(result[i + 1].metadata.publishedAt);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });
});
