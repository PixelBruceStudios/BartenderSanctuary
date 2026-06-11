import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TranslationProvider } from '@/lib/contexts';
import { ThemeProvider } from '@/lib/theme';
import LanguageThemeToggle from '@/components/LanguageThemeToggle';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TranslationProvider>
      <ThemeProvider>
        <LanguageThemeToggle />
        <Component {...pageProps} />
      </ThemeProvider>
    </TranslationProvider>
  );
}
