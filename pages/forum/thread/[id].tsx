import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getForumThread } from '@/data/blog.generated';

export default function ForumThreadPage({ thread }: { thread: any }) {
  if (!thread) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1>Thread not found</h1>
        <Link href="/forum" style={{ color: 'var(--color-accent)' }}>← Back to forum</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{thread.title} — Forum — Bartender Sanctuary</title>
        <meta name="description" content={thread.title} />
      </Head>

      <article style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/forum" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            ← Back to forum
          </Link>
        </div>

        <h1 style={{ marginBottom: '0.6rem' }}>{thread.title}</h1>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {thread.authorName} · {new Date(thread.createdAt).toLocaleString()} · {thread.replyCount} replies
        </div>

        <div
          style={{
            borderRadius: '14px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
          }}
        >
          <p style={{ color: 'var(--color-text-secondary)' }}>Thread content goes here.</p>
        </div>
      </article>
    </>
  );
}

export async function getServerSideProps(context: { params: { id?: string } }) {
  const id = context.params?.id;
  if (!id || typeof id !== 'string') {
    return { props: { thread: null } };
  }
  const thread = getForumThread(id);
  return { props: { thread: thread || null } };
}
