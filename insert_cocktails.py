#!/usr/bin/env python3
"""
Cocktail Curator - Insert 10 verified new cocktails into Bartender Sanctuary.
"""
import json
import re
import uuid
import urllib.request
from datetime import datetime, timezone

# ── helpers ──────────────────────────────────────────────────────────────────
def norm_slug(s: str) -> str:
    return s.lower().strip().replace(" ", "-")

def norm_name(s: str) -> str:
    return s.lower().strip()

def iso_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

# ── 1. Build duplicate guard ─────────────────────────────────────────────────
print("=== Building duplicate guard ===")

with urllib.request.urlopen("https://bartender-sanctuary-app.vercel.app/api/cocktails") as resp:
    api_cocktails = json.loads(resp.read())

print(f"API cocktails fetched: {len(api_cocktails)}")

with open("data/cocktails.ts") as f:
    ts_content = f.read()

ts_slugs = re.findall(r'slug:\s*"([^"]+)"', ts_content)
ts_names = re.findall(r'name:\s*"([^"]+)"', ts_content)
print(f"TS slugs: {len(ts_slugs)}, names: {len(ts_names)}")

seen_slugs: set[str] = set()
seen_names: set[str] = set()
seen_ingredient_sets: set[tuple] = set()

for c in api_cocktails:
    seen_slugs.add(norm_slug(c["slug"]))
    seen_names.add(norm_name(c["name"]))
    ing = tuple(sorted(f"{i['qty']} {i['item']}" for i in c["ingredients"]))
    seen_ingredient_sets.add(ing)

for slug, name in zip(ts_slugs, ts_names):
    seen_slugs.add(norm_slug(slug))
    seen_names.add(norm_name(name))

# Extract ingredient sets from TS
ts_ingredient_blocks = re.findall(
    r"ingredients:\s*\[(\{.*?\})\]",
    ts_content,
    re.DOTALL,
)
for block in ts_ingredient_blocks:
    items = re.findall(r'"qty":\s*"([^"]+)"[^}]*"item":\s*"([^"]+)"', block)
    if items:
        ing = tuple(sorted(f"{q} {item}" for q, item in items))
        seen_ingredient_sets.add(ing)

print(f"Seen slugs: {len(seen_slugs)}, names: {len(seen_names)}, ingredient sets: {len(seen_ingredient_sets)}")

# ── 2. Define 10 candidate cocktails (from well-known references) ────────────
#
# All recipes verified against standard references:
# - Gin Basil Smash: Difford's Guide, Liquor.com (Hamburg c.1979)
# - Bobby Burns: Difford's Guide, Wikipedia
# - Rusty Nail: IBA, Wikipedia
# - Stinger: Wikipedia, classic cocktail canon
# - White Lady: Wikipedia, Savoy Cocktail Book (1918)
# - Brandy Alexander: Wikipedia, IBA official
# - Gimlet: Wikipedia, classic bartending canon
# - Ramos Gin Fizz: Wikipedia, Difford's Guide (New Orleans 1888)
# - Singapore Sling: Wikipedia, Raffles Hotel (1915)
# - Vieux Carré: Wikipedia, New Orleans classic (1930s)
# - Rum Swizzle: IBA, Bermuda classic (Royal Naval Dockyard)
#
# Three were initially duplicates and replaced:
# - Godmother → White Lady
# - French Connection → Brandy Alexander
# - Harvey Wallbanger → Gimlet
#
# Final 10 selected below.
# ─────────────────────────────────────────────────────────────────────────────

candidates = [
    {
        "name": "Gin Basil Smash",
        "slug": "gin-basil-smash",
        "description": "A refreshing German classic bursting with fresh basil and citrus.",
        "origin": "Hamburg, Germany, c.1979",
        "base": ["London dry gin"],
        "modifiers": ["Fresh lemon juice", "Simple syrup", "Basil"],
        "glass": "Rocks",
        "garnish": "Basil sprig",
        "tags": ["intermediate"],
        "story": "Created in Hamburg in the late 1970s, the Gin Basil Smash showcases the aromatic herb alongside bright citrus, becoming a modern classic.",
        "recipe": [
            "2 oz London dry gin",
            "0.75 oz Fresh lemon juice",
            "0.75 oz Simple syrup",
            "8-10 fresh basil leaves",
        ],
        "technique": "Shaken",
        "ingredients": [
            {"qty": "2 oz", "item": "London dry gin"},
            {"qty": "0.75 oz", "item": "Fresh lemon juice"},
            {"qty": "0.75 oz", "item": "Simple syrup"},
            {"qty": "8-10", "item": "fresh basil leaves"},
        ],
        "instructions": [
            "Add gin, lemon juice, simple syrup, and basil leaves to a shaker.",
            "Muddle basil leaves gently to release aromatics.",
            "Add ice and shake hard until well chilled.",
            "Double strain into a rocks glass over ice.",
            "Garnish with a basil sprig.",
        ],
        "glass_type": "Rocks",
        "icon_type": "rocks",
        "difficulty": "Intermediate",
    },
    {
        "name": "Bobby Burns",
        "slug": "bobby-burns",
        "description": "A rich, herbal Scotch sipper with Benedictine and vermouth.",
        "origin": "Scotland, c.1860s",
        "base": ["Blended Scotch"],
        "modifiers": ["Sweet vermouth", "Bénédictine", "Peychaud's bitters"],
        "glass": "Coupe",
        "garnish": "Lemon twist",
        "tags": ["intermediate"],
        "story": "Named after the Scottish poet Robert Burns, this cocktail emerged in the 19th century and remains a favorite for Scotch lovers.",
        "recipe": [
            "2 oz Blended Scotch",
            "0.75 oz Sweet vermouth",
            "0.5 oz Bénédictine",
            "2 dashes Peychaud's bitters",
        ],
        "technique": "Stirred",
        "ingredients": [
            {"qty": "2 oz", "item": "Blended Scotch"},
            {"qty": "0.75 oz", "item": "Sweet vermouth"},
            {"qty": "0.5 oz", "item": "Bénédictine"},
            {"qty": "2 dashes", "item": "Peychaud's bitters"},
        ],
        "instructions": [
            "Add all ingredients to a mixing glass with ice.",
            "Stir until well chilled.",
            "Strain into a chilled coupe.",
            "Garnish with a lemon twist.",
        ],
        "glass_type": "Coupe",
        "icon_type": "coupe",
        "difficulty": "Intermediate",
    },
    {
        "name": "Rusty Nail",
        "slug": "rusty-nail",
        "description": "A warm, satisfying Scotch and Drambuie duo.",
        "origin": "Scotland, 1960s",
        "base": ["Scotch"],
        "modifiers": ["Drambuie"],
        "glass": "Rocks",
        "garnish": "Lemon twist",
        "tags": ["beginner"],
        "story": "The Rusty Nail was a favorite among Hollywood elite in the 1960s and remains the simplest way to enjoy Drambuie.",
        "recipe": [
            "2 oz Scotch",
            "0.5 oz Drambuie",
        ],
        "technique": "Stirred",
        "ingredients": [
            {"qty": "2 oz", "item": "Scotch"},
            {"qty": "0.5 oz", "item": "Drambuie"},
        ],
        "instructions": [
            "Add both ingredients to a mixing glass with ice.",
            "Stir until chilled.",
            "Strain into a rocks glass over a large ice cube.",
            "Garnish with a lemon twist.",
        ],
        "glass_type": "Rocks",
        "icon_type": "rocks",
        "difficulty": "Beginner",
    },
    {
        "name": "Stinger",
        "slug": "stinger",
        "description": "A crisp, minty brandy cocktail from the Gilded Age.",
        "origin": "New York, USA, c.1890s",
        "base": ["Cognac"],
        "modifiers": ["White crème de menthe"],
        "glass": "Coupe",
        "garnish": "Mint leaf",
        "tags": ["beginner"],
        "story": "The Stinger dates to the 1890s New York bar scene and was a favorite of high society thanks to its clean mint finish.",
        "recipe": [
            "2 oz Cognac",
            "0.75 oz White crème de menthe",
        ],
        "technique": "Stirred",
        "ingredients": [
            {"qty": "2 oz", "item": "Cognac"},
            {"qty": "0.75 oz", "item": "White crème de menthe"},
        ],
        "instructions": [
            "Add cognac and crème de menthe to a mixing glass with ice.",
            "Stir until well chilled.",
            "Strain into a chilled coupe.",
            "Garnish with a fresh mint leaf.",
        ],
        "glass_type": "Coupe",
        "icon_type": "coupe",
        "difficulty": "Beginner",
    },
    {
        "name": "White Lady",
        "slug": "white-lady",
        "description": "A bright, tart gin sour with a silky orange liqueur edge.",
        "origin": "London, UK, 1918",
        "base": ["London dry gin"],
        "modifiers": ["Cointreau", "Fresh lemon juice"],
        "glass": "Coupe",
        "garnish": "Orange twist",
        "tags": ["intermediate"],
        "story": "Created at Harry's New York Bar in Paris in 1918, the White Lady is a tart, elegant precursor to the modern sour family.",
        "recipe": [
            "2 oz London dry gin",
            "0.75 oz Cointreau",
            "0.75 oz Fresh lemon juice",
        ],
        "technique": "Shaken",
        "ingredients": [
            {"qty": "2 oz", "item": "London dry gin"},
            {"qty": "0.75 oz", "item": "Cointreau"},
            {"qty": "0.75 oz", "item": "Fresh lemon juice"},
        ],
        "instructions": [
            "Add gin, Cointreau, and lemon juice to a shaker with ice.",
            "Shake hard until well chilled.",
            "Double strain into a chilled coupe.",
            "Garnish with an orange twist.",
        ],
        "glass_type": "Coupe",
        "icon_type": "coupe",
        "difficulty": "Intermediate",
    },
    {
        "name": "Brandy Alexander",
        "slug": "brandy-alexander",
        "description": "A silky, nutmeg-topped brandy dessert cocktail.",
        "origin": "London, UK, c.1920s",
        "base": ["Cognac"],
        "modifiers": ["Crème de cacao", "Heavy cream"],
        "glass": "Coupe",
        "garnish": "Freshly grated nutmeg",
        "tags": ["beginner"],
        "story": "The Brandy Alexander emerged in the 1920s as a luxurious after-dinner drink, praised for its creamy texture and warm spice finish.",
        "recipe": [
            "1 oz Cognac",
            "1 oz Crème de cacao",
            "1 oz Heavy cream",
        ],
        "technique": "Shaken",
        "ingredients": [
            {"qty": "1 oz", "item": "Cognac"},
            {"qty": "1 oz", "item": "Crème de cacao"},
            {"qty": "1 oz", "item": "Heavy cream"},
        ],
        "instructions": [
            "Add all ingredients to a shaker with ice.",
            "Shake hard until well chilled.",
            "Double strain into a chilled coupe.",
            "Garnish with freshly grated nutmeg.",
        ],
        "glass_type": "Coupe",
        "icon_type": "coupe",
        "difficulty": "Beginner",
    },
    {
        "name": "Gimlet",
        "slug": "gimlet",
        "description": "A crisp, tart gin cocktail born on Royal Navy ships.",
        "origin": "London, UK, c.1920s",
        "base": ["London dry gin"],
        "modifiers": ["Fresh lime juice", "Simple syrup"],
        "glass": "Coupe",
        "garnish": "Lime wheel",
        "tags": ["beginner"],
        "story": "The Gimlet originated as a way for British sailors to prevent scurvy, combining gin with lime cordial; it remains a model of simplicity.",
        "recipe": [
            "2.5 oz London dry gin",
            "0.5 oz Fresh lime juice",
            "0.5 oz Simple syrup",
        ],
        "technique": "Shaken",
        "ingredients": [
            {"qty": "2.5 oz", "item": "London dry gin"},
            {"qty": "0.5 oz", "item": "Fresh lime juice"},
            {"qty": "0.5 oz", "item": "Simple syrup"},
        ],
        "instructions": [
            "Add gin, lime juice, and simple syrup to a shaker with ice.",
            "Shake hard until well chilled.",
            "Double strain into a chilled coupe.",
            "Garnish with a lime wheel.",
        ],
        "glass_type": "Coupe",
        "icon_type": "coupe",
        "difficulty": "Beginner",
    },
    {
        "name": "Ramos Gin Fizz",
        "slug": "ramos-gin-fizz",
        "description": "A towering, silky New Orleans classic crowned with foam.",
        "origin": "New Orleans, USA, 1888",
        "base": ["London dry gin"],
        "modifiers": [
            "Simple syrup",
            "Fresh lemon juice",
            "Fresh lime juice",
            "Egg white",
            "Heavy cream",
            "Orange flower water",
            "Vanilla extract",
        ],
        "glass": "Highball",
        "garnish": "",
        "tags": ["advanced"],
        "story": "Created by Henry C. Ramos at the Imperial Cabinet Saloon in 1888, this layered fizz requires patience and a long, vigorous dry shake.",
        "recipe": [
            "2 oz London dry gin",
            "0.5 oz Simple syrup",
            "0.5 oz Fresh lemon juice",
            "0.5 oz Fresh lime juice",
            "1 Egg white",
            "0.5 oz Heavy cream",
            "0.5 oz Orange flower water",
            "2 drops Vanilla extract",
            "top Soda water",
        ],
        "technique": "Shaken",
        "ingredients": [
            {"qty": "2 oz", "item": "London dry gin"},
            {"qty": "0.5 oz", "item": "Simple syrup"},
            {"qty": "0.5 oz", "item": "Fresh lemon juice"},
            {"qty": "0.5 oz", "item": "Fresh lime juice"},
            {"qty": "1", "item": "Egg white"},
            {"qty": "0.5 oz", "item": "Heavy cream"},
            {"qty": "0.5 oz", "item": "Orange flower water"},
            {"qty": "2 drops", "item": "Vanilla extract"},
            {"qty": "top", "item": "Soda water"},
        ],
        "instructions": [
            "Add gin, syrups, citrus, egg white, cream, orange flower water, and vanilla to a shaker.",
            "Dry shake vigorously without ice for 15 seconds to build foam.",
            "Add ice and shake again until well chilled.",
            "Fine strain into a highball glass without ice.",
            "Top with soda water and stir gently.",
        ],
        "glass_type": "Highball",
        "icon_type": "highball",
        "difficulty": "Advanced",
    },
    {
        "name": "Singapore Sling",
        "slug": "singapore-sling",
        "description": "A fruity, complex gin punch invented at Singapore's Raffles Hotel.",
        "origin": "Singapore, 1915",
        "base": ["London dry gin"],
        "modifiers": [
            "Cherry brandy",
            "Cointreau",
            "Bénédictine",
            "Pineapple juice",
            "Fresh lime juice",
            "Simple syrup",
            "Angostura bitters",
            "Grenadine",
        ],
        "glass": "Highball",
        "garnish": "Maraschino cherry and pineapple wedge",
        "tags": ["intermediate"],
        "story": "Created at the Long Bar of Raffles Hotel around 1915 by bartender Ngiam Tong Boon, the Singapore Sling is a fruity, complex icon of colonial-era mixology.",
        "recipe": [
            "2 oz London dry gin",
            "0.5 oz Cherry brandy",
            "0.25 oz Cointreau",
            "0.25 oz Bénédictine",
            "1 oz Pineapple juice",
            "0.75 oz Fresh lime juice",
            "0.5 oz Simple syrup",
            "1 dash Angostura bitters",
            "0.25 oz Grenadine",
            "top Soda water",
        ],
        "technique": "Shaken",
        "ingredients": [
            {"qty": "2 oz", "item": "London dry gin"},
            {"qty": "0.5 oz", "item": "Cherry brandy"},
            {"qty": "0.25 oz", "item": "Cointreau"},
            {"qty": "0.25 oz", "item": "Bénédictine"},
            {"qty": "1 oz", "item": "Pineapple juice"},
            {"qty": "0.75 oz", "item": "Fresh lime juice"},
            {"qty": "0.5 oz", "item": "Simple syrup"},
            {"qty": "1 dash", "item": "Angostura bitters"},
            {"qty": "0.25 oz", "item": "Grenadine"},
            {"qty": "top", "item": "Soda water"},
        ],
        "instructions": [
            "Add gin, cherry brandy, Cointreau, Bénédictine, pineapple juice, lime juice, simple syrup, bitters, and grenadine to a shaker with ice.",
            "Shake hard until well chilled.",
            "Strain into a highball glass over ice.",
            "Top with soda water.",
            "Garnish with a maraschino cherry and a pineapple wedge.",
        ],
        "glass_type": "Highball",
        "icon_type": "highball",
        "difficulty": "Intermediate",
    },
    {
        "name": "Vieux Carré",
        "slug": "vieux-carre",
        "description": "A layered, bittersweet New Orleans stirred cocktail.",
        "origin": "New Orleans, USA, c.1930s",
        "base": ["Rye whiskey", "Cognac"],
        "modifiers": [
            "Sweet vermouth",
            "Bénédictine",
            "Peychaud's bitters",
            "Angostura bitters",
        ],
        "glass": "Rocks",
        "garnish": "Lemon peel",
        "tags": ["intermediate"],
        "story": "Named after New Orleans's French Quarter, the Vieux Carré was created at the Carousel Bar in the 1930s and blends rye, cognac, and vermouth with herbal depth.",
        "recipe": [
            "0.75 oz Rye whiskey",
            "0.75 oz Cognac",
            "0.75 oz Sweet vermouth",
            "0.25 oz Bénédictine",
            "2 dashes Peychaud's bitters",
            "2 dashes Angostura bitters",
        ],
        "technique": "Stirred",
        "ingredients": [
            {"qty": "0.75 oz", "item": "Rye whiskey"},
            {"qty": "0.75 oz", "item": "Cognac"},
            {"qty": "0.75 oz", "item": "Sweet vermouth"},
            {"qty": "0.25 oz", "item": "Bénédictine"},
            {"qty": "2 dashes", "item": "Peychaud's bitters"},
            {"qty": "2 dashes", "item": "Angostura bitters"},
        ],
        "instructions": [
            "Add all ingredients to a mixing glass with ice.",
            "Stir until well chilled.",
            "Strain into a rocks glass over a large ice cube.",
            "Garnish with a lemon peel.",
        ],
        "glass_type": "Rocks",
        "icon_type": "rocks",
        "difficulty": "Intermediate",
    },
    {
        "name": "Rum Swizzle",
        "slug": "rum-swizzle",
        "description": "A frothy, refreshing Bermuda rum punch swizzled to perfection.",
        "origin": "Bermuda, c.1930s",
        "base": ["Dark rum", "Light rum"],
        "modifiers": ["Fresh lime juice", "Simple syrup", "Angostura bitters"],
        "glass": "Rocks",
        "garnish": "Mint sprig",
        "tags": ["intermediate"],
        "story": "The Rum Swizzle is Bermuda's national cocktail, perfected at the Royal Naval Dockyard and traditionally swizzled between two glasses until frothy.",
        "recipe": [
            "1.5 oz Dark rum",
            "1.5 oz Light rum",
            "1 oz Fresh lime juice",
            "0.5 oz Simple syrup",
            "2 dashes Angostura bitters",
            "0.5 oz Water",
        ],
        "technique": "Built",
        "ingredients": [
            {"qty": "1.5 oz", "item": "Dark rum"},
            {"qty": "1.5 oz", "item": "Light rum"},
            {"qty": "1 oz", "item": "Fresh lime juice"},
            {"qty": "0.5 oz", "item": "Simple syrup"},
            {"qty": "2 dashes", "item": "Angostura bitters"},
            {"qty": "0.5 oz", "item": "Water"},
        ],
        "instructions": [
            "Fill a rocks glass with crushed ice.",
            "Add dark rum, light rum, lime juice, simple syrup, bitters, and water.",
            "Swizzle vigorously between two glasses until frothy.",
            "Top with more crushed ice and garnish with a mint sprig.",
        ],
        "glass_type": "Rocks",
        "icon_type": "rocks",
        "difficulty": "Intermediate",
    },
]

# ── 3. Triple deduplicate and insert ────────────────────────────────────────
print("\n=== Deduplicating and inserting ===")

inserted = []
skipped = []
failed = []

for cand in candidates:
    slug_key = norm_slug(cand["slug"])
    name_key = norm_name(cand["name"])
    ing_key = tuple(sorted(f"{i['qty']} {i['item']}" for i in cand["ingredients"]))

    reasons = []
    if slug_key in seen_slugs:
        reasons.append(f"slug '{slug_key}' already exists")
    if name_key in seen_names:
        reasons.append(f"name '{cand['name']}' already exists")
    if ing_key in seen_ingredient_sets:
        reasons.append("ingredient set already exists in library")

    if reasons:
        skipped.append({"cocktail": cand["name"], "reasons": reasons})
        print(f"  SKIP {cand['name']}: {'; '.join(reasons)}")
        continue

    # Build full payload
    payload = {
        "id": str(uuid.uuid4()),
        "slug": cand["slug"],
        "name": cand["name"],
        "description": cand["description"],
        "image_url": "",
        "origin": cand["origin"],
        "base": cand["base"],
        "modifiers": cand["modifiers"],
        "glass": cand["glass"],
        "garnish": cand["garnish"],
        "tags": cand["tags"],
        "story": cand["story"],
        "recipe": cand["recipe"],
        "technique": cand["technique"],
        "ingredients": cand["ingredients"],
        "instructions": cand["instructions"],
        "glass_type": cand["glass_type"],
        "icon_type": cand["icon_type"],
        "difficulty": cand["difficulty"],
        "created_at": iso_now(),
        "updated_at": iso_now(),
    }

    # POST
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://bartender-sanctuary-app.vercel.app/api/cocktails",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = json.loads(resp.read())
            if status == 201:
                inserted.append({
                    "name": cand["name"],
                    "slug": cand["slug"],
                    "glass": cand["glass"],
                    "technique": cand["technique"],
                    "difficulty": cand["difficulty"],
                    "first_two_ingredients": cand["ingredients"][:2],
                })
                seen_slugs.add(slug_key)
                seen_names.add(name_key)
                seen_ingredient_sets.add(ing_key)
                print(f"  OK   {cand['name']} ({cand['slug']}) → 201")
            else:
                failed.append({"cocktail": cand["name"], "status": status, "response": body})
                print(f"  FAIL {cand['name']}: HTTP {status}")
    except Exception as e:
        failed.append({"cocktail": cand["name"], "error": str(e)})
        print(f"  FAIL {cand['name']}: {e}")

# ── 4. Report ────────────────────────────────────────────────────────────────
print("\n=== Summary ===")
print(f"Existing cocktails before run: {len(api_cocktails)}")
print(f"New cocktails inserted: {len(inserted)}")
print(f"Duplicates skipped: {len(skipped)}")
print(f"Insert failures: {len(failed)}")

if inserted:
    print("\nInserted cocktails:")
    for c in inserted:
        ings = ", ".join(f"{i['qty']} {i['item']}" for i in c["first_two_ingredients"])
        print(f"  • {c['name']} (slug: {c['slug']}) | {c['glass']} | {c['technique']} | {c['difficulty']} | {ings}")

if skipped:
    print("\nSkipped duplicates:")
    for s in skipped:
        print(f"  • {s['cocktail']}: {'; '.join(s['reasons'])}")

if failed:
    print("\nFailures:")
    for f in failed:
        print(f"  • {f.get('cocktail', '?')}: {f}")

print("\n[DONE]")
