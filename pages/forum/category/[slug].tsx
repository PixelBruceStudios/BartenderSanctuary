import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CategoryNav from '@/components/forum/CategoryNav';
import ThreadList from '@/components/forum/ThreadList';
import { forumCategories, getForumThreadsByCategory } from '@/data/blog';

export default function ForumCategory({ categorySlug }: { categorySlug: string }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeSlug, setActiveSlug] = useState('all');
  const [loading, setLoading] = useState(true);
  const active = forumCategories.find((c) => c.slug === categorySlug) || null;

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
        <title>{active ? `${active.title} — Forum` : 'Forum'} — Bartender Sanctuary</title>
        <meta name="description" content={active?.description || 'Forum threads.'} />
      </Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/forum" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>← All threads</Link>
        </div>

        <h1 style={{ marginBottom: '1.5rem' }}>{active?.title || 'Forum'}</h1>

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

export async function getServerSideProps(context: { params: { slug?: string } }) {
  const slug = context.params?.slug;
  if (!slug || typeof slug !== 'string') {
    return { props: { categorySlug: 'general' } };
  }
  return { props: { categorySlug: slug } };
}
