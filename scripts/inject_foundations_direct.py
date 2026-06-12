#!/usr/bin/env python3
"""
Directly inject all 18 Foundations lessons into the DB via psycopg2.
Bypasses inject_lesson.py to avoid parsing issues.
"""
import json
import os
import psycopg2

PASS_FILE = os.path.expanduser('~/Desktop/NeonDbPass')
HOST = 'ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech'
DB = 'BartenderSanctuary'
USER = 'neondb_owner'

with open(PASS_FILE, 'r') as f:
    password = f.read().strip()

conn = psycopg2.connect(host=HOST, database=DB, user=USER, password=password, sslmode='require')
cur = conn.cursor()

# Get category id for 'foundations'
cur.execute("SELECT id FROM categories WHERE slug = %s", ('foundations',))
cat_row = cur.fetchone()
if not cat_row:
    print("ERROR: 'foundations' category not found in DB")
    exit(1)
cat_id = cat_row[0]
print(f"Foundations category ID: {cat_id}")

lessons = [
    # Technique: history-of-the-bar
    ('history-of-the-bar', 'ancient-fermentation', 'Ancient Fermentation & Distillation', 'Where alcoholic beverages began.', '12 min', 'Beginner'),
    ('history-of-the-bar', 'taverns-saloons-speakeasies', 'Taverns, Saloons, Speakeasies', 'The social spaces that shaped drinking culture.', '14 min', 'Beginner'),
    ('history-of-the-bar', 'prohibition-legacy', 'Prohibition & Its Legacy', 'How 13 years shaped American drinking.', '15 min', 'Intermediate'),
    ('history-of-the-bar', 'golden-age', 'Golden Age of Cocktails (1860–1920)', 'Jerry Thomas to the pre-Prohibition heyday.', '18 min', 'Intermediate'),
    ('history-of-the-bar', 'tiki-era', 'Tiki Era (1930s–1960s)', 'Polynesian fantasy, rum, and Don the Beachcomber.', '15 min', 'Beginner'),
    ('history-of-the-bar', 'disco-era-decline', 'Disco Era Decline', 'When cocktails lost their way.', '10 min', 'Beginner'),
    ('history-of-the-bar', 'craft-renaissance', 'Craft Cocktail Renaissance (2000s–Now)', 'Dale DeGroff, Sasha Petraske, and the modern bar.', '16 min', 'Intermediate'),
    # Technique: bar-setup-terminology
    ('bar-setup-terminology', 'anatomy-of-bar', 'Anatomy of a Bar', 'Well, back bar, speed rail, mise en place.', '10 min', 'Beginner'),
    ('bar-setup-terminology', 'essential-glassware', 'Essential Glassware Guide', 'Coupe, rocks, highball, collins, and more.', '10 min', 'Beginner'),
    ('bar-setup-terminology', 'essential-tools', 'Essential Tools Guide', 'Shakers, strainers, muddlers, and barspoons.', '12 min', 'Beginner'),
    ('bar-setup-terminology', 'measurements', 'Bar Measurements', 'Oz, ml, dash, splash, barspoon — and the metric conversion.', '10 min', 'Beginner'),
    ('bar-setup-terminology', 'industry-slang', 'Industry Slang & Vocabulary', 'The language bars actually use.', '10 min', 'Beginner'),
    ('bar-setup-terminology', 'hygiene-food-safety', 'Bar Hygiene & Food Safety', 'Cross-contamination, glass washing, and storage.', '12 min', 'Beginner'),
    # Technique: palate-training
    ('palate-training', 'five-tastes', 'The 5 Taste Profiles', 'Sweet, sour, bitter, salty, umami.', '10 min', 'Beginner'),
    ('palate-training', 'alcohol-flavour-perception', 'How Alcohol Affects Flavour Perception', 'ABV, burn, and sensory adaptation.', '12 min', 'Beginner'),
    ('palate-training', 'training-your-nose', 'Training Your Nose', 'Aroma families and olfactory memory.', '12 min', 'Beginner'),
    ('palate-training', 'tasting-methodology', 'Tasting Methodology', 'Structured tasting for bartenders.', '14 min', 'Intermediate'),
    ('palate-training', 'building-flavour-memory', 'Building Flavour Memory', 'How to remember and recall flavours.', '12 min', 'Beginner'),
]

content_map = {
    'ancient-fermentation': 'Fermentation is one of the oldest chemical processes humans have controlled. Evidence of fermented beverages dates back to 7000–6600 BCE in Jiahu, China, where residue analysis revealed a mixed fermented drink of rice, honey, and fruit. In Mesopotamia, the Sumerians brewed beer from barley by 4000 BCE — the Hymn to Ninkasi is both a prayer and a beer recipe. Distillation emerged much later, likely between 1st century CE Alexandria and 8th–9th century Arabia, where alchemists refined wine into stronger spirits for medicinal use. Monasteries became centers of distillation knowledge across Europe by the 12th century. Understanding this timeline helps bartenders explain the "why" behind the drinks they serve.',
    'taverns-saloons-speakeasies': 'Taverns were colonial America\'s community hubs — part inn, part court, part voting station. By the 1800s, saloons became distinctly male working-class spaces, often tied to breweries. During Prohibition (1920–1933), legal bars closed and illegal speakeasies flourished, creating cocktail culture out of necessity: poor-quality bathtub gin needed masking, and secrecy demanded speed and small pours. This era invented or popularized the Sidecar, Bee\'s Knees, and French 75. After repeal, tiki bars and hotel lounges carried the cocktail forward until the dark ages of the 1970s–80s.',
    'prohibition-legacy': 'Prohibition (1920–1933) removed legal supply but did not remove demand. Organized crime stepped in, drinks got worse, and bartenders got creative. Citrus juices, honey, and syrups became essential to cover harsh spirits. Ice consumption skyrocketed — previously a luxury, now necessary for diluted, fast-served drinks. The legacy is mixed: Prohibition destroyed many fine-dining cocktail traditions but also birthed the classic cocktail canon we still revere. When legal bars reopened, many skilled bartenders had left the industry, and quality suffered for decades.',
    'golden-age': 'The Golden Age ran roughly from the 1860s to 1920. Jerry Thomas published the first bartender\'s guide in 1862 ("How to Mix Drinks"), codifying recipes and establishing bartending as a craft. Liqueurs, bitters, and fresh citrus became standard. Establishments like the Waldorf-Astoria and the Savoy set standards of service and atmosphere. The cocktail was a social lubricant for a rapidly modernizing world — railways, telegraphs, and urban density created demand for sophisticated public drinking spaces. The era ended with Prohibition but left a recipe canon that defines craft bartending today.',
    'tiki-era': 'Donn Beach opened Don the Beachcomber in 1934 Los Angeles, inventing the tiki bar: Polynesian decor, rum-forward drinks, and a mythology of Pacific escapism. Victor Bergeron (Trader Vic) popularized the Mai Tai in Oakland in 1944. The era produced elaborate drinks — Zombie, Scorpion, Navy Grog — often featuring multiple rum types, citrus, syrups, and overproof floaters. Tiki was originally a kitschy American invention, but its emphasis on balance, layered flavor, and showmanship influenced modern craft bartending. The 2000s tiki revival (CocktailDB, Three Dots and a Dash) proved its staying power.',
    'disco-era-decline': 'The 1970s–80s saw a collapse in cocktail quality. Pre-mixed sweet products (sour mix, margarita mix), frozen blenders, and low-quality spirits dominated. Vodka displaced gin as the "neutral" spirit of choice, partly because it was cheaper and easier to mask. The focus shifted from craft to volume and sweetness. Many classic bars closed or dumbed down their menus. Bartenders were treated as service staff, not craftspeople. This era is important context: the craft cocktail renaissance was explicitly a rejection of this decline.',
    'craft-renaissance': 'The renaissance began in the late 1990s and peaked in the 2000s–2010s. Dale DeGroff at the Rainbow Room revived fresh juice, house-made syrups, and pre-Prohibition recipes. Sasha Petraske at Milk & Honey introduced precision, guest interaction, and the modern cocktail menu format. Bartenders became celebrities, and cocktails became intellectual as well as social pursuits. Today\'s craft bartenders study history, chemistry, and sensory science — not just recipes. The movement has gone global, with strong scenes in London, Berlin, Tokyo, Mexico City, and Sydney.',
    'anatomy-of-bar': 'A professional bar has three functional zones. The well (or speed rail) is where you work — the sink, ice bin, rail of house pours, and immediate tools. The back bar is the display and storage area for premium bottles, liqueurs, and garnishes. Mise en place mirrors kitchen practice: everything in its place, pre-poured house pours, garnishes cut and stored correctly, glassware within reach. A well-organized mise reduces ticket times, prevents errors, and looks professional to guests.',
    'essential-glassware': 'Glassware is functional, not decorative. The coupe (150–200mL) is for shaken, strained cocktails (martinis, daiquiris). Rocks glasses (200–300mL) are for built or stirred drinks served over ice. Highball (250–350mL) and collins (350–400mL) suit long drinks with soda or juice. Nick & Nora glasses are a smaller, elegant alternative to the coupe, popular in modern bars. Flutes serve sparkling cocktails. Irish coffee glass is for hot drinks. Chilling glasses in the fridge or freezer improves temperature retention — a warm glass is a service failure.',
    'essential-tools': 'Every bartender needs a core toolkit. Boston shaker (2-piece: glass + tin) is durable and easy to seal. Cobbler shaker (3-piece) is compact but harder to open when cold. Hawthorne strainer fits a mixing glass or shaker tin; Julep strainer is for stirred drinks in a mixing glass. A barspoon (long, twisted shaft) is for stirring — it creates less dilution than shaking and looks elegant. Muddler (wood or plastic, never metal) crushes herbs and fruit. Channel knife makes citrus twists. Jigger (double-ended, 1oz/2oz or ¾oz/1½oz) ensures consistent pours. Speed pourer with calibrated training bottles helps build muscle memory for free-pouring.',
    'measurements': 'Consistency starts with measurement. In the U.S.: 1oz = 29.57mL; 1.5oz = 44.36mL (standard spirit pour). A dash is roughly 1/8oz (3.7mL) — for bitters, it is typically 2–3 quick presses of the bottle. A splash is informal, roughly 0.5–1oz. A barspoon holds about 5mL (1 tsp). In Europe and most of the world, recipes are in mL: 30mL = 1oz, 45mL = 1.5oz. Professional bars standardize on one system.',
    'industry-slang': 'Slang is practical shorthand. A well drink uses the house liquor; a call drink specifies a brand. Top-shelf means premium. Rail is the speed-rail bottles. On the rocks = over ice; neat = straight up, no ice; straight up = chilled, strained, no ice. Dirty = with olive brine (martini); dry = less vermouth. Up = chilled and strained. Shot = 1.5oz (in the U.S.). Neat pour = a single large ice cube or sphere. Muddle = crush in the glass. Build = assemble in the serving glass. Call = guest requests a specific brand.',
    'hygiene-food-safety': 'Bars are food-service environments. Glass washing: detergent, rinse, sanitize, air-dry — no towel drying (lint). Ice handling: use scoops, never hands. Garnish storage: cut citrus lasts 1–2 days in the fridge; herbs last 2–3 days in water. Cross-contamination: separate tools for raw ingredients if serving food; never use the same straw or stirrer for multiple guests. Allergens: nut-based liqueurs, egg whites, dairy — disclose when asked. Temperature: cold storage below 5°C (41°F), hot holding above 60°C (140°F). Most local health departments inspect bars; know your local code.',
    'five-tastes': 'The human tongue detects five primary tastes: sweet (energy, ripe fruit, sugar), sour (acid, tartness, brightness), bitter (complexity, depth, often from botanicals or gentian), salty (enhances flavor, masks bitterness), and umami (savory depth, soy, mushroom, aged cheese). Cocktails are rarely pure in one taste — the craft lies in balance. A sour cocktail like a daiquiri is intentionally sour, but a well-made one still has enough sweetness to round the edges.',
    'alcohol-flavour-perception': 'Alcohol itself is a solvent: it carries aroma compounds to the nose and carries taste compounds across the tongue. At low ABV, alcohol adds body and warmth. Above ~20% ABV, it begins to dominate the palate with "burn" — the trigeminal nerve detects alcohol as a mild irritant. Dilution (from shaking, stirring, or adding water) lowers ABV and opens up flavors by breaking surface tension and releasing volatile aromatics. This is why stirring a spirit-forward drink over ice improves it: controlled dilution and temperature drop.',
    'training-your-nose': 'Smell is 80% of flavor. Train your nose by smelling ingredients raw, then in combination. Common aroma families in cocktails: citrus (lemon, lime, grapefruit), floral (orange blossom, rose, lavender), herbaceous (mint, basil, rosemary), woody (oak, cedar, sandalwood), spicy (pepper, clove, cinnamon), fruity (berry, stone fruit, tropical), earthy (mushroom, beet, roots). Keep a "smell journal" — write down aromas you encounter in spirits, juices, and herbs.',
    'tasting-methodology': 'Professional tasting follows a sequence: look (color, clarity, legs/tears indicate alcohol and sugar content), smell (first without nosing, then with gentle swirling — note first, second, and third aromas), taste (small sip, coat the palate, note attack, mid-palate, and finish), think (balance, complexity, length). Use a spittoon for serious tastings — you do not need to swallow to evaluate. Taste in a quiet room with minimal background smells. Compare two similar spirits side by side to build comparative skills.',
    'building-flavour-memory': 'Memory is associative. When you taste lime juice, link it to key lime pie, margaritas, or Thai food. When you taste Campari, link it to Negroni, Boulevardier, or Campari soda. Build a mental map: "citrus + herbal + bitter" points toward gin; "caramel + vanilla + oak" points toward bourbon. Taste deliberately, not passively. Revisit the same spirit monthly. Memory fades without reinforcement — schedule regular tastings, even 5-minute ones during prep.',
}

success = 0
fail = 0

for tech_slug, lesson_slug, title, description, duration, difficulty in lessons:
    content = content_map.get(lesson_slug, '')
    if not content:
        print(f"SKIP (no content): {title}")
        fail += 1
        continue

    # Get technique id
    cur.execute("SELECT id FROM techniques WHERE category_id = %s AND slug = %s", (cat_id, tech_slug))
    tech_row = cur.fetchone()
    if not tech_row:
        print(f"FAIL: technique '{tech_slug}' not found")
        fail += 1
        continue
    tech_id = tech_row[0]

    # Upsert lesson
    cur.execute("""
        INSERT INTO lessons (technique_id, slug, title, description, duration, difficulty, content, sort_order)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 1)
        ON CONFLICT (technique_id, slug)
        DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            duration = EXCLUDED.duration,
            difficulty = EXCLUDED.difficulty,
            content = EXCLUDED.content
    """, (tech_id, lesson_slug, title, description, duration, difficulty, content))

    print(f"OK: {title} ({tech_slug} > {lesson_slug})")
    success += 1

conn.commit()
cur.close()
conn.close()

print(f"\nDone: {success} succeeded, {fail} failed")
