import { useTranslation } from '@/lib/contexts';

export default function FeaturedSection() {
  const { t } = useTranslation();

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}
    >
      {[
        {
          badge: '🎓',
          title: t('featuredLearnTitle'),
          desc: t('featuredLearnDesc'),
          link: '/school',
          cta: t('featuredLearnLink'),
          gradient: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.03) 100%)',
          border: 'rgba(99,102,241,0.25)',
          hoverBorder: 'rgba(99,102,241,0.5)',
          accent: '#818cf8'
        },
        {
          badge: '🕹️',
          title: t('featuredPlayTitle'),
          desc: t('featuredPlayDesc'),
          link: '/games',
          cta: t('featuredPlayLink'),
          gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0.03) 100%)',
          border: 'rgba(236,72,153,0.25)',
          hoverBorder: 'rgba(236,72,153,0.5)',
          accent: '#f472b6'
        }
      ].map((card) => (
        <div
          key={card.title}
          className="glass-card"
          style={{
            padding: '2rem',
            background: card.gradient,
            border: `1px solid ${card.border}`,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = card.hoverBorder;
            el.style.transform = 'translateY(-4px)';
            el.style.boxShadow = `0 12px 36px ${card.hoverBorder.replace('0.5', '0.2')}`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = card.border;
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'none';
          }}
        >
          {/* Decorative top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '1.5rem',
              right: '1.5rem',
              height: '2px',
              background: `linear-gradient(90deg, transparent 0%, ${card.accent} 50%, transparent 100%)`,
              opacity: 0.6
            }}
          />
          <div style={{ fontSize: '2rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))' }}>
            {card.badge}
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: card.accent,
              marginBottom: '0.6rem'
            }}
          >
            {card.title}
          </span>
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 600,
              marginTop: '0.2rem',
              marginBottom: '0.8rem',
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.3
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              marginBottom: '1.5rem',
              flex: 1
            }}
          >
            {card.desc}
          </p>
          <a
            href={card.link}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.55s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(100%)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-100%)'}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>{card.cta}</span>
          </a>
        </div>
      ))}
    </section>
  );
}
