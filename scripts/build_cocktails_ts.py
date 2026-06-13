import psycopg2, json
from pathlib import Path

DB_CONFIG = dict(
    host="ep-young-cell-apbcicg9-pooler.c-7.us-east-1.aws.neon.tech",
    database="BartenderSanctuary",
    user="neondb_owner",
    password="npg_T4RZg8letWEH",
    sslmode="require",
)

GLASS_TO_ICON = {
    'highball': 'highball',
    'coupe': 'coupe',
    'wine': 'wine',
    'wine glass': 'wine',
    'shot': 'shot',
    'hurricane': 'hurricane',
    'flute': 'champagne',
    'champagne flute': 'champagne',
    'champagne': 'champagne',
    'martini glass': 'martini',
    'rocks': 'rocks',
    'collins': 'highball',
    'tumbler': 'rocks',
    'tumbler glass': 'rocks',
    'mule mug': 'mule',
    'copper mug': 'mule',
    'julep cup': 'julep',
    'irish coffee glass': 'rocks',
    'pousse café glass': 'martini',
}

LEGACY = {
    "old-fashioned": {"origin": "Late 1800s, New York. The original 'cocktail' — spirit, sugar, water, bitters.", "base": ["whiskey"], "modifiers": ["bitters"], "glass": "Rocks", "story": "Before 'cocktail' meant anything with fruit juice, it meant this: spirit, sugar, water, and bitters.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "classic"]},
    "martini": {"origin": "Late 1800s, California → New York. Evolved from the Martinez.", "base": ["gin", "vodka"], "modifiers": ["vermouth"], "glass": "Coupe", "story": "The Martini has been America's most argued-over cocktail for over a century.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "classic", "dry"]},
    "manhattan": {"origin": "1870s, New York City. Said to have been invented at the Manhattan Club.", "base": ["whiskey"], "modifiers": ["vermouth", "bitters"], "glass": "Coupe", "story": "Rye whiskey, sweet vermouth, and bitters — that's all it takes.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "classic"]},
    "daiquiri": {"origin": "1896, Cuba. Not the frozen slush — the real one is shaken, fresh, and sharp.", "base": ["rum"], "modifiers": ["citrus", "syrup"], "glass": "Coupe", "story": "The original was a simple shaken sour invented near Havana's Daiquiri iron mines.", "technique": "Shaken", "tags": ["shaken", "sour", "tropical"]},
    "margarita": {"origin": "1930s–1940s, Mexico / Texas border.", "base": ["tequila"], "modifiers": ["citrus", "syrup", "liqueur"], "glass": "Rocks", "story": "The Margarita is Mexico's gift to the world.", "technique": "Shaken", "tags": ["shaken", "sour", "tropical"]},
    "negroni": {"origin": "1919, Florence, Italy. Count Camillo Negroni asked his bartender to strengthen his Americano by swapping soda for gin.", "base": ["gin"], "modifiers": ["vermouth", "liqueur", "bitters"], "glass": "Rocks", "story": "Bittersweet, bold, and unapologetically strong — the Negroni is Italy's most famous cocktail.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "bitter"]},
    "mojito": {"origin": "1500s–1800s, Cuba. Evolved from a medicinal mint-and-rum mixture.", "base": ["rum"], "modifiers": ["citrus", "syrup", "herbal"], "glass": "Highball", "story": "Havana's signature cocktail.", "technique": "Built", "tags": ["built", "refreshing", "tropical"]},
    "cosmopolitan": {"origin": "1980s–1990s, New York City. Popularized by Sex and the City.", "base": ["vodka"], "modifiers": ["citrus", "liqueur"], "glass": "Coupe", "story": "Created in NYC bars during the cocktail renaissance.", "technique": "Shaken", "tags": ["shaken", "sour", "modern"]},
    "whiskey-sour": {"origin": "1860s, USA. One of the first cocktails written down in Jerry Thomas's 1862 bartender's guide.", "base": ["whiskey"], "modifiers": ["citrus", "syrup", "egg"], "glass": "Rocks", "story": "The Whiskey Sour is older than most people think.", "technique": "Shaken", "tags": ["shaken", "sour", "classic"]},
    "tom-collins": {"origin": "1870s, London → USA. Named after a prank song; originally 'John Collins' with gin.", "base": ["gin"], "modifiers": ["citrus", "syrup", "carbonated"], "glass": "Highball", "story": "The Tom Collins is a tall, refreshing, slightly deceptive drink.", "technique": "Built", "tags": ["built", "sour", "refreshing"]},
}

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()
cur.execute("SELECT * FROM cocktails ORDER BY name ASC")
cols = [d[0] for d in cur.description]
rows = cur.fetchall()
cur.close()
conn.close()

data = [dict(zip(cols, row)) for row in rows]
print(f"Fetched {len(data)} cocktails from Neon")

lines = [
    "export interface Cocktail {",
    "  id: string;",
    "  slug: string;",
    "  name: string;",
    "  description: string;",
    "  image_url: string;",
    "  origin: string;",
    "  base: string[];",
    "  modifiers: string[];",
    "  glass: string;",
    "  garnish: string;",
    "  tags: string[];",
    "  story: string;",
    "  recipe: string[];",
    "  technique: string;",
    "  ingredients: { item: string; qty: string }[];",
    "  instructions: string[];",
    "  glass_type: string;",
    "  difficulty: string;",
    "  icon_type: string;",
    "  created_at: string;",
    "  updated_at: string;",
    "}",
    "",
    "export const cocktails: Cocktail[] = [",
]

for c in data:
    legacy = LEGACY.get(c['slug'], {})
    origin = legacy.get('origin', c.get('origin', ''))
    base = legacy.get('base', c.get('base', []) or [])
    modifiers = legacy.get('modifiers', c.get('modifiers', []) or [])
    glass = legacy.get('glass', c.get('glass_type', ''))
    story = legacy.get('story', c.get('story', '') or c.get('description', ''))
    technique = legacy.get('technique', c.get('technique', 'Shaken'))
    tags = legacy.get('tags', c.get('tags', []) or [c['difficulty'].lower()] if c.get('difficulty') else [])
    ingredients = c.get('ingredients') or []
    recipe = [f"{i['qty']} {i['item']}" for i in ingredients]

    raw_glass = (glass or '').strip().lower()
    icon_type = GLASS_TO_ICON.get(raw_glass, 'martini')

    lines.append("  {")
    lines.append(f'    id: "{c["id"]}",')
    lines.append(f'    slug: "{c["slug"]}",')
    lines.append(f'    name: {json.dumps(c["name"])},')
    lines.append(f'    description: {json.dumps(c.get("description", ""))},')
    lines.append(f'    image_url: {json.dumps(c.get("image_url", ""))},')
    lines.append(f'    origin: {json.dumps(origin)},')
    lines.append(f'    base: {json.dumps(base)},')
    lines.append(f'    modifiers: {json.dumps(modifiers)},')
    lines.append(f'    glass: {json.dumps(glass)},')
    lines.append(f'    garnish: {json.dumps(c.get("garnish", ""))},')
    lines.append(f'    tags: {json.dumps(tags)},')
    lines.append(f'    story: {json.dumps(story)},')
    lines.append(f'    recipe: {json.dumps(recipe)},')
    lines.append(f'    technique: {json.dumps(technique)},')
    lines.append(f'    ingredients: {json.dumps(ingredients)},')
    lines.append(f'    instructions: {json.dumps(c.get("instructions", []) or [])},')
    lines.append(f'    glass_type: {json.dumps(c.get("glass_type", ""))},')
    lines.append(f'    difficulty: {json.dumps(c.get("difficulty", "Beginner"))},')
    lines.append(f'    icon_type: "{icon_type}",')
    lines.append(f'    created_at: "{c.get("created_at", "")}",')
    lines.append(f'    updated_at: "{c.get("updated_at", "")}",')
    lines.append("  },")

lines.append("];")
content = "\n".join(lines) + "\n"

out = Path('/home/skicmi/bartender-sanctuary-app/data/cocktails.ts')
out.write_text(content)
print(f"Wrote {len(data)} cocktails to {out}")
