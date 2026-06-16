import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { forumCategories } from '@/data/blog.generated';

export default function NewTopicPage() {
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState(forumCategories[0]?.slug || '');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return setError('Title and content are required.');
    setSubmitting(true);
    const res = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmedTitle, categorySlug, content: trimmedContent }),
    });
    const json = await res.json();
    if (!res.ok) return setError(json.error || 'Failed to create topic.');
    window.location.href = `/forum/thread/${json.threadId}`;
  }

  return (
    <>
      <Head>
        <title>New Topic — Forum — Bartender Sanctuary</title>
        <meta name="description" content="Start a new forum discussion." />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/forum" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            ← Back to forum
          </Link>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', marginBottom: '1.5rem' }}>Start a new topic</h1>

        <form
          onSubmit={submit}
          style={{
            borderRadius: '14px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-text-secondary)' }}>
              Category
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '0.65rem 0.75rem',
                fontSize: '0.95rem',
              }}
            >
              {forumCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-text-secondary)' }}>
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What’s the topic?"
              maxLength={200}
              style={{
                width: '100%',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '0.65rem 0.75rem',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-text-secondary)' }}>
              Body
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post..."
              rows={8}
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
          </div>

          {error && <p style={{ color: '#e57373', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                padding: '0.65rem 1rem',
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
                padding: '0.7rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Creating...' : 'Create topic'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
