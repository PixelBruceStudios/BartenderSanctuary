export interface BlogPost {
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

export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ForumThread {
  id: string;
  title: string;
  categorySlug: string;
  authorName: string;
  createdAt: string;
  replyCount: number;
  lastReplyAt?: string;
}

export interface ForumCategory {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}
