import { cocktails } from '@/data/cocktails';
import { schoolCategories } from '@/data/school';
import { getCategories } from '@/data/ingredients';

const BASE_URL = 'https://bartender-sanctuary-app.vercel.app';
const urls = [
  BASE_URL + '/',
  BASE_URL + '/school',
  BASE_URL + '/ingredients',
  BASE_URL + '/games',
  ...cocktails.map((c) => `${BASE_URL}/cocktails/${c.slug}`),
  ...schoolCategories.flatMap((cat) =>
    cat.techniques.flatMap((tech) =>
      tech.lessons.map((lesson) => `${BASE_URL}/school/lesson/${cat.slug}/${tech.slug}/${lesson.id}`)
    )
  ),
  ...getCategories().map((category) => `${BASE_URL}/ingredients#${encodeURIComponent(category)}`),
];

const bad = urls.filter((url) => /[<>&"'`]/.test(url));
console.log('Total URLs:', urls.length, 'Bad:', bad.length);
bad.forEach((url) => console.log('BAD:', url));
