import { useEffect, useState } from 'react';
import Head from 'next/head';

type Session = {
  user?: {
    id: string;
    email: string;
    name?: string | null;
    emailVerified: boolean;
  };
};

const LEVELS = ['Novice', 'Apprentice', 'Craftsman', 'Master', 'Legend'] as const;
type Level = (typeof LEVELS)[number];

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<Level>('Novice');
  const [progress, setProgress] = useState(12);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/auth/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => { cancelled = true };
  }, []);

  const user = session?.user;

  const initials = (user?.email || '?').slice(0, 2).toUpperCase();

  const handleSubscribe = async () => {
    setSubscribing(true);
    setSubscribeError(null);
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Subscription failed');
      setSubscribed(true);
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#08080c', color: '#fff' }}>
        <Head><title>Dashboard · Bartender Sanctuary</title></Head>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>Loading dashboard…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#08080c', color: '#fff' }}>
        <Head><title>Dashboard · Bartender Sanctuary</title></Head>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>You’re not signed in</h1>
          <p style={{ color: '#a1a1aa', marginBottom: 20 }}>Sign in to access your dashboard.</p>
          <a
            href="/auth/signin"
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08080c', color: '#e5e7eb' }}>
      <Head><title>Dashboard · Bartender Sanctuary</title></Head>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px 48px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '0.08em',
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {user.name || user.email}
            </div>
            <div style={{ fontSize: 13, color: '#a1a1aa' }}>
              {user.email} · {user.emailVerified ? 'Verified' : 'Unverified'}
            </div>
          </div>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 6 }}>Experience level</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{level}</div>
            <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 8, lineHeight: 1.5 }}>
              Placeholder until we track completed lessons and map progress to a level.
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 6 }}>Progress</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{progress}%</div>
            <div
              style={{
                marginTop: 8,
                height: 8,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 8, lineHeight: 1.5 }}>
              Placeholder progress. We’ll wire this to real lesson completion data.
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 6 }}>Subscription</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
              {subscribed ? 'Active' : 'Placeholder'}
            </div>
            <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 6, lineHeight: 1.5 }}>
              {subscribed ? 'Full access enabled' : 'No active subscription yet'}
            </div>
            {!subscribed && (
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                style={{
                  marginTop: 10,
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: subscribing ? 'not-allowed' : 'pointer',
                }}
              >
                {subscribing ? 'Subscribing…' : 'Subscribe'}
              </button>
            )}
            {subscribeError && (
              <p style={{ fontSize: 12, color: '#fca5a5', marginTop: 8 }}>{subscribeError}</p>
            )}
          </div>
        </section>

        <section
          style={{
            padding: 18,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
            Your Sanctuary Journey
          </h2>
          <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.6 }}>
            This dashboard will soon show your learning path, achievements, and subscription
            benefits. Experience level and progress are placeholders for now, and will be
            calculated from your completed lessons and quizzes.
          </p>
        </section>
      </div>
    </div>
  );
}
