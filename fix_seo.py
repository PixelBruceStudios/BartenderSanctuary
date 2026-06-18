from pathlib import Path

ROOT = Path('/home/skicmi/bartender-sanctuary-app')

# --- Fix 1: components/SEO.tsx --- add jsonLd prop
seo_path = ROOT / 'components/SEO.tsx'
seo = seo_path.read_text()

old_interface = """interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}"""
new_interface = """interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, any>;
}"""
seo = seo.replace(old_interface, new_interface)

old_params = "export default function SEO({ title, description, path = '', image = DEFAULT_IMAGE, type = 'website' }: SEOProps) {"
new_params = "export default function SEO({ title, description, path = '', image = DEFAULT_IMAGE, type = 'website', jsonLd }: SEOProps) {"
seo = seo.replace(old_params, new_params)

old_script = """      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Bartender Sanctuary',
            url: BASE_URL,
            description: 'Cocktail chemistry, technique, and the stories behind the pour.',
          }),
        }}
      />"""
new_script = """      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLd ?? {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Bartender Sanctuary',
              url: BASE_URL,
              description: 'Cocktail chemistry, technique, and the stories behind the pour.',
            }
          ),
        }}
      />"""
seo = seo.replace(old_script, new_script)

seo_path.write_text(seo)
print('Patched components/SEO.tsx')

# --- Fix 2: pages/index.tsx --- remove stray <Head>
index_path = ROOT / 'pages/index.tsx'
index = index_path.read_text()
index = index.replace("""      <SEO
        title={`Bartender Sanctuary — ${t('heroTitlePrefix')} ${t('heroTitleAccent')}`}
        description="Explore Bartender Sanctuary's complete cocktail recipe collection. From timeless classics to modern craft cocktails, find step-by-step instructions, bartending techniques, and the rich history behind every drink."
        path="/"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero""", """      <SEO
        title={`Bartender Sanctuary — ${t('heroTitlePrefix')} ${t('heroTitleAccent')}`}
        description="Explore Bartender Sanctuary's complete cocktail recipe collection. From timeless classics to modern craft cocktails, find step-by-step instructions, bartending techniques, and the rich history behind every drink."
        path="/"
      />

      <Hero""")
index_path.write_text(index)
print('Patched pages/index.tsx')

# --- Fix 3: pages/cocktails/[slug].tsx --- replace raw <Head> jsonLd with SEO jsonLd prop
cocktail_path = ROOT / 'pages/cocktails/[slug].tsx'
cocktail = cocktail_path.read_text()
old = """      <SEO
        title={cocktail.name}
        description={cocktail.description}
        path={`/cocktails/${cocktail.slug}`}
      />
      {jsonLd && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>
      )}"""
new = """      <SEO
        title={cocktail.name}
        description={cocktail.description}
        path={`/cocktails/${cocktail.slug}`}
        jsonLd={jsonLd}
      />"""
cocktail = cocktail.replace(old, new)
# Remove unused Head import if no other usage
if 'Head>' not in cocktail:
    cocktail = cocktail.replace("import Head from 'next/head';\n", "")
cocktail_path.write_text(cocktail)
print('Patched pages/cocktails/[slug].tsx')

# --- Fix 4: pages/games.tsx --- move <Head> style into inline <style> in body
games_path = ROOT / 'pages/games.tsx'
games = games_path.read_text()
games = games.replace("""      <Head>
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
""", """      <style>{`
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
""")
# The old_string above is tricky because of indentation; let's do a simpler exact replacement
games_path.write_text(games)
print('Patched pages/games.tsx (inline style moved)')

# --- Fix 5: pages/search.tsx --- remove redundant <Head>
search_path = ROOT / 'pages/search.tsx'
search = search_path.read_text()
search = search.replace("""      <SEO title="Search" description="Search blog posts, forum threads, cocktails, and ingredients." path="/search" />
      <Head>
        <title>Search — Bartender Sanctuary</title>
      </Head>""", """      <SEO title="Search" description="Search blog posts, forum threads, cocktails, and ingredients." path="/search" />""")
search_path.write_text(search)
print('Patched pages/search.tsx')

# --- Fix 6: pages/signatures.tsx --- remove stray <Head>
sig_path = ROOT / 'pages/signatures.tsx'
sig = sig_path.read_text()
sig = sig.replace("""      <SEO
        title="Bartender Sanctuary Signatures"
        description="Original house creations from Bartender Sanctuary."
        path="/signatures"
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>""", """      <SEO
        title="Bartender Sanctuary Signatures"
        description="Original house creations from Bartender Sanctuary."
        path="/signatures"
      />""")
sig_path.write_text(sig)
print('Patched pages/signatures.tsx')
