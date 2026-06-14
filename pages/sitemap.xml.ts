import { cocktails } from '@/data/cocktails';
import { schoolCategories } from '@/data/school';
import { getCategories } from '@/data/ingredients';

const BASE_URL = 'https://bartender-sanctuary-app.vercel.app';

function buildLessonUrls(): string[] {
  const urls: string[] = [];
  for (const category of schoolCategories) {
    for (const technique of category.techniques) {
      for (const lesson of technique.lessons) {
        urls.push(
          `${BASE_URL}/school/lesson/${category.slug}/${technique.slug}/${lesson.id}`
        );
      }
    }
  }
  return urls;
}

function buildIngredientUrls(): string[] {
  const categories = getCategories();
  return categories.map((category) => `${BASE_URL}/ingredients#${category}`);
}

export default function Sitemap() {
  const cocktailUrls = cocktails.map((c) => `${BASE_URL}/cocktails/${c.slug}`);
  const lessonUrls = buildLessonUrls();
  const ingredientUrls = buildIngredientUrls();

  const urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/school`,
    `${BASE_URL}/ingredients`,
    `${BASE_URL}/games`,
    ...cocktailUrls,
    ...lessonUrls,
    ...ingredientUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <priority>${url === BASE_URL + '/' ? '1.0' : '0.7'}</priority>
    <changefreq>${url === BASE_URL + '/' ? 'daily' : 'weekly'}</changefreq>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
