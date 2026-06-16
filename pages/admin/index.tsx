import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { blogPosts, forumThreads } from '@/data/blog.generated';

const ADMIN_EMAILS = new Set(['pixelbruce.3d@gmail.com']);

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<'blog' | 'forum'>('blog');
  const isAdmin = !!session?.user?.email && ADMIN_EMAILS.has(session.user.email);

  if (status === 'loading') return <div className="container" style={{ paddingTop: '2rem' }}>Loading…</div>;
  if (!isAdmin) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1>Admin</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Sign in with an admin account to continue.</p>
        <Link href="/auth/signin" className="btn-primary" style={{ display: 'inline-block', marginTop: '0.75rem' }}>Sign in</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin — Bartender Sanctuary</title>
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h1 style={{ margin: 0 }}>Admin CMS</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn-secondary ${tab === 'blog' ? 'btn-primary' : ''}`} onClick={() => setTab('blog')}>Blog</button>
            <button className={`btn-secondary ${tab === 'forum' ? 'btn-primary' : ''}`} onClick={() => setTab('forum')}>Forum</button>
          </div>
        </div>

        {tab === 'blog' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <Link href="/admin/blog/new" className="btn-primary" style={{ display: 'inline-block' }}>New blog post</Link>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {blogPosts.map((post) => (
                <div key={post.slug} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{post.title}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{post.categorySlug || 'Uncategorized'} · {post.slug}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/blog/${post.slug}`} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.9rem' }}>View</Link>
                    <Link href={`/admin/blog/${post.slug}`} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.9rem' }}>Edit</Link>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No blog posts yet.</p>}
            </div>
          </div>
        )}

        {tab === 'forum' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <Link href="/admin/forum/new" className="btn-primary" style={{ display: 'inline-block' }}>New thread</Link>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {forumThreads.map((thread) => (
                <div key={thread.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{thread.title}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{thread.categorySlug} · {thread.replyCount ?? 0} replies</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/forum/thread/${thread.id}`} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.9rem' }}>View</Link>
                    <Link href={`/admin/forum/${thread.id}`} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.9rem' }}>Edit</Link>
                  </div>
                </div>
              ))}
              {forumThreads.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No forum threads yet.</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
