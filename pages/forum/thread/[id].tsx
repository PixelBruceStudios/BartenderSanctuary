import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getForumThread, getForumReplies, forumCategories } from '@/data/blog.generated';

export default function ForumThreadPage({ thread, replies: initialReplies }: { thread: any; replies: any[] }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replies, setReplies] = useState<any[]>(initialReplies || []);
  const [session, setSession] = useState<{ user?: { email?: string } }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((s) => setSession(s || {}))
      .catch(() => setSession({}));
  }, []);

  if (!thread) {
    return (
      <div className="container-narrow" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1>Thread not found</h1>
        <Link href="/forum" style={{ color: 'var(--color-accent)' }}>← Back to forum</Link>
      </div>
    );
  }

  const currentEmail = session.user?.email || '';

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) return setError('Reply cannot be empty.');
    setSubmitting(true);
    const res = await fetch(`/api/forum/threads/${thread.id}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: trimmed }),
    });
    const json = await res.json();
    if (!res.ok) return setError(json.error || 'Failed to post reply.');
    setContent('');
    const refreshed = await fetch(`/api/forum/threads/${thread.id}`).then((r) => r.json());
    if (refreshed?.replies) setReplies(refreshed.replies);
    setSubmitting(false);
  }

  async function deleteReply(replyId: string) {
    if (!confirm('Delete this reply?')) return;
    const res = await fetch(`/api/forum/threads/${thread.id}/replies/${replyId}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) return alert(json.error || 'Failed to delete.');
    setReplies(replies.filter((r) => r.id !== replyId));
  }

  async function saveEdit(reply: any) {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    const res = await fetch(`/api/forum/threads/${thread.id}/replies/${reply.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: trimmed }),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || 'Failed to save.');
    setReplies(replies.map((r) => (r.id === reply.id ? { ...r, content: trimmed } : r)));
    setEditingId(null);
  }

  async function deleteThread() {
    if (!confirm('Delete this entire thread? This cannot be undone.')) return;
    const res = await fetch(`/api/forum/threads/${thread.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) return alert(json.error || 'Failed to delete.');
    window.location.href = '/forum';
  }

  async function updateThread() {
    const title = prompt('Title', thread.title);
    if (!title) return;
    const res = await fetch(`/api/forum/threads/${thread.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, categorySlug: thread.categorySlug, content: thread.content }),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || 'Failed to update.');
    window.location.reload();
  }

  return (
    <>
      <Head>
        <title>{thread.title} — Forum — Bartender Sanctuary</title>
        <meta name="description" content={thread.title} />
      </Head>

      <article className="container-narrow" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/forum" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            ← Back to forum
          </Link>
        </div>

        <header style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {thread.categorySlug}
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', marginBottom: '0.5rem', lineHeight: 1.2 }}>{thread.title}</h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {thread.authorName} · {new Date(thread.createdAt).toLocaleString()} · {thread.replyCount ?? replies.length} replies
          </div>
        </header>

        <div
          style={{
            borderRadius: '14px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div className="blog-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{thread.content}</ReactMarkdown>
          </div>

          {currentEmail === thread.authorEmail && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                onClick={updateThread}
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={deleteThread}
                style={{
                  background: 'var(--color-surface)',
                  color: '#e57373',
                  border: '1px solid var(--color-border)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Replies</h2>
          {replies.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No replies yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    borderRadius: '12px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    {reply.authorName} · {new Date(reply.createdAt).toLocaleString()}
                  </div>
                  <div className="blog-prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply.content}</ReactMarkdown>
                  </div>

                  {currentEmail === reply.authorEmail && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => { setEditingId(reply.id); setEditContent(reply.content); }}
                        style={{
                          background: 'var(--color-surface)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)',
                          padding: '0.35rem 0.7rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteReply(reply.id)}
                        style={{
                          background: 'var(--color-surface)',
                          color: '#e57373',
                          border: '1px solid var(--color-border)',
                          padding: '0.35rem 0.7rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {editingId === reply.id && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        style={{
                          width: '100%',
                          background: 'var(--color-bg)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={() => saveEdit(reply)}
                          style={{
                            background: 'var(--color-accent)',
                            color: '#fff',
                            border: 'none',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            background: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Post a reply</h2>
          <form
            onSubmit={submitReply}
            style={{
              borderRadius: '14px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '1rem',
            }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your reply..."
              rows={5}
              style={{
                width: '100%',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '0.75rem',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={async () => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append('file', file);
                    const res = await fetch('/api/forum/upload', { method: 'POST', body: form });
                    const json = await res.json();
                    if (res.ok && json.url) {
                      setContent((c) => `${c}\n\n![image](${json.url})\n`);
                    } else {
                      alert(json.error || 'Upload failed.');
                    }
                  };
                  input.click();
                }}
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Add image
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Posting...' : 'Post reply'}
              </button>
            </div>
            {error && <p style={{ color: '#e57373', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
          </form>
        </section>
      </article>
    </>
  );
}

export async function getServerSideProps(context: { params: { id?: string } }) {
  const id = context.params?.id;
  if (!id || typeof id !== 'string') {
    return { props: { thread: null, replies: [] } };
  }
  const thread = getForumThread(id);
  const replies = getForumReplies(id);
  return { props: { thread: thread || null, replies: replies || [] } };
}
