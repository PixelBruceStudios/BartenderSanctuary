import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '@/components/SEO';
import CategoryNav from '@/components/forum/CategoryNav';
import ThreadList from '@/components/forum/ThreadList';
import { forumCategories, getForumThreadsByCategory } from '@/data/blog.generated';

export default function ForumIndex() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeSlug, setActiveSlug] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = (slug: string) => {
    setLoading(true);
    setActiveSlug(slug);
  };

  useEffect(() => {
    fetch('/api/forum/threads')
      .then((r) => r.json())
      .then((data) => {
        const filtered = activeSlug === 'all' ? data : data.filter((t: any) => t.categorySlug === activeSlug);
        setThreads(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeSlug]);

  return (
    <>
      <SEO
        title="Forum"
        description="Community forum for bartenders and enthusiasts."
        path="/forum"
      />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0 }}>Forum</h1>
          <Link
            href="/forum/new"
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            New Topic
          </Link>
        </div>

        <CategoryNav categories={forumCategories} activeSlug={activeSlug} onChange={load} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Link href="/search" style={{ fontSize: '0.9rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>Search</Link>
        </div>
        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading threads…</p>
        ) : (
          <ThreadList threads={threads} />
        )}
      </div>
    </>
  );
}
