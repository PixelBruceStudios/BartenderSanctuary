import { useTranslation } from '@/lib/contexts';
import { useTheme } from '@/lib/theme';

export default function LanguageThemeToggle() {
  const { lang, setLang } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 50,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.35rem',
        borderRadius: '999px',
        border: '1px solid var(--color-border)',
        background: 'rgba(10, 10, 15, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <button
        onClick={() => setLang(lang === 'en' ? 'hr' : 'en')}
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--color-text)',
          cursor: 'pointer',
          padding: '0.35rem 0.5rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          lineHeight: 1,
          transition: 'background 0.2s ease'
        }}
        title={lang === 'en' ? 'Switch to Croatian' : 'Switch to English'}
        type="button"
      >
        🌐 {lang.toUpperCase()}
      </button>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--color-text)',
          cursor: 'pointer',
          padding: '0.35rem 0.5rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          lineHeight: 1,
          transition: 'background 0.2s ease'
        }}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        type="button"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
