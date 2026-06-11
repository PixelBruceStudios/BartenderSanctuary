export interface Cocktail {
  slug: string;
  name: string;
  origin: string;
  base: string[];
  modifiers: string[];
  glass: string;
  garnish: string;
  tags: string[];
  story: string;
  recipe: string[];
  technique: string;
}

export const cocktails: Cocktail[] = [
  {
    slug: "old-fashioned",
    name: "Old Fashioned",
    origin: "Late 1800s, New York. The original 'cocktail' — spirit, sugar, water, bitters. No frills, just balance.",
    base: ["whiskey"],
    modifiers: ["bitters"],
    glass: "Rocks",
    garnish: "Orange peel",
    tags: ["stirred", "spirit-forward", "classic"],
    story: "Before 'cocktail' meant anything with fruit juice, it meant this: spirit, sugar, water, and bitters. The Old Fashioned became a term of rebellion when bartenders started adding too many extras. Ordering one was a way to demand the old way — pure and simple.",
    recipe: [
      "2 oz bourbon or rye whiskey",
      "1 sugar cube (or 1/4 oz simple syrup)",
      "2 dashes Angostura bitters",
      "1 dash orange bitters (optional)",
      "Orange peel for garnish"
    ],
    technique: "Stirred"
  },
  {
    slug: "martini",
    name: "Martini",
    origin: "Late 1800s, California → New York. Evolved from the Martinez. Gin meets vermouth in a cold, stirred embrace.",
    base: ["gin", "vodka"],
    modifiers: ["vermouth"],
    glass: "Coupe",
    garnish: "Lemon twist / olive",
    tags: ["stirred", "spirit-forward", "classic", "dry"],
    story: "The Martini has been America's most argued-over cocktail for over a century. Dry or wet? Gin or vodka? Stirred or shaken? James Bond popularized the shaken version, but purists insist stirring keeps it silky. Either way, it's elegance in a glass.",
    recipe: [
      "2.5 oz gin or vodka",
      "0.5 oz dry vermouth",
      "Lemon twist or olive for garnish"
    ],
    technique: "Stirred"
  },
  {
    slug: "manhattan",
    name: "Manhattan",
    origin: "1870s, New York City. Said to have been invented at the Manhattan Club for a banquet honoring presidential candidate Samuel Tilden.",
    base: ["whiskey"],
    modifiers: ["vermouth", "bitters"],
    glass: "Coupe",
    garnish: "Brandied cherry",
    tags: ["stirred", "spirit-forward", "classic"],
    story: "Rye whiskey, sweet vermouth, and bitters — that's all it takes. Legend says it was born at a political party headquarters in the 1870s, and it's been a favorite of writers, politicians, and anyone who appreciates a drink with gravitas.",
    recipe: [
      "2 oz rye whiskey",
      "1 oz sweet vermouth",
      "2 dashes Angostura bitters",
      "Brandied cherry for garnish"
    ],
    technique: "Stirred"
  },
  {
    slug: "daiquiri",
    name: "Daiquiri",
    origin: "1896, Cuba. Not the frozen slush of spring break — the real one is shaken, fresh, and sharp.",
    base: ["rum"],
    modifiers: ["citrus", "syrup"],
    glass: "Coupe",
    garnish: "Lime wheel",
    tags: ["shaken", "sour", "tropical"],
    story: "Frozen daiquiris get all the attention, but the original was a simple shaken sour invented near Havana's Daiquiri iron mines. Hemingway's favorite was the Papa Doble — double rum, no sugar, just lime. A great daiquiri is tart, cold, and a little dangerous.",
    recipe: [
      "2 oz white rum",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "Lime wheel for garnish"
    ],
    technique: "Shaken"
  },
  {
    slug: "margarita",
    name: "Margarita",
    origin: "1930s–1940s, Mexico / Texas border. Multiple origin stories, but all agree: tequila, lime, salt.",
    base: ["tequila"],
    modifiers: ["citrus", "syrup", "liqueur"],
    glass: "Rocks",
    garnish: "Lime wheel",
    tags: ["shaken", "sour", "tropical"],
    story: "The Margarita is Mexico's gift to the world. Whether it was a socialite in Acapulco or a bartender in Dallas, someone got it right: tequila, fresh lime, a touch of sweetness, and a salted rim. It's the taste of summer in a glass.",
    recipe: [
      "2 oz blanco tequila",
      "1 oz fresh lime juice",
      "0.5 oz triple sec or Cointreau",
      "0.5 oz simple syrup",
      "Salt for rim",
      "Lime wheel for garnish"
    ],
    technique: "Shaken"
  },
  {
    slug: "negroni",
    name: "Negroni",
    origin: "1919, Florence, Italy. Count Camillo Negroni asked his bartender to strengthen his Americano by swapping soda for gin.",
    base: ["gin"],
    modifiers: ["vermouth", "liqueur", "bitters"],
    glass: "Rocks",
    garnish: "Orange peel",
    tags: ["stirred", "spirit-forward", "bitter"],
    story: "Bittersweet, bold, and unapologetically strong — the Negroni is Italy's most famous cocktail. Count Negroni wanted something stronger than his usual Americano, and his bartender gave him a drink that would become a global icon. Equal parts, no shortcuts.",
    recipe: [
      "1 oz gin",
      "1 oz Campari",
      "1 oz sweet vermouth",
      "Orange peel for garnish"
    ],
    technique: "Stirred"
  },
  {
    slug: "mojito",
    name: "Mojito",
    origin: "1500s–1800s, Cuba. Evolved from a medicinal mint-and-rum mixture to the bar standard we know today.",
    base: ["rum"],
    modifiers: ["citrus", "syrup", "herbal"],
    glass: "Highball",
    garnish: "Mint sprig",
    tags: ["built", "refreshing", "tropical"],
    story: "Havana's signature cocktail. The Mojito combines white rum, fresh mint, lime, and sparkling water — a drink designed for hot Caribbean afternoons. Ernest Hemingway made it famous in his novels, and it's been a summer staple ever since.",
    recipe: [
      "2 oz white rum",
      "1 oz fresh lime juice",
      "0.75 oz simple syrup",
      "6–8 fresh mint leaves",
      "0.5 oz soda water",
      "Mint sprig for garnish"
    ],
    technique: "Built"
  },
  {
    slug: "cosmopolitan",
    name: "Cosmopolitan",
    origin: "1980s–1990s, New York City. Popularized by *Sex and the City*, but created by bartenders experimenting with vodka and citrus.",
    base: ["vodka"],
    modifiers: ["citrus", "liqueur"],
    glass: "Coupe",
    garnish: "Orange twist",
    tags: ["shaken", "sour", "modern"],
    story: "The Cosmopolitan is the cocktail that defined a generation. Created in NYC bars during the cocktail renaissance, it became a cultural icon on TV. Behind the pink color is a perfectly balanced sour: vodka, triple sec, lime, and a touch of cranberry.",
    recipe: [
      "1.5 oz citrus vodka",
      "1 oz triple sec or Cointreau",
      "0.75 oz fresh lime juice",
      "0.5 oz cranberry juice",
      "Orange twist for garnish"
    ],
    technique: "Shaken"
  },
  {
    slug: "whiskey-sour",
    name: "Whiskey Sour",
    origin: "1860s, USA. One of the first cocktails written down in Jerry Thomas's 1862 bartender's guide.",
    base: ["whiskey"],
    modifiers: ["citrus", "syrup", "egg"],
    glass: "Rocks",
    garnish: "Orange slice / cherry",
    tags: ["shaken", "sour", "classic"],
    story: "The Whiskey Sour is older than most people think. Jerry Thomas published a recipe in 1862 — before Prohibition, before the cocktail 'renaissance.' Some versions add egg white for silky texture, but the core is simple: whiskey, lemon, sugar, shaken hard.",
    recipe: [
      "2 oz bourbon",
      "1 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "1 egg white (optional, for foam)",
      "Angostura bitters (for garnish)",
      "Lemon slice / cherry for garnish"
    ],
    technique: "Shaken"
  },
  {
    slug: "tom-collins",
    name: "Tom Collins",
    origin: "1870s, London → USA. Named after a prank song popular at the time; the drink was originally 'John Collins' with gin.",
    base: ["gin"],
    modifiers: ["citrus", "syrup", "carbonated"],
    glass: "Highball",
    garnish: "Lemon slice / cherry",
    tags: ["built", "sour", "refreshing"],
    story: "The Tom Collins is a tall, refreshing, slightly deceptive drink. Its name comes from a 1870s practical joke song, and early versions used Old Tom gin. Today it's a simple highball: gin, lemon, sugar, and soda water — perfect for lazy afternoons.",
    recipe: [
      "2 oz gin",
      "1 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "3–4 oz soda water",
      "Lemon slice / cherry for garnish"
    ],
    technique: "Built"
  },
  {
    slug: "milk-punch",
    name: "Milk Punch",
    origin: "17th century, England → New Orleans. A clarified milk-wash punch that was a favorite of literary figures and sailors alike.",
    base: ["whiskey", "rum"],
    modifiers: ["citrus", "syrup", "dairy"],
    glass: "Coupe",
    garnish: "Nutmeg grate",
    tags: ["milk-wash", "clarified", "spirit-forward", "historical"],
    story: "Milk Punch is one of the oldest clarified cocktails in existence. By curdling milk with acid and spirit, then straining it, bartenders created a silky, shelf-stable punch that could survive long sea voyages. It was reportedly Benjamin Franklin's favorite drink.",
    recipe: [
      "1.5 oz bourbon",
      "1.5 oz dark rum",
      "1 oz fresh lemon juice",
      "0.75 oz simple syrup",
      "3–4 oz whole milk",
      "Freshly grated nutmeg"
    ],
    technique: "Milk Wash / Clarified"
  },
  {
    slug: "fat-wash-bourbon",
    name: "Fat-Washed Bourbon",
    origin: "Modern technique, USA. Bourbon infused with browned butter or bacon fat, then clarified. A science-first approach to flavor.",
    base: ["whiskey"],
    modifiers: ["fat", "citrus"],
    glass: "Rocks",
    garnish: "Orange peel",
    tags: ["fat-wash", "clarified", "spirit-forward", "modern"],
    story: "Fat washing borrows from distilling: you steep spirit in melted fat, freeze it, then strain out the solids. The result is a spirit that tastes like browned butter or crispy bacon, but remains shelf-stable and mixable. It's cocktail chemistry at its most delicious.",
    recipe: [
      "750 ml bourbon",
      "0.5 cup unsalted butter (browned) or bacon fat",
      "1 cup whole milk (optional, for extra clarification)",
      "1 oz fresh lemon juice",
      "0.5 oz simple syrup"
    ],
    technique: "Fat Wash / Clarified"
  }
];

export const allBases = [...new Set(cocktails.flatMap(c => c.base))].sort();
export const allMods = [...new Set(cocktails.flatMap(c => c.modifiers))].sort();
