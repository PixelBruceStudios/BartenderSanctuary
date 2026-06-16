import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '@/components/SEO';
import CategoryNav from '@/components/blog/CategoryNav';
import PostCard from '@/components/blog/PostCard';
import { blogCategories } from '@/data/blog.generated';

export default function BlogIndex() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Blog"
        description="Bartending guides, recipes, techniques, and industry news."
        path="/blog"
      />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Blog</h1>

        <CategoryNav categories={blogCategories} activeSlug="all" onChange={() => {}} />

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading posts…</p>
        ) : posts.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No posts yet.</p>
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
