#!/usr/bin/env node
// scripts/seed-school.cjs
// Usage: DATABASE_URL='postgresql://USER:***@HOST/DB' node scripts/seed-school.cjs
// Safe to re-run: uses ON CONFLICT DO UPDATE.

const { Client } = require('pg');

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('DATABASE_URL env var required');
  process.exit(1);
}

const CATEGORIES = [
  {
    slug: 'foundations',
    title: 'Foundations',
    description: 'The essential building blocks of bartending: history, setup, measurements, and palate.',
    icon: '🏗️',
    sort_order: 1,
    techniques: [
      {
        slug: 'history-of-the-bar',
        title: 'History of the Bar',
        description: 'From ancient fermentation to the craft renaissance.',
        sort_order: 1,
        lessons: [
          { id: 'foundations-history-1', slug: 'ancient-fermentation', title: 'Ancient Fermentation & Distillation', description: 'Where alcoholic beverages began.', duration: '12 min', difficulty: 'Beginner', sort_order: 1, content: 'Fermentation is one of the oldest chemical processes humans have controlled. Evidence of fermented beverages dates back to 7000–6600 BCE in Jiahu, China, where residue analysis revealed a mixed fermented drink of rice, honey, and fruit. In Mesopotamia, the Sumerians brewed beer from barley by 4000 BCE — the Hymn to Ninkasi is both a prayer and a beer recipe. Distillation emerged much later, likely between 1st century CE Alexandria and 8th–9th century Arabia, where alchemists refined wine into stronger spirits for medicinal use. Monasteries became centers of distillation knowledge across Europe by the 12th century. Understanding this timeline helps bartenders explain the "why" behind the drinks they serve.' },
          { id: 'foundations-history-2', slug: 'taverns-saloons-speakeasies', title: 'Taverns, Saloons, Speakeasies', description: 'The social spaces that shaped drinking culture.', duration: '14 min', difficulty: 'Beginner', sort_order: 2, content: 'Taverns were colonial America\'s community hubs — part inn, part court, part voting station. By the 1800s, saloons became distinctly male working-class spaces, often tied to breweries. During Prohibition (1920–1933), legal bars closed and illegal speakeasies flourished, creating cocktail culture out of necessity: poor-quality bathtub gin needed masking, and secrecy demanded speed and small pours. This era invented or popularized the Sidecar, Bee\'s Knees, and French 75. After repeal, tiki bars and hotel lounges carried the cocktail forward until the dark ages of the 1970s–80s.' },
          { id: 'foundations-history-3', slug: 'prohibition-legacy', title: 'Prohibition & Its Legacy', description: 'How 13 years shaped American drinking.', duration: '15 min', difficulty: 'Intermediate', sort_order: 3, content: 'Prohibition (1920–1933) removed legal supply but did not remove demand. Organized crime stepped in, drinks got worse, and bartenders got creative. Citrus juices, honey, and syrups became essential to cover harsh spirits. Ice consumption skyrocketed — previously a luxury, now necessary for diluted, fast-served drinks. The legacy is mixed: Prohibition destroyed many fine-dining cocktail traditions but also birthed the classic cocktail canon we still revere. When legal bars reopened, many skilled bartenders had left the industry, and quality suffered for decades.' },
          { id: 'foundations-history-4', slug: 'golden-age', title: 'Golden Age of Cocktails (1860–1920)', description: 'Jerry Thomas to the pre-Prohibition heyday.', duration: '18 min', difficulty: 'Intermediate', sort_order: 4, content: 'The Golden Age ran roughly from the 1860s to 1920. Jerry Thomas published the first bartender\'s guide in 1862 ("How to Mix Drinks"), codifying recipes and establishing bartending as a craft. Liqueurs, bitters, and fresh citrus became standard. Establishments like the Waldorf-Astoria and the Savoy set standards of service and atmosphere. The cocktail was a social lubricant for a rapidly modernizing world — railways, telegraphs, and urban density created demand for sophisticated public drinking spaces. The era ended with Prohibition but left a recipe canon that defines craft bartending today.' },
          { id: 'foundations-history-5', slug: 'tiki-era', title: 'Tiki Era (1930s–1960s)', description: 'Polynesian fantasy, rum, and Don the Beachcomber.', duration: '15 min', difficulty: 'Beginner', sort_order: 5, content: 'Donn Beach opened Don the Beachcomber in 1934 Los Angeles, inventing the tiki bar: Polynesian decor, rum-forward drinks, and a mythology of Pacific escapism. Victor Bergeron (Trader Vic) popularized the Mai Tai in Oakland in 1944. The era produced elaborate drinks — Zombie, Scorpion, Navy Grog — often featuring multiple rum types, citrus, syrups, and overproof floaters. Tiki was originally a kitschy American invention, but its emphasis on balance, layered flavor, and showmanship influenced modern craft bartending. The 2000s tiki revival (CocktailDB, Three Dots and a Dash) proved its staying power.' },
          { id: 'foundations-history-6', slug: 'disco-era-decline', title: 'Disco Era Decline', description: 'When cocktails lost their way.', duration: '10 min', difficulty: 'Beginner', sort_order: 6, content: 'The 1970s–80s saw a collapse in cocktail quality. Pre-mixed sweet products (sour mix, margarita mix), frozen blenders, and low-quality spirits dominated. Vodka displaced gin as the "neutral" spirit of choice, partly because it was cheaper and easier to mask. The focus shifted from craft to volume and sweetness. Many classic bars closed or dumbed down their menus. Bartenders were treated as service staff, not craftspeople. This era is important context: the craft cocktail renaissance was explicitly a rejection of this decline.' },
          { id: 'foundations-history-7', slug: 'craft-renaissance', title: 'Craft Cocktail Renaissance (2000s–Now)', description: 'Dale DeGroff, Sasha Petraske, and the modern bar.', duration: '16 min', difficulty: 'Intermediate', sort_order: 7, content: 'The renaissance began in the late 1990s and peaked in the 2000s–2010s. Dale DeGroff at the Rainbow Room revived fresh juice, house-made syrups, and pre-Prohibition recipes. Sasha Petraske at Milk & Honey introduced precision, guest interaction, and the modern cocktail menu format. Bartenders became celebrities, and cocktails became intellectual as well as social pursuits. Today\'s craft bartenders study history, chemistry, and sensory science — not just recipes. The movement has gone global, with strong scenes in London, Berlin, Tokyo, Mexico City, and Sydney.' },
        ],
      },
      {
        slug: 'bar-setup-terminology',
        title: 'Bar Setup & Terminology',
        description: 'Anatomy of a bar, glassware, tools, measurements, and hygiene.',
        sort_order: 2,
        lessons: [
          { id: 'foundations-bar-1', slug: 'anatomy-of-bar', title: 'Anatomy of a Bar', description: 'Well, back bar, speed rail, mise en place.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'A professional bar has three functional zones. The **well** (or speed rail) is where you work — the sink, ice bin, rail of house pours, and immediate tools. The **back bar** is the display and storage area for premium bottles, liqueurs, and garnishes. **Mise en place** mirrors kitchen practice: everything in its place, pre-poured house pours, garnishes cut and stored correctly, glassware within reach. A well-organized mise reduces ticket times, prevents errors, and looks professional to guests.' },
          { id: 'foundations-bar-2', slug: 'essential-glassware', title: 'Essential Glassware Guide', description: 'Coupe, rocks, highball, collins, and more.', duration: '10 min', difficulty: 'Beginner', sort_order: 2, content: 'Glassware is functional, not decorative. The **coupe** (150–200mL) is for shaken, strained cocktails (martinis, daiquiris). **Rocks glasses** (200–300mL) are for built or stirred drinks served over ice. **Highball** (250–350mL) and **collins** (350–400mL) suit long drinks with soda or juice. **Nick & Nora** glasses are a smaller, elegant alternative to the coupe, popular in modern bars. **Flutes** serve sparkling cocktails. **Irish coffee glass** is for hot drinks. Chilling glasses in the fridge or freezer improves temperature retention — a warm glass is a service failure.' },
          { id: 'foundations-bar-3', slug: 'essential-tools', title: 'Essential Tools Guide', description: 'Shakers, strainers, muddlers, and barspoons.', duration: '12 min', difficulty: 'Beginner', sort_order: 3, content: 'Every bartender needs a core toolkit. **Boston shaker** (2-piece: glass + tin) is durable and easy to seal. **Cobbler shaker** (3-piece) is compact but harder to open when cold. **Hawthorne strainer** fits a mixing glass or shaker tin; **Julep strainer** is for stirred drinks in a mixing glass. A **barspoon** (long, twisted shaft) is for stirring — it creates less dilution than shaking and looks elegant. **Muddler** (wood or plastic, never metal) crushes herbs and fruit. **Channel knife** makes citrus twists. **Jigger** (double-ended, 1oz/2oz or ¾oz/1½oz) ensures consistent pours. **Speed pourer** with calibrated training bottles helps build muscle memory for free-pouring.' },
          { id: 'foundations-bar-4', slug: 'measurements', title: 'Bar Measurements', description: 'Oz, ml, dash, splash, barspoon — and the metric conversion.', duration: '10 min', difficulty: 'Beginner', sort_order: 4, content: 'Consistency starts with measurement. In the U.S.: 1oz = 29.57mL; 1.5oz = 44.36mL (standard spirit pour). A **dash** is roughly 1/8oz (3.7mL) — for bitters, it is typically 2–3 quick presses of the bottle. A **splash** is informal, roughly 0.5–1oz. A **barspoon** holds about 5mL (1 tsp). In Europe and most of the world, recipes are in mL: 30mL = 1oz, 45mL = 1.5oz. Professional bars standardize on one system. Recipes on Bartender Sanctuary use oz for U.S. readers with mL in parentheses where helpful.' },
          { id: 'foundations-bar-5', slug: 'industry-slang', title: 'Industry Slang & Vocabulary', description: 'The language bars actually use.', duration: '10 min', difficulty: 'Beginner', sort_order: 5, content: 'Slang is practical shorthand. A **well drink** uses the house liquor; a **call drink** specifies a brand. **Top-shelf** means premium. **Rail** is the speed-rail bottles. **On the rocks** = over ice; **neat** = straight up, no ice; **straight up** = chilled, strained, no ice. **Dirty** = with olive brine (martini); **dry** = less vermouth. **Up** = chilled and strained. **Shot** = 1.5oz (in the U.S.). **Neat pour** = a single large ice cube or sphere. **Muddle** = crush in the glass. **Build** = assemble in the serving glass. **Call** = guest requests a specific brand.' },
          { id: 'foundations-bar-6', slug: 'hygiene-food-safety', title: 'Bar Hygiene & Food Safety', description: 'Cross-contamination, glass washing, and storage.', duration: '12 min', difficulty: 'Beginner', sort_order: 6, content: 'Bars are food-service environments. **Glass washing**: detergent, rinse, sanitize, air-dry — no towel drying (lint). **Ice handling**: use scoops, never hands. **Garnish storage**: cut citrus lasts 1–2 days in the fridge; herbs last 2–3 days in water. **Cross-contamination**: separate tools for raw ingredients if serving food; never use the same straw or stirrer for multiple guests. **Allergens**: nut-based liqueurs, egg whites, dairy — disclose when asked. **Temperature**: cold storage below 5°C (41°F), hot holding above 60°C (140°F). Most local health departments inspect bars; know your local code.' },
        ],
      },
      {
        slug: 'palate-training',
        title: 'Palate Training',
        description: 'Taste profiles, aroma, and building flavour memory.',
        sort_order: 3,
        lessons: [
          { id: 'foundations-palate-1', slug: 'five-tastes', title: 'The 5 Taste Profiles', description: 'Sweet, sour, bitter, salty, umami.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'The human tongue detects five primary tastes: **sweet** (energy, ripe fruit, sugar), **sour** (acid, tartness, brightness), **bitter** (complexity, depth, often from botanicals or gentian), **salty** (enhances flavor, masks bitterness), and **umami** (savory depth, soy, mushroom, aged cheese). Cocktails are rarely pure in one taste — the craft lies in balance. A sour cocktail like a daiquiri is intentionally sour, but a well-made one still has enough sweetness to round the edges. Palate training starts with identifying these tastes in isolation, then in combination.' },
          { id: 'foundations-palate-2', slug: 'alcohol-flavour-perception', title: 'How Alcohol Affects Flavour Perception', description: 'ABV, burn, and sensory adaptation.', duration: '12 min', difficulty: 'Beginner', sort_order: 2, content: 'Alcohol itself is a solvent: it carries aroma compounds to the nose and carries taste compounds across the tongue. At low ABV, alcohol adds body and warmth. Above ~20% ABV, it begins to dominate the palate with "burn" — the trigeminal nerve detects alcohol as a mild irritant. Dilution (from shaking, stirring, or adding water) lowers ABV and opens up flavors by breaking surface tension and releasing volatile aromatics. This is why stirring a spirit-forward drink over ice improves it: controlled dilution and temperature drop.' },
          { id: 'foundations-palate-3', slug: 'training-your-nose', title: 'Training Your Nose', description: 'Aroma families and olfactory memory.', duration: '12 min', difficulty: 'Beginner', sort_order: 3, content: 'Smell is 80% of flavor. Train your nose by smelling ingredients raw, then in combination. Common aroma families in cocktails: **citrus** (lemon, lime, grapefruit), **floral** (orange blossom, rose, lavender), **herbaceous** (mint, basil, rosemary), **woody** (oak, cedar, sandalwood), **spicy** (pepper, clove, cinnamon), **fruity** (berry, stone fruit, tropical), **earthy** (mushroom, beet, roots). Keep a "smell journal" — write down aromas you encounter in spirits, juices, and herbs. Over time, you will recognize patterns and identify off-flavors faster.' },
          { id: 'foundations-palate-4', slug: 'tasting-methodology', title: 'Tasting Methodology', description: 'How to taste spirits and cocktails like a professional.', duration: '14 min', difficulty: 'Beginner', sort_order: 4, content: 'Professional tasting follows a sequence: **look** (color, clarity, legs/tears indicate alcohol and sugar content), **smell** (first without nosing, then with gentle swirling — note first, second, and third aromas), **taste** (small sip, coat the palate, note attack, mid-palate, and finish), **think** (balance, complexity, length). Use a spittoon for serious tastings — you do not need to swallow to evaluate. Taste in a quiet room with minimal background smells. Compare two similar spirits side by side (two bourbons, two gins) to build comparative skills.' },
          { id: 'foundations-palate-5', slug: 'building-flavour-memory', title: 'Building Flavour Memory', description: 'How to remember and recall tastes and aromas.', duration: '12 min', difficulty: 'Beginner', sort_order: 5, content: 'Memory is associative. When you taste lime juice, link it to key lime pie, margaritas, or Thai food. When you taste Campari, link it to Negroni, Boulevardier, or Campari soda. Build a mental map: "citrus + herbal + bitter" points toward gin; "caramel + vanilla + oak" points toward bourbon. Taste deliberately, not passively. Revisit the same spirit monthly. Memory fades without reinforcement — schedule regular tastings, even 5-minute ones during prep.' },
        ],
      },
    ],
  },
  {
    slug: 'spirits',
    title: 'Spirits',
    description: 'The complete guide to base spirits: raw materials, fermentation, distillation, and flavor.',
    icon: '🥃',
    sort_order: 2,
    techniques: [
      { slug: 'whiskey', title: 'Whiskey', description: 'Grain, barrel, and time — the world\'s most diverse spirit category.', sort_order: 1, lessons: [
        { id: 'spirits-whiskey-1', slug: 'whiskey-made', title: 'How Whiskey Is Made', description: 'From grain to glass.', duration: '14 min', difficulty: 'Beginner', sort_order: 1, content: 'Whiskey production has four stages: mashing (converting grain starches to fermentable sugars), fermenting (yeast converts sugars to alcohol), distilling (separating alcohol from water and congeners), and aging (extracting flavor from oak). Each stage offers variables that define style: grain type, yeast strain, still type, barrel type, char level, climate, and time.' },
        { id: 'spirits-whiskey-2', slug: 'scotch-regions', title: 'Scotch — Regions & Styles', description: 'Islay, Speyside, Highlands, Lowlands, Islands, Campbeltown.', duration: '16 min', difficulty: 'Intermediate', sort_order: 2, content: 'Scotch whisky must be distilled and aged in Scotland. The main regions produce distinct profiles: Islay is smoky (peated malt); Speyside is fruity and elegant; Highlands is varied; Lowlands is light; Islands is maritime; Campbeltown is briny and industrial. Single malt means one distillery; blended means multiple malts plus grain whisky.' },
        { id: 'spirits-whiskey-3', slug: 'bourbon', title: 'Bourbon — Rules & Production', description: 'U.S. identity, mash bill, new oak, and char.', duration: '15 min', difficulty: 'Intermediate', sort_order: 3, content: 'Bourbon must be 51%+ corn, distilled to ≤160 proof, entered into the barrel at ≤125 proof, aged in new charred American oak, and bottled at ≥80 proof. No additives allowed except water to reduce proof. The "new charred oak" requirement is unique — it forces extraction of vanillin, caramel, and coconut compounds every time, which is why bourbon tastes distinctively sweet and vanilla-forward.' },
      ]},
      { slug: 'gin', title: 'Gin', description: 'Juniper-led spirit with endless botanical possibilities.', sort_order: 2, lessons: [
        { id: 'spirits-gin-1', slug: 'gin-made', title: 'How Gin Is Made', description: 'Base spirit, botanicals, and distillation.', duration: '12 min', difficulty: 'Beginner', sort_order: 1, content: 'Gin starts with a neutral grain spirit (NGS) distilled to ~96% ABV. Botanicals — juniper plus coriander, citrus peel, orris root, angelica, and more — are added during distillation in a pot still (distilled gin) or macerated and then redistilled. The resulting spirit is diluted to bottling strength (usually 37.5–47% ABV). London Dry requires all flavoring during distillation; no post-distillation sweetening or flavoring except to restore neutrality.' },
      ]},
      { slug: 'rum', title: 'Rum', description: 'From molasses to rhum agricole.', sort_order: 3, lessons: [
        { id: 'spirits-rum-1', slug: 'rum-made', title: 'How Rum Is Made', description: 'Base material, fermentation, distillation, aging.', duration: '12 min', difficulty: 'Beginner', sort_order: 1, content: 'Rum is distilled from fermented sugarcane byproducts: molasses (byproduct of sugar refining) or fresh cane juice (agricole). Molasses rums are generally fuller and sweeter; agricole rhums are grassy, vegetal, and often funky. The Caribbean dominates production, but style varies enormously by island and distillery.' },
      ]},
      { slug: 'tequila-mezcal', title: 'Tequila & Mezcal', description: 'Agave spirits of Mexico.', sort_order: 4, lessons: [
        { id: 'spirits-tequila-1', slug: 'agave-plant', title: 'Agave — The Plant', description: 'The heart of Mexican spirits.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Blue agave (Agave tequilana Weber) grows in the volcanic soil of Jalisco and surrounding regions. It takes 7–10 years to reach maturity. The piña (heart) is roasted, shredded, and fermented. For mezcal, agave hearts are roasted in earthen pits, giving the spirit its signature smoky character. Tequila uses agave cooked in brick ovens or autoclaves.' },
      ]},
      { slug: 'vodka', title: 'Vodka', description: 'Neutral spirit, terroir, and the myth of "no flavor."', sort_order: 5, lessons: [
        { id: 'spirits-vodka-1', slug: 'vodka-made', title: 'How Vodka Is Made', description: 'Base, distillation, filtration, dilution.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Vodka is distilled from any fermentable agricultural base: grains (rye, wheat), potatoes, grapes, beets, or whey. It is distilled to high proof (≥95% ABV in the EU), filtered (charcoal, quartz, silver), and diluted to bottling strength (usually 37.5–40% ABV). The base material leaves a fingerprint even at high dilution.' },
      ]},
      { slug: 'brandy-cognac', title: 'Brandy & Cognac', description: 'Distilled wine, Armagnac, Calvados, and more.', sort_order: 6, lessons: [
        { id: 'spirits-brandy-1', slug: 'brandy-made', title: 'How Brandy Is Made', description: 'Wine to spirit — distillation and aging.', duration: '12 min', difficulty: 'Beginner', sort_order: 1, content: 'Brandy is wine distilled to spirit, then aged in oak. Cognac is a protected appellation in France with strict rules: double distillation in pot stills, aging in Limousin or Tronçais oak for minimum 2 years for VS, 4 for VSOP, 10 for XO. Armagnac is older, more rustic, distilled once in a continuous still. Calvados is apple brandy from Normandy.' },
      ]},
      { slug: 'liqueurs-amari', title: 'Liqueurs & Amari', description: 'Herbal, citrus, bitter, and cream liqueurs.', sort_order: 7, lessons: [
        { id: 'spirits-liqueurs-1', slug: 'liqueurs-made', title: 'How Liqueurs Are Made', description: 'Maceration, distillation, sweetening, and dosing.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Liqueurs are spirits flavored and sweetened. Production methods: maceration (soaking botanicals in base spirit), percolation (spirit passes through botanicals), distillation (distilling with botanicals), or combination. After flavor extraction, sugar (sucrose, invert sugar, honey) is added to 100–400g/L. Amari are Italian bitter liqueurs, typically 20–40% ABV, flavored with herbs, roots, and citrus peels.' },
      ]},
      { slug: 'beer-wine-basics', title: 'Beer & Wine Basics', description: 'Service, storage, and pairing fundamentals.', sort_order: 8, lessons: [
        { id: 'spirits-beer-1', slug: 'beer-styles', title: 'Beer Styles for Bartenders', description: 'Lager, ale, stout, sour, and more.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Bars increasingly serve craft beer. Key styles: lager (clean, crisp, bottom-fermented), ale (fruitier, top-fermented), IPA (hoppy, bitter), stout (dark, roasted), sour (acidic, funky), wheat (hazy, light). Know ABV ranges, flavor profiles, and glassware. Beer cocktails (shandy, michelada, boilermaker) are growing.' },
      ]},
    ],
  },
  {
    slug: 'cocktail-theory',
    title: 'Cocktail Theory',
    description: 'Balance, families, formulas, and original creation methods.',
    icon: '⚖️',
    sort_order: 3,
    techniques: [
      { slug: 'classic-families', title: 'Classic Cocktail Families', description: 'Sours, highballs, stirred, and tiki.', sort_order: 1, lessons: [
        { id: 'theory-families-1', slug: 'sours', title: 'Sours', description: 'The archetypal balance of spirit, citrus, and sugar.', duration: '12 min', difficulty: 'Beginner', sort_order: 1, content: 'The sour template is spirit + citrus + sugar + optional egg white. It is the foundation of the daiquiri, margarita, and sidecar. Balance is key: too much sugar is cloying; too much acid is puckering. Fresh citrus juice is non-negotiable — bottled juice lacks the volatile aromatics that make a sour sing. Shake hard with ice to chill and dilute properly.' },
      ]},
      { slug: 'cocktail-formula', title: 'The Cocktail Formula', description: 'Base, modifier, accent, and balance.', sort_order: 2, lessons: [
        { id: 'theory-formula-1', slug: 'base-modifier-accent', title: 'Base, Modifier, Accent', description: 'The structural model for every great cocktail.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'A cocktail can be decomposed: **base** (the dominant spirit, 1.5–2oz), **modifier** (liqueur, vermouth, or fortified wine that softens and adds complexity, 0.5–1oz), and **accent** (bitters, citrus, or aromatic garnish that brightens). In a martini, gin is the base, vermouth is the modifier, and bitters are the accent. In a margarita, tequila is the base, triple sec is the modifier, lime is the accent (plus salt rim). This model helps diagnose and fix unbalanced drinks.' },
      ]},
      { slug: 'original-creation', title: 'Original Cocktail Creation', description: 'From concept to recipe documentation.', sort_order: 3, lessons: [
        { id: 'theory-creation-1', slug: 'ideation-concept', title: 'Ideation & Concept', description: 'Where do new drinks come from?', duration: '10 min', difficulty: 'Intermediate', sort_order: 1, content: 'Original drinks arise from constraints: available ingredients, seasonal produce, guest preferences, or a theme. Start with one anchor (a spirit, a flavor, a memory). Ask: what does this drink feel like? Is it bright and summery? Deep and wintry? Fun and tropical? Elegant and restrained? The concept guides ingredient choices before you pour anything.' },
      ]},
    ],
  },
  {
    slug: 'techniques',
    title: 'Techniques',
    description: 'Core bartending skills: shaking, stirring, ice, garnish, and glassware.',
    icon: '🛠️',
    sort_order: 4,
    techniques: [
      { slug: 'core-techniques', title: 'Core Techniques', description: 'Shake, stir, build, strain, muddle, layer.', sort_order: 1, lessons: [
        { id: 'tech-core-1', slug: 'shaking', title: 'Shaking', description: 'Hard shake, dry shake, and reverse shake.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Shaking chills rapidly, adds dilution, and aerates (creating foam with egg white). The **hard shake** builds pressure for faster chilling. The **dry shake** (no ice) emulsifies egg white before adding ice. The **reverse shake** adds ice halfway to control dilution. Always strain: fine strain for egg white drinks to remove ice chips and pulp.' },
      ]},
      { slug: 'ice', title: 'Ice', description: 'Ice chemistry, types, and dilution control.', sort_order: 2, lessons: [
        { id: 'tech-ice-1', slug: 'ice-chemistry', title: 'Ice Chemistry', description: 'Why ice matters more than you think.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Ice cools drinks by melting — the phase change absorbs energy (latent heat of fusion). Clear, dense ice melts slower than cloudy ice because it has less trapped air. Cracking ice increases surface area, speeding chilling but also dilution. Sphere ice (one large sphere) exposes minimal surface area, ideal for spirit-forward drinks served neat or with one large rock. Directional dilution (ice poured down the side of the glass) chills gently; undiluted spirit-forward drinks are stirred, not shaken.' },
      ]},
      { slug: 'garnish', title: 'Garnish', description: 'Twists, expressed oils, herbs, and rims.', sort_order: 3, lessons: [
        { id: 'tech-garnish-1', slug: 'citrus-twists', title: 'Citrus Twists & Peels', description: 'Zest, oils, and presentation.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'A **twist** expresses citrus oils over the drink surface. Hold the peel colored-side down over the drink, give it a sharp squeeze to spray oils, then drop it in. A **wheel** is for rim garnish or floating. A **coin** is thin-cut, for color. Always cut citrus away from you with a sharp knife. Express oils before dropping — the aroma primes the guest before their first sip.' },
      ]},
      { slug: 'glassware-techniques', title: 'Glassware', description: 'Why glass shape matters.', sort_order: 4, lessons: [
        { id: 'tech-glass-1', slug: 'why-glass-shape-matters', title: 'Why Glass Shape Matters', description: 'Aroma concentration, temperature, and experience.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'A coupe concentrates aromas upward; a rocks glass releases them broadly. A narrow flute preserves bubbles in sparkling drinks. A wide-mouth glass allows aromatics to escape; a narrow one traps them. Glass thickness affects temperature retention. Always chill glasses before serving cold drinks; warm mugs before serving hot drinks. The wrong glass undermines the drink\'s best qualities.' },
      ]},
    ],
  },
  {
    slug: 'cocktail-chemistry',
    title: 'Cocktail Chemistry',
    description: 'The science of balance: acid, dilution, temperature, emulsion, and aroma.',
    icon: '⚗️',
    sort_order: 5,
    techniques: [
      { slug: 'clarification', title: 'Clarification', description: 'Milk wash, agar, gelatin, and centrifuge.', sort_order: 1, lessons: [
        { id: 'chem-clarify-1', slug: 'milk-wash', title: 'Milk Wash', description: 'Casein clarification for crystal-clear cocktails.', duration: '16 min', difficulty: 'Advanced', sort_order: 1, content: 'Milk washing (or clarification) uses casein proteins in milk to bind suspended particles in a cocktail, yielding a crystal-clear liquid with intensified flavor. Method: mix spirit, acid, and sugar with milk (1:1 ratio), refrigerate 12–24 hours, strain through coffee filter or centrifuge. The result is a smooth, silky texture with bright clarity. This is the technique behind the infamous "milk punch" and modern clarified cocktails at high-end bars.' },
      ]},
      { slug: 'infusions-extractions', title: 'Infusions & Extractions', description: 'Fat washing, cold and hot infusion, sous vide, oleo, tinctures.', sort_order: 2, lessons: [
        { id: 'chem-infuse-1', slug: 'fat-washing', title: 'Fat Washing', description: 'Butter, bacon, coconut, sesame — infusing spirit with fat-soluble flavor.', duration: '14 min', difficulty: 'Intermediate', sort_order: 1, content: 'Fat washing infuses a spirit with flavors from fat (butter, bacon, coconut oil, sesame oil) by shaking or blending, then freezing and straining. Alcohol is an excellent solvent for fat-soluble flavor compounds. Freezing solidifies the fat, which is then removed by filtration. Result: a spirit with rich, round mouthfeel and concentrated flavor — perfect for Old Fashioneds, Manhattans, or unique sours.' },
      ]},
      { slug: 'acids-sourness', title: 'Acids & Sourness', description: 'Citric, malic, tartaric, lactic acid and adjusting.', sort_order: 3, lessons: [
        { id: 'chem-acids-1', slug: 'acid-adjusting', title: 'Acid Adjusting', description: 'Precision souring beyond lemon and lime.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'Citric acid (from citrus) is the default acid in cocktails, but malic (apple, stone fruit), tartaric (grapes, tamarind), lactic (yogurt, fermented flavors), and phosphoric (cola) each contribute different sour profiles. Powdered food-grade acids let bartenders dial in sourness without adding juice sugar or water. This is essential for consistency, for low-ABV drinks, and for creating flavors that citrus alone cannot achieve.' },
      ]},
      { slug: 'carbonation', title: 'Carbonation', description: 'CO2, force carbonation, and batched fizz.', sort_order: 4, lessons: [
        { id: 'chem-carbonation-1', slug: 'how-carbonation-works', title: 'How Carbonation Works', description: 'Solubility, pressure, temperature, and nucleation.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'CO2 dissolves in liquid under pressure. Lower temperatures increase solubility — that is why soda is kept cold. When pressure is released (opening a bottle, pouring), CO2 comes out of solution as bubbles (nucleation). Over-carbonation or warm liquid causes excessive foam. Force carbonation uses an ISI whipper or CO2 tank to dissolve gas at high pressure, yielding a silkier, more controlled fizz than soda water.' },
      ]},
      { slug: 'texture-foam', title: 'Texture & Foam', description: 'Egg white, aquafaba, lecithin, xanthan, espuma.', sort_order: 5, lessons: [
        { id: 'chem-foam-1', slug: 'egg-white-chemistry', title: 'Egg White Chemistry', description: 'Proteins, air, and the perfect foam.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'Egg white foam is a colloidal system: proteins denature and unfold at the air-liquid interface, forming a film that traps air. The foam is light, dry, and voluminous — it adds texture without sweetness. The science: vigorous shaking (or dry shake) aligns proteins; acid (lemon juice) stabilizes; bitters floated on top preserve foam structure. Aquafaba (chickpea water) works as a vegan alternative via saponins, though the texture is slightly different.' },
      ]},
      { slug: 'fermentation-homemade', title: 'Fermentation & Homemade Ingredients', description: 'Syrups, shrubs, tepache, bitters.', sort_order: 6, lessons: [
        { id: 'chem-ferment-1', slug: 'syrups-shrubs', title: 'Syrups & Shrubs', description: 'House-made sweet and sour ingredients.', duration: '12 min', difficulty: 'Beginner', sort_order: 1, content: 'Simple syrup is 1:1 sugar:water (or 2:1 rich syrup for viscosity and shelf life). **Shrubs** add vinegar to fruit + sugar, creating a fermented or macerated drinking vinegar. Cold-process syrups (muddling herbs/fruit into sugar, then adding water) preserve volatile aromatics that heat destroys. Store syrups refrigerated: 1:1 lasts ~1 month, rich syrup ~2 months. Label with date — never use moldy or off-smelling syrup.' },
      ]},
      { slug: 'molecular-advanced', title: 'Molecular & Advanced', description: 'Spherification, gels, smoking, rotary evaporation.', sort_order: 7, lessons: [
        { id: 'chem-molecular-1', slug: 'spherification', title: 'Spherification', description: 'Basic and reverse spherification.', duration: '16 min', difficulty: 'Advanced', sort_order: 1, content: 'Spherification encapsulates liquid in a thin gel membrane. **Basic spherification** uses sodium alginate + calcium chloride bath — the liquid forms a sphere when dropped in. **Reverse spherification** uses calcium lactate/lactate in the liquid + alginate bath — better for dairy or high-calcium liquids. The result is a burst-in-your-mouth sphere — used for olive "caviars," fruit pearls, and cocktail garnishes.' },
      ]},
    ],
  },
  {
    slug: 'menus-bar-programs',
    title: 'Menus & Bar Programs',
    description: 'Designing, batching, pricing, and running profitable bar menus.',
    icon: '📋',
    sort_order: 6,
    techniques: [
      { slug: 'menu-design', title: 'Menu Design', description: 'Structure, descriptions, pricing, and seasonality.', sort_order: 1, lessons: [
        { id: 'menus-1', slug: 'menu-structure', title: 'Menu Structure & Flow', description: 'How to organize a cocktail menu for readability and sales.', duration: '10 min', difficulty: 'Intermediate', sort_order: 1, content: 'A good menu guides the guest from familiar to adventurous. Start with classics, then house signatures, then experimental. Group by style (spirit-forward, shaken, long) or by flavor. Include 8–15 drinks max — too many causes decision fatigue. Price strategically: place a high-priced anchor to make mid-range drinks feel reasonable.' },
      ]},
      { slug: 'batching-scaling', title: 'Batching & Scaling', description: 'Pre-dilution, shelf life, large format.', sort_order: 2, lessons: [
        { id: 'menus-2', slug: 'batching-service', title: 'Batching for Service', description: 'Consistency, speed, and quality control.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'Batching mixes cocktail ingredients in bulk before service — essential for high-volume bars. Pre-dilute to mimic shake/stir dilution (typically 20–25%). Store in airtight containers, refrigerated. Acid-forward batches last 1–2 days; spirit-forward last longer. Label every batch with contents, date, and dilution ratio. Taste before service — dilution continues slowly even in the bottle.' },
      ]},
      { slug: 'bar-economics', title: 'Bar Economics', description: 'Pour cost, inventory, waste, and P&L.', sort_order: 3, lessons: [
        { id: 'menus-3', slug: 'pour-cost', title: 'Pour Cost & Beverage Cost %', description: 'The math behind profitable drinks.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'Pour cost is the cost of ingredients divided by the sale price. Industry target: 18–24% for cocktails, 20–25% for wine, 16–20% for beer. Calculate by measuring actual pour yield (not recipe ounces) — evaporation, spillage, and over-pouring add up. Inventory weekly. Waste reduction (stale garnishes, over-made batches) is the easiest way to improve margin.' },
      ]},
    ],
  },
  {
    slug: 'service-hospitality',
    title: 'Service & Hospitality',
    description: 'Guest experience, speed, efficiency, and the no/low movement.',
    icon: '🤝',
    sort_order: 7,
    techniques: [
      { slug: 'guest-experience', title: 'Guest Experience', description: 'Reading guests, recommendations, and responsible service.', sort_order: 1, lessons: [
        { id: 'service-1', slug: 'reading-guest', title: 'Reading the Guest', description: 'Body language, mood, and order signals.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'A guest\'s order tells a story. A Negroni at 11pm suggests they know spirits; a Margarita suggests they want something familiar and fun. Watch posture, eye contact, and tone. A solo guest at the bar may want conversation (or not — read cues). A group celebrating wants showmanship. Never assume — ask open questions: "Do you prefer sweet, sour, or spirit-forward?"' },
      ]},
      { slug: 'speed-efficiency', title: 'Speed & Efficiency', description: 'Mise en place, workflow, and high-volume service.', sort_order: 2, lessons: [
        { id: 'service-2', slug: 'station-setup', title: 'Station Setup', description: 'Pre-shift mise en place for speed and accuracy.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Before doors open, set your station: ice bin full, garnishes cut and in labeled containers, house pours in rail, tools clean and in order, trash bin accessible. A clean station is a fast station. During service, clean as you go — wipe spills, return tools, restock between rushes. Anticipate the next order while making the current one.' },
      ]},
      { slug: 'non-alcoholic-low-abv', title: 'Non-Alcoholic & Low-ABV', description: 'No/low movement, complexity without alcohol.', sort_order: 3, lessons: [
        { id: 'service-3', slug: 'building-na-cocktails', title: 'Building N/A Cocktails', description: 'Complexity, texture, and aroma without alcohol.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'Non-alcoholic drinks must earn their place on the menu — they need acid, texture, aroma, and visual appeal. Seedlip and Lyre\'s provide base spirits, but house-made syrups, shrubs, shrubs, and high-quality mixers matter more. Consider **body** (cream, egg white, aquafaba foam), **bitter** (non-alcoholic bitters, tonic, coffee), and **umami** (tomato, mushroom, seaweed) to replace alcohol\'s mouthfeel.' },
      ]},
    ],
  },
  {
    slug: 'wine-beverage-program',
    title: 'Wine & Beverage Program',
    description: 'Wine service, coffee & tea bars, and fresh ingredient work.',
    icon: '🍷',
    sort_order: 8,
    techniques: [
      { slug: 'wine-service', title: 'Wine Service', description: 'Opening, decanting, temperature, and pairing.', sort_order: 1, lessons: [
        { id: 'wine-1', slug: 'opening-decanting', title: 'Opening & Decanting', description: 'Wine service fundamentals for bartenders.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Opening wine: cut capsule below the ring, insert waiter\'s friend at the opposite side from the label, pull with leverage. Decant old reds to separate sediment; decant young bold reds to aerate. White and rosé: serve chilled (8–12°C). Sparkling: 6–8°C, upright. Always present the bottle to the guest before opening. Know your glassware: Burgundy (wide bowl) vs. Bordeaux (taller bowl) vs. flute.' },
      ]},
      { slug: 'coffee-tea-bar', title: 'Coffee & Tea Bar', description: 'Espresso, tea infusions, and matcha.', sort_order: 2, lessons: [
        { id: 'wine-2', slug: 'espresso-martini-family', title: 'Espresso Martini Family', description: 'Coffee cocktails and variations.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'The Espresso Martini (vodka, coffee liqueur, espresso, sugar) popularized coffee cocktails. Variations: add hazelnut liqueur, swap vodka for rum, use cold brew concentrate. Fresh espresso is essential — instant or old coffee kills the drink. The foam head (from shaking) is the signature. Many bars now have an espresso machine behind the bar; if not, use high-quality cold brew concentrate.' },
      ]},
      { slug: 'juice-fresh-ingredients', title: 'Juice & Fresh Ingredients', description: 'Juicing, sourcing, and storage.', sort_order: 3, lessons: [
        { id: 'wine-3', slug: 'juicing-methods', title: 'Juicing Methods & Yield', description: 'Citrus, cold-press, and shelf life.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Fresh-squeezed citrus juice is non-negotiable for quality cocktails. A standard lemon yields ~1oz; a lime ~0.75oz. Juice to order when possible, or batch fresh juice daily with a rotational schedule (lemon Monday, lime Tuesday, grapefruit Wednesday). Cold-press juicers extract more yield but oxidize faster. Store juice in airtight containers in the coldest part of the fridge, labeled with date. Citrus juice lasts 1–2 days; other juices (apple, carrot) spoil faster.' },
      ]},
    ],
  },
  {
    slug: 'career-industry',
    title: 'Career & Industry',
    description: 'Building a bartending career: jobs, ownership, and industry trends.',
    icon: '🚀',
    sort_order: 9,
    techniques: [
      { slug: 'working-bars', title: 'Working in Bars', description: 'Bar types, roles, CV, and competitions.', sort_order: 1, lessons: [
        { id: 'career-1', slug: 'bar-types', title: 'Types of Bars', description: 'Hotel, cocktail bar, nightclub, restaurant, and more.', duration: '10 min', difficulty: 'Beginner', sort_order: 1, content: 'Bars vary enormously by format. **Hotel bar**: high volume, standardized, wine-forward, late hours. **Cocktail bar**: craft-focused, lower volume, higher margins, menu-driven. **Nightclub**: high volume, pre-made batches, bottle service. **Restaurant bar**: food-first, wine-driven, seasonal cocktails. **Tiki bar**: theme-heavy, rum-forward, elaborate presentation. **Pop-up / mobile**: temporary, event-driven, creative freedom. Each type demands different skills — choose environments that match your strengths and interests.' },
      ]},
      { slug: 'bar-ownership', title: 'Bar Ownership', description: 'Concept, licensing, build-out, staffing, P&L.', sort_order: 2, lessons: [
        { id: 'career-2', slug: 'concept-development', title: 'Concept Development', description: 'From idea to viable bar concept.', duration: '14 min', difficulty: 'Advanced', sort_order: 1, content: 'A bar concept is a promise to the guest. It answers: who are we, what do we serve, and why does it matter? Strong concepts are specific (not "a cocktail bar" but "a 1950s sailor-themed bar with tropical drinks and dive-bar prices"). Define your target guest, price point, location, and aesthetic before signing a lease. The concept drives menu, staffing, music, lighting, glassware, and marketing. Vague concepts fail because they appeal to everyone and excite no one.' },
      ]},
      { slug: 'industry-trends', title: 'Industry & Trends', description: 'Sustainability, zero-waste, global trends, and careers.', sort_order: 3, lessons: [
        { id: 'career-3', slug: 'sustainability-zero-waste', title: 'Sustainability in Bars', description: 'Zero-waste bartending and circular bar design.', duration: '12 min', difficulty: 'Intermediate', sort_order: 1, content: 'Zero-waste bartending means designing menus and operations so that every ingredient is used fully: citrus peels for syrups and garnishes, leftover herbs for infusions, spent coffee grounds for bitters or chili salt, stale bread for fat-washed spirit. Circular bar design tracks waste streams and builds them back into the menu. It is not just environmental — it is economic: waste is lost profit. Guests increasingly reward sustainable bars with loyalty and social media amplification.' },
      ]},
    ],
  },
];

async function seed() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  for (const cat of CATEGORIES) {
    const catRes = await client.query(
      `INSERT INTO categories (slug, title, description, icon, sort_order)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title,
         description=EXCLUDED.description,
         icon=EXCLUDED.icon
       RETURNING id`,
      [cat.slug, cat.title, cat.description, cat.icon, cat.sort_order]
    );
    const catId = catRes.rows[0].id;

    for (const tech of cat.techniques) {
      const techRes = await client.query(
        `INSERT INTO techniques (category_id, slug, title, description, sort_order)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (category_id, slug) DO UPDATE SET
           title=EXCLUDED.title,
           description=EXCLUDED.description
         RETURNING id`,
        [catId, tech.slug, tech.title, tech.description, tech.sort_order]
      );
      const techId = techRes.rows[0].id;

      for (const lesson of tech.lessons) {
        await client.query(
          `INSERT INTO lessons (technique_id, slug, title, description, duration, difficulty, content, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (technique_id, slug) DO UPDATE SET
             title=EXCLUDED.title,
             description=EXCLUDED.description,
             duration=EXCLUDED.duration,
             difficulty=EXCLUDED.difficulty,
             content=EXCLUDED.content`,
          [techId, lesson.slug, lesson.title, lesson.description, lesson.duration, lesson.difficulty, lesson.content, lesson.sort_order]
        );
      }
    }
  }

  await client.end();
  console.log(`✓ Seeded ${CATEGORIES.length} categories, ${CATEGORIES.reduce((a,c) => a + c.techniques.length, 0)} techniques, ${CATEGORIES.reduce((a,c) => a + c.techniques.reduce((b,t) => b + t.lessons.length, 0), 0)} lessons.`);
}

seed().catch(err => { console.error(err); process.exit(1); });
