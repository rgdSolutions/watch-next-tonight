import fs from 'fs';
import { unstable_cache } from 'next/cache';
import path from 'path';

export interface BlogPost {
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    author: string;
    image: string;
    meta_description: string;
    keywords: string[];
  };
  slug: string;
  content: React.ComponentType;
}

export function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    throw new Error('Frontmatter block not found or malformed in the provided file content.');
  }
  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const metadata: Partial<BlogPost['metadata']> = {};

  frontMatterLines.forEach((line) => {
    // Skip empty lines
    if (!line.trim()) return;

    // Check if line contains the required ': ' separator
    if (!line.includes(': ')) {
      console.warn(`Skipping malformed frontmatter line: "${line}"`);
      return;
    }

    const [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();

    // Skip lines with empty values
    if (!value) {
      console.warn(`Skipping frontmatter line with empty value: "${line}"`);
      return;
    }

    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes

    // Handle keywords as array
    if (key.trim() === 'keywords') {
      metadata.keywords = value.split(',').map((k) => k.trim());
    } else {
      metadata[key.trim() as keyof BlogPost['metadata']] = value as any;
    }
  });

  // Validate required fields
  const requiredFields: (keyof BlogPost['metadata'])[] = [
    'title',
    'publishedAt',
    'summary',
    'author',
    'image',
    'meta_description',
    'keywords',
  ];

  const missingFields = requiredFields.filter((field) => !metadata[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required frontmatter fields: ${missingFields.join(', ')}`);
  }

  return { metadata: metadata as BlogPost['metadata'], content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

// Extracted for testability - can be mocked in tests
export async function importMDXContent(fileName: string): Promise<React.ComponentType> {
  // Ensure fileName includes .mdx extension for Vite's static analysis
  const fileNameWithExt = fileName.endsWith('.mdx') ? fileName : `${fileName}.mdx`;
  const { default: content } = await import(`@/content/blog/${fileNameWithExt}`);
  return content;
}

async function getMDXData(
  dir: string,
  contentImporter: (fileName: string) => Promise<React.ComponentType> = importMDXContent
): Promise<BlogPost[]> {
  const mdxFiles = getMDXFiles(dir);

  return Promise.all(
    mdxFiles.map(async (file) => {
      const { metadata } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));

      // Dynamically import the MDX file using the provided importer
      const content = await contentImporter(file);

      return {
        metadata,
        slug,
        content,
      };
    })
  );
}

async function getBlogPostsUncached(
  contentImporter?: (fileName: string) => Promise<React.ComponentType>
): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'blog');

  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  try {
    const posts = await getMDXData(contentDir, contentImporter);
    return posts.sort((a, b) => {
      // Sort by publishedAt date, newest first
      return (
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
      );
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export async function getBlogPosts(
  contentImporter?: (fileName: string) => Promise<React.ComponentType>
): Promise<BlogPost[]> {
  // Use unstable_cache for production performance
  const getCachedPosts = unstable_cache(
    async () => getBlogPostsUncached(contentImporter),
    ['blog-posts'],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ['blog-posts'],
    }
  );

  return getCachedPosts();
}
