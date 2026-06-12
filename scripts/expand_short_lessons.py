#!/usr/bin/env python3
"""
Expand the 5 short Foundations lessons in the DB.
These currently fall below 500 chars and need to reach 1,000+ for £5/month quality.
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

# Get foundations category
cur.execute("SELECT id FROM categories WHERE slug = %s", ('foundations',))
row = cur.fetchone()
if not row:
    print("ERROR: foundations category not found")
    exit(1)
cat_id = row[0]

# Get technique IDs
cur.execute("SELECT id, slug FROM techniques WHERE category_id = %s", (cat_id,))
tech_map = {row[1]: row[0] for row in cur.fetchall()}

expansions = {
    'anatomy-of-bar': {
        'title': 'Anatomy of a Bar',
        'description': 'Well, back bar, speed rail, mise en place.',
        'duration': '12 min',
        'difficulty': 'Beginner',
        'content': """A professional bar is a system, not just a counter. Understanding its zones is the first step to working efficiently and looking like you belong behind it.

The well (or speed rail) is your command center. It sits closest to the guest or at the point where you actually make drinks, and it contains the house pours — the spirits you use most often, lined up on a narrow rail for instant access. Behind the well you will find the ice bin (two bins is standard: one for cocktail ice, one for water/well ice), the sink for rinsing shakers and glasses, and a dedicated space for your immediate tools: shaker, Hawthorne strainer, barspoon, jigger, and a small cutting board for garnishes. Everything within arm's reach means you stop reaching, stop thinking, and start flowing.

The back bar is the showcase. It is what guests see when they sit down, and it is also where you keep liqueurs, modifiers, and premium pours that do not earn a spot on the speed rail. A well-ordered back bar groups by function: amari together, liqueurs together, vermouths together. It makes restocking faster and prevents the "hunt" during a busy shift.

Mise en place borrows directly from kitchen discipline. Every garnish is pre-cut at the start of service: lime wheels stored in a sealed container, lemon twists in a damp paper towel, mint sprigs in water. House recipes are pre-batched where possible (syrups, infusions, bitters blends). Glassware is staged in racks above the well. The goal is zero improvisation during service — if you need it, it should already be there, in the same place every night.

Workflow matters. A classic bar layout places the well on the left, the sink in the middle, and the ice on the right (for right-handed bartenders). This creates a natural left-to-right motion: grab bottle, measure, shake or stir, strain, garnish, serve. Deviating from this flow creates congestion and accidents.

Temperature is part of anatomy. A bar fridge for juice and perishables (citrus goes dull after hours at room temperature), a freezer for coupes and Nick & Nora glasses, and a separate ice storage bin away from the sink so meltwater does not dilute your cocktail ice. Under-bar refrigeration keeps vermouth and liqueurs fresh longer; many bars store open vermouth in the main fridge and pour from smaller bottles behind the bar to avoid oxidation.

Finally, consider the guest's perspective. A clean, uncluttered back bar signals competence. Spillage rings, dust on bottles, and mismatched glassware all scream neglect. A bartender who cares about their station is presumed to care about the drink."""
    },
    'measurements': {
        'title': 'Bar Measurements',
        'description': 'Oz, ml, dash, splash, barspoon — and the metric conversion.',
        'duration': '12 min',
        'difficulty': 'Beginner',
        'content': """Consistency is impossible without standardized measurement. Every cocktail is a ratio, and ratios only work if the parts are the same size every time.

In the U.S. system, the foundation is the ounce. One fluid ounce equals 29.57mL, but bars round to 30mL for simplicity. The standard spirit pour is 1.5oz (44.36mL), also commonly called a "jigger" because it is the larger end of a standard double-ended jigger. Beer towers and wine are different; we are talking cocktails here.

A dash is the most debated measurement in bartending. There is no official volume, but industry convention treats it as roughly 1/8oz (3.7mL). For bitters specifically, a dash is 2–3 quick presses of the bottle held upright. Some bitters bottles have glass dashers that release a consistent 0.04mL per press; others rely on feel. The key is consistency: if your dash is half the volume of your colleague's, your drinks will taste different.

A splash is informal and appears mostly in older recipes. Think of it as 0.5–1oz — roughly the amount you get when you tip a bottle for a second or two. In modern recipe writing, splash is being phased out in favor of exact ounces or milliliters.

A barspoon holds approximately 5mL (1 teaspoon). It is used in stirring and layering, where precise small volumes matter. The twisted shaft is not decorative — it helps the spoon grip the inside of a mixing glass and makes stirring smoother.

The metric system dominates everywhere except the United States. In Europe, Australia, and most of Asia: 30mL = 1oz, 45mL = 1.5oz. Many modern cocktail books publish both. If you work internationally, memorize the 30/45 rule: 1oz is 30, 1.5oz is 45. Everything else is just fractions of those.

Professional bars pick one system and enforce it. Switching between oz and mL mid-shift causes errors. House recipes should be written in the system your bar uses, with conversions noted only for reference. When you taste a cocktail and it is "off," the first thing to check is the pour — was it 1.5oz or a lazy 1.25oz?

Free-pouring — pouring without a jigger — is common in high-volume bars after training. It requires calibrated pour spouts and muscle memory. The test is the 1-second pour: most spouts release 1oz per second. Practice with a measured jigger until you can hit 1oz in one second blind, then build up to 1.5oz in 1.5 seconds. Even free-pour bars keep jiggers behind the counter for verification."""
    },
    'five-tastes': {
        'title': 'The 5 Taste Profiles',
        'description': 'Sweet, sour, bitter, salty, umami.',
        'duration': '14 min',
        'difficulty': 'Beginner',
        'content': """Every flavor you perceive in a drink maps back to five basic tastes. Understanding how they interact is the difference between mixing drinks and crafting cocktails.

Sweetness is the most immediately recognizable taste. It signals energy (sugars) and appears in cocktails via simple syrup, honey, agave, fruit juices, liqueurs, and some modifiers like Chartreuse or Bénédictine. Sweetness rounds out harsh edges, but too much makes a drink cloying and masks other flavors. In a well-balanced cocktail, sweetness should be present but not dominant — you should finish the drink wanting another sip, not reaching for water.

Sourness comes from acid, and acid is what makes a cocktail "growl" on the sides of your tongue. The primary cocktail acids are citric (lemon, lime), malic (apples, rhubarb), tartaric (grapes, tamarind), and phosphoric (cola). Citric is the bartender's default because lemon and lime juice are shelf-stable enough for service and deliver a clean, bright sour. A sour cocktail that does not make you pucker slightly is under-acided; one that makes you wince is over-acided. The classic sour ratio (2:1:1 spirit to citrus to syrup) is a starting point, not a rule — some citrus is more acidic than others, and some spirits demand more sweetness.

Bitterness is the acquired taste that separates casual drinkers from cocktail enthusiasts. It signals potential toxins in nature, which is why children reject it and adults learn to seek it out. In cocktails, bitterness comes from gentian (in Campari and quinquina), cinchona bark (in tonic and bitter liqueurs), cinchona (in vermouth), and various herbs and roots. A touch of bitterness adds complexity and "structure" — it is the architectural beam that supports the sweetness and acid. A Negroni without Campari is just sweet booze; the bitter is what makes it interesting.

Salty is the taste most overlooked in cocktails, yet it is everywhere. Salt suppresses bitterness and enhances sweetness, which is why salted caramel works and why a salted rim on a margarita makes the tequila taste smoother. A tiny pinch of salt in a sour cocktail (some bartenders literally add a pinch to the shaker) can round out harsh edges without making the drink taste salty. Sea salt tinctures are a modern tool for controlled salinity.

Umami is the savory fifth taste, identified officially in 1985 by Japanese scientists but experienced by cooks for centuries. It comes from glutamates and nucleotides, and it appears in cocktails via tomato orclam juice (Bloody Mary), mushroom-infused spirits, aged cheeses in fat-washed spirits, and soy sauce in adventurous mixes. Umami adds depth and "mouthfilling" character. It is subtle but powerful — a drop of soy in a Bloody Mary is the difference between "tomato juice with vodka" and "why is this so good?"

Training your palate means learning to identify these tastes in isolation, then in combination. Taste lemon juice and identify the sour. Taste tonic water and identify both sweet and bitter. Taste a well-made margarita and identify all five: tequila (sweet, earthy, umami from agave), lime (sour), triple sec (sweet, orange bitter), salt (salty), and the agave syrup if used (sweet)."""
    },
    'training-your-nose': {
        'title': 'Training Your Nose',
        'description': 'Aroma families and olfactory memory.',
        'duration': '14 min',
        'difficulty': 'Beginner',
        'content': """Smell is 80% of flavor, yet most people never train their nose beyond recognizing coffee and garbage. For a bartender, olfactory skill is a professional advantage — it lets you identify spirits by aroma alone, spot off notes before they reach a guest, and create cocktails that smell as complex as they taste.

The human nose can distinguish over 1 trillion scents, but only if you practice. Olfactory memory works like any other memory: you need repeated exposure and deliberate labeling. When you smell lime juice, do not just think "citrus" — think "lime: sharp, green, slightly bitter rind, bright, almost electric." When you smell Campari, think "Campari: bitter orange, rhubarb, cola, cinnamon bark, a hint of menthol." The more specific your labels, the stronger the memory trace.

Common aroma families in cocktails form a vocabulary you will use constantly. Citrus covers lemon, lime, grapefruit, yuzu, and bitter orange. Floral covers orange blossom, rose, lavender, elderflower, and hibiscus. Herbaceous covers mint, basil, rosemary, thyme, and tarragon. Woody covers oak (from barrel-aged spirits), cedar, sandalwood, and fresh-cut lumber (some New World gins use it). Spicy covers pepper, clove, cinnamon, cardamom, and grains of paradise. Fruity covers berry, stone fruit (peach, apricot), tropical (mango, pineapple, passionfruit), and orchard fruit (apple, pear). Earthy covers mushroom, beet, root vegetables, soil, and wet stone. Nutty covers almond, hazelnut, walnut, and toasted sesame. Each family tells you something about the ingredient's chemistry: "earthy" often means terpenes; "floral" often means linalool.

Train in three modes. First, raw ingredient smelling: hold a fresh lime under your nose, close your eyes, and name three distinct aromas. Do the same with a sprig of mint, a slice of orange, a stick of cinnamon. Second, combination smelling: mix two or three ingredients and try to pick out each component. This is harder and more realistic — in a cocktail, aromas blend and mask each other. Third, spirit nosing: pour a bourbon, a gin, and a rum, and try to identify each blind. The more you do this, the faster you will recognize that "caramel, vanilla, oak" means bourbon, while "juniper, coriander, citrus peel" means gin.

Keep a smell journal. Write down five aromas you encountered during each shift: the lime you cut, the mint you muddled, the spirit you tasted. Over a month, patterns emerge. You will notice that "aged rum" always has a specific molasses-and-vanilla signature, while "unaged rum" smells like raw sugarcane and yeast. You will start spotting problems: "this lime smells off — is it starting to ferment?" or "this gin smells like turpentine — did they use too much pine resin in the botanicals?"

The nose tires quickly. If you smell ten ingredients in a row, you will stop distinguishing them. Reset by smelling your own skin (the inside of your elbow works), coffee beans (many bars keep them behind the counter for palate resets between tastings), or a clean linen cloth. Olfactory fatigue is real and unavoidable; managing it is part of the job.

Finally, connect smell to memory. When you smell elderflower for the first time, link it to something you already know: "elderflower smells like lychee and pear with a hint of cucumber." When you taste mezcal, link the smoke to campfire and roasted agave. Association is the fastest way to build a mental library of aromas."""
    },
}

# Add the unchanged but still-in-DB lessons back into data/school.ts
# We'll just update the 5 short ones in the DB and re-sync data/school.ts
for slug, info in expansions.items():
    tech_id = tech_map.get('bar-setup-terminology') or tech_map.get('palate-training')
    
    # Find which technique this belongs to
    if slug in ['anatomy-of-bar', 'measurements']:
        tech_slug = 'bar-setup-terminology'
    else:
        tech_slug = 'palate-training'
    
    tech_id = tech_map[tech_slug]
    
    cur.execute("""
        UPDATE lessons
        SET title = %s, description = %s, duration = %s, difficulty = %s, content = %s
        WHERE technique_id = %s AND slug = %s
    """, (info['title'], info['description'], info['duration'], info['difficulty'], 
          info['content'], tech_id, slug))
    
    print(f"Updated: {info['title']} ({slug}) — {len(info['content'])} chars")

conn.commit()
cur.close()
conn.close()

print("\nDone: 5 lessons expanded")
