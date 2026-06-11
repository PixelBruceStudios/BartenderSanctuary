export interface Technique {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  equipment: string[];
  ingredients: string[];
  steps: string[];
  tips: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  techniqueSlugs: string[];
  content: string;
  completed?: boolean;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export const categories: Category[] = [
  {
    slug: 'clarification',
    title: 'Clarification',
    description: 'Strip impurities and create crystal-clear cocktails using milk, agar, or gelatin.',
    icon: '🔬',
    lessons: [
      {
        id: 'clarification-101',
        title: 'Clarification 101: Why clarity matters',
        description: 'Understand the science behind why bartenders clarify cocktails.',
        techniqueSlugs: ['milk-wash', 'agar-clarification'],
        content: `Clarification isn’t just for looks — it changes mouthfeel, stabilizes flavor, and extends shelf life. In milk washing, acid curdles milk proteins which trap polyphenols and harsh congeners from spirit. The result is a smoother, rounder liquid that stays stable for weeks. Agar clarification works differently: the gelling agent traps particles as it sets, yielding a brilliantly clear gel-net liquid when strained. Both methods turn a good cocktail into a great one.`,
      },
      {
        id: 'milk-wash-deep-dive',
        title: 'Milk Wash Deep Dive',
        description: 'Step-by-step milk wash with troubleshooting tips.',
        techniqueSlugs: ['milk-wash'],
        content: `Start with a high-proof spirit (100+ proof works best). Add whole milk at a ratio of roughly 3:1 spirit to milk, plus a small acid dose — lemon juice or citric acid works. Shake hard and let rest 20–30 minutes until visible curds form. Strain through a fine-mesh sieve lined with coffee filters; a second pass through a fresh filter produces the clearest result. Whey left behind carries the harsh compounds; what passes through is clean, round, and shelf-stable.`,
      },
      {
        id: 'agar-basics',
        title: 'Agar Basics',
        description: 'Your first agar-clarified cocktail batch.',
        techniqueSlugs: ['agar-clarification'],
        content: `Agar powder hydrates in cold water, then gels between 85–95°C. Dissolve 1 tsp per 500ml liquid, combine with your cocktail base at around 60°C, then let set 1–2 hours at room temperature. The gel traps haze-causing particles. Strain slowly through cheesecloth first, then coffee filters — patience here pays off in clarity. Agar clarification is best for batched cocktails that will sit for days.`,
      },
    ],
  },
  {
    slug: 'fat-infusion',
    title: 'Fat Infusion',
    description: 'Borrow from distilling: infuse spirit with butter, bacon, coconut, or olive oil.',
    icon: '🧈',
    lessons: [
      {
        id: 'fat-wash-101',
        title: 'Fat Wash 101',
        description: 'The basic method and the science of fat-soluble flavor.',
        techniqueSlugs: ['fat-wash'],
        content: `Fat washing works because many flavor compounds are soluble in fat, not water or spirit alone. By suspending melted fat in high-proof spirit, you extract those compounds. The freeze step is critical: fat solidifies while spirit stays liquid, making separation trivial. Strain well to remove all fat solids, or the drink will go cloudy and eventually spoil. A final pass through a coffee filter ensures a clean, stable infusion.`,
      },
      {
        id: 'brown-butter-bourbon',
        title: 'Brown Butter Bourbon',
        description: 'A specific, repeatable recipe for brown butter fat-washed bourbon.',
        techniqueSlugs: ['fat-wash-bourbon'],
        content: `Use a high-rye bourbon for spice contrast. Brown 1 stick of unsalted butter in a saucepan until nutty and golden — don’t burn it. Let cool slightly, then combine with 750ml bourbon in a jar. Shake, rest 2–4 hours at room temperature, then freeze 4+ hours. Strain through cheesecloth, then through a coffee filter. Store in a sealed bottle. Use 2 oz in an Old Fashioned or Boulevardier for a rich, nutty depth.`,
      },
    ],
  },
  {
    slug: 'foam-emulsion',
    title: 'Foam & Emulsion',
    description: 'Master egg whites, aquafaba, and emulsification for silky texture.',
    icon: '🥚',
    lessons: [
      {
        id: 'dry-shake-method',
        title: 'The Dry Shake Method',
        description: 'Shake without ice first to build a fine, lasting foam.',
        techniqueSlugs: ['dry-shake'],
        content: `The dry shake is the difference between a whisper-thin foam and a dense, stable crown. Add all ingredients except ice to your shaker, seal, and shake vigorously for 10–15 seconds. The agitation denatures proteins and creates micro-bubbles. Then add ice and shake again for 10–15 seconds until well-chilled. Double-strain into a chilled glass to catch ice shards and any broken foam bits. Aquafaba works as a vegan substitute at roughly 3/4 oz per egg white.`,
      },
    ],
  },
  {
    slug: 'advanced-batching',
    title: 'Advanced Batching',
    description: 'Batch large volumes without losing freshness or clarity.',
    icon: '⚗️',
    lessons: [
      {
        id: 'batched-sours',
        title: 'Batched Sours & Clarification',
        description: 'How to batch a clarified sour that keeps for weeks.',
        techniqueSlugs: ['agar-clarification', 'milk-wash'],
        content: `For a batched sour, mix spirit, citrus, and syrup first. If you want clarity, clarify the entire batch using agar or milk wash before dilution. Dilution should happen before clarification so the final product is at serving strength. Bottle in swing-top or swing-cap bottles and refrigerate. A properly clarified batch can last 2–4 weeks chilled. Label with batch date and technique used.`,
      },
    ],
  },
];

export const allTechniques: Technique[] = [
  {
    slug: 'milk-wash',
    title: 'Milk Wash',
    tagline: 'Clarify spirits with milk for a silky, shelf-stable result',
    description:
      'Milk washing uses the acid in milk to curdle proteins, which trap impurities and harsh congeners. The result is a smoother, cleaner spirit with a velvety mouthfeel — and it can be stored for weeks without refrigeration.',
    difficulty: 'Intermediate',
    time: '30 min active + 24h rest',
    equipment: ['Jar with lid', 'Fine-mesh strainer', 'Coffee filters or cheesecloth', 'Funnel'],
    ingredients: ['Base spirit', 'Whole milk', 'Acid (citrus or vinegar)'],
    steps: [
      'Combine spirit, milk, and a splash of acid in a jar. Shake well.',
      'Let rest at room temperature for 20–30 minutes until curds form.',
      'Strain through a fine-mesh strainer lined with coffee filters.',
      'Repeat filtration for extra clarity. Store in a sealed bottle.'
    ],
    tips: 'Use whole milk for best curdling. A second strain through a clean paper filter produces a crystal-clear result.'
  },
  {
    slug: 'fat-wash',
    title: 'Fat Wash',
    tagline: 'Infuse spirit with rich fat flavor, then clarify',
    description:
      'Fat washing borrows from distilling: you steep spirit in melted fat, freeze it, then strain out the solids. The result is a spirit that tastes like browned butter, bacon, or coconut, but remains shelf-stable and mixable.',
    difficulty: 'Beginner',
    time: '15 min active + 4h freeze',
    equipment: ['Jar with lid', 'Freezer', 'Fine-mesh strainer', 'Cheesecloth'],
    ingredients: ['Base spirit', 'Melted fat (butter, bacon, coconut)'],
    steps: [
      'Melt fat and let cool slightly. Combine with spirit in a jar.',
      'Shake vigorously and let rest at room temperature for 2–4 hours.',
      'Place jar in freezer for 4+ hours until fat solidifies.',
      'Strain through cheesecloth, then through a coffee filter for clarity.'
    ],
    tips: 'Use high-proof spirit (100+ proof) for better fat solubility. Don’t skip the freeze step — it’s what separates the fat from the liquid.'
  },
  {
    slug: 'agar-clarification',
    title: 'Agar Clarification',
    tagline: 'Use agar to create crystal-clear cocktails with intense flavor',
    description:
      'Agar (a seaweed-derived gelling agent) traps particles during a low-heat gel process. When strained, it produces a brilliantly clear liquid with concentrated flavor — perfect for batched cocktails.',
    difficulty: 'Advanced',
    time: '45 min active + 2h rest',
    equipment: ['Saucepan', 'Thermometer', 'Fine-mesh strainer', 'Cheesecloth', 'Coffee filters'],
    ingredients: ['Agar powder', 'Water', 'Cocktail base (juice, spirit mix)'],
    steps: [
      'Dissolve agar in cold water (1 tsp per 500ml liquid).',
      'Heat to 85–95°C while stirring. Do not boil.',
      'Combine agar mixture with your cocktail base at ~60°C.',
      'Let set at room temperature for 1–2 hours, then strain slowly through cheesecloth and filters.'
    ],
    tips: 'Straining is the hardest part — be patient. A second cold strain through a fresh filter produces the best clarity.'
  },
  {
    slug: 'dry-shake',
    title: 'Dry Shake',
    tagline: 'Shake without ice first for maximum foam and emulsion',
    description:
      'A dry shake means shaking all ingredients without ice first, then adding ice and shaking again. It creates a finer, more stable foam — essential for sours with egg white or aquafaba.',
    difficulty: 'Beginner',
    time: '2 min',
    equipment: ['Cocktail shaker', 'Hawthorne strainer'],
    ingredients: ['Any sour recipe', 'Egg white or aquafaba'],
    steps: [
      'Add all ingredients except ice to your shaker.',
      'Shake vigorously for 10–15 seconds without ice.',
      'Add ice and shake again for 10–15 seconds until well-chilled.',
      'Double-strain into a chilled glass.'
    ],
    tips: 'Aquafaba works as a vegan alternative. Use 3/4 oz aquafaba per egg white equivalent.'
  },
  {
    slug: 'fat-wash-bourbon',
    title: 'Brown Butter Bourbon',
    tagline: 'A specific fat-wash example using browned butter',
    description:
      'Browning butter before washing creates a nutty, caramelized depth that pairs beautifully with bourbon. This is a specific technique under the broader fat-wash umbrella, useful for rich stirred cocktails.',
    difficulty: 'Beginner',
    time: '20 min active + 4h freeze',
    equipment: ['Saucepan', 'Jar', 'Freezer', 'Strainer'],
    ingredients: ['Bourbon', 'Unsalted butter'],
    steps: [
      'Brown butter in a saucepan over medium heat until nutty and golden.',
      'Let cool slightly, then combine with bourbon in a jar.',
      'Shake and rest 2–4 hours at room temperature.',
      'Freeze 4+ hours, then strain through cheesecloth and coffee filters.'
    ],
    tips: 'Use a high-rye bourbon for better spice contrast with the browned butter.'
  },
];
