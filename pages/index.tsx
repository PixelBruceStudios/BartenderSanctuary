import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/contexts';
import { matchCocktails, getMissingIngredients, getMissingIngredientGroups } from '@/lib/matching';
import CocktailCard from '@/components/CocktailCard';
import IngredientCombobox from '@/components/IngredientCombobox';
import PantryTool from '@/components/PantryTool';
import RecipeDisplay from '@/components/RecipeDisplay';
import AffiliateBar from '@/components/AffiliateBar';
import RecipeModal from '@/components/RecipeModal';
import Hero from '@/components/Hero';
import FeaturedSection from '@/components/FeaturedSection';
import type { Cocktail } from '@/data/cocktails';
import SEO from '@/components/SEO';

const techniqueMap: Record<string, string> = {
  'milk-wash': 'Requires Milk Wash technique',
  'clarified': 'Requires Clarification (milk or agar)',
  'fat-wash': 'Requires Fat Wash technique',
  'agar': 'Requires Agar clarification',
  'stirred': 'Technique: Stirred',
  'shaken': 'Technique: Shaken',
  'built': 'Technique: Built in glass'
};

function techniqueSuggestions(selectedBases: string[], selectedMods: string[]): string[] {
  const suggestions: string[] = [];
  if (selectedBases.includes('whiskey') && selectedMods.includes('dairy')) {
    suggestions.push('Try a Milk Wash for silky, clarified spirit');
  }
  if (selectedBases.includes('whiskey') && selectedMods.includes('fat')) {
    suggestions.push('Try Fat Washing with browned butter or bacon fat');
  }
  if (selectedMods.includes('egg')) {
    suggestions.push('Dry shake without ice first for maximum foam');
  }
  if (selectedBases.includes('gin') && selectedMods.includes('herbal')) {
    suggestions.push('Muddle herbs gently — over-muddling releases bitterness');
  }
  return [...new Set(suggestions)];
}

export default function Home() {
  const { t } = useTranslation();
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'tool'>('browse');
  const [selectedBases, setSelectedBases] = useState<string[]>([]);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Cocktail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeShowOz, setRecipeShowOz] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch('/api/cocktails')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load cocktails');
        return r.json();
      })
      .then((data: Cocktail[]) => {
        if (cancelled) return;
        const clean = data.filter((c): c is Cocktail => Boolean(c?.slug && c?.name));
        setCocktails(clean);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const allBases = useMemo(
    () => [...new Set(cocktails.flatMap((c) => c.base ?? []))].sort(),
    [cocktails]
  );
  const allMods = useMemo(
    () => [...new Set(cocktails.flatMap((c) => c.modifiers ?? []))].sort(),
    [cocktails]
  );

  const matches = useMemo(
    () => matchCocktails(cocktails, selectedBases, selectedMods, []),
    [selectedBases, selectedMods, cocktails]
  );

  const filteredCocktails = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return cocktails;
    return cocktails.filter(
      (c) =>
        (c.name ?? '').toLowerCase().includes(q) ||
        (c.tags ?? []).some((tag) => (tag ?? '').toLowerCase().includes(q)) ||
        (c.story ?? '').toLowerCase().includes(q)
    );
  }, [searchQuery, cocktails]);

  const suggestions = useMemo(
    () => techniqueSuggestions(selectedBases, selectedMods),
    [selectedBases, selectedMods]
  );

  const toggleIngredient = (category: 'base' | 'mod', value: string) => {
    const setter = category === 'base' ? setSelectedBases : setSelectedMods;
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleCocktailClick = (cocktail: Cocktail) => {
    setSelectedRecipe(cocktail);
  };

  const handleSurpriseMe = () => {
    if (!cocktails.length) return;
    const random = cocktails[Math.floor(Math.random() * cocktails.length)];
    setActiveTab('tool');
    setSelectedBases(random.base);
    setSelectedMods(random.modifiers);
  };

  if (error) {
    return (
      <div className="container-narrow" style={{ paddingTop: '4rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <SEO title="Bartender Sanctuary" description={t('heroDescription')} path="/" />
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Unable to load</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Bartender Sanctuary — ${t('heroTitlePrefix')} ${t('heroTitleAccent')}`}
        description="Explore Bartender Sanctuary's complete cocktail recipe collection. From timeless classics to modern craft cocktails, find step-by-step instructions, bartending techniques, and the rich history behind every drink."
        path="/"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero
        t={t}
        cocktailsCount={cocktails.length}
        basesCount={new Set(allBases).size}
        onFindDrink={() => setActiveTab('tool')}
        onBrowse={() => setActiveTab('browse')}
      />

      <main className="container">
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: '0.6rem'
          }}
        >
          {(['browse', 'tool'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#fff' : 'var(--color-text-muted)',
                fontSize: '1rem',
                padding: '0.6rem 1.2rem',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                fontWeight: activeTab === tab ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'browse' ? t('tabBrowse') : t('tabTool')}
            </button>
          ))}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <a
              href="/school"
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              {t('tabSchoolLink')}
            </a>
            <a
              href="/ingredients"
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Ingredient Library
            </a>
            <a
              href="/games"
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              {t('tabGamesLink')}
            </a>
            <a
              href="/blog"
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Blog
            </a>
            <a
              href="/forum"
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Forum
            </a>
            <Link
              href="/search"
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Search
            </Link>
          </div>
        </div>

        <FeaturedSection />

        {activeTab === 'browse' && (
          <div className="animate-fade-in">
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <svg
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  width: '18px',
                  height: '18px'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {loading ? (
              <div style={{ color: 'var(--color-text-muted)', padding: '3rem 0', textAlign: 'center' }}>
                Loading cocktails…
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {filteredCocktails.map((c, i) => (
                  <div key={c.slug} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                    <CocktailCard cocktail={c} onClick={() => handleCocktailClick(c)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tool' && <PantryTool cocktails={cocktails} />}
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem',
          borderTop: '1px solid var(--color-border)',
          marginTop: '3rem'
        }}
      >
        {t('footerText')}
      </footer>

      <RecipeModal
        cocktail={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        showOz={recipeShowOz}
        onToggleUnits={() => setRecipeShowOz((prev) => !prev)}
      />
    </>
  );
}
