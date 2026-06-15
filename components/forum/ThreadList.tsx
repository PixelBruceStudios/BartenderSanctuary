import Link from 'next/link';
import type { ForumThread } from '@/types/blog';

export default function ThreadList({ threads }: { threads: ForumThread[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {threads.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No threads yet.</p>
      ) : (
        threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/forum/thread/${thread.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                borderRadius: '12px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{thread.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  {thread.authorName} · {new Date(thread.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {thread.replyCount} replies
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
