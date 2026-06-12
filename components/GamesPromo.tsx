import { useTranslation } from '@/lib/contexts';

export default function GamesPromo({ t }: { t: any }) {
  const games = [
    { emoji: '🎡', label: 'Sip Roulette', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(168,85,247,0.05))', border: 'rgba(168,85,247,0.35)', text: '#c084fc' },
    { emoji: '🤫', label: 'Never Have I Ever', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.18), rgba(236,72,153,0.05))', border: 'rgba(236,72,153,0.35)', text: '#f472b6' },
    { emoji: '💣', label: 'Tick-Tick-Boom!', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.05))', border: 'rgba(239,68,68,0.35)', text: '#fca5a5' },
    { emoji: '🎲', label: 'Drinkopoly', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(59,130,246,0.05))', border: 'rgba(59,130,246,0.35)', text: '#93c5fd' },
    { emoji: '🃏', label: 'Higher / Lower', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.05))', border: 'rgba(16,185,129,0.35)', text: '#6ee7b7' },
    { emoji: '🧠', label: 'Chimp Memory', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.05))', border: 'rgba(245,158,11,0.35)', text: '#fcd34d' }
  ];

  return (
    <section
      style={{
        padding: '4rem 1.5rem',
        background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(88,28,135,0.1) 50%, rgba(15,23,42,0) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative blurred orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ fontSize: '2.75rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.15))' }}>🎮</div>
        <h2
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800,
            fontFamily: "'Playfair Display', Georgia, serif",
            background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 45%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 0 18px rgba(192, 132, 252, 0.25))'
          }}
        >
          {t('sectionGames')}
        </h2>
        <p
          className="animate-fade-in-up stagger-1"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
            maxWidth: '580px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.75
          }}
        >
          {t('sectionGamesDescription')}
        </p>

        <div
          className="animate-fade-in-up stagger-2"
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}
        >
          {games.map((game) => (
            <span
              key={game.label}
              className="game-pill"
              style={{
                background: game.gradient,
                color: game.text,
                border: `1px solid ${game.border}`
              }}
            >
              {game.emoji} {game.label}
            </span>
          ))}
        </div>

        <a
          href="/games"
          className="animate-fade-in-up stagger-3"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2.25rem',
            borderRadius: '999px',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            textDecoration: 'none',
            boxShadow: '0 12px 36px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 16px 44px rgba(124, 58, 237, 0.55), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(100%)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-100%)'}
          />
          {t('btnPlayGames')}
          <span style={{ fontSize: '1.2rem', position: 'relative', zIndex: 1 }}>→</span>
        </a>
      </div>
    </section>
  );
}
