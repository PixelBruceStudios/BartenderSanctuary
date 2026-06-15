import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
      <Head>
        <title>Forum — Bartender Sanctuary</title>
        <meta name="description" content="Community forum for bartenders and enthusiasts." />
      </Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Forum</h1>

        <CategoryNav categories={forumCategories} activeSlug={activeSlug} onChange={load} />

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading threads…</p>
        ) : (
          <ThreadList threads={threads} />
        )}
      </div>
    </>
  );
}
