import type { BlogCategory, BlogPost, ForumCategory, ForumThread } from '@/types/blog';

export const blogCategories: BlogCategory[] = [
  { slug: 'techniques', title: 'Techniques', description: 'Bar techniques, methods, and fundamentals.', icon: '🛠️' },
  { slug: 'recipes', title: 'Recipes', description: 'Classic and modern cocktail recipes.', icon: '🍸' },
  { slug: 'ingredients', title: 'Ingredients', description: 'Spirits, mixers, and garnishes.', icon: '🧪' },
  { slug: 'career', title: 'Career', description: 'Bartending careers and industry news.', icon: '🚀' }
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'welcome-to-bartender-sanctuary',
    title: 'Welcome to Bartender Sanctuary',
    excerpt: 'A quick intro to the school and what you can learn here.',
    content: 'Full article content goes here.',
    coverImage: '/photos/placeholder.jpg',
    categorySlug: 'techniques',
    tags: ['intro', 'news'],
    publishedAt: '2026-06-01T00:00:00Z',
    authorName: 'Bartender Sanctuary',
  },
];

export const forumCategories: ForumCategory[] = [
  { slug: 'general', title: 'General', description: 'General discussion about bartending.', icon: '💬' },
  { slug: 'recipes', title: 'Recipes', description: 'Share and discuss cocktail recipes.', icon: '🍸' },
  { slug: 'techniques', title: 'Techniques', description: 'Technique tips and questions.', icon: '🛠️' },
  { slug: 'career', title: 'Career', description: 'Jobs, interviews, and industry topics.', icon: '🚀' }
];

export const forumThreads: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Best practices for stirring vs shaking',
    categorySlug: 'techniques',
    authorName: 'Mixologist101',
    createdAt: '2026-06-10T00:00:00Z',
    replyCount: 0,
    lastReplyAt: undefined,
    content: 'When should you stir and when should you shake? Let\'s discuss the fundamentals.',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.categorySlug === categorySlug);
}

export function getForumThread(id: string): ForumThread | undefined {
  return forumThreads.find((thread) => thread.id === id);
}

export function getForumThreadsByCategory(categorySlug: string): ForumThread[] {
  return forumThreads.filter((thread) => thread.categorySlug === categorySlug);
}
