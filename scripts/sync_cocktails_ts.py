import requests, json

BASE = "https://bartender-sanctuary-app.vercel.app"
r = requests.get(f"{BASE}/api/cocktails", timeout=15)
r.raise_for_status()
data = r.json()

data.sort(key=lambda x: x['name'].lower())

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
  "  icon_type: string;",
  "  difficulty: string;",
  "  created_at: string;",
  "  updated_at: string;",
  "}",
  "",
  "export const cocktails: Cocktail[] = [",
]

# Map DB fields to legacy frontend fields
LEGACY_MAP = {
  "old-fashioned": {"origin": "Late 1800s, New York. The original 'cocktail' — spirit, sugar, water, bitters.", "base": ["whiskey"], "modifiers": ["bitters"], "glass": "Rocks", "story": "Before 'cocktail' meant anything with fruit juice, it meant this: spirit, sugar, water, and bitters. The Old Fashioned became a term of rebellion when bartenders started adding too many extras. Ordering one was a way to demand the old way — pure and simple.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "classic"]},
  "martini": {"origin": "Late 1800s, California → New York. Evolved from the Martinez.", "base": ["gin", "vodka"], "modifiers": ["vermouth"], "glass": "Coupe", "story": "The Martini has been America's most argued-over cocktail for over a century. Dry or wet? Gin or vodka? Stirred or shaken? James Bond popularized the shaken version, but purists insist stirring keeps it silky.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "classic", "dry"]},
  "manhattan": {"origin": "1870s, New York City. Said to have been invented at the Manhattan Club.", "base": ["whiskey"], "modifiers": ["vermouth", "bitters"], "glass": "Coupe", "story": "Rye whiskey, sweet vermouth, and bitters — that's all it takes. Legend says it was born at a political party headquarters in the 1870s, and it's been a favorite of writers and politicians ever since.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "classic"]},
  "daiquiri": {"origin": "1896, Cuba. Not the frozen slush — the real one is shaken, fresh, and sharp.", "base": ["rum"], "modifiers": ["citrus", "syrup"], "glass": "Coupe", "story": "The original was a simple shaken sour invented near Havana's Daiquiri iron mines. A great daiquiri is tart, cold, and a little dangerous.", "technique": "Shaken", "tags": ["shaken", "sour", "tropical"]},
  "margarita": {"origin": "1930s–1940s, Mexico / Texas border. Multiple origin stories, but all agree: tequila, lime, salt.", "base": ["tequila"], "modifiers": ["citrus", "syrup", "liqueur"], "glass": "Rocks", "story": "The Margarita is Mexico's gift to the world. Whether it was a socialite in Acapulco or a bartender in Dallas, someone got it right: tequila, fresh lime, a touch of sweetness, and a salted rim.", "technique": "Shaken", "tags": ["shaken", "sour", "tropical"]},
  "negroni": {"origin": "1919, Florence, Italy. Count Camillo Negroni asked his bartender to strengthen his Americano by swapping soda for gin.", "base": ["gin"], "modifiers": ["vermouth", "liqueur", "bitters"], "glass": "Rocks", "story": "Bittersweet, bold, and unapologetically strong — the Negroni is Italy's most famous cocktail. Equal parts, no shortcuts.", "technique": "Stirred", "tags": ["stirred", "spirit-forward", "bitter"]},
  "mojito": {"origin": "1500s–1800s, Cuba. Evolved from a medicinal mint-and-rum mixture.", "base": ["rum"], "modifiers": ["citrus", "syrup", "herbal"], "glass": "Highball", "story": "Havana's signature cocktail. The Mojito combines white rum, fresh mint, lime, and sparkling water — a drink designed for hot Caribbean afternoons.", "technique": "Built", "tags": ["built", "refreshing", "tropical"]},
  "cosmopolitan": {"origin": "1980s–1990s, New York City. Popularized by Sex and the City.", "base": ["vodka"], "modifiers": ["citrus", "liqueur"], "glass": "Coupe", "story": "Created in NYC bars during the cocktail renaissance, it became a cultural icon. Behind the pink color is a perfectly balanced sour: vodka, triple sec, lime, and a touch of cranberry.", "technique": "Shaken", "tags": ["shaken", "sour", "modern"]},
  "whiskey-sour": {"origin": "1860s, USA. One of the first cocktails written down in Jerry Thomas's 1862 bartender's guide.", "base": ["whiskey"], "modifiers": ["citrus", "syrup", "egg"], "glass": "Rocks", "story": "The Whiskey Sour is older than most people think. Jerry Thomas published a recipe in 1862. Some versions add egg white for silky texture, but the core is simple: whiskey, lemon, sugar, shaken hard.", "technique": "Shaken", "tags": ["shaken", "sour", "classic"]},
  "tom-collins": {"origin": "1870s, London → USA. Named after a prank song; originally 'John Collins' with gin.", "base": ["gin"], "modifiers": ["citrus", "syrup", "carbonated"], "glass": "Highball", "story": "The Tom Collins is a tall, refreshing, slightly deceptive drink. Today it's a simple highball: gin, lemon, sugar, and soda water — perfect for lazy afternoons.", "technique": "Built", "tags": ["built", "sour", "refreshing"]},
}

for c in data:
    legacy = LEGACY_MAP.get(c['slug'], {})
    origin = legacy.get('origin', '')
    base = legacy.get('base', [])
    modifiers = legacy.get('modifiers', [])
    glass = legacy.get('glass', c.get('glass_type', ''))
    story = legacy.get('story', c.get('story', '') or c.get('description', '') or '')
    technique = legacy.get('technique', 'Shaken')
    tags = legacy.get('tags', [c.get('difficulty', '').lower()] if c.get('difficulty') else [])
    recipe = [f"{i['qty']} {i['item']}" for i in c.get('ingredients', [])]

    lines.append("  {")
    lines.append(f"    id: \"{c['id']}\",")
    lines.append(f"    slug: \"{c['slug']}\",")
    lines.append(f"    name: {json.dumps(c['name'])},",)
    lines.append(f"    description: {json.dumps(c['description'])},",)
    lines.append(f"    image_url: {json.dumps(c.get('image_url'))},",)
    lines.append(f"    origin: {json.dumps(origin)},",)
    lines.append(f"    base: {json.dumps(base)},",)
    lines.append(f"    modifiers: {json.dumps(modifiers)},",)
    lines.append(f"    glass: {json.dumps(glass)},",)
    lines.append(f"    garnish: {json.dumps(c.get('garnish'))},",)
    lines.append(f"    tags: {json.dumps(tags)},",)
    lines.append(f"    story: {json.dumps(story)},",)
    lines.append(f"    recipe: {json.dumps(recipe)},",)
    lines.append(f"    technique: {json.dumps(technique)},",)
    lines.append(f"    ingredients: {json.dumps(c.get('ingredients', []))},",)
    lines.append(f"    instructions: {json.dumps(c.get('instructions', []))},",)
    lines.append(f"    glass_type: {json.dumps(c.get('glass_type'))},",)
    lines.append(f"    icon_type: {json.dumps(c.get('icon_type'))},",)
    lines.append(f"    difficulty: {json.dumps(c.get('difficulty'))},",)
    lines.append(f"    created_at: {json.dumps(str(c.get('created_at')))},",)
    lines.append(f"    updated_at: {json.dumps(str(c.get('updated_at')))},",)
    lines.append("  },")

lines.append("];")
content = "\n".join(lines) + "\n"
with open("/home/skicmi/bartender-sanctuary-app/data/cocktails.ts", "w") as f:
    f.write(content)
print(f"Wrote {len(data)} cocktails to data/cocktails.ts with full frontend fields")
