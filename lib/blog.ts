import fs from 'fs';
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

function parseFrontmatter(fileContent: string) {
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
    const [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes

    // Handle keywords as array
    if (key.trim() === 'keywords') {
      metadata.keywords = value.split(',').map((k) => k.trim());
    } else {
      metadata[key.trim() as keyof BlogPost['metadata']] = value as any;
    }
  });

  return { metadata: metadata as BlogPost['metadata'], content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

async function getMDXData(dir: string): Promise<BlogPost[]> {
  const mdxFiles = getMDXFiles(dir);

  return Promise.all(
    mdxFiles.map(async (file) => {
      const { metadata } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));

      // Dynamically import the MDX file
      const { default: content } = await import(`@/content/blog/${file}`);

      return {
        metadata,
        slug,
        content,
      };
    })
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'blog');

  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  try {
    const posts = await getMDXData(contentDir);
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
