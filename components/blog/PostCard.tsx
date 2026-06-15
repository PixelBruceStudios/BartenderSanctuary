import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

export default function PostCard({ post }: { post: BlogPost & { category?: { title: string; slug: string } | null } }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          borderRadius: '14px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, border-color 0.2s ease',
        }}
      >
        {post.coverImage && (
          <div
            style={{
              height: '180px',
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginBottom: '0.35rem' }}>
            {post.category?.title || post.categorySlug}
          </div>
          <h3 style={{ marginBottom: '0.4rem', fontSize: '1.05rem' }}>{post.title}</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.7rem' }}>{post.excerpt}</p>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {new Date(post.publishedAt).toLocaleDateString()} · {post.authorName}
          </div>
        </div>
      </div>
    </Link>
  );
}
