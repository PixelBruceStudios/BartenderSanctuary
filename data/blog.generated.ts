// AUTO-GENERATED — do not edit directly. Run `npm run build:blog` to regenerate.

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categorySlug: string;
  tags: string[];
  publishedAt: string;
  authorName: string;
}

export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ForumThread {
  id: string;
  title: string;
  categorySlug: string;
  authorName: string;
  createdAt: string;
  replyCount?: number;
  lastReplyAt?: string;
  content: string;
}

export interface ForumCategory {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export const blogCategories: BlogCategory[] = [
  { slug: "techniques", title: "Techniques", description: "Bar techniques, methods, and fundamentals.", icon: "🛠️" },
  { slug: "recipes", title: "Recipes", description: "Classic and modern cocktail recipes.", icon: "🍸" },
  { slug: "ingredients", title: "Ingredients", description: "Spirits, mixers, and garnishes.", icon: "🧪" },
  { slug: "career", title: "Career", description: "Bartending careers and industry news.", icon: "🚀" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "modernist-cocktail-revolution",
    title: "The Modernist Cocktail Revolution: How Science Changed the Bar",
    excerpt: "From clarification to spherification, modernist techniques have transformed cocktail craft. Meet the pioneers redefining what a drink can be.",
    content: "\n# The Modernist Cocktail Revolution: How Science Changed the Bar\n\nThe cocktail renaissance of the 2000s brought back forgotten classics. But a quieter revolution was happening behind the stick: bartenders started treating drinks like chefs treat food. Clarified milk punches turned crystal clear. Spheres of citrus burst in your mouth. Foams floated atop glasses like clouds.\n\nThis is the story of the modernist cocktail movement — and the people who turned the bar into a lab.\n\n## What Are Modernist Cocktails?\n\nModernist cocktails apply scientific techniques to drink-making. The goal isn’t just novelty; it’s texture, precision, and flavor clarity. Common techniques include:\n\n- **Clarification** — using milk, agar, or gelatine to strip cloudy cocktails into transparent, intense elixirs\n- **Spherification** — encasing liquid in a thin membrane that bursts on contact\n- **Foams and airs** — creating light textures with soy lecithin or a siphon\n- **Vacuum infusion** — pulling flavors into spirits under pressure\n- **Rotary evaporation** — distilling aromatics at low temperatures for purity\n\nThe result: drinks that taste cleaner, feel stranger, and linger longer on the palate.\n\n## Julie Reiner: The Clover Club Pioneer\n\nJulie Reiner didn’t just open one of New York’s best cocktail bars — she helped professionalize the craft. At Clover Club, Reiner treats cocktails as a discipline, not just a service. Her team uses clarification for classic milk punches, and her menu balances modernist technique with drinkability.\n\n> \"The best modernist drinks still taste like cocktails, not chemistry experiments.\"\n\nReiner’s influence extends beyond her bar. She’s trained a generation of bartenders who now run their own programs, spreading modernist thinking across the industry.\n\n## Tony Conigliaro: The UK’s Experimental Voice\n\nIn London, Tony Conigliaro was doing modernist work before most American bars had heard the term. At 69 Colebrooke Row, his cocktails read like a science syllabus: fat-washed gins, clarified daiquiris, and ingredients you’d expect in a perfume lab.\n\nConigliaro’s philosophy is straightforward: if a technique makes the drink better, use it — regardless of tradition. His awards and international consulting work made him one of the most influential figures in experimental bartending.\n\n## Ryan Chetiyawardana: Low-Waste Modernism\n\nRyan “Mr Lyan” Chetiyawardana won the World Class bartender competition and built a mini-empire around Lyaness and Super Lyan in London. But his modernist edge isn’t just about technique — it’s about sustainability.\n\nAt Lyaness, waste streams become ingredients. Citrus peels are candied or distilled. Spent botanicals get reused. The result is modernist technique married to circular economics, a model more bars are adopting.\n\n## The Techniques Explained\n\n### Clarification\nThe oldest modernist trick in the book. Add a liquid with protein (milk, whey, yogurt) to an acidic cocktail, let it curdle, then strain through paper or a centrifuge. The solids trap cloudiness and impurities, leaving a gin-clear liquid with concentrated flavor.\n\n### Spherification\nMix a flavored liquid with sodium alginate, then drop it into a calcium bath. A thin gel membrane forms around each drop. The result: cocktail caviar. Used sparingly — one or two spheres per drink — it adds surprise without gimmickry.\n\n### Foams and Airs\nSoy lecithin plus an immersion blender creates stable foams that add aroma without weight. Siphons charge creams, infusions, and even spirits with air, turning a stiff drink into something weightless.\n\n### Vacuum Infusion\nA vacuum sealer pulls air out of a chamber containing spirit and flavoring. Under reduced pressure, volatile compounds extract faster, creating intense infusions in minutes instead of days.\n\n## Why It Matters\n\nModernist cocktails aren’t the future — they’re already the present in top bars worldwide. The movement has:\n\n- Raised the skill ceiling for bartenders\n- Created a shared technical vocabulary across the industry\n- Inspired cross-pollination with culinary circles\n- Made hospitality more precise and consistent\n\nThe bars that thrive in 2026 and beyond will be the ones that master both the classics and the lab.\n\n## Where to Learn More\n\n- Difford’s Guide contributor profiles track modernist innovators globally\n- Liquor.com publishes technique deep dives and interviews with leading modernist bartenders\n- Clover Club, 69 Colebrooke Row, and Lyaness all publish menus that read like science papers\n\n---\n\n*Sources: Difford’s Guide, Liquor.com, Clover Club, 69 Colebrooke Row, Lyaness. Research database: content/research/people/* and content/research/topics/modernist-cocktails.md*\n",
    coverImage: "/photos/placeholder.jpg",
    categorySlug: "techniques",
    tags: ["modernist","experimental","science","technique"],
    publishedAt: "2026-06-15T00:00:00Z",
    authorName: "Bartender Sanctuary",
  },
  {
    slug: "welcome-to-bartender-sanctuary",
    title: "Welcome to Bartender Sanctuary",
    excerpt: "A quick intro to the school and what you can learn here.",
    content: "\n# Welcome to Bartender Sanctuary\n\nThis is the first post on the Bartender Sanctuary blog. More content coming soon.\n",
    coverImage: "/photos/placeholder.jpg",
    categorySlug: "techniques",
    tags: ["intro","news"],
    publishedAt: "2026-06-01T00:00:00Z",
    authorName: "Bartender Sanctuary",
  },
];

export const forumCategories: ForumCategory[] = [
  { slug: "general", title: "General", description: "General discussion about bartending.", icon: "💬" },
  { slug: "recipes", title: "Recipes", description: "Share and discuss cocktail recipes.", icon: "🍸" },
  { slug: "techniques", title: "Techniques", description: "Technique tips and questions.", icon: "🛠️" },
  { slug: "career", title: "Career", description: "Jobs, interviews, and industry topics.", icon: "🚀" },
];

export const forumThreads: ForumThread[] = [
  {
    id: "best-practices-stirring-vs-shaking",
    title: "Best practices for stirring vs shaking",
    categorySlug: "techniques",
    authorName: "Mixologist101",
    createdAt: "2026-06-10T00:00:00Z",
    replyCount: 0,
    content: "\n# Best practices for stirring vs shaking\n\nWhen should you stir and when should you shake? Let's discuss the fundamentals.\n",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.categorySlug === categorySlug);
}

export function getForumThread(id: string): ForumThread | undefined {
  return forumThreads.find((thread) => thread.id === id);
}

export function getForumThreadsByCategory(categorySlug: string): ForumThread[] {
  return forumThreads.filter((thread) => thread.categorySlug === categorySlug);
}
