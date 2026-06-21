import { cocktails } from '@/data/cocktails';
import { schoolCategories } from '@/data/school';
import { getCategories } from '@/data/ingredients';
import { blogPosts, blogCategories } from '@/data/blog';

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
  return null;
}

export async function getServerSideProps({ res }: any) {
  const cocktailUrls = cocktails.map((c) => `${BASE_URL}/cocktails/${c.slug}`);
  const lessonUrls = buildLessonUrls();
  const ingredientUrls = buildIngredientUrls();
  const blogPostUrls = blogPosts.map((p) => `${BASE_URL}/blog/${p.slug}`);
  const blogCategoryUrls = blogCategories.map((c) => `${BASE_URL}/blog/category/${c.slug}`);

  const urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/school`,
    `${BASE_URL}/ingredients`,
    `${BASE_URL}/games`,
    `${BASE_URL}/blog`,
    ...cocktailUrls,
    ...lessonUrls,
    ...ingredientUrls,
    ...blogPostUrls,
    ...blogCategoryUrls,
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

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return { props: {} };
}
