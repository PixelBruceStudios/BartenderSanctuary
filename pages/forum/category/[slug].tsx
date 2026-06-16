import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '@/components/SEO';
import CategoryNav from '@/components/forum/CategoryNav';
import ThreadList from '@/components/forum/ThreadList';
import { forumCategories, getForumThreadsByCategory } from '@/data/blog.generated';

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
    setLoading(true);
    fetch('/api/forum/threads')
      .then((r) => r.json())
      .then((data) => {
        const filtered = activeSlug === 'all' ? data : data.filter((t: any) => t.categorySlug === activeSlug);
        setThreads(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  return (
    <>
      <SEO
        title={active ? `${active.title} — Forum` : 'Forum'}
        description={active?.description || 'Forum threads.'}
        path={`/forum/category/${categorySlug}`}
      />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
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
