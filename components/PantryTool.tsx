import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/contexts';
import { matchCocktails, getMissingIngredients, getMissingIngredientGroups } from '@/lib/matching';
import IngredientCombobox from '@/components/IngredientCombobox';
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

type PantryToolProps = {
  cocktails: Cocktail[];
};

export default function PantryTool({ cocktails }: PantryToolProps) {
  const { t } = useTranslation();
  const [selectedBases, setSelectedBases] = useState<string[]>([]);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);

  const allBases = useMemo(
    () => [...new Set(cocktails.flatMap((c) => c.base))].sort(),
    [cocktails]
  );
  const allMods = useMemo(
    () => [...new Set(cocktails.flatMap((c) => c.modifiers))].sort(),
    [cocktails]
  );

  const matches = useMemo(
    () => matchCocktails(cocktails, selectedBases, selectedMods),
    [selectedBases, selectedMods, cocktails]
  );

  const suggestions = useMemo(
    () => techniqueSuggestions(selectedBases, selectedMods),
    [selectedBases, selectedMods]
  );

  return (
    <div className="animate-fade-in">
      <div
        className="glass-card"
        style={{ padding: '1.5rem', marginBottom: '2rem' }}
      >
        <h2 style={{ marginBottom: '0.5rem' }}>{t('toolTitle')}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {t('toolDescription')}
        </p>

        <IngredientCombobox
          allItems={allBases}
          selected={selectedBases}
          onAdd={(value) => setSelectedBases((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value])}
          onRemove={(value) => setSelectedBases((prev) => prev.filter((v) => v !== value))}
          placeholder="Search base spirits…"
          label={t('baseSpirits')}
          allowCustom={false}
          emptyMessage="All base spirits selected"
        />

        <div style={{ height: '1rem' }} />

        <IngredientCombobox
          allItems={allMods}
          selected={selectedMods}
          onAdd={(value) => setSelectedMods((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value])}
          onRemove={(value) => setSelectedMods((prev) => prev.filter((v) => v !== value))}
          placeholder="Search modifiers…"
          label={t('modifiers')}
          allowCustom={false}
          emptyMessage="All modifiers selected"
        />

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button
            className="btn-primary"
            onClick={() => {
              const el = document.getElementById('tool-results');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('btnFindMatches')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              if (!cocktails.length) return;
              const random = cocktails[Math.floor(Math.random() * cocktails.length)];
              setSelectedBases(random.base);
              setSelectedMods(random.modifiers);
            }}
          >
            {t('btnSurpriseMe')}
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="technique-suggestion" style={{ marginBottom: '1rem' }}>
          <strong>{t('techniqueTips')}</strong> {suggestions.join(' · ')}
        </div>
      )}

      <div id="tool-results">
        {matches.length === 0 ? (
          <div className="empty-state">
            {selectedBases.length === 0 && selectedMods.length === 0
              ? t('emptySelectIngredients')
              : t('emptyNoMatches')}
          </div>
        ) : (
          matches.map((c, i) => {
            const missing = getMissingIngredients(c, selectedBases, selectedMods);
            const isFullMatch = missing.length === 0;
            const techniqueTags = c.tags.filter((tag) =>
              ['milk-wash', 'clarified', 'fat-wash', 'agar', 'stirred', 'shaken', 'built'].includes(tag)
            );
            const techniqueNote = techniqueTags.length
              ? techniqueTags.map((tag) => techniqueMap[tag] || tag).join('<br />')
              : '';

            return (
              <div
                key={c.slug}
                className={`glass-card animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
                style={{
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  opacity: isFullMatch ? 1 : 0.85
                }}
              >
                <h3 style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  {c.name}
                  <span className="match-badge score">{c.score} match{c.score !== 1 ? 'es' : ''}</span>
                  <span className="match-badge pantry">{c.pantryScore}% pantry</span>
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.8rem' }}>
                  {c.glass} glass · {c.origin}
                </div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.7 }}>
                  {c.story}
                </div>

                {c.recipe && c.recipe.length > 0 && (
                  <div className="recipe-block">
                    <h4>{t('recipeTitle')}</h4>
                    <ul>
                      {c.recipe.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
                  {isFullMatch ? (
                    <span style={{ color: 'var(--color-success)' }}>{t('youHaveEverything')}</span>
                  ) : (
                    <div>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{t('missingLabel')}</span>
                      <div style={{ marginTop: '0.4rem' }}>
                        {(() => {
                          const groups = getMissingIngredientGroups(c, selectedBases, selectedMods);
                          if (groups.length === 0) return null;
                          return groups.map((g) => (
                            <div
                              key={g.label}
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: '0.35rem',
                                marginBottom: '0.25rem'
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.06em',
                                  color: 'var(--color-accent)',
                                  minWidth: '5.5rem'
                                }}
                              >
                                {g.label}
                              </span>
                              {g.missing.map((item) => (
                                <span
                                  key={item}
                                  style={{
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '999px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-secondary)',
                                    background: 'rgba(255,255,255,0.02)'
                                  }}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {techniqueNote && (
                  <div
                    className="technique-note"
                    style={{ marginTop: '0.8rem' }}
                    dangerouslySetInnerHTML={{ __html: techniqueNote }}
                  />
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.8rem' }}>
                  {c.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
