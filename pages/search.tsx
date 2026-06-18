import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { blogPosts, forumThreads } from '@/data/blog.generated';
import { ingredients as ingredientList } from '@/data/ingredients';
import { cocktails as cocktailList } from '@/data/cocktails';

type ResultItem = {
  type: 'blog' | 'forum' | 'cocktail' | 'ingredient';
  title: string;
  href: string;
  snippet?: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }
    const out: ResultItem[] = [];

    for (const post of blogPosts) {
      const hay = `${post.title} ${post.excerpt || ''} ${post.content || ''}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'blog',
          title: post.title,
          href: `/blog/${post.slug}`,
          snippet: post.excerpt || post.content?.slice(0, 140),
        });
      }
    }

    for (const thread of forumThreads) {
      const hay = `${thread.title} ${thread.content || ''}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'forum',
          title: thread.title,
          href: `/forum/thread/${thread.id}`,
          snippet: thread.content?.slice(0, 140),
        });
      }
    }

    for (const c of cocktailList) {
      const ingredientText = c.ingredients?.map((x: any) => x.item).join(' ') || '';
      const instructionText = c.instructions?.join(' ') || '';
      const hay = `${c.name} ${ingredientText} ${instructionText}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'cocktail',
          title: c.name,
          href: `/cocktails/${c.slug}`,
          snippet: c.glass || c.instructions?.slice(0, 2).join(' '),
        });
      }
    }

    for (const i of ingredientList) {
      const hay = `${i.name} ${i.brands?.join(' ') || ''} ${i.notes || ''}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'ingredient',
          title: i.name,
          href: '/ingredients',
          snippet: i.brands?.join(', ') || i.notes?.slice(0, 120),
        });
      }
    }

    setResults(out.slice(0, 30));
  }, [query]);

  return (
    <>
      <SEO title="Search" description="Search blog posts, forum threads, cocktails, and ingredients." path="/search" />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Search</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cocktails, ingredients, posts, threads…"
          className="search-input"
          style={{ paddingLeft: '1rem' }}
          autoFocus
        />

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {results.length === 0 && query.trim().length > 0 && (
            <p style={{ color: 'var(--color-text-muted)' }}>No results.</p>
          )}
          {results.map((item, idx) => (
            <Link
              key={`${item.type}-${item.href}-${idx}`}
              href={item.href}
              style={{
                display: 'block',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item.type}
              </div>
              <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{item.title}</div>
              {item.snippet && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{item.snippet}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
