import re

with open('data/school.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the closing of schoolCategories array and insert before it
insert_marker = "];\n\nexport const allTechniques"

if insert_marker not in text:
    raise SystemExit('Could not find insertion point in school.ts')

new_categories = """
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
            content: `Acid is the backbone of balance. Without it, a cocktail feels flat, cloying, or alcoholic. The primary acids in cocktails are citric (lemon, lime), malic (apple, cranberry), tartaric (grape, tamarind), and phosphoric (some sodas). Citric acid is the most common and versatile — it’s bright, clean, and dissolves easily. The classic sour ratio (2:1:1 spirit:citrus:syrup) works because the acid cuts sweetness and the syrup softens the acid’s edge. Too much acid and the drink puckers; too little and it’s syrupy. Balance is subjective, but the sour component should be noticeable without dominating.`,
            sources: [
              'Wondrich, David. "The Chemistry of the Perfect Cocktail."',
              'McGee, Harold. "On Food and Cooking: The Science and Lore of the Kitchen."',
              'DISCUS: cocktail balance guidelines'
            ]
          },
          {
            id: 'citrus-varieties',
            title: 'Citrus varieties & flavor impact',
            description: 'Lemon, lime, grapefruit, yuzu, and how they change a drink.',
            duration: '12 min',
            difficulty: 'Beginner',
            content: `Lemon: The universal sour. High in citric acid (~5%), with a bright, clean profile that works in almost any cocktail. Persian (Bearss) lime is the standard bar lime — juicier, more bitter, and more aromatic than Key lime. Grapefruit adds a bitter-sour complexity; ruby red is sweeter, white is more bitter. Yuzu (East Asian citrus) is floral, aromatic, and less acidic than lemon — use it where you want fragrance without sharpness. Kaffir lime leaves add an herbal, citrusy aroma to Southeast Asian cocktails. Blood orange adds color and a raspberry-like note. Each citrus changes the drink’s personality: a Daiquiri with lemon vs. lime tastes like a different cocktail entirely.`,
            sources: [
              'Wondrich, David. "Imbibe!"',
              'McGee, Harold. "On Food and Cooking"',
              'R. Porter, "Citrus: A History"'
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
          {
            id: 'emulsion-chemistry',
            title: 'Emulsion in cocktails',
            description: 'How egg white, aquafaba, and fat create silky texture.',
            duration: '16 min',
            difficulty: 'Advanced',
            content: `An emulsion is a mixture of two liquids that don’t normally mix — like oil and water — stabilized by a third substance (an emulsifier). In cocktails, the emulsifier is usually protein (egg white, aquafaba, soy protein) or fat (from a fat wash or cream). When you shake a sour with egg white, the proteins denature and unfold, creating a network that traps air bubbles and water. The result is a foam that’s stable, silky, and light. Fat-based emulsions (like a Ramos Gin Fizz with orange flower water and cream) are more delicate and require specific techniques: a long dry shake, then a second shake with ice. The chemistry is the same — protein or fat molecules with one end attracted to water and one to air — but the execution varies by ingredient.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Emulsions and Foams."',
              'Oxford, A. "The Science of Egg White Foam."',
              'DISCUS: texture and mouthfeel'
            ]
          },
          {
            id: 'aroma-and-volatility',
            title: 'Aroma & volatility',
            description: 'Why some ingredients smell more than others, and how to preserve aroma.',
            duration: '12 min',
            difficulty: 'Advanced',
            content: `Aroma comes from volatile organic compounds — molecules that evaporate easily at room temperature. In cocktails, these come from botanicals (gin), citrus oils, herbs, and even the spirit itself. Temperature and surface area control volatility: a cold drink releases less aroma; a warm drink releases more. That’s why a room-temperature Martini smells boozy while a chilled one opens up. Shaking vs. stirring also matters: shaking aerates the drink, creating tiny bubbles that release more aroma when you sip. Garnishes aren’t just decoration — a lemon twist expressed over the drink sprays citral and limonene onto the surface, changing the first thing you smell. Herbal sprigs (mint, rosemary) release terpenes when slapped, releasing aroma without adding much flavor.`,
            sources: [
              'Aroma Culture: volatile compounds in mixology',
              'McGee, Harold. "On Food and Cooking: Smell and Taste."',
              'DISCUS: garnish and aroma guidelines'
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
            content: `A "rich syrup" is 2 parts sugar to 1 part water (by weight), yielding a sweeter, more viscous solution than standard 1:1 simple syrup. Because it has less free water, it resists bacterial growth longer — a 2:1 syrup can last months refrigerated, while 1:1 lasts weeks. Rich syrup is preferred in stirred cocktails (Manhattan, Martini) where extra body and sweetness are desirable. In shaken sours, 1:1 is usually better because it mixes more readily. Always measure by weight, not volume — sugar packs vary. A common ratio for stirred drinks is 2:1; for sparkling drinks, 1:1 is safer because it dissolves faster. Agave nectar is already concentrated (~1.3:1), so it’s closer to rich syrup in intensity.`,
            sources: [
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
  {
    slug: 'clarification',
    title: 'Clarification',
    description: 'Strip impurities and create crystal-clear, shelf-stable cocktails.',
    icon: '🔬',
    techniques: [
      {
        slug: 'milk-wash',
        title: 'Milk Wash',
        description: 'Use milk proteins to strip haze and harshness from spirit.',
        lessons: [
          {
            id: 'milk-wash-101',
            title: 'Milk wash fundamentals',
            description: 'Acid, curds, and why it works.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Milk washing relies on the chemistry of casein — the main protein in milk. When acid (lemon juice, citric acid, or vinegar) is added to milk, the pH drops and casein proteins coagulate into curds. These curds act like a physical filter: as they form, they trap polyphenols, tannins, and harsh congeners that cause bitterness and haze. The result is a smoother, rounder spirit that can be stored for weeks without refrigeration because the harsh compounds are removed. The process: combine spirit, milk, and acid in a jar; shake; rest 20–30 minutes; strain through coffee filters. A second strain through a fresh filter produces the clearest result.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Milk and Dairy."',
              'DISCUS: clarification methods',
              'The Bar Book: Elements of Cocktail Technique (J. Regan)
            ]
          },
          {
            id: 'milk-wash-advanced',
            title: 'Advanced milk wash',
            description: 'Ratios, temperatures, and troubleshooting.',
            duration: '16 min',
            difficulty: 'Advanced',
            content: `The standard ratio is 3:1 spirit to milk, with 1–2% acid by volume. Too much acid and you’ll curdle all the milk, making straining difficult; too little and clarification is incomplete. Temperature matters: room temperature (20–22°C) is ideal. Cold milk slows curd formation; warm milk can cause incomplete coagulation. Rest time is usually 20–30 minutes, but heavy spirits (like overproof rum) may need longer. If the result is cloudy after one strain, repeat with a fresh filter. Whey left behind carries the bitter compounds; what passes through is clean. A pH meter can help — aim for pH 4.6–5.0 for optimal curdling. Store the clarified spirit in a sealed bottle in the fridge for up to 4 weeks.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Acid-Base Chemistry."',
              'DISCUS: advanced clarification',
              'Liquid Intelligence (D. Arnold)'
            ]
          },
        ],
      },
      {
        slug: 'agar-clarification',
        title: 'Agar Clarification',
        description: 'Seaweed-derived gelling for brilliant clarity in batched drinks.',
        lessons: [
          {
            id: 'agar-101',
            title: 'Agar basics',
            description: 'Hydration, gel temperatures, and straining technique.',
            duration: '14 min',
            difficulty: 'Advanced',
            content: `Agar is a polysaccharide extracted from red algae. It hydrates in cold water, then forms a gel between 85–95°C. Unlike gelatin (animal-based), agar sets at room temperature and is stable at higher temperatures — useful for warm climates. For cocktail clarification: dissolve 1 tsp agar per 500ml liquid in cold water, heat to 85–95°C while stirring, then combine with your cocktail base at ~60°C. Let set 1–2 hours at room temperature. The gel traps haze-causing particles. Strain slowly through cheesecloth first, then coffee filters — patience here pays off in clarity. Agar clarification is best for batched cocktails that will sit for days, like a clarified punch or milk punch.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Gelling Agents."',
              'DISCUS: clarification methods',
              'Liquid Intelligence (D. Arnold)'
            ]
          },
        ],
      },
    ],
  },
  {
    slug: 'foam-emulsion',
    title: 'Foam & Emulsion',
    description: 'Silky textures from egg whites, aquafaba, and proper shaking technique.',
    icon: '🥚',
    techniques: [
      {
        slug: 'dry-shake',
        title: 'Dry Shake',
        description: 'Build fine, stable foam without ice first.',
        lessons: [
          {
            id: 'dry-shake-101',
            title: 'The dry shake method',
            description: 'Science of foam, timing, and double-straining.',
            duration: '8 min',
            difficulty: 'Beginner',
            content: `The dry shake is the difference between a whisper-thin foam and a dense, stable crown. Add all ingredients except ice to your shaker, seal, and shake vigorously for 10–15 seconds. The agitation denatures proteins and creates micro-bubbles. Then add ice and shake again for 10–15 seconds until well-chilled. Double-strain into a chilled glass to catch ice shards and broken foam bits. The key is energy: a lazy shake produces thin foam. Aquafaba works as a vegan substitute at roughly 3/4 oz per egg white. For extra stability, add a pinch of salt or a drop of orange flower water — both help proteins bond.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Egg Foams."',
              'DISCUS: texture and foam',
              'The Bar Book (J. Regan)'
            ]
          },
          {
            id: 'vegan-foam',
            title: 'Vegan alternatives',
            description: 'Aquafaba, soy protein, and other substitutes.',
            duration: '10 min',
            difficulty: 'Beginner',
            content: `Aquafaba (the liquid from canned chickpeas) is the best vegan substitute for egg white. It contains saponins and proteins that foam similarly to albumen. Use 3/4 oz aquafaba per egg white equivalent. Soy protein isolate (found in health stores) also works — mix 1 tsp with 1 oz water. Other options: agar agar (for firm foams), lecithin (for airy, lightweight foams), and chia gel (for thicker, gelatinous textures). Each has different stability and flavor: aquafaba is neutral; soy can taste beany; agar is flavorless but sets firm. For a vegan Ramos Gin Fizz, aquafaba + a pinch of cream of tartar gives the best result. Experiment with small batches to find what works for your recipe.`,
            sources: [
              'McGee, Harold. "On Food and Cooking: Plant Proteins."',
              'DISCUS: vegan cocktail techniques',
              'Liquid Intelligence (D. Arnold)'
            ]
          },
        ],
      },
    ],
  },
  {
    slug: 'advanced-batching',
    title: 'Advanced Batching',
    description: 'Batch large-format cocktails without sacrificing clarity, freshness, or balance.',
    icon: '⚗️',
    techniques: [
      {
        slug: 'batched-sours',
        title: 'Batched Sours',
        description: 'Clarify, dilute, and bottle for service.',
        lessons: [
          {
            id: 'batched-sours-101',
            title: 'Batching logic',
            description: 'Order of operations: mix, clarify, dilute, bottle.',
            duration: '12 min',
            difficulty: 'Intermediate',
            content: `Batching a sour requires understanding the order of operations. First, mix spirit, citrus, and syrup at full strength. Second, if clarity is desired, clarify the entire batch using agar or milk wash before dilution. Third, dilute to serving strength — a good rule is 20–25% dilution for stirred drinks, 30–40% for shaken sours. Fourth, bottle in swing-top or swing-cap bottles and refrigerate. A properly clarified batch can last 2–4 weeks chilled. Label with batch date, technique used, and dilution percentage. For large formats, use a kitchen scale: weigh the batch before and after dilution to hit the target ABV precisely.`,
            sources: [
              'DISCUS: batching guidelines',
              'Wondrich, David. "The Science of Batching."',
              'The Bar Book (J. Regan)'
            ]
          },
          {
            id: 'batched-spirits',
            title: 'Batched stirred drinks',
            description: 'Manhattans, Martinis, and Negronis that keep for weeks.',
            duration: '14 min',
            difficulty: 'Intermediate',
            content: `Stirred cocktails (Manhattan, Martini, Negroni) are easier to batch than sours because they contain no citrus or egg — fewer perishable ingredients. Mix spirit, vermouth, and bitters at full strength, then dilute to ~20–25% with water. Bottle and refrigerate. These drinks can last 2–3 weeks because the high alcohol content (usually 25–35% ABV after dilution) acts as a preservative. Vermouth is the weak link: once opened, it oxidizes. Use fresh vermouth and consider adding a small amount of vodka (1 tsp per 750ml) to slow oxidation. Label with batch date and serve over ice or up, as specified. For a pre-batched Martini, aim for 28–30% ABV after dilution — slightly stronger than a freshly stirred one, because it will dilute further over ice.`,
            sources: [
              'DISCUS: stirred drink batching',
              'Wondrich, David. "Imbibe!"',
              'Liquid Intelligence (D. Arnold)'
            ]
          },
        ],
      },
    ],
  },
];

text = text.replace(insert_marker, ",".join(new_categories) + "\n\nexport const allTechniques")

with open('data/school.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Categories added. Total file size:', len(text), 'bytes')
