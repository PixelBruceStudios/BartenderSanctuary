import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { useSession } from 'next-auth/react';

export default function AdminForumEdit({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = session?.user?.email;
  const isAdmin = email === 'pixelbruce.3d@gmail.com';

  useEffect(() => {
    if (status === 'loading' || !isAdmin) return;
    fetch(`/api/admin/content?kind=forum&slug=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) throw new Error(json.error || 'Failed to load');
        setTitle(json.data.title);
        setBody(json.data.body);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [status, isAdmin, id]);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/content?kind=forum&slug=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error || 'Failed to save.');
    else alert('Saved.');
    setSaving(false);
  }

  if (status === 'loading') return <div className="container" style={{ paddingTop: '2rem' }}>Loading…</div>;
  if (!isAdmin) return <div className="container" style={{ paddingTop: '2rem' }}>Forbidden.</div>;

  return (
    <>
      <SEO
        title="Edit thread"
        description="Edit forum thread content in the Bartender Sanctuary admin CMS."
        path={`/admin/forum/${id}`}
      />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/admin" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>← Admin</Link>
        </div>
        <h1 style={{ marginBottom: '1rem' }}>Edit thread</h1>
        {loading && <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>}
        {error && <p style={{ color: '#e57373', marginBottom: '0.75rem' }}>{error}</p>}
        <div className="container-narrow" style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="search-input"
            style={{ paddingLeft: '1rem', background: 'var(--color-bg)', color: 'var(--color-text)' }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Thread body (markdown)"
            rows={16}
            className="search-input"
            style={{ paddingLeft: '1rem', background: 'var(--color-bg)', color: 'var(--color-text)', lineHeight: 1.6 }}
          />
          <div>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ padding: '0.65rem 1rem' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: { params: { id?: string[] } }) {
  const id = (context.params?.id || []).join('/');
  return { props: { id } };
}
