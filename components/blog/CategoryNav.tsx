import Link from 'next/link';
import type { BlogCategory } from '@/types/blog';

export default function CategoryNav({ categories, activeSlug, onChange }: { categories: BlogCategory[]; activeSlug: string; onChange: (slug: string) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          style={{
            background: activeSlug === cat.slug ? 'var(--color-accent)' : 'var(--color-surface)',
            border: 'none',
            color: activeSlug === cat.slug ? '#fff' : 'var(--color-text-secondary)',
            padding: '0.55rem 1rem',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeSlug === cat.slug ? 600 : 500,
          }}
        >
          <span style={{ marginRight: '0.35rem' }}>{cat.icon}</span>
          {cat.title}
        </button>
      ))}
    </div>
  );
}
