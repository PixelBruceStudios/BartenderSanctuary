import HeroNebula from '@/components/HeroNebula';

export default function Hero({ t, cocktailsCount, basesCount, onFindDrink, onBrowse }: {
  t: any;
  cocktailsCount: number;
  basesCount: number;
  onFindDrink: () => void;
  onBrowse: () => void;
}) {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
        background: '#0a0a14',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Three.js nebula background */}
      <HeroNebula />

      <div
        style={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '5rem 1.5rem 4.5rem',
          textAlign: 'center',
          width: '100%',
          zIndex: 1
        }}
      >
        <div className="animate-fade-in-up">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              background: 'rgba(26, 26, 36, 0.7)',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.75rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                boxShadow: '0 0 10px var(--color-accent), 0 0 20px rgba(99, 102, 241, 0.4)'
              }}
            />
            {t('heroCocktailChemistry')}
          </span>
        </div>

        <h1
          className="animate-fade-in-up stagger-1"
          style={{
            fontSize: 'clamp(2.8rem, 6.5vw, 4.2rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: '1.4rem',
            letterSpacing: '-0.035em',
            textShadow: '0 0 60px rgba(99, 102, 241, 0.25)'
          }}
        >
          {t('heroTitlePrefix')}{' '}
          <span
            className="gradient-text"
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))'
            }}
          >
            {t('heroTitleAccent')}
          </span>
        </h1>

        <p
          className="animate-fade-in-up stagger-2"
          style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: '620px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.75,
            textShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
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
            flexWrap: 'wrap',
            marginBottom: '3.25rem'
          }}
        >
          <button
            onClick={onFindDrink}
            className="btn-primary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(100%)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-100%)'}
            />
            {t('btnFindDrink')}
          </button>
          <button
            onClick={onBrowse}
            className="btn-secondary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              borderRadius: '12px'
            }}
          >
            {t('btnBrowseCocktails')}
          </button>
        </div>

        <div
          className="animate-fade-in-up stagger-4"
          style={{
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              background: 'rgba(26, 26, 36, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1rem 1.4rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              {cocktailsCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              Cocktails
            </div>
          </div>
          <div
            style={{
              background: 'rgba(26, 26, 36, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1rem 1.4rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              {basesCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              Base Spirits
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
