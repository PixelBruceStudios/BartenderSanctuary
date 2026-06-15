import { Cocktail } from '@/data/cocktails';

interface CocktailIconProps {
  iconType?: string;
  size?: number;
  className?: string;
}

const palettes: Record<string, { glass: string; stroke: string; liquid: string }> = {
  martini:   { glass: '#e6f2ff', stroke: '#7eb8d8', liquid: '#cfe8ff' },
  rocks:     { glass: '#f6f6f6', stroke: '#c0c0c0', liquid: '#e6c87a' },
  highball:  { glass: '#eef6fb', stroke: '#8fb8cc', liquid: '#fce8c8' },
  hurricane: { glass: '#fff3eb', stroke: '#dbaa90', liquid: '#ff8c5a' },
  coupe:     { glass: '#f5f0fb', stroke: '#bfa0d8', liquid: '#fde8c8' },
  wine:      { glass: '#fbf0f0', stroke: '#d6a8a8', liquid: '#c94e4e' },
  champagne: { glass: '#fbfbfb', stroke: '#c8c8c8', liquid: '#f7d98a' },
  shot:      { glass: '#f8f8f8', stroke: '#b8b8b8', liquid: '#e8b840' },
  mule:      { glass: '#f2e8dc', stroke: '#a87850', liquid: '#e6c078' },
  tiki:      { glass: '#f5ecd8', stroke: '#8c6c48', liquid: '#e06848' },
  punch:     { glass: '#f3f7f3', stroke: '#90a890', liquid: '#c94040' },
  flip:      { glass: '#fbf5f0', stroke: '#c8a888', liquid: '#d4a050' },
  fizz:      { glass: '#edf6fb', stroke: '#88b8cc', liquid: '#d4eaf5' },
  swizzle:   { glass: '#f0f8fb', stroke: '#6fa0b8', liquid: '#cfe8f5' },
  julep:     { glass: '#f0f4f0', stroke: '#88a888', liquid: '#88c888' },
};

const validTypes = new Set(Object.keys(palettes));

function CocktailIcon({ iconType = 'martini', size = 200, className = '' }: CocktailIconProps) {
  const safeType = validTypes.has(iconType) ? iconType : 'martini';
  const colors = palettes[safeType];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ display: 'block' }}
    >
      {iconFor(safeType, colors)}
    </svg>
  );
}

function iconFor(type: string, c: { glass: string; stroke: string; liquid: string }) {
  switch (type) {
    case 'martini':
      return (
        <g>
          <path d="M 10 18 L 50 82 L 90 18 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 12 22 L 50 80 L 88 22 Z" fill="none" stroke={c.stroke} strokeWidth="3" strokeLinejoin="round" />
          <line x1="50" y1="80" x2="50" y2="92" stroke={c.stroke} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="50" cy="94" rx="16" ry="3" fill="none" stroke={c.stroke} strokeWidth="2" />
          <circle cx="50" cy="14" r="4" fill={c.liquid} stroke={c.stroke} strokeWidth="2" />
        </g>
      );
    case 'rocks':
      return (
        <g>
          <rect x="28" y="32" width="44" height="50" rx="4" fill={c.liquid} opacity="0.9" />
          <rect x="30" y="34" width="40" height="46" rx="3" fill="none" stroke={c.stroke} strokeWidth="2.5" />
          <line x1="36" y1="40" x2="36" y2="72" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <rect x="44" y="60" width="14" height="3" rx="1" fill={c.glass} opacity="0.7" />
        </g>
      );
    case 'highball':
      return (
        <g>
          <rect x="34" y="18" width="32" height="68" rx="3" fill={c.liquid} opacity="0.9" />
          <rect x="36" y="20" width="28" height="64" rx="2" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="18" rx="16" ry="3" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="42" y1="28" x2="42" y2="68" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <line x1="28" y1="26" x2="34" y2="26" stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'hurricane':
      return (
        <g>
          <path d="M 30 18 Q 28 62 50 62 Q 72 62 70 18 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 32 22 Q 30 58 50 58 Q 70 58 68 22 Z" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="18" rx="20" ry="4" fill="none" stroke={c.stroke} strokeWidth="2" />
          <path d="M 36 26 L 36 50" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <line x1="46" y1="30" x2="46" y2="48" stroke={c.glass} strokeWidth="1.5" opacity="0.5" />
          <line x1="54" y1="32" x2="54" y2="52" stroke={c.glass} strokeWidth="1.5" opacity="0.5" />
        </g>
      );
    case 'coupe':
      return (
        <g>
          <path d="M 24 28 Q 24 56 50 56 Q 76 56 76 28" fill={c.liquid} opacity="0.9" />
          <path d="M 26 30 Q 26 54 50 54 Q 74 54 74 30" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="28" rx="26" ry="5" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="50" y1="56" x2="50" y2="88" stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="50" cy="90" rx="18" ry="3" fill="none" stroke={c.stroke} strokeWidth="2" />
          <path d="M 34 34 Q 34 50 50 50" stroke={c.glass} strokeWidth="2" opacity="0.5" fill="none" />
        </g>
      );
    case 'wine':
      return (
        <g>
          <path d="M 30 20 Q 30 56 50 56 Q 70 56 70 20" fill={c.liquid} opacity="0.9" />
          <path d="M 32 24 Q 32 54 50 54 Q 68 54 68 24" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="20" rx="20" ry="4" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="50" y1="56" x2="50" y2="86" stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="50" cy="88" rx="16" ry="3" fill="none" stroke={c.stroke} strokeWidth="2" />
          <path d="M 36 26 Q 36 48 50 48" stroke={c.glass} strokeWidth="2" opacity="0.4" fill="none" />
        </g>
      );
    case 'champagne':
      return (
        <g>
          <rect x="42" y="16" width="16" height="66" rx="3" fill={c.liquid} opacity="0.9" />
          <rect x="44" y="18" width="12" height="62" rx="2" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="16" rx="8" ry="2" fill="none" stroke={c.stroke} strokeWidth="2" />
          <circle cx="50" cy="14" r="2.5" fill={c.glass} stroke={c.stroke} strokeWidth="1.5" />
          <line x1="34" y1="38" x2="42" y2="38" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'shot':
      return (
        <g>
          <rect x="36" y="30" width="28" height="46" rx="2" fill={c.liquid} opacity="0.9" />
          <rect x="38" y="32" width="24" height="42" rx="1" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="30" rx="14" ry="2" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="44" y1="38" x2="44" y2="62" stroke={c.glass} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        </g>
      );
    case 'mule':
      return (
        <g>
          <path d="M 30 26 L 30 78 Q 30 88 50 88 Q 70 88 70 78 L 70 26 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 32 30 L 32 76 Q 32 84 50 84 Q 68 84 68 76 L 68 30 Z" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="26" rx="20" ry="4" fill="none" stroke={c.stroke} strokeWidth="2" />
          <path d="M 70 36 Q 84 36 84 52 Q 84 68 70 68" fill="none" stroke={c.stroke} strokeWidth="2.5" />
          <line x1="38" y1="34" x2="38" y2="72" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>
      );
    case 'tiki':
      return (
        <g>
          <path d="M 28 28 Q 26 50 32 78 Q 40 90 50 90 Q 60 90 68 78 Q 74 50 72 28 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 32 34 Q 30 52 36 74 Q 44 86 50 86 Q 56 86 64 74 Q 70 52 68 34 Z" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="28" rx="22" ry="5" fill="none" stroke={c.stroke} strokeWidth="2" />
          <circle cx="40" cy="52" r="3.5" fill={c.glass} stroke={c.stroke} strokeWidth="1.5" />
          <circle cx="60" cy="52" r="3.5" fill={c.glass} stroke={c.stroke} strokeWidth="1.5" />
          <path d="M 42 66 Q 50 72 58 66" fill="none" stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="38" x2="36" y2="68" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>
      );
    case 'punch':
      return (
        <g>
          <rect x="34" y="28" width="32" height="56" rx="3" fill={c.liquid} opacity="0.9" />
          <rect x="36" y="30" width="28" height="52" rx="2" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="50" y1="28" x2="50" y2="12" stroke={c.stroke} strokeWidth="2" />
          <line x1="38" y1="36" x2="38" y2="68" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <circle cx="44" cy="22" r="3" fill={c.glass} opacity="0.8" />
          <circle cx="56" cy="26" r="2.5" fill={c.glass} opacity="0.8" />
          <circle cx="50" cy="20" r="2" fill={c.glass} opacity="0.8" />
        </g>
      );
    case 'flip':
      return (
        <g>
          <path d="M 28 34 Q 26 62 50 62 Q 74 62 72 34 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 30 38 Q 28 58 50 58 Q 72 58 70 38 Z" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="34" rx="22" ry="4" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="38" y1="42" x2="38" y2="56" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <path d="M 42 30 Q 50 36 58 30" fill="none" stroke={c.glass} strokeWidth="1.5" opacity="0.6" />
        </g>
      );
    case 'fizz':
      return (
        <g>
          <path d="M 34 22 L 36 78 Q 36 86 50 86 Q 64 86 64 78 L 66 22 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 36 28 L 38 75 Q 38 82 50 82 Q 62 82 62 75 L 64 28 Z" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="22" rx="16" ry="3" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="42" y1="30" x2="42" y2="70" stroke={c.glass} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <line x1="58" y1="34" x2="58" y2="72" stroke={c.glass} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <circle cx="50" cy="16" r="2" fill={c.glass} />
          <circle cx="44" cy="14" r="1.5" fill={c.glass} />
          <circle cx="56" cy="15" r="1.5" fill={c.glass} />
        </g>
      );
    case 'swizzle':
      return (
        <g>
          <rect x="36" y="22" width="28" height="66" rx="2" fill={c.liquid} opacity="0.9" />
          <rect x="38" y="24" width="24" height="62" rx="1" fill="none" stroke={c.stroke} strokeWidth="2" />
          <line x1="30" y1="32" x2="36" y2="32" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="44" x2="36" y2="44" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="56" x2="36" y2="56" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="30" x2="38" y2="68" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>
      );
    case 'julep':
      return (
        <g>
          <path d="M 24 28 L 28 86 Q 28 94 50 94 Q 72 94 72 86 L 76 28 Z" fill={c.liquid} opacity="0.9" />
          <path d="M 28 34 L 32 83 Q 32 90 50 90 Q 68 90 68 83 L 72 34 Z" fill="none" stroke={c.stroke} strokeWidth="2" />
          <ellipse cx="50" cy="28" rx="26" ry="4" fill="none" stroke={c.stroke} strokeWidth="2" />
          <path d="M 76 40 Q 90 40 90 56 Q 90 72 76 72" fill="none" stroke={c.stroke} strokeWidth="2.5" />
          <line x1="36" y1="36" x2="36" y2="80" stroke={c.glass} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <path d="M 40 32 L 40 72" stroke={c.glass} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        </g>
      );
    default:
      return <circle cx="50" cy="50" r="30" fill={c.liquid} stroke={c.stroke} strokeWidth="3" />;
  }
}

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
          {cocktail.glass || ''}
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
