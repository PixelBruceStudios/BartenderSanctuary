import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TranslationProvider } from '@/lib/contexts';
import { ThemeProvider } from '@/lib/theme';
import { SessionProvider } from 'next-auth/react';
import LanguageThemeToggle from '@/components/LanguageThemeToggle';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <TranslationProvider>
        <ThemeProvider>
          <LanguageThemeToggle />
          <Component {...pageProps} />
        </ThemeProvider>
      </TranslationProvider>
    </SessionProvider>
  );
}
