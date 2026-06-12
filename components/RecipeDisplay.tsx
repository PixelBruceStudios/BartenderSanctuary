'use client';

import { Cocktail } from '@/data/cocktails';
import { useState, useMemo } from 'react';

const OZ_TO_ML = 29.5735;

function convertQty(qty: string, toOz: boolean): string {
  const trimmed = qty.trim();
  const ozMatch = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)\s*oz$/i);
  const mlMatch = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)\s*ml$/i);

  if (ozMatch && toOz === false) {
    const ml = (parseFloat(ozMatch[1]) * OZ_TO_ML).toFixed(0);
    return `${ml} ml`;
  }
  if (mlMatch && toOz === true) {
    const oz = parseFloat(mlMatch[1]) / OZ_TO_ML;
    const formatted = Number.isInteger(oz) ? oz.toFixed(1) : oz.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} oz`;
  }

  return trimmed;
}

interface RecipeDisplayProps {
  cocktail: Cocktail;
}

export default function RecipeDisplay({ cocktail }: RecipeDisplayProps) {
  const [showOz, setShowOz] = useState(false);
  const ingredients = useMemo(() => {
    const list = cocktail.ingredients || [];
    return list.map((ing) => ({
      item: ing.item,
      qty: convertQty(ing.qty, showOz)
    }));
  }, [cocktail, showOz]);

  return (
    <div className="recipe-card" style={{ marginTop: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recipe</strong>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOz((prev) => !prev);
          }}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem' }}
        >
          {showOz ? 'Show ml' : 'Show oz'}
        </button>
      </div>

      <ul style={{ display: 'grid', gap: '0.35rem', paddingLeft: 0, listStyle: 'none' }}>
        {ingredients.map((ing, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 0.6rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px'
            }}
          >
            <span style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{ing.item}</span>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-accent)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {ing.qty}
            </span>
          </li>
        ))}
      </ul>

      {cocktail.instructions && cocktail.instructions.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Process</strong>
          <ol style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.35rem', marginTop: '0.5rem' }}>
            {cocktail.instructions.map((step, idx) => (
              <li key={idx} style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
