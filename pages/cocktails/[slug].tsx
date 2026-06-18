import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { cocktails } from '@/data/cocktails';
import SEO from '@/components/SEO';

export default function CocktailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const cocktail = cocktails.find((c) => c.slug === slug);

  const jsonLd = useMemo(() => {
    if (!cocktail) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: cocktail.name,
      description: cocktail.description,
      recipeIngredient: cocktail.ingredients.map((i) => `${i.qty} ${i.item}`),
      recipeInstructions: cocktail.instructions.map((step) => ({
        '@type': 'HowToStep',
        text: step,
      })),
      recipeCuisine: 'Cocktail',
      totalTime:
        cocktail.difficulty === 'Beginner'
          ? 'PT5M'
          : cocktail.difficulty === 'Intermediate'
          ? 'PT10M'
          : 'PT15M',
      keywords: cocktail.tags.join(', '),
    };
  }, [cocktail]);

  if (!cocktail) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container-narrow">
          <SEO title="Cocktail not found" description="The requested cocktail could not be found." path="/cocktails" />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Cocktail not found</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            The cocktail you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <a
            href="/"
            className="btn-primary"
            style={{ padding: '0.8rem 1.2rem', borderRadius: '0.6rem', textDecoration: 'none' }}
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={cocktail.name}
        description={cocktail.description}
        path={`/cocktails/${cocktail.slug}`}
        jsonLd={jsonLd}
      />

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2.25rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                lineHeight: 1.2,
              }}
            >
              {cocktail.name}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '720px' }}>
              {cocktail.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              {cocktail.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-accent)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                  }}
                >
                  {tag}
                </span>
              ))}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-muted)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                }}
              >
                {cocktail.difficulty}
              </span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ingredients</h2>
            <ul style={{ lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              {cocktail.ingredients.map((ing, idx) => (
                <li key={idx}>
                  <strong>{ing.qty}</strong> {ing.item}
                </li>
              ))}
            </ul>

            <h2 style={{ margin: '1.5rem 0 0.75rem' }}>Instructions</h2>
            <ol style={{ lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              {cocktail.instructions.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
