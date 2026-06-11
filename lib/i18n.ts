export type Lang = 'en' | 'hr';

export type TranslationKeys = {
  // Nav
  navHome: string;
  navSchool: string;
  navGames: string;
  // Index page
  heroCocktailChemistry: string;
  heroTitlePrefix: string;
  heroTitleAccent: string;
  heroDescription: string;
  btnFindDrink: string;
  btnBrowseCocktails: string;
  statCocktails: string;
  statTechniques: string;
  statPossibilities: string;
  sectionGames: string;
  sectionGamesDescription: string;
  btnPlayGames: string;
  tabBrowse: string;
  tabTool: string;
  tabSchoolLink: string;
  tabGamesLink: string;
  featuredLearn: string;
  featuredLearnTitle: string;
  featuredLearnDesc: string;
  featuredLearnLink: string;
  featuredPlay: string;
  featuredPlayTitle: string;
  featuredPlayDesc: string;
  featuredPlayLink: string;
  searchPlaceholder: string;
  noResults: string;
  emptySelectIngredients: string;
  emptyNoMatches: string;
  btnFindMatches: string;
  btnSurpriseMe: string;
  techniqueTips: string;
  recipeTitle: string;
  footerText: string;
  youHaveEverything: string;
  missingLabel: string;
  toolTitle: string;
  toolDescription: string;
  baseSpirits: string;
  modifiers: string;
  // School page
  schoolTitle: string;
  schoolDescription: string;
  schoolTechniquesIn: string;
  lessonsCount: string;
  lessonCount: string;
  backToCategory: string;
  markComplete: string;
  markIncomplete: string;
  // Games page
  gamesTitle: string;
  gamesDescription: string;
  loadingGames: string;
  loadingDirect: string;
  loadError: string;
  loadErrorDesc: string;
  openDirect: string;
  backToCocktails: string;
  // Lesson page
  lessonNotFound: string;
};

const en: TranslationKeys = {
  navHome: 'Home',
  navSchool: 'Bartender School',
  navGames: 'Party Games',
  heroCocktailChemistry: 'Cocktail chemistry & technique',
  heroTitlePrefix: 'Master the science of',
  heroTitleAccent: 'the perfect pour',
  heroDescription:
    'From milk washes to fat infusions, learn the techniques that turn ordinary ingredients into extraordinary cocktails. Browse classics, experiment with our ingredient tool, and elevate your home bar.',
  btnFindDrink: 'Find your next drink',
  btnBrowseCocktails: 'Browse cocktails',
  statCocktails: 'Cocktails',
  statTechniques: 'Techniques',
  statPossibilities: 'Possibilities',
  sectionGames: 'Party Games',
  sectionGamesDescription:
    'Pass-the-phone multiplayer fun for your next gathering. Spin the wheel, play Never Have I Ever, challenge friends with Most Likely To, and more — all on one screen, no app required.',
  btnPlayGames: 'Play Party Games',
  tabBrowse: 'Browse',
  tabTool: 'Ingredient Tool',
  tabSchoolLink: 'Bartender School →',
  tabGamesLink: 'Party Games →',
  featuredLearn: 'Learn',
  featuredLearnTitle: 'Bartender School',
  featuredLearnDesc: 'Structured lessons on techniques, tools, and cocktail history. From basics to advanced.',
  featuredLearnLink: 'Go to School',
  featuredPlay: 'Play',
  featuredPlayTitle: 'Party Games',
  featuredPlayDesc: 'Spin the wheel, Never Have I Ever, Most Likely To, Drinkopoly — pass-the-phone fun.',
  featuredPlayLink: 'Play Now',
  searchPlaceholder: 'Search cocktails by name, tag, or story...',
  noResults: 'No cocktails match your search.',
  emptySelectIngredients: 'Select at least one ingredient to see matches.',
  emptyNoMatches: 'No matches found. Try different ingredients.',
  btnFindMatches: 'Find Matches',
  btnSurpriseMe: 'Surprise Me',
  techniqueTips: 'Technique tips:',
  recipeTitle: 'Recipe',
  footerText: 'Bartender Sanctuary · Photos from /photos/ · Update data/cocktails.ts to add recipes',
  youHaveEverything: '✓ You have everything',
  missingLabel: 'Missing:',
  toolTitle: 'What do you have?',
  toolDescription: 'Select your ingredients and we\'ll show you what you can make.',
  baseSpirits: 'Base Spirits',
  modifiers: 'Modifiers',
  schoolTitle: 'Bartender School',
  schoolDescription:
    'Progressive lessons organized by topic. Start with a category, choose a technique, and work through numbered lessons. Mark them complete as you go.',
  schoolTechniquesIn: 'Techniques in',
  lessonsCount: 'lessons',
  lessonCount: 'lesson',
  backToCategory: '← Back to',
  markComplete: 'Mark complete',
  markIncomplete: 'Mark incomplete',
  gamesTitle: 'Party Games',
  gamesDescription:
    'Pass-the-phone party drinking games. Spin the wheel, Never Have I Ever, Most Likely To, Drinkopoly, and more.',
  loadingGames: 'Loading games…',
  loadingDirect: 'If this takes too long, try opening directly:',
  loadError: 'Failed to load games.',
  loadErrorDesc: 'The game might be blocked by your browser or network.',
  openDirect: 'Open Games Directly',
  backToCocktails: '← Back to cocktails',
  lessonNotFound: 'Lesson not found',
};

const hr: TranslationKeys = {
  navHome: 'Početna',
  navSchool: 'Barmenska škola',
  navGames: 'Igre za zabavu',
  heroCocktailChemistry: 'Kemija koktela i tehnike',
  heroTitlePrefix: 'Savladajte znanost',
  heroTitleAccent: 'savršenog serviranja',
  heroDescription:
    'Od mliječnih ispiranja do masnih infuzija, naučite tehnike koje pretvaraju obične sastojke u izvanredne koktele. Pregledajte klasične, eksperimentirajte s našim alatom za sastojke i podignite svoj domaći bar.',
  btnFindDrink: 'Pronađite sljedeći piće',
  btnBrowseCocktails: 'Pregledaj koktele',
  statCocktails: 'Koktela',
  statTechniques: 'Tehnike',
  statPossibilities: 'Mogućnosti',
  sectionGames: 'Igre za zabavu',
  sectionGamesDescription:
    'Zabava za više ljudi — prosljedite telefon. Okrenite kotač, igrajte Nikada to nisam radio, izazovite prijatelje sa S najvjerojatnije da, i još mnogo toga — sve na jednom zaslonu, bez aplikacije.',
  btnPlayGames: 'Igrajte igre',
  tabBrowse: 'Pregled',
  tabTool: 'Alat za sastojke',
  tabSchoolLink: 'Barmenska škola →',
  tabGamesLink: 'Igre za zabavu →',
  featuredLearn: 'Naučite',
  featuredLearnTitle: 'Barmenska škola',
  featuredLearnDesc: 'Strukturirane lekcije o tehnikama, alatima i povijesti koktela. Od osnova do naprednih.',
  featuredLearnLink: 'Idi na školu',
  featuredPlay: 'Igrajte',
  featuredPlayTitle: 'Igre za zabavu',
  featuredPlayDesc: 'Okrenite kotač, Nikada to nisam radio, S najvjerojatnije da, Drinkopoly — zabava prosljedom telefona.',
  featuredPlayLink: 'Igraj sada',
  searchPlaceholder: 'Pretražite koktele po nazivu, oznaci ili priči...',
  noResults: 'Nema koktela koji odgovaraju pretrazi.',
  emptySelectIngredients: 'Odaberite barem jedan sastojak da biste vidjeli rezultate.',
  emptyNoMatches: 'Nema rezultata. Pokušajte druge sastojke.',
  btnFindMatches: 'Pronađi parove',
  btnSurpriseMe: 'Iznenadi me',
  techniqueTips: 'Savjeti za tehnike:',
  recipeTitle: 'Recept',
  footerText: 'Bartender Sanctuary · Fotografije iz /photos/ · Ažurirajte data/cocktails.ts za dodavanje recepata',
  youHaveEverything: '✓ Imate sve',
  missingLabel: 'Nedostaje:',
  toolTitle: 'Što imate?',
  toolDescription: 'Odaberite svoje sastojke i pokazat ćemo vam što možete napraviti.',
  baseSpirits: 'Osnovni alkohol',
  modifiers: 'Dodatci',
  schoolTitle: 'Barmenska škola',
  schoolDescription:
    'Progresivne lekcije organizirane po temama. Započnite s kategorijom, odaberite tehniku i prođite kroz numerirane lekcije. Označite ih kao završene dok napredujete.',
  schoolTechniquesIn: 'Tehnike u',
  lessonsCount: 'lekcija',
  lessonCount: 'lekcija',
  backToCategory: '← Natrag na',
  markComplete: 'Označi kao završeno',
  markIncomplete: 'Označi kao nezavršeno',
  gamesTitle: 'Igre za zabavu',
  gamesDescription:
    'Party igre pića prosljedom telefona. Okrenite kotač, Nikada to nisam radio, S najvjerojatnije da, Drinkopoly i još mnogo toga.',
  loadingGames: 'Učitavanje igara…',
  loadingDirect: 'Ako ovo traje predugo, pokušajte otvoriti izravno:',
  loadError: 'Neuspjelo učitavanje igara.',
  loadErrorDesc: 'Igra možda blokira vaš preglednik ili mreža.',
  openDirect: 'Otvori igre izravno',
  backToCocktails: '← Natrag na koktele',
  lessonNotFound: 'Lekcija nije pronađena',
};

export const translations: Record<Lang, TranslationKeys> = { en, hr };
