export interface AffiliateProduct {
  id: string;
  name: string;
  brand?: string;
  author?: string;
  category: string;
  description: string;
  price: string;
  image: string;
  url: string;
  tags: string[];
  relatedCocktails: string[];
}

// Amazon Associates affiliate — replace AMAZON_ASSOCIATE_TAG with real one
export const AMAZON_ASSOCIATE_TAG = 'pixelbruce-20';

export function affiliateUrl(product: AffiliateProduct): string {
  // If URL already has a tag param, keep it; otherwise add our affiliate tag
  if (product.url.includes('tag=')) {
    return product.url;
  }
  const base = product.url.split('?')[0];
  return `${base}?tag=${AMAZON_ASSOCIATE_TAG}&language=en_US`;
}

export const affiliateProducts: AffiliateProduct[] = [
  // SHAKERS & TOOLS
  {
    id: 'prod-001',
    name: 'Professional Boston Shaker Set',
    brand: 'Barillio',
    category: 'Tools',
    description: '2-piece stainless steel Boston shaker (18oz + 28oz) with built-in strainer. Weighted ends for perfect seal. Restaurant-grade.',
    price: '$19.99',
    image: 'https://m.media-amazon.com/images/I/51oXfMTdHxL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B01N9N0JGG',
    tags: ['shaker', 'boston', 'stainless-steel', 'essential'],
    relatedCocktails: ['whiskey-sour', 'daiquiri', 'espresso-martini'],
  },
  {
    id: 'prod-002',
    name: 'Japanese Style Jigger Double',
    brand: 'U-Taste',
    category: 'Tools',
    description: '304 stainless steel double jigger (0.5oz/1oz + 1oz/2oz). Japanese precision measurement. 18/8 food-grade steel.',
    price: '$8.99',
    image: 'https://m.media-amazon.com/images/I/51zDgKEz8ML._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B01H3YF3LQ',
    tags: ['jigger', 'measurement', 'precision'],
    relatedCocktails: ['manhattan', 'martini', 'negroni'],
  },
  {
    id: 'prod-003',
    name: 'Bar Spoon Set — 4 Pack',
    brand: 'Barillio',
    category: 'Tools',
    description: 'Stainless steel bar spoons (11 inch) with weighted ends for smooth stirring. Teardrop design. Dishwasher safe.',
    price: '$9.99',
    image: 'https://m.media-amazon.com/images/I/51wnpSfCjML._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B01N5D6FQW',
    tags: ['bar-spoon', 'stirred', 'essential'],
    relatedCocktails: ['manhattan', 'martini', 'old-fashioned'],
  },
  {
    id: 'prod-004',
    name: 'Mixologist Mixing Glass Set',
    brand: 'Yaromo',
    category: 'Tools',
    description: 'Thick-bottomed mixing glass (750ml) with measuring markings. Shatter-resistant. Essential for stirred cocktails.',
    price: '$14.99',
    image: 'https://m.media-amazon.com/images/I/51aqnqDnKjL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B07P5VK7C4',
    tags: ['mixing-glass', 'stirred', 'essential'],
    relatedCocktails: ['manhattan', 'martini', 'negroni'],
  },
  // BITTERS
  {
    id: 'prod-005',
    name: 'Angostura Aromatic Bitters — 4oz',
    brand: 'Angostura',
    category: 'Bitters',
    description: 'The world\'s most famous aromatic bitters. Essential for Old Fashioneds, Manhattans, and almost every classic cocktail.',
    price: '$12.99',
    image: 'https://m.media-amazon.com/images/I/41S4O5QWZkL._AC_SL1000_.jpg',
    url: 'https://www.amazon.com/dp/B000VK5ZVO',
    tags: ['bitters', 'angostura', 'aromatic', 'essential'],
    relatedCocktails: ['old-fashioned', 'manhattan', 'whiskey-sour'],
  },
  {
    id: 'prod-006',
    name: 'Fee Brothers Orange Bitters',
    brand: 'Fee Brothers',
    category: 'Bitters',
    description: 'Citrus-forward aromatic bitters. Transforms Martinez, Martinez variations, and any spirit-forward cocktail with orange depth.',
    price: '$9.49',
    image: 'https://m.media-amazon.com/images/I/51m7GOtPALL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B000VK5ZQO',
    tags: ['bitters', 'orange', 'citrus', 'essential'],
    relatedCocktails: ['martinez', 'old-fashioned', 'sazerac'],
  },
  {
    id: 'prod-007',
    name: 'Bittermens Xocolatl Mole Bitters',
    brand: 'Bittermens',
    category: 'Bitters',
    description: 'Chocolate, cinnamon, and spice bitters. Revolutionary for tiki, desert-forward cocktails, and Old Fashioned variations.',
    price: '$13.99',
    image: 'https://m.media-amazon.com/images/I/51xQBLNVVJL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B0085HV2AS',
    tags: ['bitters', 'chocolate', 'spice', 'tiki'],
    relatedCocktails: ['milk-punch', 'old-fashioned', 'desert-rose'],
  },
  // VERMOUTH
  {
    id: 'prod-008',
    name: 'Carpano Antica Formula Vermouth',
    brand: 'Fratelli Branca',
    category: 'Vermouth',
    description: 'The original Italian vermouth (1786). Intensely herbal, vanilla-forward. The secret ingredient in world-class Manhattans.',
    price: '$29.99',
    image: 'https://m.media-amazon.com/images/I/51M5xJX2G3L._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B0014D6VAU',
    tags: ['vermouth', 'sweet', 'italian', 'manhattan'],
    relatedCocktails: ['manhattan', 'negroni', 'rob-roy'],
  },
  {
    id: 'prod-009',
    name: 'Dolin Dry Vermouth',
    brand: 'Dolin',
    category: 'Vermouth',
    description: 'Light, elegant French dry vermouth from Chambery. The benchmark for Martinis and Perfect Martinis. Refrigerate after opening.',
    price: '$11.99',
    image: 'https://m.media-amazon.com/images/I/51m9ILcH0YL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B0014D6V7G',
    tags: ['vermouth', 'dry', 'french', 'martini'],
    relatedCocktails: ['martini', 'gibson', 'perfect-martini'],
  },
  // BOOKS
  {
    id: 'prod-010',
    name: 'The Joy of Mixology',
    author: 'Gary Regan',
    category: 'Books',
    description: 'The definitive bartender\'s guide. 500+ recipes, spirit profiles, and the philosophy of balance. Essential reference for every home bar.',
    price: '$24.99',
    image: 'https://m.media-amazon.com/images/I/51oXtEH1OIL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/0609608767',
    tags: ['book', 'reference', 'classic'],
    relatedCocktails: ['all'],
  },
  {
    id: 'prod-011',
    name: 'Liquid Intelligence',
    author: 'Dave Arnold',
    category: 'Books',
    description: 'The science of the perfect cocktail. Centrifuges, vacuum evaporators, and modern techniques. For the curious home bartender.',
    price: '$22.00',
    image: 'https://m.media-amazon.com/images/I/51dVMNX0M8L._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/0393089273',
    tags: ['book', 'science', 'modern', 'technique'],
    relatedCocktails: ['clarified-milk-punch', 'fat-wash-old-fashioned'],
  },
  // ICE TRAYS
  {
    id: 'prod-012',
    name: 'King Cube Ice Tray — 2 inch',
    brand: 'Tovolo',
    category: 'Ice',
    description: 'Large 2-inch clear ice cubes. Slow melting = less dilution. Essential for whiskey cocktails and stirred drinks.',
    price: '$14.99',
    image: 'https://m.media-amazon.com/images/I/51rNJpBcP4L._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/s?k=king+cube+ice+tray+2+inch&TAG=pixelbruce-20',
    tags: ['ice', 'dilution', 'whiskey', 'essential'],
    relatedCocktails: ['old-fashioned', 'manhattan', 'whiskey-sour'],
  },
  // STRAINERS
  {
    id: 'prod-013',
    name: 'Hawthorne Strainer',
    brand: 'Oversized',
    category: 'Tools',
    description: 'Classic spring-loaded Hawthorne strainer. Fits standard tins. The workhorse strainer for shaken cocktails.',
    price: '$7.99',
    image: 'https://m.media-amazon.com/images/I/51kEaPOa4GL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/s?k=hawthorne+strainer+bar+tool&TAG=pixelbruce-20',
    tags: ['strainer', 'shaken', 'essential'],
    relatedCocktails: ['whiskey-sour', 'daiquiri', 'martini'],
  },
  {
    id: 'prod-014',
    name: 'Julep Strainer',
    brand: 'Oversized',
    category: 'Tools',
    description: 'Perforated julep strainer. For stirred cocktails in mixing glasses. Slots catch ice chips while pouring.',
    price: '$6.99',
    image: 'https://m.media-amazon.com/images/I/51kEaPOa4GL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/s?k=julep+strainer+bar+tool&TAG=pixelbruce-20',
    tags: ['strainer', 'stirred', 'mixing-glass'],
    relatedCocktails: ['manhattan', 'martini', 'negroni'],
  },
];

export function getProductsForCocktail(slug: string): AffiliateProduct[] {
  return affiliateProducts.filter(
    (p) => p.relatedCocktails.includes('all') || p.relatedCocktails.includes(slug)
  );
}

export function getProductsByCategory(category: string): AffiliateProduct[] {
  return affiliateProducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}
