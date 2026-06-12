import { useTranslation } from '@/lib/contexts';

export default function GamesPromo({ t }: { t: ReturnType<typeof useTranslation>['t'] }) {
  return (
    <section
      className="py-16 px-4"
      style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(88,28,135,0.08) 50%, rgba(15,23,42,0) 100%)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
        <h2
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            fontFamily: "'Playfair Display', Georgia, serif",
            background: 'linear-gradient(135deg, #f472b6, #c084fc, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}
        >
          {t('sectionGames')}
        </h2>
        <p
          className="animate-fade-in-up stagger-1"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
            maxWidth: '640px',
            margin: '0 auto 2rem',
            lineHeight: 1.7
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
            marginBottom: '2.5rem'
          }}
        >
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>🎡 Sip Roulette</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.3)' }}>🤫 Never Have I Ever</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>💣 Tick-Tick-Boom!</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>🎲 Drinkopoly</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>🃏 Higher / Lower</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}>🧠 Chimp Memory</span>
        </div>
        <a
          href="/games"
          className="animate-fade-in-up stagger-3 inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            color: '#fff',
            boxShadow: '0 10px 30px rgba(124, 58, 237, 0.35)',
            textDecoration: 'none'
          }}
        >
          {t('btnPlayGames')}
          <span style={{ fontSize: '1.1rem' }}>→</span>
        </a>
      </div>
    </section>
  );
}
