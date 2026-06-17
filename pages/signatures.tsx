import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/SEO';

export default function Signatures() {
  return (
    <>
      <SEO
        title="Bartender Sanctuary Signatures"
        description="Original house creations from Bartender Sanctuary."
        path="/signatures"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <div
          style={{
            padding: '2rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Bartender Sanctuary Signatures</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
              House recipes — coming soon.
            </p>
          </div>
          <Link
            href="/"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Back to home
          </Link>
        </div>

        <section
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            color: 'var(--color-text-muted)'
          }}
        >
          <p>No signature recipes added yet.</p>
        </section>
      </main>
    </>
  );
}
