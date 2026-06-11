import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/contexts';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  content: string;
  sort_order: number;
  sources: { citation: string; url: string }[];
}

interface LessonProps {
  categorySlug: string;
  techniqueSlug: string;
  lessonId: string;
}

function LessonContent({ categorySlug, techniqueSlug, lessonId }: LessonProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Lesson not found');
        return r.json();
      })
      .then((data: Lesson) => {
        if (cancelled) return;
        setLesson(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [lessonId]);

  if (loading) {
    return <div style={{ color: 'var(--color-text-muted)', padding: '3rem 0' }}>Loading lesson…</div>;
  }
  if (error || !lesson) {
    return <div style={{ color: '#fca5a5', padding: '3rem 0' }}>{error || 'Lesson not found'}</div>;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>
            Lesson
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, lineHeight: 1.2 }}>
            {lesson.title}
          </h1>
        </div>
        <span
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)'
          }}
        >
          {lesson.difficulty}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)'
        }}
      >
        <span>{lesson.duration}</span>
        <span>·</span>
        <span>{lesson.difficulty}</span>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ color: 'var(--color-text)', lineHeight: 1.9, fontSize: '1.05rem' }}>
          {lesson.content.split('\n\n').map((paragraph, i) => (
            <p key={i} style={{ marginBottom: '1rem' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {lesson.sources && lesson.sources.length > 0 && (
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--color-text-muted)' }}>
              Sources &amp; Further Reading
            </h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              {lesson.sources.map((source, i) => (
                <li key={i}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                      {source.citation}
                    </a>
                  ) : (
                    source.citation
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <Link
          href="/school"
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          ← Back to school
        </Link>
      </div>
    </div>
  );
}

export default function LessonPage({ categorySlug, techniqueSlug, lessonId }: LessonProps) {
  return (
    <>
      <Head>
        <title>{`Lesson | Bartender School`}</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <nav
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/school" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>School</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text)' }}>Lesson</span>
        </nav>

        <LessonContent categorySlug={categorySlug} techniqueSlug={techniqueSlug} lessonId={lessonId} />
      </div>
    </>
  );
}
