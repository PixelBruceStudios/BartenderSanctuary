import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GamesPage() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <Head>
        <title>Party Games — Bartender Sanctuary</title>
        <meta name="description" content="Pass-the-phone party drinking games. Spin the wheel, Never Have I Ever, Most Likely To, Drinkopoly, and more." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 relative">
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl">🍺</span>
              <div>
                <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-cyan-400 tracking-tight leading-none uppercase">
                  Bartender Sanctuary
                </h1>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                  ← Back to cocktails
                </span>
              </div>
            </Link>
            <div className="text-xs text-slate-400 font-mono">Party Games</div>
          </div>
        </header>

        {/* Loading / error states */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {!loaded && !error && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading games…</p>
              <p className="text-xs text-slate-500">If this takes too long, try opening directly:</p>
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
            <div className="text-center py-20 space-y-4">
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
        </div>

        {/* Full-viewport iframe — fixed below header */}
        <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <iframe
            src="/games/app/index.html"
            title="Party Drinking Games"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className="w-full h-full border-0"
            style={{ display: 'block' }}
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    </>
  );
}
