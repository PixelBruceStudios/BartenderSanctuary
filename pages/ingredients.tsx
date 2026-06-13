import { useState, useMemo } from 'react';
import Head from 'next/head';
import { useTranslation } from '@/lib/contexts';
import SEO from '@/components/SEO';
import { ingredients, getCategories, getIngredientByName } from '@/data/ingredients';
import { affiliateProducts } from '@/data/affiliate-products';

const CATEGORY_ICONS: Record<string, string> = {
  'Whiskies': '🥃',
  'Rums': '🏴‍☠️',
  'Gins': '🌿',
  'Tequila & Mezcal': '🌵',
  'Vodka': '❄️',
  'Liqueurs': '🍯',
  'Bitters & Aperitifs': '🌺',
  'Sherries & Vermouths': '🍷',
  'Wines & Sparkling': '🍾',
  'Juices & Mixers': '🧃',
  'Syrups & Sweeteners': '🍬',
  'Fresh & Garnish': '🍋',
  'Dairy & Cream': '🥛',
  'Other Spirits': '🌴',
};

function CategorySection({
  category,
  items,
  expanded,
  onToggle,
  searchQuery,
  onOpenBottles,
}: {
  category: string;
  items: typeof ingredients;
  expanded: boolean;
  onToggle: () => void;
  searchQuery: string;
  onOpenBottles: (ingredientName: string) => void;
}) {
  const { t } = useTranslation();
  const icon = CATEGORY_ICONS[category] || '📦';
  const q = searchQuery.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter((ing) => {
      const haystack = [ing.name, ing.description, ...ing.brands, ing.category, ing.notes].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [items, q]);

  if (filtered.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: expanded ? 'var(--color-surface-hover)' : 'var(--color-surface)',
          border: 'none',
          borderBottom: expanded ? '1px solid var(--color-border)' : '1px solid transparent',
          padding: '1.1rem 1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--color-text)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{icon}</span>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}>
            {category}
          </span>
          <span style={{
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.15rem 0.55rem',
            borderRadius: '999px',
          }}>
            {filtered.length}
          </span>
        </div>
        <span
          className="accordion-icon"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          {searchQuery && (
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.8rem',
              marginTop: '1rem',
              marginBottom: '0.8rem',
            }}>
              Showing {filtered.length} of {items.length} ingredients matching "{searchQuery}"
            </p>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {filtered.map((ing) => (
              <IngredientCard key={ing.name} ingredient={ing} onOpenBottles={onOpenBottles} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IngredientCard({ ingredient, onOpenBottles }: { ingredient: typeof ingredients[number]; onOpenBottles: (name: string) => void }) {
  const hasBottles = (ingredient.bottles?.length ?? 0) > 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.1rem',
        cursor: 'default',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ marginBottom: '0.6rem' }}>
        <h4 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '0.3rem',
          color: 'var(--color-text)',
          lineHeight: 1.3,
        }}>
          {ingredient.name}
        </h4>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.55,
        }}>
          {ingredient.description}
        </p>
      </div>

      {ingredient.brands.length > 0 && (
        <div style={{ marginBottom: '0.6rem' }}>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600,
            display: 'block',
            marginBottom: '0.3rem',
          }}>
            Key Brands
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {ingredient.brands.slice(0, 4).map((brand) => (
              <span
                key={brand}
                className="tag"
                style={{
                  fontSize: '0.72rem',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.18)',
                  color: 'var(--color-info)',
                }}
              >
                {brand}
              </span>
            ))}
            {ingredient.brands.length > 4 && (
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                padding: '0.15rem 0.4rem',
              }}>
                +{ingredient.brands.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {ingredient.notes && (
        <div
          style={{
            background: 'var(--color-info-bg)',
            borderLeft: '2px solid var(--color-info)',
            padding: '0.4rem 0.7rem',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.78rem',
            color: 'var(--color-info)',
            lineHeight: 1.5,
            marginBottom: hasBottles ? '0.6rem' : '0',
          }}
        >
          💡 {ingredient.notes}
        </div>
      )}

      {hasBottles && (
        <button
          onClick={() => onOpenBottles(ingredient.name)}
          style={{
            marginTop: '0.2rem',
            padding: '0.5rem 0.9rem',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🍾 View bottles ({ingredient.bottles!.length})
        </button>
      )}
    </div>
  );
}

function BottleModal({ ingredientName, onClose }: { ingredientName: string; onClose: () => void }) {
  const { t } = useTranslation();
  const ingredient = getIngredientByName(ingredientName);
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null);

  if (!ingredient) return null;

  const bottles = ingredient.bottles ?? [];
  const activeBottle = selectedBottle ? bottles.find((b) => b.name === selectedBottle) ?? null : null;

  const relatedBottles = activeBottle?.related ?? [];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.3rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
            }}>
              {ingredient.name} — Bottles
            </h3>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: '0.2rem 0 0',
            }}>
              {bottles.length} bottle{bottles.length !== 1 ? 's' : ''} in collection
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{
          overflowY: 'auto',
          flex: 1,
          padding: '1.5rem',
        }}>
          {!activeBottle ? (
            /* Bottle grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              {bottles.map((bottle) => (
                <button
                  key={bottle.name}
                  onClick={() => setSelectedBottle(bottle.name)}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-surface-hover)',
                  }}>
                    {bottle.image ? (
                      <img
                        src={bottle.image}
                        alt={bottle.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const img = e.currentTarget;
                          img.style.display = 'none';
                          const sibling = img.nextElementSibling as HTMLElement | null;
                          if (sibling) sibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{
                      display: bottle.image ? 'none' : 'flex',
                      width: '100%',
                      height: '100px',
                      background: 'linear-gradient(135deg, var(--color-bg-elevated), var(--color-surface-hover))',
                      borderRadius: '8px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      border: '1px solid var(--color-border-subtle)',
                    }}>
                      🍾
                    </div>
                  </div>
                  <div>
                    <h4 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      margin: '0 0 0.3rem',
                      lineHeight: 1.3,
                    }}>
                      {bottle.name}
                    </h4>
                    <p style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {bottle.description}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-accent)',
                    fontWeight: 500,
                    marginTop: 'auto',
                  }}>
                    View details →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Bottle detail view */
            <div>
              <button
                onClick={() => setSelectedBottle(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  padding: '0 0 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                ← Back to all bottles
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 280px) 1fr',
                gap: '1.5rem',
                alignItems: 'start',
              }}>
                {/* Bottle image */}
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  maxHeight: '320px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border-subtle)',
                  background: 'var(--color-surface-hover)',
                }}>
                  {activeBottle.image ? (
                    <img
                      src={activeBottle.image}
                      alt={activeBottle.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    display: activeBottle.image ? 'none' : 'flex',
                    width: '100%',
                    aspectRatio: '3/4',
                    maxHeight: '320px',
                    background: 'linear-gradient(135deg, var(--color-bg-elevated), var(--color-surface-hover))',
                    borderRadius: '12px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    border: '1px solid var(--color-border-subtle)',
                  }}>
                    🍾
                  </div>
                </div>

                {/* Bottle info */}
                <div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    margin: '0 0 0.6rem',
                    lineHeight: 1.25,
                  }}>
                    {activeBottle.name}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                    margin: '0 0 1.25rem',
                  }}>
                    {activeBottle.description}
                  </p>

                  {relatedBottles.length > 0 && (
                    <div>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '0.6rem',
                      }}>
                        Related Bottles
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {relatedBottles.map((rel) => {
                          const relIng = getIngredientByName(ingredientName);
                          const relBottle = relIng?.bottles?.find((b) => b.name === rel);
                          const isClickable = !!relBottle;
                          return (
                            <button
                              key={rel}
                              onClick={() => isClickable && setSelectedBottle(rel)}
                              disabled={!isClickable}
                              style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: isClickable ? 'pointer' : 'default',
                                transition: 'all 0.2s ease',
                                background: isClickable ? 'rgba(99,102,241,0.1)' : 'var(--color-surface)',
                                border: isClickable ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--color-border)',
                                color: isClickable ? 'var(--color-info)' : 'var(--color-text-muted)',
                              }}
                              onMouseOver={(e) => {
                                if (isClickable) {
                                  e.currentTarget.style.background = 'rgba(99,102,241,0.18)';
                                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                                }
                              }}
                              onMouseOut={(e) => {
                                if (isClickable) {
                                  e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                                }
                              }}
                            >
                              {isClickable ? '🍾 ' : ''}{rel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IngredientLibrary() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(), []);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const expandAll = () => setExpandedCategories(new Set(categories));
  const collapseAll = () => setExpandedCategories(new Set());

  return (
    <>
      <Head>
        <title>Ingredient Library — Bartender Sanctuary</title>
        <meta
          name="description"
          content="Explore every ingredient used across our cocktail collection: whiskies, rums, gins, liqueurs, bitters, juices, syrups, and more."
        />
      </Head>
      <SEO
        title="Ingredient Library"
        description="Explore every ingredient used across our cocktail collection."
        path="/ingredients"
      />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            marginBottom: '0.5rem',
            lineHeight: 1.15,
          }}>
            Ingredient Library
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '680px',
          }}>
            Every spirit, liqueur, mixer, and garnish used across {ingredients.length}+ cocktails.
            Click a category to explore brands, tasting notes, and classic uses.
          </p>
        </div>

        {/* Search + controls */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <svg
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                width: '16px',
                height: '16px',
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
              placeholder="Search ingredients, brands, notes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
          <button
            onClick={expandAll}
            style={{
              padding: '0.6rem 1rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            style={{
              padding: '0.6rem 1rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Collapse all
          </button>
          <span style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            marginLeft: 'auto',
          }}>
            {ingredients.length} ingredients · {categories.length} categories
          </span>
        </div>

        {/* Categories */}
        <div>
          {categories.map((cat) => {
            const items = ingredients.filter((i) => i.category === cat);
            const isExpanded = expandedCategories.has(cat);
            const isFiltered = searchQuery.trim().length > 0;

            return (
              <CategorySection
                key={cat}
                category={cat}
                items={items}
                expanded={isExpanded || isFiltered}
                onToggle={() => toggleCategory(cat)}
                searchQuery={searchQuery}
                onOpenBottles={(name) => setSelectedIngredient(name)}
              />
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="empty-state">
            No ingredients found.
          </div>
        )}
      </main>

      {/* Bottle modal */}
      {selectedIngredient && (
        <BottleModal
          ingredientName={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
        />
      )}

      {/* Affiliate sidebar */}
      <AffiliateSidebar />
    </>
  );
}

function AffiliateSidebar() {
  const topTools = affiliateProducts.filter(p => p.category === 'Tools').slice(0, 3);

  return (
    <aside
      style={{
        position: 'fixed',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 50,
      }}
    >
      <p
        style={{
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text-muted)',
          fontWeight: 600,
          margin: 0,
        }}
      >
        Top gear
      </p>
      {topTools.map(product => (
        <a
          key={product.id}
          href={`/api/affiliate-redirect?productId=${product.id}`}
          className="glass-card"
          style={{
            padding: '0.6rem',
            textDecoration: 'none',
            color: 'inherit',
            fontSize: '0.75rem',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <p style={{ fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
            {product.name}
          </p>
          <p style={{ color: 'var(--color-accent)', fontWeight: 700, margin: '0.2rem 0 0' }}>
            {product.price}
          </p>
        </a>
      ))}
    </aside>
  );
}
