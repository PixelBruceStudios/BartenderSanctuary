import { useTranslation } from '@/lib/contexts';
import type { Cocktail } from '@/data/cocktails';

type HeroProps = {
  t: ReturnType<typeof useTranslation>['t'];
  cocktailsCount: number;
  basesCount: number;
  onFindDrink: () => void;
  onBrowse: () => void;
};

export default function Hero({ t, cocktailsCount, basesCount, onFindDrink, onBrowse }: HeroProps) {
  return (
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
          <button className="btn-primary" onClick={onFindDrink}>
            {t('btnFindDrink')}
          </button>
          <button className="btn-secondary" onClick={onBrowse}>
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
            { value: `${cocktailsCount}+`, label: t('statCocktails') },
            { value: `${basesCount}+`, label: t('statTechniques') },
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
  );
}
