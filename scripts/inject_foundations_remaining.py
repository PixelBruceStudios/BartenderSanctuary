#!/usr/bin/env python3
"""
Inject remaining 6 short Foundations lessons with expanded content directly into DB.
"""
import os
import psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE) as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

cur.execute("""
    SELECT c.slug, t.slug, t.id 
    FROM techniques t 
    JOIN categories c ON t.category_id = c.id 
    WHERE c.slug = 'foundations'
""")
tech_map = {(row[0], row[1]): row[2] for row in cur.fetchall()}

lessons = [
    ('foundations', 'bar-setup-terminology', 'essential-glassware',
     'Essential Glassware Guide',
     'Coupe, rocks, highball, collins, and more.', '12 min', 'Beginner',
     """Glassware is functional, not decorative. The right glass preserves temperature, showcases aroma, and controls dilution. Using the wrong glass is like serving wine in a coffee mug — the drink suffers, and the guest notices even if they cannot articulate why.

The coupe (150–200mL) is for shaken, strained cocktails: martinis, daiquiris, sours, and anything served "up" without ice. Its wide bowl concentrates aroma upward toward the nose while its stem keeps hand warmth away from the liquid. The coupe fell out of favour in the 1980s when the Martini glass grew absurdly large, but modern bars have returned to the smaller, elegant coupe.

Rocks glasses (200–300mL), also called Old Fashioned glasses or lowballs, are for built or stirred drinks served over ice. Their wide mouth allows ice and garnish to sit comfortably, and their weight feels substantial in the hand. A double rocks glass (300mL+) is useful for drinks with lots of ice or multiple ingredients, like a Mai Tai or a Long Island Iced Tea.

Highball (250–350mL) and collins (350–400mL) suit long drinks with soda or juice: gin and tonic, Cuba Libre, Tom Collins. The tall shape preserves carbonation by minimizing surface area and makes the drink refreshing to look at. A Collins glass is slightly narrower than a highball, which concentrates aroma for drinks like the Tom Collins where gin botanicals matter.

Nick & Nora glasses are a smaller, elegant alternative to the coupe, popular in modern bars. They hold about 120–150mL and have a slight taper that concentrates aroma even more than a coupe. They are the preferred vessel for many modern stirred cocktails.

Flutes serve sparkling cocktails: French 75, Bellini, Champagne cocktail. Their narrow bowl preserves bubbles and directs aroma to the nose. Avoid storing flutes upside-down; the rim can chip and create rough spots that damage carbonation.

Irish coffee glass is for hot drinks: Irish coffee, hot buttered rum, Moscow mule (traditionally served in a copper mug). The handle protects hands from heat. Never serve hot cocktails in glassware without a handle — the temperature transfer is uncomfortable and dangerous.

Chilling glasses in the fridge or freezer improves temperature retention dramatically. A warm glass is a service failure: it raises the cocktail's temperature by several degrees within seconds, accelerating dilution and flattening flavour. Keep a dedicated glass fridge behind the bar if possible; at minimum, store coupes and Nick & Nora glasses in the freezer during service."""),

    ('foundations', 'bar-setup-terminology', 'essential-tools',
     'Essential Tools Guide',
     'Shakers, strainers, muddlers, and barspoons.', '14 min', 'Beginner',
     """Every bartender needs a core toolkit, and understanding what each tool does — and does not do — is essential to consistent performance. Cheap tools break at the worst moment; professional tools last years and feel like extensions of your hand.

The Boston shaker (2-piece: glass + tin) is the workhorse of the professional bar. The glass fits inside the tin, creating a seal when tapped firmly. It is durable, easy to open when cold (tap the rim, not the side), and allows you to see the drink as you shake. The two-piece design means you can replace either half if it breaks. Many bartenders prefer a tin-on-tin Boston shaker for extra durability; glass can chip.

The Cobbler shaker (3-piece) is compact and popular in home bars, but it has a fatal flaw: it becomes almost impossible to open when cold. The metal contracts, creating a vacuum seal that requires a firm tap on the side — easy to dent the shaker or hurt your hand. Avoid it in professional settings.

Strainers come in two main types. The Hawthorne strainer fits over a mixing glass or inside a shaker tin; its springy disc catches ice and solids while letting liquid pass. The Julep strainer is for stirred drinks in a mixing glass; it sits inside the glass and requires a slight tilt to pour. Both are essential: Hawthorne for shaken drinks, Julep for stirred. A fine-mesh strainer (tea strainer) is the third tool in your strainer arsenal — it catches tiny ice chips and fruit pulp for perfectly smooth drinks.

The barspoon (long, twisted shaft, typically 30cm) is for stirring. The twist is not decorative — it helps the spoon grip the inside of a mixing glass and makes stirring smoother and faster. Stirring creates less dilution than shaking, which is why spirit-forward drinks (Manhattan, Martini, Negroni) are stirred while sour drinks (Daiquiri, Whiskey Sour) are shaken. A good barspoon has a heavy, weighted end for balance.

The muddler crushes herbs and fruit to release oils and juices. Wood or plastic is preferred because metal can crack glass and add metallic flavours. The flat-ended muddler is more versatile than the rounded end — it presses more evenly. Muddle gently for herbs (mint, basil) to avoid releasing bitter tannins from stems and leaves; press firmly for fruit (lime, strawberry) to break cell walls.

A jigger (double-ended, 1oz/2oz or ¾oz/1½oz) ensures consistent pours. The smaller end is for liqueurs and modifiers; the larger end is for spirits. Some bartenders use a Japanese-style jigger with multiple measurement marks for extra precision. Free-pouring without a jigger is acceptable only after you have built muscle memory with one — and even then, keep a jigger behind the bar for verification."""),

    ('foundations', 'bar-setup-terminology', 'industry-slang',
     'Industry Slang & Vocabulary',
     'The language bars actually use.', '12 min', 'Beginner',
     """Slang is practical shorthand that lets bartenders communicate quickly during service. Knowing the language is part of professional competence — it signals to colleagues and guests that you belong behind the bar.

Well drink vs. call drink: A well drink uses the house liquor — the brand kept on the speed rail. A call drink specifies a brand: "Jack and Coke" instead of "whiskey and Coke." Wells are cheaper for the guest; calls cost more. Knowing your well is the first step to upselling: "We have Maker's Mark as our well bourbon, but if you'd like something richer, we can pour Woodford Reserve for two dollars more."

Top-shelf means premium, literally the bottles displayed on the top shelf behind the bar. Rails are the speed-rail bottles at waist level. The distinction matters for inventory management and pricing.

Serving style: On the rocks means over ice. Neat means straight up, no ice, no mixer — just the spirit. Straight up means chilled (shaken or stirred with ice, then strained) and served in a stemmed glass with no ice. The distinction between neat and straight up is one of the most common sources of confusion for guests, and clarifying it politely is a mark of professionalism.

Dirty means with olive brine (martini). Dry means less vermouth. Up means chilled and strained. A "dry martini" means less vermouth; a "dirty martini" means with brine. A "martini up" means served in a coupe with no ice, regardless of how much vermouth is used.

Other essentials: Muddle means crush in the glass. Build means assemble in the serving glass (no shaker). Call means guest requests a specific brand. Neat pour means a single large ice cube or sphere, designed to chill without over-diluting. Speed pour refers to free-pouring from a bottle with a pour spout. A "speed round" is when a bartender pours multiple drinks simultaneously — a skill that separates veterans from beginners.

Housemade items: House-made tonic, house-made vermouth, house-made bitters — these signal a bar that takes its drinks seriously. "House" in this context means made in-house, not the well brand."""),

    ('foundations', 'bar-setup-terminology', 'hygiene-food-safety',
     'Bar Hygiene & Food Safety',
     'Cross-contamination, glass washing, and storage.', '14 min', 'Beginner',
     """Bars are food-service environments, and most local health departments inspect them with the same rigour as restaurants. A bartender who ignores hygiene risks not only their guests but their livelihood.

Glass washing follows a strict three-step process: wash with detergent, rinse with clean water, sanitize with a chemical sanitizer or hot water (82°C/180°F minimum), then air-dry on a rack. Towel drying is prohibited because towels spread bacteria and leave lint on the rim. A wet glass signals poor washing; a glass with water spots signals poor rinsing. Both are unacceptable in a professional bar.

Ice handling: use scoops, never hands. Hands carry bacteria, and ice is food. Store ice in a dedicated ice bin with a lid, and use a different scoop for each bin if you have multiple ice types (cocktail ice, water ice, beer ice). Never store ice in the sink or on a dirty surface. Ice machines need regular cleaning — at minimum monthly — to prevent biofilms.

Garnish storage is a quality issue. Cut citrus lasts 1–2 days in the fridge in a sealed container; after that, it dries out and loses oil. Fresh herbs last 2–3 days in water, like cut flowers. Berries and stone fruit garnish should be washed, dried, and used within a day. Storing garnishes at room temperature accelerates spoilage and reduces aroma. A bartender who reaches for a lime wheel that is brown and shrivelled is serving a drink that looks and tastes worse than it should.

Cross-contamination: separate tools for raw ingredients if you also serve food. Never use the same straw, stirrer, or glass for multiple guests. If a guest returns a drink, discard it and serve in a new glass — do not "top up" from the bottle. Allergens are a legal liability: nut-based liqueurs (amaretto, Frangelico), egg whites, dairy (Baileys, cream liqueurs), and sulfites (in some wines and ciders) must be disclosed when asked. Have a list of common allergens for every cocktail on your menu.

Temperature control: cold storage below 5°C (41°F) for juices, garnishes, and perishable ingredients. Hot holding above 60°C (140°F) for any warm drinks. Keep your fridge organized with FIFO (first in, first out) labelling. Know your local health code — it is your responsibility, not just the manager's."""),

    ('foundations', 'palate-training', 'tasting-methodology',
     'Tasting Methodology',
     'Structured tasting for bartenders.', '14 min', 'Intermediate',
     """Professional tasting follows a disciplined four-stage sequence that turns a casual sip into structured analysis. Mastering this sequence lets you evaluate spirits, ingredients, and finished cocktails with consistency and precision.

Look first. Hold the glass up to a light source and note color, clarity, and viscosity. Color tells you about aging (dark = longer or newer barrel), proof (higher proof often means more intense color extraction), and additives (caramel coloring in rum and whisky). Clarity indicates filtration and chill-filtering. Viscosity — how slowly the liquid runs down the glass — indicates sugar content, oil content, and body. A spirit that "legs" heavily (forms slow-running droplets on the glass) has more body and often more sugar or congeners.

Smell second, but in two passes. First pass: hold the glass 5–10cm from your nose and inhale gently without swirling. Note the first, most volatile aromas — the "top notes." Second pass: swirl the glass gently to release heavier compounds, then inhale again. Note the mid-palate and base aromas. Third pass (optional): let the glass sit for 30 seconds, then smell again to detect fading top notes and emerging base notes. Spirits evolve as they open up, and so do cocktails.

Taste third. Take a small sip — 5–10mL is enough — and coat the entire palate. Note three phases: attack (first impression, usually acid and alcohol), mid-palate (the core flavours: fruit, spice, oak, botanicals), and finish (what lingers after swallowing or spitting). A long finish means complex, concentrated flavours; a short finish means lighter, simpler flavours. Use a spittoon for serious tastings — you do not need to swallow to evaluate, and tasting 20 spirits neat will impair your judgment quickly.

Think fourth. Balance, complexity, and length. Is the spirit harmonious, or does one element dominate? Is it complex (many layers) or simple (one or two dominant notes)? Is the finish pleasant or harsh? Compare to a reference: if you are tasting bourbon, compare it to the bourbon you tasted last week. If you are tasting a cocktail, compare it to the recipe standard.

Taste in a quiet room with minimal background smells. Coffee, cigarette smoke, strong food aromas, and even strong perfumes will distort your perception. Serious tasting rooms are designed for this: neutral walls, clean glassware, no competing odours."""),

    ('foundations', 'palate-training', 'alcohol-flavour-perception',
     'How Alcohol Affects Flavour Perception',
     'ABV, burn, and sensory adaptation.', '14 min', 'Beginner',
     """Alcohol is a solvent, a stimulant, and an irritant — all at once. Understanding how it interacts with your senses explains why the same drink tastes different at different proofs, temperatures, and dilutions, and why "burn" is not the same as "flavour."

At low ABV (under 15%), alcohol adds body, warmth, and a mild sweetness without dominating the palate. This is the zone of most aperitifs and low-ABV cocktails — the Americano, the Spritz, the Sherry Cobbler. Alcohol carries aroma compounds to the nose and carries taste compounds across the tongue, enhancing perception rather than overwhelming it.

Above 15–20% ABV, alcohol begins to dominate. The trigeminal nerve — the same nerve that detects spiciness, carbonation, and menthol — registers alcohol as a mild irritant. What we call "burn" is actually a pain signal, albeit a mild one. This is why a shot of 40% ABV spirit feels hot while a 15% ABV wine feels warm. Sensitivity varies: experienced drinkers often report less burn because they have desensitized their trigeminal receptors through repeated exposure, but the physical irritation is still present.

Dilution is the bartender's most powerful tool for managing alcohol perception. Shaking or stirring with ice lowers ABV by 10–25% depending on technique and duration. This does more than reduce burn — it opens up flavours by breaking surface tension and releasing volatile aromatics. A spirit-forward drink stirred over ice for 20 seconds will taste different from the same drink poured neat: the ethanol "blur" clears, and individual flavours become distinguishable.

Temperature also matters. A cold drink suppresses aroma (volatile compounds move less in cold liquid) but also reduces burn. A warm drink enhances aroma but increases the perception of alcohol. This is why a martini is served very cold (suppresses ethanol, highlights gin botanicals) while a neat spirit is served at room temperature (maximizes aroma). The temperature at which you taste something changes what you taste.

Aging and congeners affect perception too. Congeners — the compounds produced during fermentation and distillation besides ethanol — add complexity but also weight and sometimes harshness. Pot-stilled spirits (many Scotches, some rums) have more congeners and feel fuller; column-stilled spirits (most vodkas, many gins) have fewer congeners and feel cleaner. The "burn" of a high-congener spirit is different from the burn of a high-ABV clean spirit: one is spicy and complex, the other is harsh and simple."""),
]

success = 0
fail = 0

for cat_slug, tech_slug, lesson_slug, title, desc, dur, diff, content in lessons:
    tech_id = tech_map.get((cat_slug, tech_slug))
    if not tech_id:
        print(f"FAIL: technique not found: {cat_slug} > {tech_slug}")
        fail += 1
        continue
    
    try:
        cur.execute("""
            UPDATE lessons
            SET title = %s, description = %s, duration = %s, difficulty = %s, content = %s
            WHERE technique_id = %s AND slug = %s
        """, (title, desc, dur, diff, content, tech_id, lesson_slug))
        
        if cur.rowcount == 0:
            print(f"WARN: no rows updated for {title} ({lesson_slug})")
        else:
            print(f"OK: {title} — {len(content.split())} words")
            success += 1
    except Exception as e:
        print(f"FAIL: {title} — {e}")
        fail += 1

conn.commit()
cur.close()
conn.close()

print(f"\nDone: {success} succeeded, {fail} failed")
