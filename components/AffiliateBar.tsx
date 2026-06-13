import { useState } from 'react';
import { getProductsForCocktail, type AffiliateProduct } from '@/data/affiliate-products';

interface AffiliateBarProps {
  cocktailSlug: string;
}

export default function AffiliateBar({ cocktailSlug }: AffiliateBarProps) {
  const [expanded, setExpanded] = useState(false);
  const products = getProductsForCocktail(cocktailSlug);

  if (products.length === 0) return null;

  return (
    <div
      className="affiliate-bar"
      style={{
        marginTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '1rem',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-accent)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <span>🛒</span>
        <span>Gear up for this drink ({products.length} picks)</span>
        <span style={{ fontSize: '0.75rem' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.75rem',
            marginTop: '0.8rem',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p
        style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.5rem',
        }}
      >
        Affiliate links support the site. Price and availability subject to change.
      </p>
    </div>
  );
}

function ProductCard({ product }: { product: AffiliateProduct }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={`/api/affiliate-redirect?productId=${product.id}`}
      className="glass-card affiliate-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0.9rem',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          width: '100%',
          height: '120px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}
          >
            🛒
          </div>
        )}
      </div>

      <div>
        <p
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600,
            marginBottom: '0.15rem',
          }}
        >
          {product.brand}
        </p>
        <h4
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h4>
      </div>

      <p
        style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {product.description}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.4rem',
        }}
      >
        <span
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--color-accent)',
          }}
        >
          {product.price}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-accent)',
            fontWeight: 600,
          }}
        >
          View on Amazon →
        </span>
      </div>
    </a>
  );
}
