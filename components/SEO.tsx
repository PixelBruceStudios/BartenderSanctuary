import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, any> | null;
}

const BASE_URL = 'https://bartender-sanctuary-app.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({ title, description, path = '', image = DEFAULT_IMAGE, type = 'website', jsonLd }: SEOProps) {
  const url = `${BASE_URL}${path}`;
  const fullTitle = title.includes('Bartender Sanctuary') ? title : `${title} | Bartender Sanctuary`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Bartender Sanctuary" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
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
      />
    </Head>
  );
}
