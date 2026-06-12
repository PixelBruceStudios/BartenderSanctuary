'use client';

import { Cocktail } from '@/data/cocktails';
import RecipeDisplay from '@/components/RecipeDisplay';

type RecipeModalProps = {
  cocktail: Cocktail | null;
  onClose: () => void;
  showOz: boolean;
  onToggleUnits: () => void;
};

export default function RecipeModal({ cocktail, onClose, showOz, onToggleUnits }: RecipeModalProps) {
  if (!cocktail) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        zIndex: 100
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{cocktail.name}</h2>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem' }}
          >
            Close
          </button>
        </div>

        <div style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
          {cocktail.story}
        </div>

        <RecipeDisplay cocktail={cocktail} showOz={showOz} onToggleUnits={onToggleUnits} />
      </div>
    </div>
  );
}
