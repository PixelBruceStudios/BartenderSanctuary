import { useState } from 'react';
import { useTheme } from '@/lib/theme';

export default function BugReportButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      name: (data.get('name') as string | null) || undefined,
      email: (data.get('email') as string | null) || undefined,
      description: (data.get('description') as string | null) || undefined,
    };

    if (!body.description?.trim()) {
      setError('Please describe the bug.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Failed to send.');
      }

      setSubmitted(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bug-report-trigger"
        title="Report a bug"
        aria-label="Report a bug"
      >
        <span aria-hidden="true">🐛</span>
        <span>Found a bug?</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bug-report-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              background: theme === 'dark' ? 'var(--color-bg-elevated)' : '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: '1rem',
              padding: '1.75rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3
                id="bug-report-title"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.3rem',
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                🐛 Found a bug?
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close bug report form"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  padding: '0.25rem 0.5rem',
                }}
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem 0',
                  color: 'var(--color-success)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <p style={{ color: 'var(--color-text)', margin: 0 }}>
                  Thanks! Your report has been sent.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setOpen(false);
                  }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '0.6rem',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  Something broken? Tell us what happened and we&apos;ll look into it.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label
                      htmlFor="bug-name"
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Your name (optional)
                    </label>
                    <input
                      id="bug-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Alex"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bug-email"
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Email (optional — for follow-up)
                    </label>
                    <input
                      id="bug-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bug-desc"
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      What went wrong? *
                    </label>
                    <textarea
                      id="bug-desc"
                      name="description"
                      required
                      rows={5}
                      placeholder="Describe the bug, steps to reproduce, what you expected..."
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {error && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#f87171',
                      }}
                    >
                      {error}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? 'Sending…' : 'Send report'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
