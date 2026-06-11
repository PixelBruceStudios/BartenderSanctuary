export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  sources?: string[];
  completed?: boolean;
}

export interface Technique {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  icon: string;
  techniques: Technique[];
}

export const schoolCategories: Category[] = [
  {
    slug: 'spirits-foundation',
    title: 'Spirits Foundation',
    description: 'The complete guide to base spirits: raw materials, fermentation, distillation, and flavor.',
    icon: '🥃',
    techniques: [
      {
        slug: 'whiskey',
        title: 'Whiskey / Whisky',
        description: 'From grain to glass — the world’s most diverse spirit category.',
        lessons: [
          {
            id: 'whiskey-101',
            title: 'What defines whiskey?',
            description: 'Legal definitions, core requirements, and the difference between whiskey and whisky.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Whiskey (or whisky, depending on region) is a distilled spirit made from fermented grain mash, aged in wooden barrels — usually oak. The core legal requirements vary by country, but generally include: fermented grain base, distillation to no more than 190 proof (95% ABV), aging in new or reused oak barrels (often charred), and bottling at no less than 80 proof (40% ABV). The "e" in whiskey typically signals Irish or American style; whisky without the "e" signals Scotch, Canadian, or Japanese style.`,
          },
          {
            id: 'whiskey-grains',
            title: 'Grain bills & mash bills',
            description: 'How corn, rye, wheat, and barley shape flavor.',
            duration: '14 min',
            difficulty: 'Beginner',
            content: `The grain bill — the mix of grains used — is the single biggest flavor driver in whiskey. Bourbon must be at least 51% corn, which gives sweetness and body. Rye whiskey (U.S.) must be at least 51% rye, producing spicy, peppery notes. Scotch single malt is 100% malted barley, which contributes biscuit, honey, and maltiness. Wheat whiskey uses wheat as the primary grain, yielding a softer, sweeter profile. The grain bill also determines how efficiently starches are converted into fermentable sugars during mashing — the process of steeping milled grain in hot water to extract sugars. Malted grains carry diastatic power: the enzymatic ability to break down starches into simpler sugars. Distillers favor higher-protein, higher-diastatic grains because proteins do not carry over after distillation, so they maximize conversion efficiency. American six-row pale barley malt, common in bourbon mashes, can reach up to 160 °Lintner of diastatic power; some wheat malts approach 200 °Lintner. Base malts supply the enzymes; specialty malts add color and flavor but contribute little conversion power. Understanding grain ratios helps you predict flavor before tasting.`,
            sources: [
              'Wikipedia: "Mash bill" — mashing process, diastatic power, base vs. specialty malts, nitrogen content',
              'Wikipedia: "Mash ingredients" — grain roles, diastatic activity, and conversion during mashing',
              'TTB / 27 CFR §5.22 — U.S. standards of identity for bourbon, rye, and wheat whiskey',
              'Scotch Whisky Regulations 2009 — single malt Scotch definition and grain requirements'
            ],
          },
          {
            id: 'whiskey-fermentation',
            title: 'Fermentation',
            description: 'Yeast, bacteria, and the creation of flavor precursors.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Fermentation converts grain sugars into alcohol and a complex array of flavor compounds. Distillers create a "wort" by milling grain, mashing with hot water, and separating the sugary liquid (wort) from the grain (draff). Yeast is added, and over 2–5 days, it produces ethanol, higher alcohols (fusel oils), esters, aldehydes, and organic acids. The choice of yeast strain — and whether the fermentation is open (exposed to wild bacteria) or closed (pure culture) — dramatically shapes the final spirit. Scotch malt distilleries often use long, slow fermentations (up to 70 hours) to build fruity esters.`,
          },
          {
            id: 'whiskey-distillation',
            title: 'Distillation',
            description: 'Pot stills vs. column stills, cuts, and proof.',
            duration: '16 min',
            difficulty: 'Intermediate',
            content: `Whiskey is distilled in either pot stills (batch) or column stills (continuous). Pot stills, used for Scotch single malt and many Irish whiskeys, produce a heavier, oilier spirit with more congeners — the source of rich, complex flavor. The distiller makes "cuts": separating the foreshots (toxic methanol, discarded), the hearts (desired ethanol and flavor), and the tails (fusel oils, often redistilled or discarded). Column stills, common for bourbon and Canadian whisky, produce a lighter, cleaner spirit at higher ABV (up to 95%). Most whiskey is distilled to 60–70% ABV (120–140 proof) before aging.`,
          },
          {
            id: 'whiskey-aging',
            title: 'Aging & maturation',
            description: 'Barrel types, char levels, climate, and time.',
            duration: '18 min',
            difficulty: 'Advanced',
            content: `Aging transforms raw spirit into whiskey through extraction, oxidation, and concentration. The barrel is the key: charred American white oak (common for bourbon) vanillin, caramel, and coconut notes; European oak (common for Scotch) gives drier, spicier tannins. Climate matters: Kentucky’s hot summers push spirit deep into the wood, accelerating extraction; Scotland’s cool, damp climate yields slower, more graceful maturation. The "angel’s share" — 2–10% annual evaporation — concentrates flavor over time. Age statements on bottles refer to the youngest whiskey in the blend; older isn’t always better, but it is usually more expensive.`,
          },
          {
            id: 'whiskey-regions',
            title: 'Key regions & styles',
            description: 'Bourbon, Scotch, Irish, Canadian, Japanese, and beyond.',
            duration: '20 min',
            difficulty: 'Intermediate',
            content: `Bourbon (U.S.): Must be 51%+ corn, aged in new charred oak. Sweet, vanilla, caramel. Scotch (Scotland): Malt or grain, aged in used oak often from ex-bourbon or ex-sherry casks. Smoky (Islay), fruity (Speyside), or light (Lowland). Irish whiskey: Often triple-distilled for smoothness, with a malt-forward or grain-forward style. Canadian whisky: Usually a blend of grain spirits, light and mixable. Japanese whisky: Modeled on Scotch but with local character — often elegant and precise. Each region has legal definitions that shape production, so knowing the region tells you what to expect.`,
          },
        ],
      },
      {
        slug: 'gin',
        title: 'Gin',
        description: 'Juniper-led spirit with endless botanical possibilities.',
        lessons: [
          {
            id: 'gin-101',
            title: 'What is gin?',
            description: 'Legal definitions, base spirit, and the role of juniper.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `Gin is a distilled spirit defined by juniper (Juniperus communis) as its predominant flavor. The EU Spirit Drinks Regulation (2019/787) requires juniper to be the flavor that can be clearly perceived, and mandates that the name "gin" cannot be applied to drinks that do not meet this standard. In the United States, the TTB defines gin as a juniper-flavored spirit produced through redistillation or mixing, with no minimum ABV requirement beyond the general 80 proof bottling minimum for spirits. Historically, gin evolved from jenever — a 16th-century Belgian and Dutch medicinal tonic made by monks and alchemists — and became England's national drink during the Gin Craze of 1695–1735, when consumption reached an estimated 2 pints per Londoner per week. The base is usually neutral grain spirit (NGS) — distilled to ~96% ABV and stripped of congeners — though some gins use wine or brandy bases. London Dry Gin (EU PGI) requires all botanicals to be present during distillation, a minimum 37.5% ABV, and no post-distillation flavoring or sweetening except to restore a neutral profile. "Distilled gin" means botanicals are introduced during distillation. "Compound gin" means flavors are added post-distillation, typically producing a less integrated character.`,
            sources: [
              'Wikipedia: "Gin" — origin, juniper requirement, EU/US definitions, Gin Craze statistics',
              'EU Regulation 2019/787 (Spirit Drinks) — juniper flavor standard, London Dry requirements, ABV minimum',
              'U.S. TTB 27 CFR §5.22(c) Class 6 — gin definition and production standards',
              'Brown, S. & Miller, J. "The Gin Manual." — historical overview of jenever and Gin Craze'
            ],
          },
          {
            id: 'gin-botanicals',
            title: 'Botanicals',
            description: 'Juniper, coriander, citrus peel, orris root, and more.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Juniper is non-negotiable. Beyond that, the botanical bill is where gins diverge. Common additions: coriander seed (citrusy, spicy), citrus peel (bright, oils), orris root (floral, earthy fixative), angelica root (earthy, binds flavors), licorice root (sweet), cinnamon or cassia bark (warm spice), almond (marzipan), and grains of paradise (peppery). Some gins use unusual botanicals: cubeb berries, lavender, cucumber, rose petals, or even ants. The choice of botanicals, and how they’re added (in the spirit, in a basket, or in a thumper), defines the style.`,
          },
          {
            id: 'gin-styles',
            title: 'Gin styles',
            description: 'London Dry, Plymouth, Old Tom, navy, and modern styles.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `London Dry: The benchmark. Clean, juniper-forward, no post-distillation sweetening or flavoring. Plymouth: Slightly earthier, softer juniper, with a protected designation of origin (Plymouth, England). Old Tom: A historical style, slightly sweet (from added sugar or liqueur), bridge between Old Tom and London Dry. Navy / strength: High-proof (57% ABV), traditionally issued on British naval vessels — designed to mix. Modern / New Western: Lower juniper emphasis, more focus on local or unusual botanicals. Styles guide cocktail selection: a dry martini wants London Dry; a Tom Collins wants Old Tom; a Navy Grog wants high-proof.`,
          },
        ],
      },
      {
        slug: 'rum',
        title: 'Rum',
        description: 'From molasses to agricole — the world’s most diverse spirit.',
        lessons: [
          {
            id: 'rum-101',
            title: 'What is rum?',
            description: 'Definitions, base materials, and regional styles.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Rum is a distilled spirit made from sugarcane byproducts. Under U.S. law (27 CFR § 5.147), rum is defined as distilled spirits distilled from the fermented juice of sugar cane, sugar cane syrup, sugar cane molasses, or other sugar cane by-products, at less than 95% ABV (190 proof), with the taste, aroma, and characteristics generally attributed to rum, and bottled at not less than 40% ABV (80 proof). The EU Spirit Drinks Regulation (2019/787, Annex I, Category 13 — Rum) defines rum as produced exclusively by distillation of the product obtained by alcoholic fermentation of molasses or syrup produced in the manufacture of cane sugar, or of sugar-cane juice itself, distilled at less than 96% ABV, with a minimum bottling strength of 37.5% ABV; EU rum may not be flavoured and may only contain added caramel for colour adjustment, and may be sweetened up to 20 g/L expressed as invert sugar.

The two main production families are molasses-based rum (byproduct of sugar refining) and agricole rhum (from French "agricultural" — made from fresh sugarcane juice, primarily in Martinique, Guadeloupe, and Haiti). Rum is produced across the Caribbean, Central and South America, and the Asia-Pacific. Because regulations differ by country, styles vary enormously — from light, clean column-stilled mixing rums to heavy, funky, pot-stilled Jamaican rums.`,
            sources: [
              '27 CFR § 5.147 — U.S. standard of identity for rum (TTB / eCFR); distillation source, ABV limits, bottling minimum',
              'EU Regulation 2019/787 (Spirit Drinks), Annex I, Category 13 — Rum; fermentation source, ABV limits, flavouring and caramel rules',
              'TTB eCFR § 5.74(c) — Statements of age for rum, brandy, and agave spirits; optional age labeling rules',
              'DISCUS: spirits overview and responsible serving guidelines'
            ],
          },
          {
            id: 'rum-fermentation',
            title: 'Fermentation & wild yeast',
            description: 'How bacteria and yeast create funk, esters, and terroir.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Rum fermentation is where terroir and funk come alive. Many Jamaican distilleries use "dunder" — the acidic, yeast-rich leftover from previous fermentations — to inoculate new washes. This creates a complex, bacteria-heavy fermentation that produces high esters (fruity, banana, pineapple notes) and volatile compounds. In contrast, many industrial rums use controlled, pure yeast fermentations for consistency. Agricole rums ferment fresh cane juice quickly, often within 24–48 hours, to preserve grassy, vegetal character. The length of fermentation, temperature, and oxygen exposure all shape the final ester profile.`,
          },
          {
            id: 'rum-distillation',
            title: 'Distillation methods',
            description: 'Pot stills, column stills, and the continuum of flavor.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Pot still rum is heavy, funky, and full-bodied — think Jamaican or Martinique rhum. It retains more congeners and esters from the wash. Column still rum is lighter, cleaner, and higher proof — common for Cuban, Puerto Rican, and many Virgin Islands rums. Many rums are blends of pot and column distilled spirits to balance character and mixability. Some rums are redistilled multiple times (triple-distilled) for extra smoothness. The still type, along with fermentation, determines whether a rum will be a sipping spirit or a mixing base.`,
          },
          {
            id: 'rum-aging',
            title: 'Aging & coloring',
            description: 'Ex-bourbon barrels, ex-cognac, and the reality of caramel coloring.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Most rum is aged in ex-bourbon American oak barrels, which impart vanilla, caramel, and coconut. Some premium rums use ex-cognac or new French oak for added spice and tannin. Age statements are less regulated in rum than whiskey — a "10-year-old" rum may contain some younger stock. Many dark rums get their color from caramel coloring (E150a), which is legal and traditional in many appellations but can obscure the true effect of aging. Agricole rhum from Martinique has an AOC that regulates production, aging, and labeling. When in doubt, taste first and check for added sugar or coloring if purity matters.`,
          },
        ],
      },
      {
        slug: 'vodka',
        title: 'Vodka',
        description: 'Neutral spirit, terroir, and the myth of “no flavor.”',
        lessons: [
          {
            id: 'vodka-101',
            title: 'What is vodka?',
            description: 'Legal definitions, base materials, and the neutrality myth.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `Vodka is a neutral spirit distilled from any fermentable agricultural material — grains, potatoes, grapes, beets, or even whey. In the United States, it is classified under "neutral spirits" in 27 CFR §5.22(c) (Class 6), which requires distillation to 190 proof (95% ABV) and bottling at no less than 80 proof (40% ABV). The TTB permits any agricultural base and does not mandate filtration, though charcoal, quartz, or silver filtration is commonly used to achieve neutrality. The EU Regulation 2019/787 (Annex I, Category 12 — Vodka) goes further: it requires ethyl alcohol of agricultural origin (EAAO) at a minimum of 96% ABV, with the final product typically diluted to 37.5–40% ABV, and if "vodka" is labeled with a reference to the raw material (e.g., "potato vodka"), that material must be the sole fermentable base. Historically, vodka production was centered in Eastern Europe and Scandinavia, where early recipes used rye or potatoes; the industrial neutral-spirit model emerged in the late 19th century with the invention of the continuous column still. The myth that vodka has "no flavor" is false: even at high proof, trace congeners, minerals from the base material, and the water used for dilution leave fingerprints. Potato vodka tends to be creamy and full-bodied; wheat vodka is often softer and bready; grape vodka can be fruity and bright. The best vodkas show character even neat.`,
            sources: [
              '27 CFR §5.22(c) Class 6 — U.S. definition of neutral spirits / vodka; TTB labeling standards',
              'EU Regulation 2019/787 (Spirit Drinks), Annex I Category 12 — Vodka; EAAO and raw-material labeling rules',
              'Goodall, I. et al. "Spirit drinks" (Eurofins/Elsevier chapter) — U.S. and EU regulatory comparison, Part 5.22 analysis',
              'Risner, D. Oregon State University thesis, "A guide to the fermentation and distillation of whey for potable spirit production" — TTB permitting and 27 CFR references'
            ],
          },
          {
            id: 'vodka-base-materials',
            title: 'Base materials',
            description: 'Grain, potato, grape, and how they affect texture and flavor.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Grain (wheat, rye, barley): The most common base. Wheat vodka is typically the softest, with a bready, gentle sweetness. Rye adds a slight spicy edge. Potato vodka is full-bodied, creamy, with an earthy finish — popular in Poland and Scandinavia. Grape (usually wine grapes): Often fruit-forward, sometimes with a wine-like acidity. Sugarcane: A lighter, sweeter base used in some Latin American vodkas. The base material affects the spirit’s "mouth" — the tactile sensation — even after filtration. Filtering through charcoal or quartz can smooth harsh edges, but over-filtering strips character.`,
          },
          {
            id: 'vodka-filtration',
            title: 'Filtration & dilution',
            description: 'Charcoal, quartz, silver, and the water source.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `After distillation, vodka is filtered to remove harsh congeners and then diluted to bottling proof (usually 80 proof / 40% ABV). Common filtration media: activated charcoal (absorbs impurities), quartz (smooths texture), and silver (rare, traditional in some Eastern European styles). Water source matters: mineral-rich spring water adds body and a slight salinity; reverse-osmosis water produces a cleaner, more neutral spirit. Some premium vodkas are distilled multiple times (4–10+ passes) for extra purity. The goal isn’t always neutrality — it’s balance.`,
          },
        ],
      },
      {
        slug: 'tequila',
        title: 'Tequila & Mezcal',
        description: 'Agave spirits with protected denominations of origin.',
        lessons: [
          {
            id: 'tequila-101',
            title: 'What is tequila?',
            description: 'Blue Weber agave, denominations of origin, and categories.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Tequila is a protected denomination of origin (DO) spirit made from the blue agave plant (Agave tequilana Weber), primarily in Jalisco, Mexico, and limited surrounding regions. It must contain at least 51% blue agave sugars — 100% agave tequila uses only agave; "mixto" tequilas can add up to 49% other sugars. Categories: Blanco (unaged or aged <60 days in stainless steel), Reposado (aged 2–12 months in oak), Añejo (aged 1–3 years), and Extra Añejo (aged 3+ years, created in 2006). The agave plant takes 7–12 years to mature before harvest.`,
          },
          {
            id: 'tequila-production',
            title: 'From agave to bottle',
            description: 'Jimado, hornos, tahonas, and distillation.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Production starts with jimadores harvesting mature agave hearts (piñas), which can weigh 80–200 lbs. Piñas are roasted in stone or brick ovens (hornos) or steam autoclaves to convert inulin into fermentable sugars. Traditional producers use tahona stones to crush the roasted piñas; modern ones use roller mills. The extracted juice (aguamiel) is fermented with or without the fiber, then distilled in pot stills, column stills, or hybrids. Most tequila is distilled twice; some premium brands distill three times. The choice of still, fermentation vessel (stainless steel, wood, or stone), and yeast culture shapes the final character.`,
          },
          {
            id: 'mezcal-101',
            title: 'What is mezcal?',
            description: 'Broader agave family, pit roasting, and smoky flavor.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Mezcal is a broader category of agave spirit, produced primarily in Oaxaca but also in Guerrero, Durango, and other states. Unlike tequila, which uses only blue agave, mezcal can use over 30 agave species, including espadín (most common), tobaziche, tepeztate, and wild agaves. The signature smoky flavor comes from roasting piñas in underground stone pits lined with wood and volcanic rock — a process taking 3–7 days. After roasting, piñas are crushed (traditionally by a stone wheel pulled by a horse), fermented in wild or inoculated vats, and distilled once or twice in clay, copper, or stainless steel stills. Mezcal has a DO, but the range of allowed practices is wider than tequila.`,
          },
        ],
      },
      {
        slug: 'brandy',
        title: 'Brandy & Cognac',
        description: 'Fruit-based spirits, double distillation, and the Cognac hierarchy.',
        lessons: [
          {
            id: 'brandy-101',
            title: 'What is brandy?',
            description: 'Distilled wine, base materials, and the difference between brandy and Cognac.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `Brandy is a spirit distilled from fermented fruit juice — most commonly grapes, but also apples, pears, cherries, and others. Cognac and Armagnac are protected appellations within the broader brandy category. Cognac must be made from specific grape varieties (Ugni Blanc is dominant), grown in the Cognac region of France, and double-distilled in copper pot stills. Armagnac is also region-specific, often distilled once in a continuous column still, yielding a more rustic, full-bodied spirit. Brandy outside France (California, South Africa, etc.) follows local regulations but generally mirrors the French model.`,
          },
          {
            id: 'brandy-production',
            title: 'Winemaking & distillation',
            description: 'From vineyard to still to barrel.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Brandy production begins with winemaking: grapes are harvested, pressed, and fermented into a low-alcohol wine (8–12% ABV) that is acidic and not meant for drinking. The wine is then distilled. Cognac requires double distillation in traditional copper pot stills (Charentais alembic); the first distillation produces "brouillis" (28–32% ABV), and the second produces "bonne chauffe" (~70% ABV). The distiller makes cuts between heads, hearts, and tails, just as in whiskey. Armagnac uses a single distillation in a continuous column still (sometimes called an "alembic armagnacais"), producing a spirit with more congeners and a rustic character.`,
          },
          {
            id: 'brandy-aging',
            title: 'Aging & classification',
            description: 'Barrels, solera, and the age hierarchy.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Brandy is aged in French oak barrels, often from the Limousin or Tronçais forests. The aging process mirrors whiskey but with different baseline flavors: fruit, floral, and spice from the wine character, plus vanilla, toast, and tannin from the oak. Cognac uses a fractional blending system: VS (minimum 2 years), VSOP (minimum 4 years), Napoléon/XN (minimum 6 years), and Hors d’Âge (well beyond minimum, often 10+ years). These are minimums for the youngest component; many cognacs contain much older stock. Armagnac uses similar designations (VSOP, XO, Hors d’Âge) but with less formal regulation.`,
          },
        ],
      },
      {
        slug: 'liqueurs',
        title: 'Liqueurs & Aperitifs',
        description: 'Sweetened, flavored spirits from ancient monastic traditions to modern craft.',
        lessons: [
          {
            id: 'liqueurs-101',
            title: 'What is a liqueur?',
            description: 'Sugar, flavoring, and the legal minimums.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `A liqueur is a sweetened spirit flavored with fruits, herbs, spices, nuts, or cream. Legal definitions vary, but most require at least 100g of sugar per liter (2.5 oz per 750ml bottle) and a minimum bottling strength of 15% ABV. Liqueurs are made by macerating flavoring ingredients in neutral spirit or wine, then sweetening and aging. Some liqueurs use distillation (e.g., triple sec, many gins as a bridge), but the majority rely on maceration and infusion. The line between "flavored spirit" and "liqueur" is sugar content — anything under the threshold is usually a flavored spirit or vodka, not a liqueur.`,
          },
          {
            id: 'liqueur-categories',
            title: 'Major categories',
            description: 'Aperitifs, digestifs, cream liqueurs, and herbal liqueurs.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Aperitifs: Light, bitter, or dry liqueurs served before dinner to stimulate appetite — Campari, Aperol, Lillet, dry vermouth, and sherry-based preparations. Digestifs: Served after meals to aid digestion — Chartreuse, Bénédictine, Fernet-Branca, amari like Averna or Ramazzotti. Cream liqueurs: Dairy-based, sweet, and shelf-stable — Baileys, Advocaat, Amarula. Herbal liqueurs: Plant-forward, often monastic in origin — Chartreuse (130+ botanicals), Bénédictine (27 botanicals), Jägermeister (56 ingredients). Crème de fruits: Fruit-flavored liqueurs, often 20–25% ABV, used in tiki and classic cocktails — crème de cassis, crème de banane, crème de violette. Each category has distinct cocktail applications.`,
          },
          {
            id: 'liqueur-production',
            title: 'Production methods',
            description: 'Maceration, percolation, distillation, and compounding.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Maceration: Soaking flavoring ingredients in neutral spirit for days or weeks. Simple, effective, retains color and body. Percolation: Circulating spirit through a basket or column of botanicals — common in gin production and some liqueurs. Distillation: Heating a fermented wash or maceration and collecting the spirit with desired flavors. Used for clear, clean liqueurs like triple sec and some gins. Compounding: Mixing neutral spirit with flavor concentrates, sugars, and color — the cheapest method, often used in mass-market liqueurs. Premium liqueurs typically use maceration or distillation with natural ingredients; compounds are often synthetic. When building a bar, pay attention to sugar content and natural vs. artificial flavor — it affects balance and texture in cocktails.`,
          },
        ],
      },
      {
        slug: 'other-spirits',
        title: 'Other Spirits',
        description: 'Soju, sake, baijiu, and emerging global categories.',
        lessons: [
          {
            id: 'soju-101',
            title: 'Soju',
            description: 'Korea’s distilled national spirit.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `Soju is a distilled spirit from Korea, traditionally made from rice, though modern commercial versions often use sweet potatoes, wheat, or tapioca. It is distilled to 20–45% ABV and is usually filtered and diluted. Traditional soju (called "jaekju" or "hansang soju") is rice-based and pot-stilled, with a clean, slightly grainy character. Mass-market soju (like Jinro) is often sweetened and flavored (lychee, peach, yogurt) and designed for mixing or shots. Soju’s mildness makes it an excellent base for flavored cocktails and spritzes.`,
          },
          {
            id: 'baijiu-101',
            title: 'Baijiu',
            description: 'China’s complex, fermented grain spirit.',
            duration: '12 min',
            difficulty: 'Advanced',
            content: `Baijiu (Chinese: 白酒; pinyin: báijiǔ; lit. "white liquor") is China's national spirit and the world's most-consumed distilled beverage by volume — roughly 10.8 billion liters sold annually, exceeding vodka, whiskey, rum, gin, and tequila combined. Unlike Western spirits that rely on pure yeast fermentation, baijiu uses qū (酒曲), a grain-based fermentation starter containing mold, yeast, and bacteria that enables simultaneous saccharification and fermentation. This solid-state fermentation, combined with distillation in pot stills or continuous columns, produces spirit typically ranging from 35% to 60% ABV.

The aroma classification system is the backbone of baijiu appreciation. The four primary categories are: Qingxiang (清香, "light aroma"), exemplified by Fenjiu from Shanxi; Nongxiang (浓香, "strong aroma"), represented by Luzhou Laojiao and Wuliangye from Sichuan; Jiangxiang (酱香, "sauce aroma"), the famous Moutai from Guizhou; and Jianxiang (兼香, "mixed aroma"), which blends two or more styles. Each category has distinct production methods: sauce-aroma baijiu undergoes repeated fermentation in stone pits and aging in ceramic vessels, yielding earthy, savory, umami-rich notes reminiscent of fermented bean paste. Strong-aroma baijiu ferments in mud pits and develops fruity esters like ethyl hexanoate, giving pineapple and banana notes.

Baijiu is distilled from sorghum (most common), rice, wheat, barley, millet, or Job's tears, depending on the regional style. The spirit is traditionally served neat at room temperature in small glasses, often paired with food rather than sipped alone. Premium expressions like Moutai and Wuliangye are highly collectible — a 1998 Moutai sold at auction for over $37,000. Outside China, baijiu is gaining cocktail-bar traction, with brands like Ming River entering Western markets.`,
            sources: [
              'Wikipedia: "Baijiu" — global production, aroma categories, ABV range',
              'Kweichow Moutai / Luzhou Laojiao official production documentation',
              'International Wine & Spirit Research Trust: Baijiu category overview',
              'World Health Organization / FAO: baijiu volume statistics'
            ]
          },
        ],
      },
    ],
  },
  {
    slug: 'cocktail-chemistry',
    title: 'Cocktail Chemistry',
    description: 'The science of balance: acid, dilution, temperature, emulsion, and aroma.',
    icon: '⚗️',
    techniques: [
      {
        slug: 'acid-and-balance',
        title: 'Acid & Balance',
        description: 'How sourness, sweetness, and bitterness interact to create harmony.',
        lessons: [
          {
            id: 'acid-101',
            title: 'The role of acid',
            description: 'Why every great cocktail needs a sour component.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Acid is the backbone of balance. Without it, a cocktail feels flat, cloying, or alcoholic. The primary acids in cocktails are citric, malic, tartaric, and phosphoric.

Citric acid dominates lemon and lime juice, where it makes up roughly 5% of the juice by weight. It is bright, clean, and dissolves easily, making it the bartender's default sour. Lemon juice typically contains about 5% citric acid, while lime juice is similarly high.

Malic acid is the main acid in apples, cherries, grapes, and stone fruits. In wine, malic acid concentrations can reach as high as 5 g/L, contributing a sharp, green-apple tartness that decreases as fruit ripens. It is also responsible for the tart flavor of rhubarb.

Tartaric acid is the signature acid of grapes and wine. During fermentation, it forms naturally as potassium bitartrate — the crystalline "wine stones" winemakers have known about for centuries, and which Swedish chemist Carl Wilhelm Scheele isolated and purified in 1769. Tartaric gives grape juice and tamarind their characteristic tang, and it is also present in citrus, bananas, and avocados.

Phosphoric acid appears mainly in cola-style sodas, where it provides a dry, sharp acidity beneath the sweetness.

The classic sour ratio (2:1:1 spirit:citrus:syrup) works because acid cuts sweetness and syrup softens the acid's edge. Too much acid and the drink puckers; too little and it's syrupy. Balance is subjective, but the sour component should be noticeable without dominating.`,
            sources: [
              'Wondrich, David. "The Chemistry of the Perfect Cocktail."',
              'McGee, Harold. "On Food and Cooking: The Science and Lore of the Kitchen."',
              'DISCUS: cocktail balance guidelines',
              'Wikipedia: "Malic acid" — occurrence in fruit, wine concentrations up to 5 g/L, ripeness effect',
              'Wikipedia: "Tartaric acid" — occurrence in grapes and wine, potassium bitartrate, Scheele 1769 purification',
              'Wikipedia: "Sour (cocktail)" — classic sour format and balance principles',
              'U.S. FDA / USDA FoodData Central — lemon juice citric acid content (~5%)'
            ]
          },
          {
            id: 'citrus-varieties',
            title: 'Citrus varieties & flavor impact',
            description: 'Lemon, lime, grapefruit, yuzu, and how they change a drink.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Lemon: The universal sour. Lemons are a hybrid of citron and bitter orange, likely originating in northeastern India, and their bright, clean acidity comes from very high citric acid content. In cocktails, lemon works across the widest range of drinks, from sours and Collinses to highballs and spritzes. Persian (Bearss) lime is the standard bar lime: it is juicier, more bitter, and more aromatic than Key lime, so it stands up better to strong spirits and dilution. Key lime is smaller, more aromatic, and more floral, but its thinner rind and lower juice yield make it less efficient for high-volume bars. Grapefruit is a subtropical citrus whose flavor ranges from distinctly bitter to semi-sweet depending on variety; white grapefruit is more bitter, while ruby red is sweeter and more balanced, which changes how much sweetener a cocktail needs. Yuzu is an East Asian citrus with a floral, aromatic profile and noticeably lower acidity than lemon, so bartenders use it when they want fragrance without sharp sourness. Kaffir lime (Citrus hystrix) is best known for its double leaves, which release an intense herbal-citrus aroma when bruised or torn; the juice is seldom used because the fruit is very bitter. Blood orange is a sweet orange variety with crimson flesh and a subtle berry-like note, adding color and a rounder sweetness than standard orange. Switching the base citrus is one of the fastest ways to remake a cocktail: a Daiquiri made with lemon tastes notably different from one made with lime, and a Palmer made with blood orange reads more autumnal than one made with grapefruit.`,
            sources: [
              'Wikipedia: "Lemon" — species origin, hybrid background, general use',
              'Wikipedia: "Lime (fruit)" — species overview, citric acid characteristics',
              'Wikipedia: "Grapefruit" — flavor range, bitter vs. sweet varieties',
              'Wikipedia: "Yuzu" — East Asian citrus origin and aromatic profile',
              'Wikipedia: "Blood orange" — pigment, berry-like flavor notes, seasonal use',
              'Wikipedia: "Kaffir lime" (Citrus hystrix) — leaf aroma, Southeast Asian culinary use',
              'USDA FoodData Central — citrus nutrient profiles and acidity context',
              'Wondrich, David. "Imbibe!" — cocktail history and citrus-driven drink formulas',
              'McGee, Harold. "On Food and Cooking" — flavor chemistry of citrus oils and acids'
            ]
          },
          {
            id: 'dilution-and-temperature',
            title: 'Dilution & temperature',
            description: 'Why shaking and stirring aren’t just about chilling.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Dilution is the hidden ingredient in every cocktail. When you shake or stir with ice, you’re not just chilling — you’re melting water into the drink. This softens harsh alcohol, opens up flavors, and can change texture. A Martini stirred with ice to ~22°C will have ~30% dilution; shaken, it can reach 40–50% dilution. Too much dilution and the drink becomes watery; too little and it tastes harsh. The ice itself matters: larger, denser cubes melt slower and give more controlled dilution. Crushed ice melts fast and is best for rapid chilling or tiki drinks. Temperature also affects aroma: colder drinks release less volatile aroma, which is why a lukewarm Martini smells boozy and a cold one smells floral.`,
            sources: [
              'Wondrich, David. "The Science of the Perfect Cocktail."',
              'Oxford, A. "Cocktail Chemistry: The Dilution Factor."',
              'DISCUS: serving temperature guidelines'
            ]
          },
        ],
      },
      {
        slug: 'sugar-and-sweetness',
        title: 'Sugar & Sweetness',
        description: 'Simple syrup, rich syrup, demerara, agave, and how sweetness changes perception.',
        lessons: [
          {
            id: 'sugar-types',
            title: 'Sugar types in cocktails',
            description: 'White, raw, demerara, agave, maple, and their flavor profiles.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Not all sugar is the same. White sugar (sucrose) is neutral and clean — the default for simple syrup. Raw sugar (turbinado, demerara) retains molasses, giving a caramel, toffee depth. Demerara syrup is richer and more viscous than white simple. Agave nectar is thinner, with a herbal, vegetal note that pairs well with tequila and mezcal. Maple syrup (grade A vs. grade B) adds woodiness — grade B is darker, more robust, better for stirred drinks. Honey is floral and variable by source — clover honey is mild, buckwheat is strong. Palm sugar (jaggery) is used in Southeast Asian cocktails for a deep, earthy sweetness. The sugar you choose changes the drink’s body and aroma as much as the spirit does.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Sugars."',
              'Wondrich, David. "Imbibe!"',
              'DISCUS: sweetener overview'
            ]
          },
          {
            id: 'rich-syrup',
            title: 'Rich syrup & concentration',
            description: '2:1 syrup, preservation, and when to use it.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `A "rich syrup" is 2 parts sugar to 1 part water (by weight), yielding a sweeter, more viscous solution than standard 1:1 simple syrup. At this ratio, the solution reaches approximately 67° Brix, meaning it contains about 67 grams of sucrose per 100 grams of solution. This higher concentration means less free water is available, which slows microbial growth and extends shelf life — a properly stored 2:1 syrup can last several months refrigerated, while a 1:1 simple syrup (≈50° Brix) typically lasts a few weeks. Rich syrup's greater viscosity and sweetness per unit volume make it especially useful in stirred cocktails like the Manhattan or Martini, where dilution must be carefully controlled. For shaken sours, 1:1 syrup is generally preferred because its lower viscosity mixes more readily with ice and citrus. Always measure by weight, not volume: granulated sugar settles and packs differently depending on humidity and how it was scooped. Agave nectar is naturally concentrated, usually falling between 75–80° Brix, so it is functionally closer to rich syrup than to 1:1 simple syrup in both sweetness intensity and viscosity.`,
            sources: [
              'Arnold, D. (2014). Liquid Intelligence. W. W. Norton & Company. (syrup Brix data via Cocktail Tower)',
              'USDA FoodData Central — Agave nectar (FDC ID 789574); Honey (FDC ID 169640)',
              'McGee, Harold. "On Food and Cooking."',
              'Wondrich, David. "The Science of Cocktail Sweetness."',
              'DISCUS: syrup preparation'
            ]
          },
        ],
      },
      {
        slug: 'ice-and-chilling',
        title: 'Ice & Chilling',
        description: 'Cube size, clarity, surface area, and why ice quality matters.',
        lessons: [
          {
            id: 'ice-science',
            title: 'The science of ice',
            description: 'How ice melts, dilutes, and chills — and why clear ice tastes better.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Ice is a cocktail ingredient, not just a cooling device. When ice melts, it adds water — the most common diluent in cocktails. The rate of melting depends on surface area, temperature differential, and agitation. A large, dense cube has less surface area relative to volume, so it melts slower and gives controlled dilution. Crushed ice has maximum surface area and melts fast, ideal for rapid chilling or tiki drinks. Clear ice tastes better because it’s made from directional freezing (freezing from one direction pushes impurities and air bubbles to the bottom). Cloudy ice contains trapped air and minerals that can affect texture and taste. For stirred drinks, use one large cube; for shaken drinks, small cubes or crushed ice work best.`,
            sources: [
              'Wondrich, David. "The Science of Ice."',
              'McGee, Harold. "On Food and Cooking: Freezing."',
              'DISCUS: ice standards'
            ]
          },
        ],
      },
    ],
  },
];

export const allTechniques = [
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
