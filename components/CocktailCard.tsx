import { Cocktail } from '@/data/cocktails';
import CocktailIcon from './CocktailIcon';

interface CocktailCardProps {
  cocktail: Cocktail;
  onClick: () => void;
}

export default function CocktailCard({ cocktail, onClick }: CocktailCardProps) {
  const imgSrc = `/photos/${cocktail.slug}.jpg`;

  return (
    <div
      className="glass-card photo-card animate-fade-in-up"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="photo-wrapper" style={{ height: '220px' }}>
        <img
          src={imgSrc}
          alt={cocktail.name}
          className="w-full h-full object-contain transition-opacity duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.parentElement?.querySelector('.photo-placeholder') as HTMLElement | null;
            if (placeholder) placeholder.style.display = 'flex';
          }}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            const placeholder = target.parentElement?.querySelector('.photo-placeholder') as HTMLElement | null;
            if (placeholder) placeholder.style.display = 'none';
          }}
        />
        <div className="photo-placeholder absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
          <CocktailIcon iconType={cocktail.icon_type} size={140} />
        </div>
      </div>
      <div style={{ padding: '1.2rem' }}>
        <h3 style={{ marginBottom: '0.3rem' }}>{cocktail.name}</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
          {cocktail.origin ? cocktail.origin.split('.').slice(0, 2).join('.') : ''}
          {cocktail.origin && cocktail.origin.split('.').length > 2 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
          {(cocktail.tags || []).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
