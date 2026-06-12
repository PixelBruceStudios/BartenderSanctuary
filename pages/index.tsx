import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useTranslation } from '@/lib/contexts';
import { matchCocktails, getMissingIngredients, getMissingIngredientGroups } from '@/lib/matching';
import CocktailCard from '@/components/CocktailCard';
import IngredientCombobox from '@/components/IngredientCombobox';
import PantryTool from '@/components/PantryTool';
import RecipeDisplay from '@/components/RecipeDisplay';
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
  const [selectedCustom, setSelectedCustom] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['base', 'mod']));

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
        setCocktails(data);
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
    () => [...new Set(cocktails.flatMap((c) => c.base))].sort(),
    [cocktails]
  );
  const allMods = useMemo(
    () => [...new Set(cocktails.flatMap((c) => c.modifiers))].sort(),
    [cocktails]
  );

  const filteredCocktails = useMemo(() => {
    if (!searchQuery.trim()) return cocktails;
    const q = searchQuery.toLowerCase();
    return cocktails.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        c.story.toLowerCase().includes(q)
    );
  }, [searchQuery, cocktails]);

  const matches = useMemo(
    () => matchCocktails(cocktails, selectedBases, selectedMods, selectedCustom),
    [selectedBases, selectedMods, selectedCustom, cocktails]
  );

  const suggestions = useMemo(
    () => techniqueSuggestions(selectedBases, selectedMods),
    [selectedBases, selectedMods]
  );

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleIngredient = (category: 'base' | 'mod', value: string) => {
    const setter = category === 'base' ? setSelectedBases : setSelectedMods;
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const addCustomIngredient = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedCustom.includes(trimmed)) {
      setSelectedCustom((prev) => [...prev, trimmed]);
    }
    setCustomInput('');
  };

  const removeCustomIngredient = (value: string) => {
    setSelectedCustom((prev) => prev.filter((v) => v !== value));
  };

  const clearCustomIngredients = () => {
    setSelectedCustom([]);
    setCustomInput('');
  };

  const handleCocktailClick = (cocktail: Cocktail) => {
    setActiveTab('tool');
    setSelectedBases(cocktail.base);
    setSelectedMods(cocktail.modifiers);
    const existing = new Set([...cocktail.base, ...cocktail.modifiers].map((i) => i.toLowerCase()));
    const extras = (cocktail.ingredients || [])
      .map((i) => i.item)
      .filter((item) => !existing.has(item.toLowerCase()));
    if (extras.length) {
      setSelectedCustom((prev) => {
        const merged = new Set([...prev, ...extras]);
        return [...merged];
      });
    }
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
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <SEO title="Bartender Sanctuary" description={t('heroDescription')} path="/" />
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Unable to load</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Bartender Sanctuary — ${t('heroTitlePrefix')} ${t('heroTitleAccent')}`}</title>
        <meta name="description" content={t('heroDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SEO
        title={`Bartender Sanctuary — ${t('heroTitlePrefix')} ${t('heroTitleAccent')}`}
        description={t('heroDescription')}
        path="/"
      />

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--color-border)',
          background: 'linear-gradient(135deg, #0a0a14 0%, #0f0f1f 50%, #0a0a14 100%)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '5rem 1.5rem 4rem',
            textAlign: 'center'
          }}
        >
          <div className="animate-fade-in-up">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                background: 'rgba(26, 26, 36, 0.6)',
                backdropFilter: 'blur(8px)',
                marginBottom: '1.5rem'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 8px var(--color-accent)'
                }}
              />
              {t('heroCocktailChemistry')}
            </span>
          </div>

          <h1
            className="animate-fade-in-up stagger-1"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em'
            }}
          >
            {t('heroTitlePrefix')}{' '}
            <span className="gradient-text">{t('heroTitleAccent')}</span>
          </h1>

          <p
            className="animate-fade-in-up stagger-2"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: 1.7
            }}
          >
            {t('heroDescription')}
          </p>

          <div
            className="animate-fade-in-up stagger-3"
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button className="btn-primary" onClick={() => setActiveTab('tool')}>
              {t('btnFindDrink')}
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('browse')}>
              {t('btnBrowseCocktails')}
            </button>
          </div>

          <div
            className="animate-fade-in-up stagger-4"
            style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              marginTop: '3rem',
              flexWrap: 'wrap'
            }}
          >
            {[
              { value: `${cocktails.length}+`, label: t('statCocktails') },
              { value: `${new Set(allBases).size}+`, label: t('statTechniques') },
              { value: '∞', label: t('statPossibilities') }
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: 'var(--color-accent)'
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '0.2rem'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4"
        style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(88,28,135,0.08) 50%, rgba(15,23,42,0) 100%)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
          <h2
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              fontFamily: "'Playfair Display', Georgia, serif",
              background: 'linear-gradient(135deg, #f472b6, #c084fc, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}
          >
            {t('sectionGames')}
          </h2>
          <p
            className="animate-fade-in-up stagger-1"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
              maxWidth: '640px',
              margin: '0 auto 2rem',
              lineHeight: 1.7
            }}
          >
            {t('sectionGamesDescription')}
          </p>
          <div
            className="animate-fade-in-up stagger-2"
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2.5rem'
            }}
          >
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>🎡 Sip Roulette</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.3)' }}>🤫 Never Have I Ever</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>💣 Tick-Tick-Boom!</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>🎲 Drinkopoly</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>🃏 Higher / Lower</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}>🧠 Chimp Memory</span>
          </div>
          <a
            href="/games"
            className="animate-fade-in-up stagger-3 inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.35)',
              textDecoration: 'none'
            }}
          >
            {t('btnPlayGames')}
            <span style={{ fontSize: '1.1rem' }}>→</span>
          </a>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.5rem',
            alignItems: 'center',
            flexWrap: 'wrap'
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
          <a
            href="/school"
            style={{
              marginLeft: 'auto',
              marginRight: '1rem',
              fontSize: '0.9rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            {t('tabSchoolLink')}
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
        </div>

        <section
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            background: 'var(--color-bg-elevated)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-accent)'
                }}
              >
                {t('featuredLearn')}
              </span>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginTop: '0.4rem',
                  marginBottom: '0.6rem',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              >
                {t('featuredLearnTitle')}
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}
              >
                {t('featuredLearnDesc')}
              </p>
              <a href="/school" className="btn-primary" style={{ display: 'inline-flex' }}>
                {t('featuredLearnLink')}
              </a>
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-accent)'
                }}
              >
                {t('featuredPlay')}
              </span>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginTop: '0.4rem',
                  marginBottom: '0.6rem',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              >
                {t('featuredPlayTitle')}
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}
              >
                {t('featuredPlayDesc')}
              </p>
              <a href="/games" className="btn-primary" style={{ display: 'inline-flex' }}>
                {t('featuredPlayLink')}
              </a>
            </div>
          </div>
        </section>

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
            {!loading && filteredCocktails.length === 0 && (
              <div className="empty-state">{t('noResults')}</div>
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
    </>
  );
}
