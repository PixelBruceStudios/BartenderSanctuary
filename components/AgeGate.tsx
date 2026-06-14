import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme';

type Props = { children: React.ReactNode };

const STORAGE_KEY = 'bs_age_verified';

export default function AgeGate({ children }: Props) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [showGate, setShowGate] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setVerified(true);
    } else if (stored === 'false') {
      setVerified(false);
      setShowGate(true);
    } else {
      setShowGate(true);
    }
  }, []);

  const handleConfirm = (over18: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(over18));
    setVerified(over18);
    setShowGate(false);
  };

  if (verified === null || showGate) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? 'rgba(5, 5, 10, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          padding: '1rem',
        }}
      >
        <div
          style={{
            background: theme === 'dark' ? 'var(--color-bg-elevated)' : '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.6rem',
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            🍸 Age Verification
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}
          >
            Bartender Sanctuary contains content related to alcohol and is intended
            for adults only. You must be of legal drinking age in your country to
            continue.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '0.6rem',
              }}
            >
              I am 18 or older
            </button>
            <button
              type="button"
              onClick={() => handleConfirm(false)}
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: '0.6rem',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              I am under 18
            </button>
          </div>
          <p
            style={{
              marginTop: '1.25rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
            }}
          >
            By continuing, you confirm you are of legal drinking age. We do not store
            any personal data — this is a client-side check only.
          </p>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Access Restricted</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            You must be of legal drinking age to enter Bartender Sanctuary.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
