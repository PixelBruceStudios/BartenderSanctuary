import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');
const outFile = path.join(root, 'data', 'blog.generated.ts');
const seedFile = path.join(root, 'data', 'blog.ts');

interface Category {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

interface Categories {
  blog: Category[];
  forum: Category[];
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categorySlug: string;
  tags: string[];
  publishedAt: string;
  authorName: string;
}

interface ForumThread {
  id: string;
  title: string;
  categorySlug: string;
  authorName: string;
  createdAt: string;
  replyCount: number;
  lastReplyAt?: string;
  content: string;
}

interface ForumReply {
  id: string;
  threadId: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string;
  content: string;
}

function readCategories(): Categories {
  const file = path.join(contentDir, 'categories.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function readBlogPosts(blogDir: string): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];
  const posts: BlogPost[] = [];
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const indexFile = path.join(blogDir, entry.name, 'index.md');
    if (!fs.existsSync(indexFile)) continue;

    const raw = fs.readFileSync(indexFile, 'utf-8');
    const { data, content } = matter(raw);

    posts.push({
      slug: entry.name,
      title: (data.title as string) || entry.name,
      excerpt: (data.excerpt as string) || '',
      content,
      coverImage: data.coverImage as string | undefined,
      categorySlug: (data.categorySlug as string) || '',
      tags: (data.tags as string[]) || [],
      publishedAt: (data.publishedAt as string) || new Date().toISOString(),
      authorName: (data.authorName as string) || 'Unknown',
    });
  }

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

function readForumThreads(forumDir: string): ForumThread[] {
  if (!fs.existsSync(forumDir)) return [];
  const threads: ForumThread[] = [];
  const entries = fs.readdirSync(forumDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const indexFile = path.join(forumDir, entry.name, 'index.md');
    if (!fs.existsSync(indexFile)) continue;

    const raw = fs.readFileSync(indexFile, 'utf-8');
    const { data, content } = matter(raw);

    const repliesDir = path.join(forumDir, entry.name, 'replies');
    let replyCount = 0;
    let lastReplyAt: string | undefined;
    if (fs.existsSync(repliesDir)) {
      const replyEntries = fs.readdirSync(repliesDir, { withFileTypes: true });
      replyCount = replyEntries.filter((e) => e.isFile() && e.name.endsWith('.md')).length;
      const replyDates = replyEntries
        .filter((e) => e.isFile() && e.name.endsWith('.md'))
        .map((e) => {
          const rRaw = fs.readFileSync(path.join(repliesDir, e.name), 'utf-8');
          const rData = matter(rRaw).data;
          return (rData.createdAt as string) || '';
        })
        .filter(Boolean);
      if (replyDates.length > 0) {
        lastReplyAt = replyDates.sort().pop()!;
      }
    }

    threads.push({
      id: entry.name,
      title: (data.title as string) || entry.name,
      categorySlug: (data.categorySlug as string) || '',
      authorName: (data.authorName as string) || 'Unknown',
      createdAt: (data.createdAt as string) || new Date().toISOString(),
      replyCount,
      lastReplyAt,
      content,
    });
  }

  return threads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function readForumReplies(forumDir: string): ForumReply[] {
  if (!fs.existsSync(forumDir)) return [];
  const replies: ForumReply[] = [];
  const threadDirs = fs.readdirSync(forumDir, { withFileTypes: true });

  for (const threadEntry of threadDirs) {
    if (!threadEntry.isDirectory()) continue;
    const repliesDir = path.join(forumDir, threadEntry.name, 'replies');
    if (!fs.existsSync(repliesDir)) continue;

    const replyFiles = fs.readdirSync(repliesDir, { withFileTypes: true });
    for (const replyEntry of replyFiles) {
      if (!replyEntry.isFile() || !replyEntry.name.endsWith('.md')) continue;
      const raw = fs.readFileSync(path.join(repliesDir, replyEntry.name), 'utf-8');
      const { data, content } = matter(raw);
      replies.push({
        id: replyEntry.name.replace(/\.md$/, ''),
        threadId: threadEntry.name,
        authorName: (data.authorName as string) || 'Unknown',
        authorEmail: data.authorEmail as string | undefined,
        createdAt: (data.createdAt as string) || new Date().toISOString(),
        content,
      });
    }
  }

  return replies;
}

function escape(str: string): string {
  return JSON.stringify(str);
}

function generateTS(
  categories: Categories,
  posts: BlogPost[],
  threads: ForumThread[],
  replies: ForumReply[]
): string {
  const lines: string[] = [
    '// AUTO-GENERATED — do not edit directly. Run `npm run build:blog` to regenerate.',
    '',
    'export interface BlogPost {',
    '  slug: string;',
    '  title: string;',
    '  excerpt: string;',
    '  content: string;',
    '  coverImage?: string;',
    '  categorySlug: string;',
    '  tags: string[];',
    '  publishedAt: string;',
    '  authorName: string;',
    '}',
    '',
    'export interface BlogCategory {',
    '  slug: string;',
    '  title: string;',
    '  description: string;',
    '  icon?: string;',
    '}',
    '',
    'export interface ForumThread {',
    '  id: string;',
    '  title: string;',
    '  categorySlug: string;',
    '  authorName: string;',
    '  createdAt: string;',
    '  replyCount: number;',
    '  lastReplyAt?: string;',
    '  content: string;',
    '}',
    '',
    'export interface ForumCategory {',
    '  slug: string;',
    '  title: string;',
    '  description: string;',
    '  icon?: string;',
    '}',
    '',
    'export interface ForumReply {',
    '  id: string;',
    '  threadId: string;',
    '  authorName: string;',
    '  authorEmail?: string;',
    '  createdAt: string;',
    '  content: string;',
    '}',
    '',
  ];

  lines.push('export const blogCategories: BlogCategory[] = [');
  for (const cat of categories.blog) {
    lines.push(`  { slug: ${escape(cat.slug)}, title: ${escape(cat.title)}, description: ${escape(cat.description)}, icon: ${cat.icon ? escape(cat.icon) : 'undefined'} },`);
  }
  lines.push('];');
  lines.push('');

  lines.push('export const blogPosts: BlogPost[] = [');
  for (const post of posts) {
    lines.push(`  {`);
    lines.push(`    slug: ${escape(post.slug)},`);
    lines.push(`    title: ${escape(post.title)},`);
    lines.push(`    excerpt: ${escape(post.excerpt)},`);
    lines.push(`    content: ${escape(post.content)},`);
    if (post.coverImage) lines.push(`    coverImage: ${escape(post.coverImage)},`);
    lines.push(`    categorySlug: ${escape(post.categorySlug)},`);
    lines.push(`    tags: ${JSON.stringify(post.tags)},`);
    lines.push(`    publishedAt: ${escape(post.publishedAt)},`);
    lines.push(`    authorName: ${escape(post.authorName)},`);
    lines.push(`  },`);
  }
  lines.push('];');
  lines.push('');

  lines.push('export const forumCategories: ForumCategory[] = [');
  for (const cat of categories.forum) {
    lines.push(`  { slug: ${escape(cat.slug)}, title: ${escape(cat.title)}, description: ${escape(cat.description)}, icon: ${cat.icon ? escape(cat.icon) : 'undefined'} },`);
  }
  lines.push('];');
  lines.push('');

  lines.push('export const forumThreads: ForumThread[] = [');
  for (const thread of threads) {
    lines.push(`  {`);
    lines.push(`    id: ${escape(thread.id)},`);
    lines.push(`    title: ${escape(thread.title)},`);
    lines.push(`    categorySlug: ${escape(thread.categorySlug)},`);
    lines.push(`    authorName: ${escape(thread.authorName)},`);
    lines.push(`    createdAt: ${escape(thread.createdAt)},`);
    lines.push(`    replyCount: ${thread.replyCount},`);
    if (thread.lastReplyAt) lines.push(`    lastReplyAt: ${escape(thread.lastReplyAt)},`);
    lines.push(`    content: ${escape(thread.content)},`);
    lines.push(`  },`);
  }
  lines.push('];');
  lines.push('');

  lines.push('export const forumReplies: ForumReply[] = [');
  for (const reply of replies) {
    lines.push(`  {`);
    lines.push(`    id: ${escape(reply.id)},`);
    lines.push(`    threadId: ${escape(reply.threadId)},`);
    lines.push(`    authorName: ${escape(reply.authorName)},`);
    if (reply.authorEmail) lines.push(`    authorEmail: ${escape(reply.authorEmail)},`);
    lines.push(`    createdAt: ${escape(reply.createdAt)},`);
    lines.push(`    content: ${escape(reply.content)},`);
    lines.push(`  },`);
  }
  lines.push('];');
  lines.push('');

  lines.push('export function getBlogPost(slug: string): BlogPost | undefined {');
  lines.push('  return blogPosts.find((post) => post.slug === slug);');
  lines.push('}');
  lines.push('');
  lines.push('export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {');
  lines.push('  return blogPosts.filter((post) => post.categorySlug === categorySlug);');
  lines.push('}');
  lines.push('');
  lines.push('export function getForumThread(id: string): ForumThread | undefined {');
  lines.push('  return forumThreads.find((thread) => thread.id === id);');
  lines.push('}');
  lines.push('');
  lines.push('export function getForumThreadsByCategory(categorySlug: string): ForumThread[] {');
  lines.push('  return forumThreads.filter((thread) => thread.categorySlug === categorySlug);');
  lines.push('}');
  lines.push('');
  lines.push('export function getForumReplies(threadId: string): ForumReply[] {');
  lines.push('  return forumReplies.filter((reply) => reply.threadId === threadId);');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const categories = readCategories();
  const blogDir = path.join(contentDir, 'blog');
  const forumDir = path.join(contentDir, 'forum');

  let posts = readBlogPosts(blogDir);
  let threads = readForumThreads(forumDir);
  let replies = readForumReplies(forumDir);

  if (posts.length === 0 && fs.existsSync(seedFile)) {
    const seedModule = (await import(seedFile)) as any;
    posts = seedModule.blogPosts || [];
  }
  if (threads.length === 0 && fs.existsSync(seedFile)) {
    const seedModule = (await import(seedFile)) as any;
    threads = seedModule.forumThreads || [];
  }

  const ts = generateTS(categories, posts, threads, replies);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, ts, 'utf-8');

  console.log(`Generated ${outFile}`);
  console.log(`  ${posts.length} blog posts`);
  console.log(`  ${threads.length} forum threads`);
  console.log(`  ${replies.length} forum replies`);
}

main();
