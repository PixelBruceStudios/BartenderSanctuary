import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '@/components/SEO';
import CategoryNav from '@/components/blog/CategoryNav';
import PostCard from '@/components/blog/PostCard';
import { blogCategories, getBlogPostsByCategory } from '@/data/blog.generated';

export default function BlogCategory({ categorySlug }: { categorySlug: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const active = blogCategories.find((c) => c.slug === categorySlug) || null;

  useEffect(() => {
    setLoading(true);
    fetch('/api/blog/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.filter((p: any) => p.categorySlug === categorySlug));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  return (
    <>
      <SEO
        title={active ? `${active.title} — Blog` : 'Blog'}
        description={active?.description || 'Blog posts.'}
        path={`/blog/category/${categorySlug}`}
      />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>← All posts</Link>
        </div>

        <h1 style={{ marginBottom: '1.5rem' }}>{active?.title || 'Category'}</h1>

        <CategoryNav categories={blogCategories} activeSlug={categorySlug} onChange={() => {}} />

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading posts…</p>
        ) : posts.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No posts in this category yet.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
