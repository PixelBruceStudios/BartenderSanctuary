#!/usr/bin/env python3
"""
Inject all 13 short Foundations lessons with expanded content directly into DB.
No TS parsing needed.
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

# Get technique IDs
cur.execute("""
    SELECT c.slug, t.slug, t.id 
    FROM techniques t 
    JOIN categories c ON t.category_id = c.id 
    WHERE c.slug = 'foundations'
""")
tech_map = {(row[0], row[1]): row[2] for row in cur.fetchall()}

lessons = [
    # history-of-the-bar
    ('foundations', 'history-of-the-bar', 'ancient-fermentation',
     'Ancient Fermentation & Distillation',
     'Where alcoholic beverages began.', '12 min', 'Beginner',
     """Fermentation is one of the oldest chemical processes humans have controlled. Evidence of fermented beverages dates back to 7000–6600 BCE in Jiahu, China, where residue analysis revealed a mixed fermented drink of rice, honey, and fruit. In Mesopotamia, the Sumerians brewed beer from barley by 4000 BCE — the Hymn to Ninkasi is both a prayer and a beer recipe, making it the oldest known written recipe in human history.

Distillation emerged much later, likely between 1st century CE Alexandria and 8th–9th century Arabia, where alchemists refined wine into stronger spirits for medicinal use. The word "alcohol" itself comes from the Arabic al-kuhl, referring to a fine powder used as eyeliner, which became associated with distilled essences. Monasteries became centers of distillation knowledge across Europe by the 12th century, producing herbal tinctures and "aqua vitae" (water of life).

Understanding this timeline matters for bartenders because every spirit you pour carries this history. When you serve a mezcal, you are serving a tradition that predates Spanish distillation in Mexico, where indigenous peoples fermented agave for centuries before copper stills arrived. When you serve a French cognac, you are serving a product of 16th-century monastic experimentation. Knowing the "why" behind the drinks helps you tell their stories to guests, and storytelling is half of modern bartending."""),
    
    ('foundations', 'history-of-the-bar', 'taverns-saloons-speakeasies',
     'Taverns, Saloons, Speakeasies',
     'The social spaces that shaped drinking culture.', '14 min', 'Beginner',
     """Taverns were colonial America's community hubs — part inn, part court, part voting station. In 18th-century Philadelphia, taverns were where the Continental Congress met informally, where political factions formed, and where ordinary citizens encountered ideas that shaped the revolution. The Blue Anchor, founded in 1682, claims to be America's oldest tavern; it was a stopping point for travelers, a post office, and a polling place all at once.

By the 1800s, saloons became distinctly male working-class spaces, often tied to breweries through "tied house" arrangements. A tied house was a saloon owned or financed by a brewery, which ensured loyalty to that brewery's beer. This model shaped American drinking for decades and eventually led to Prohibition-era arguments about monopolistic control of alcohol. Saloons were also social levelers: recent immigrants, laborers, and businessmen might all drink in the same establishment, separated more by class of drink than by class of person.

During Prohibition (1920–1933), legal bars closed and illegal speakeasies flourished, creating cocktail culture out of necessity. Poor-quality bathtub gin needed aggressive masking — citrus, honey, and ginger became essential. Secrecy demanded speed and small pours, which favoured strong, concentrated drinks over the long, slow drinks of the pre-Prohibition era. This period invented or popularized the Sidecar, Bee's Knees, and French 75. After repeal, tiki bars and hotel lounges carried the cocktail forward until the dark ages of the 1970s–80s. The speakeasy's legacy lives on in modern "speakeasy-style" bars that deliberately recreate the exclusivity and craft of that era."""),

    ('foundations', 'history-of-the-bar', 'prohibition-legacy',
     'Prohibition & Its Legacy',
     'How 13 years shaped American drinking.', '15 min', 'Intermediate',
     """Prohibition (1920–1933) removed legal supply but did not remove demand. The 18th Amendment and the Volstead Act banned the manufacture, sale, and transportation of intoxicating liquors, but they did not ban consumption. The result was the largest uncontrolled experiment in American social policy to date, and its effects are still felt in bar culture today.

Organized crime stepped in where legal business had been removed. Al Capone's Chicago empire was built on bootlegging, and speakeasies were often run by gangsters who controlled both the supply and the venues. Drinks got worse because the available spirits were often poorly made, contaminated with methanol or other industrial chemicals, or simply diluted beyond usability. Bartenders got creative: citrus juices masked bad flavours, honey and syrups smoothed harsh edges, and sparkling wine added a sense of occasion to otherwise mediocre drinks.

Ice consumption skyrocketed — previously a luxury commodity shipped from New England ponds, now necessary for the fast-served, diluted drinks that dominated speakeasy menus. This created the modern ice industry and normalized the practice of serving drinks "on the rocks" rather than neat or up.

The legacy is mixed. Prohibition destroyed many fine-dining cocktail traditions: when legal bars reopened in 1933, many skilled bartenders had left the industry or died, and the generation that learned to drink during Prohibition preferred sweet, simple drinks. Quality suffered for decades. Yet Prohibition also birthed the classic cocktail canon we still revere, because the best bartenders of the era — those who worked in the last legal years before 1920 and kept their skills alive underground — wrote the recipes that define craft bartending today. Jerry Thomas's guide was rediscovered and republished, and pre-Prohibition recipes became the foundation of the 2000s renaissance."""),

    ('foundations', 'history-of-the-bar', 'golden-age',
     'Golden Age of Cocktails (1860–1920)',
     'Jerry Thomas to the pre-Prohibition heyday.', '18 min', 'Intermediate',
     """The Golden Age ran roughly from the 1860s to 1920. It began with the publication of Jerry Thomas's "How to Mix Drinks" in 1862, the first bartender's guide to codify recipes and establish bartending as a craft rather than a casual service skill. Thomas, known as "Professor" Jerry Thomas, ran bars in New York, San Francisco, and London, and his book contained 237 recipes ranging from the simple (gin punch) to the elaborate (blue blazer, a flaming cocktail that requires two mixing glasses and nerves of steel).

Liqueurs, bitters, and fresh citrus became standard during this era. The availability of commercially produced liqueurs — Chartreuse, Bénédictine, maraschino, curaçao — expanded the bartender's palette dramatically. Bitters, which had been used primarily in medicinal tonics, became a cocktail essential. The term "cocktail" itself was defined by 1862: a mix of spirits, sugar, water, and bitters, distinguished from simpler drinks like slings or punches.

Establishments like the Waldorf-Astoria in New York and the Savoy in London set standards of service and atmosphere that defined luxury drinking. The Savoy's American Bar, opened in 1893, became the most famous cocktail bar in the world, serving royalty, celebrities, and businessmen. Bartenders there invented the Hanky Panky (Ada Coleman, 1903) and perfected the protocols of guest interaction that modern craft bartenders still emulate.

The cocktail was a social lubricant for a rapidly modernizing world. Railways, telegraphs, and urban density created demand for sophisticated public drinking spaces. A businessman could meet a partner at the hotel bar; a couple could celebrate at the restaurant lounge; friends could gather at the corner tavern. The era ended with Prohibition but left a recipe canon — the Old Fashioned, the Martini, the Manhattan, the Daiquiri — that defines craft bartending today. Every modern cocktail bar that cares about history is, in essence, trying to recreate the Golden Age."""),

    ('foundations', 'history-of-the-bar', 'tiki-era',
     'Tiki Era (1930s–1960s)',
     'Polynesian fantasy, rum, and Don the Beachcomber.', '15 min', 'Beginner',
     """Donn Beach opened Don the Beachcomber in 1934 Los Angeles, inventing the tiki bar: Polynesian decor, rum-forward drinks, and a mythology of Pacific escapism that had nothing to do with actual Polynesian culture. Beach had traveled in the South Pacific and brought back stories, artifacts, and a sense of exoticism that Depression-era America craved. His bar was dimly lit, filled with bamboo and tikis, and served drinks with names like the Zombie and the Scorcher.

Victor Bergeron (Trader Vic) popularized the Mai Tai in Oakland in 1944, creating a rivalry with Beach that lasted decades. Both men claimed invention of key drinks, and both expanded into restaurant chains, packaged products, and international franchising. The tiki era produced elaborate drinks that often featured multiple rum types, citrus juices, house-made syrups, and overproof floaters — drinks that were as much theater as refreshment.

Tiki was originally a kitschy American invention, but its emphasis on balance, layered flavor, and showmanship influenced modern craft bartending. The Zombie, for example, is a masterclass in balance: multiple rums provide bass notes, lime provides acid, falernum provides spice and sweetness, grenadine provides fruit, and a float of overproof rum provides the "kick." The 2000s tiki revival — spearheaded by bars like CocktailDB in London and Three Dots and a Dash in Chicago — proved its staying power. Modern bartenders respect tiki not as kitsch but as a legitimate tradition of complex, multi-component drinks."""),

    ('foundations', 'history-of-the-bar', 'disco-era-decline',
     'Disco Era Decline',
     'When cocktails lost their way.', '10 min', 'Beginner',
     """The 1970s–80s saw a collapse in cocktail quality that created the vacuum the craft renaissance later filled. Pre-mixed sweet products (sour mix, margarita mix), frozen blenders, and low-quality spirits dominated American bars. Vodka displaced gin as the "neutral" spirit of choice, partly because it was cheaper, easier to mass-produce, and easier to mask in sweet mixed drinks. The classic Martini became a vodka Martini, then a "tini" (appletini, cosmo-tini), losing its structure and elegance entirely.

The focus shifted from craft to volume and sweetness. Bartenders were treated as service staff, not craftspeople. Many classic bars closed or dumbed down their menus to survive. Training was minimal: pour, shake, serve. The result was a generation of drinkers who associated cocktails with cloying sweetness and low-quality ingredients. When people said "I don't like cocktails" in the 1980s, they often meant "I don't like the sickly sweet drinks this era produced."

This era is important context for students because the craft cocktail renaissance was explicitly a rejection of this decline. When Dale DeGroff revived fresh juice at the Rainbow Room in the 1980s, he was directly countering the sour-mix culture. When Sasha Petraske opened Milk & Honey in 1999, he was rejecting the noisy, flashing-lights bar scene of the 1980s. Understanding what came before helps students understand why craft bartenders care so much about fresh ingredients, proper technique, and historical recipes. The pendulum always swings: the better you know the low point, the more you appreciate the recovery."""),

    ('foundations', 'history-of-the-bar', 'craft-renaissance',
     'Craft Cocktail Renaissance (2000s–Now)',
     'Dale DeGroff, Sasha Petraske, and the modern bar.', '16 min', 'Intermediate',
     """The renaissance began in the late 1990s and peaked in the 2000s–2010s. Dale DeGroff, working at the Rainbow Room in New York, is often called the "king of cocktails" for his role in reviving fresh juice, house-made syrups, and pre-Prohibition recipes. He trained a generation of bartenders who went on to open influential bars across the world.

Sasha Petraske opened Milk & Honey in New York in 1999, introducing precision, guest interaction, and the modern cocktail menu format. His rules were strict: no shouting, no phone calls at the bar, cocktails served in proper glassware, and a menu organized by spirit-forward, sour, sparkling, and other families. Petraske trained bartenders who opened bars in London (Attaboy), Los Angeles (The Varnish), and beyond, spreading the gospel globally.

Bartenders became celebrities, and cocktails became intellectual as well as social pursuits. Books like "The PDT Cocktail Book" (2011), "Death & Co" (2012), and "The Joy of Mixology" (2003) codified the new standards. Today's craft bartenders study history, chemistry, and sensory science — not just recipes. They understand acid ratios, dilution curves, and aroma extraction. The movement has gone global, with strong scenes in London, Berlin, Tokyo, Mexico City, Sydney, and Barcelona. The modern bar is not just a place to drink; it is a place to learn, to explore, and to experience flavours with intention."""),

    # bar-setup-terminology
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

    # palate-training
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

Aging and congeners affect perception too. Congeners — the compounds produced during fermentation and distillation besides ethanol — add complexity but also weight and sometimes harshness. Pot-stilled spirits (manyScotches, some rums) have more congeners and feel fuller; column-stilled spirits (most vodkas, many gins) have fewer congeners and feel cleaner. The "burn" of a high-congener spirit is different from the burn of a high-ABV clean spirit: one is spicy and complex, the other is harsh and simple."""),

    ('foundations', 'palate-training', 'five-tastes',
     'The 5 Taste Profiles',
     'Sweet, sour, bitter, salty, umami.', '14 min', 'Beginner',
     """Every flavour you perceive in a drink maps back to five basic tastes. Understanding how they interact is the difference between mixing drinks and crafting cocktails.

Sweetness is the most immediately recognizable taste. It signals energy (sugars) and appears in cocktails via simple syrup, honey, agave, fruit juices, liqueurs, and modifiers like Chartreuse. Sweetness rounds out harsh edges, but too much makes a drink cloying. In a well-balanced cocktail, sweetness should be present but not dominant — you should finish the drink wanting another sip, not reaching for water.

Sourness comes from acid, and acid is what makes a cocktail "growl" on the sides of your tongue. The primary cocktail acids are citric (lemon, lime), malic (apples, rhubarb), tartaric (grapes, tamarind), and phosphoric (cola). Citric is the bartender's default because lemon and lime juice are shelf-stable enough for service and deliver a clean, bright sour. The classic sour ratio (2:1:1 spirit to citrus to syrup) is a starting point, not a rule — some citrus is more acidic than others, and some spirits demand more sweetness.

Bitterness is the acquired taste that separates casual drinkers from enthusiasts. It signals potential toxins in nature, which is why children reject it and adults learn to seek it out. In cocktails, bitterness comes from gentian (Campari), cinchona bark (tonic, bitter liqueurs), and various herbs. A touch of bitterness adds complexity and "structure" — it is the architectural beam that supports sweetness and acid. A Negroni without Campari is just sweet booze; the bitter is what makes it interesting.

Salty is the most overlooked taste in cocktails, yet it is everywhere. Salt suppresses bitterness and enhances sweetness, which is why a salted rim makes tequila taste smoother. A tiny pinch of salt in a sour cocktail can round out harsh edges without making the drink taste salty. Sea salt tinctures are a modern tool for controlled salinity.

Umami is the savoury fifth taste, identified in 1985 but experienced by cooks for centuries. It comes from glutamates and appears in cocktails via tomato juice (Bloody Mary), mushroom-infused spirits, aged cheeses in fat-washed spirits, and soy sauce in adventurous mixes. Umami adds depth and "mouthfilling" character — a drop of soy in a Bloody Mary is the difference between "tomato juice with vodka" and "why is this so good."

Training your palate means learning to identify these tastes in isolation, then in combination. Taste lemon juice and identify the sour. Taste tonic water and identify both sweet and bitter. Taste a well-made margarita and identify all five at once."""),
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
