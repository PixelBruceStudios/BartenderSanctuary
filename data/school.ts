export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  sources?: string[];
  completed?: boolean;
  sort_order?: number;
}

export interface Technique {
  id?: string;
  slug: string;
  title: string;
  description: string;
  sort_order?: number;
  lessons: Lesson[];
}

export interface Category {
  id?: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sort_order?: number;
  techniques: Technique[];
}

export const schoolCategories: Category[] = [
  {
    id: 'foundations',
    slug: 'foundations',
    title: 'Foundations',
    description: 'The essential building blocks of bartending: history, setup, measurements, and palate.',
    icon: '🏗️',
    sort_order: 0,
    techniques: [
      {
        id: 'history-of-the-bar',
        slug: 'history-of-the-bar',
        title: 'History of the Bar',
        description: 'From ancient fermentation to the craft renaissance.',
        sort_order: 0,
        lessons: [
          {
            id: 'ancient-fermentation',
            title: 'Ancient Fermentation & Distillation',
            description: 'Where alcoholic beverages began.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Fermentation is one of the oldest chemical processes humans have controlled. Evidence of fermented beverages dates back to 7000–6600 BCE in Jiahu, China, where residue analysis revealed a mixed fermented drink of rice, honey, and fruit. In Mesopotamia, the Sumerians brewed beer from barley by 4000 BCE — the Hymn to Ninkasi is both a prayer and a beer recipe. Distillation emerged much later, likely between 1st century CE Alexandria and 8th–9th century Arabia, where alchemists refined wine into stronger spirits for medicinal use. Monasteries became centers of distillation knowledge across Europe by the 12th century. Understanding this timeline helps bartenders explain the "why" behind the drinks they serve.`,
            sort_order: 0,
          },
          {
            id: 'taverns-saloons-speakeasies',
            title: 'Taverns, Saloons, Speakeasies',
            description: 'The social spaces that shaped drinking culture.',
            duration: '14 min',
            difficulty: 'Beginner',
            content: `Taverns were colonial America's community hubs — part inn, part court, part voting station. By the 1800s, saloons became distinctly male working-class spaces, often tied to breweries. During Prohibition (1920–1933), legal bars closed and illegal speakeasies flourished, creating cocktail culture out of necessity: poor-quality bathtub gin needed masking, and secrecy demanded speed and small pours. This era invented or popularized the Sidecar, Bee's Knees, and French 75. After repeal, tiki bars and hotel lounges carried the cocktail forward until the dark ages of the 1970s–80s.`,
            sort_order: 1,
          },
          {
            id: 'prohibition-legacy',
            title: 'Prohibition & Its Legacy',
            description: 'How 13 years shaped American drinking.',
            duration: '15 min',
            difficulty: 'Intermediate',
            content: `Prohibition (1920–1933) removed legal supply but did not remove demand. Organized crime stepped in, drinks got worse, and bartenders got creative. Citrus juices, honey, and syrups became essential to cover harsh spirits. Ice consumption skyrocketed — previously a luxury, now necessary for diluted, fast-served drinks. The legacy is mixed: Prohibition destroyed many fine-dining cocktail traditions but also birthed the classic cocktail canon we still revere. When legal bars reopened, many skilled bartenders had left the industry, and quality suffered for decades.`,
          },
          {
            id: 'golden-age',
            title: 'Golden Age of Cocktails (1860–1920)',
            description: 'Jerry Thomas to the pre-Prohibition heyday.',
            duration: '18 min',
            difficulty: 'Intermediate',
            content: `The Golden Age ran roughly from the 1860s to 1920. Jerry Thomas published the first bartender's guide in 1862 ("How to Mix Drinks"), codifying recipes and establishing bartending as a craft. Liqueurs, bitters, and fresh citrus became standard. Establishments like the Waldorf-Astoria and the Savoy set standards of service and atmosphere. The cocktail was a social lubricant for a rapidly modernizing world — railways, telegraphs, and urban density created demand for sophisticated public drinking spaces. The era ended with Prohibition but left a recipe canon that defines craft bartending today.`,
          },
          {
            id: 'tiki-era',
            title: 'Tiki Era (1930s–1960s)',
            description: 'Polynesian fantasy, rum, and Don the Beachcomber.',
            duration: '15 min',
            difficulty: 'Beginner',
            content: `Donn Beach opened Don the Beachcomber in 1934 Los Angeles, inventing the tiki bar: Polynesian decor, rum-forward drinks, and a mythology of Pacific escapism. Victor Bergeron (Trader Vic) popularized the Mai Tai in Oakland in 1944. The era produced elaborate drinks — Zombie, Scorpion, Navy Grog — often featuring multiple rum types, citrus, syrups, and overproof floaters. Tiki was originally a kitschy American invention, but its emphasis on balance, layered flavor, and showmanship influenced modern craft bartending. The 2000s tiki revival (CocktailDB, Three Dots and a Dash) proved its staying power.`,
          },
          {
            id: 'disco-era-decline',
            title: 'Disco Era Decline',
            description: 'When cocktails lost their way.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `The 1970s–80s saw a collapse in cocktail quality. Pre-mixed sweet products (sour mix, margarita mix), frozen blenders, and low-quality spirits dominated. Vodka displaced gin as the "neutral" spirit of choice, partly because it was cheaper and easier to mask. The focus shifted from craft to volume and sweetness. Many classic bars closed or dumbed down their menus. Bartenders were treated as service staff, not craftspeople. This era is important context: the craft cocktail renaissance was explicitly a rejection of this decline.`,
          },
          {
            id: 'craft-renaissance',
            title: 'Craft Cocktail Renaissance (2000s–Now)',
            description: 'Dale DeGroff, Sasha Petraske, and the modern bar.',
            duration: '16 min',
            difficulty: 'Intermediate',
            content: `The renaissance began in the late 1990s and peaked in the 2000s–2010s. Dale DeGroff at the Rainbow Room revived fresh juice, house-made syrups, and pre-Prohibition recipes. Sasha Petraske at Milk & Honey introduced precision, guest interaction, and the modern cocktail menu format. Bartenders became celebrities, and cocktails became intellectual as well as social pursuits. Today's craft bartenders study history, chemistry, and sensory science — not just recipes. The movement has gone global, with strong scenes in London, Berlin, Tokyo, Mexico City, and Sydney.`,
          },
        ],
      },
      {
        slug: 'bar-setup-terminology',
        title: 'Bar Setup & Terminology',
        description: 'Anatomy of a bar, glassware, tools, measurements, and hygiene.',
        lessons: [
          {
            id: 'anatomy-of-bar',
            title: 'Anatomy of a Bar',
            description: 'Well, back bar, speed rail, mise en place.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `A professional bar has three functional zones. The **well** (or speed rail) is where you work — the sink, ice bin, rail of house pours, and immediate tools. The **back bar** is the display and storage area for premium bottles, liqueurs, and garnishes. **Mise en place** mirrors kitchen practice: everything in its place, pre-poured house pours, garnishes cut and stored correctly, glassware within reach. A well-organized mise reduces ticket times, prevents errors, and looks professional to guests.`,
          },
          {
            id: 'essential-glassware',
            title: 'Essential Glassware Guide',
            description: 'Coupe, rocks, highball, collins, and more.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Glassware is functional, not decorative. The **coupe** (150–200mL) is for shaken, strained cocktails (martinis, daiquiris). **Rocks glasses** (200–300mL) are for built or stirred drinks served over ice. **Highball** (250–350mL) and **collins** (350–400mL) suit long drinks with soda or juice. **Nick & Nora** glasses are a smaller, elegant alternative to the coupe, popular in modern bars. **Flutes** serve sparkling cocktails. **Irish coffee glass** is for hot drinks. Chilling glasses in the fridge or freezer improves temperature retention — a warm glass is a service failure.`,
          },
          {
            id: 'essential-tools',
            title: 'Essential Tools Guide',
            description: 'Shakers, strainers, muddlers, and barspoons.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Every bartender needs a core toolkit. **Boston shaker** (2-piece: glass + tin) is durable and easy to seal. **Cobbler shaker** (3-piece) is compact but harder to open when cold. **Hawthorne strainer** fits a mixing glass or shaker tin; **Julep strainer** is for stirred drinks in a mixing glass. A **barspoon** (long, twisted shaft) is for stirring — it creates less dilution than shaking and looks elegant. **Muddler** (wood or plastic, never metal) crushes herbs and fruit. **Channel knife** makes citrus twists. **Jigger** (double-ended, 1oz/2oz or ¾oz/1½oz) ensures consistent pours. **Speed pourer** with calibrated training bottles helps build muscle memory for free-pouring.`,
          },
          {
            id: 'measurements',
            title: 'Bar Measurements',
            description: 'Oz, ml, dash, splash, barspoon — and the metric conversion.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Consistency starts with measurement. In the U.S.: 1oz = 29.57mL; 1.5oz = 44.36mL (standard spirit pour). A **dash** is roughly 1/8oz (3.7mL) — for bitters, it is typically 2–3 quick presses of the bottle. A **splash** is informal, roughly 0.5–1oz. A **barspoon** holds about 5mL (1 tsp). In Europe and most of the world, recipes are in mL: 30mL = 1oz, 45mL = 1.5oz. Professional bars standardize on one system. Recipes on Bartender Sanctuary use oz for U.S. readers with mL in parentheses where helpful.`,
          },
          {
            id: 'industry-slang',
            title: 'Industry Slang & Vocabulary',
            description: 'The language bars actually use.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Slang is practical shorthand. A **well drink** uses the house liquor; a **call drink** specifies a brand. **Top-shelf** means premium. **Rail** is the speed-rail bottles. **On the rocks** = over ice; **neat** = straight up, no ice; **straight up** = chilled, strained, no ice. **Dirty** = with olive brine (martini); **dry** = less vermouth. **Up** = chilled and strained. **Shot** = 1.5oz (in the U.S.). **Neat pour** = a single large ice cube or sphere. **Muddle** = crush in the glass. **Build** = assemble in the serving glass. **Call** = guest requests a specific brand.`,
          },
          {
            id: 'hygiene-food-safety',
            title: 'Bar Hygiene & Food Safety',
            description: 'Cross-contamination, glass washing, and storage.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Bars are food-service environments. **Glass washing**: detergent, rinse, sanitize, air-dry — no towel drying (lint). **Ice handling**: use scoops, never hands. **Garnish storage**: cut citrus lasts 1–2 days in the fridge; herbs last 2–3 days in water. **Cross-contamination**: separate tools for raw ingredients if serving food; never use the same straw or stirrer for multiple guests. **Allergens**: nut-based liqueurs, egg whites, dairy — disclose when asked. **Temperature**: cold storage below 5°C (41°F), hot holding above 60°C (140°F). Most local health departments inspect bars; know your local code.`,
          },
        ],
      },
      {
        slug: 'palate-training',
        title: 'Palate Training',
        description: 'Taste profiles, aroma, and building flavour memory.',
        lessons: [
          {
            id: 'five-tastes',
            title: 'The 5 Taste Profiles',
            description: 'Sweet, sour, bitter, salty, umami.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `The human tongue detects five primary tastes: **sweet** (energy, ripe fruit, sugar), **sour** (acid, tartness, brightness), **bitter** (complexity, depth, often from botanicals or gentian), **salty** (enhances flavor, masks bitterness), and **umami** (savory depth, soy, mushroom, aged cheese). Cocktails are rarely pure in one taste — the craft lies in balance. A sour cocktail like a daiquiri is intentionally sour, but a well-made one still has enough sweetness to round the edges. Palate training starts with identifying these tastes in isolation, then in combination.`,
          },
          {
            id: 'alcohol-flavour-perception',
            title: 'How Alcohol Affects Flavour Perception',
            description: 'ABV, burn, and sensory adaptation.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Alcohol itself is a solvent: it carries aroma compounds to the nose and carries taste compounds across the tongue. At low ABV, alcohol adds body and warmth. Above ~20% ABV, it begins to dominate the palate with "burn" — the trigeminal nerve detects alcohol as a mild irritant. Dilution (from shaking, stirring, or adding water) lowers ABV and opens up flavors by breaking surface tension and releasing volatile aromatics. This is why stirring a spirit-forward drink over ice improves it: controlled dilution and temperature drop.`,
          },
          {
            id: 'training-your-nose',
            title: 'Training Your Nose',
            description: 'Aroma families and olfactory memory.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Smell is 80% of flavor. Train your nose by smelling ingredients raw, then in combination. Common aroma families in cocktails: **citrus** (lemon, lime, grapefruit), **floral** (orange blossom, rose, lavender), **herbaceous** (mint, basil, rosemary), **woody** (oak, cedar, sandalwood), **spicy** (pepper, clove, cinnamon), **fruity** (berry, stone fruit, tropical), **earthy** (mushroom, beet, roots). Keep a "smell journal" — write down aromas you encounter in spirits, juices, and herbs. Over time, you will recognize patterns and identify off-flavors faster.`,
          },
          {
            id: 'tasting-methodology',
            title: 'Tasting Methodology',
            description: 'Structured tasting for bartenders.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Professional tasting follows a sequence: **look** (color, clarity, legs/tears indicate alcohol and sugar content), **smell** (first without nosing, then with gentle swirling — note first, second, and third aromas), **taste** (small sip, coat the palate, note attack, mid-palate, and finish), **think** (balance, complexity, length). Use a spittoon for serious tastings — you do not need to swallow to evaluate. Taste in a quiet room with minimal background smells. Compare two similar spirits side by side (two bourbons, two gins) to build comparative skills.`,
          },
          {
            id: 'building-flavour-memory',
            title: 'Building Flavour Memory',
            description: 'How to remember and recall flavours.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Memory is associative. When you taste lime juice, link it to key lime pie, margaritas, or Thai food. When you taste Campari, link it to Negroni, Boulevardier, or Campari soda. Build a mental map: "citrus + herbal + bitter" points toward gin; "caramel + vanilla + oak" points toward bourbon. Taste deliberately, not passively. Revisit the same spirit monthly. Memory fades without reinforcement — schedule regular tastings, even 5-minute ones during prep.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'spirits',
    title: 'Spirits',
    description: 'The complete guide to base spirits: raw materials, fermentation, distillation, and flavor.',
    icon: '🥃',
    techniques: [
      {
        slug: 'whiskey',
        title: 'Whiskey / Whisky',
        description: 'From grain to glass - the world’s most diverse spirit category.',
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
