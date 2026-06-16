import { useState } from 'react';
import Head from 'next/head';
import SEO from '@/components/SEO';

export default function GamesPage() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <SEO
        title="Party Games"
        description="Pass-the-phone party drinking games. Spin the wheel, Never Have I Ever, Most Likely To, Drinkopoly, and more."
        path="/games"
      />
      <Head>
        <style>{`
          html, body, #__next { margin: 0; padding: 0; }
          .games-iframe-wrap {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            max-width: 100%;
          }
          .games-iframe-wrap iframe {
            width: 100%;
            height: 100%;
            border: 0;
            display: block;
          }
        `}</style>
      </Head>

      <div className="games-iframe-wrap">
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-950 z-10">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-300">Loading games…</p>
            <a
              href="/games/app/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 underline"
            >
              Open Games in New Tab
            </a>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-6 text-center bg-slate-950 z-10">
            <p className="text-rose-400 font-bold">Failed to load games.</p>
            <p className="text-sm text-slate-400">The game might be blocked by your browser or network.</p>
            <a
              href="/games/app/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Open Games Directly
            </a>
          </div>
        )}

        <iframe
          src="/games/app/index.html"
          title="Party Drinking Games"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </>
  );
}
