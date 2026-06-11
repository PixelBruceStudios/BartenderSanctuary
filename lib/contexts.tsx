import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Lang, TranslationKeys } from '@/lib/i18n';
import { translations } from '@/lib/i18n';

type TranslationContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof TranslationKeys) => string;
};

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem('lang') as Lang | null;
      if (stored === 'en' || stored === 'hr') {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem('lang', next);
    } catch {}
  };

  const t = (key: keyof TranslationKeys) => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback for safety outside provider
    return {
      lang: 'en' as Lang,
      setLang: () => {},
      t: (key: keyof TranslationKeys) => translations.en[key] || key,
    };
  }
  return context;
}
