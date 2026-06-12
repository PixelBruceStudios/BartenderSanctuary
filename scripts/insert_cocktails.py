import requests, json, os, sys

BASE = "https://bartender-sanctuary-app.vercel.app"
COCKTAIL_URL = f"{BASE}/api/cocktails"

with open(os.path.expanduser("~/Desktop/NeonDbPass")) as f:
    DB_PASS = f.read().strip()

cocktails = [
  {
    "slug": "old-fashioned",
    "name": "Old Fashioned",
    "description": "The original cocktail. Whiskey, sugar, bitters, and nothing else. Stirred, not shaken.",
    "image_url": "",
    "ingredients": [
      {"item": "Bourbon or rye whiskey", "qty": "2 oz"},
      {"item": "Sugar cube", "qty": "1"},
      {"item": "Angostura bitters", "qty": "2 dashes"},
      {"item": "Orange bitters", "qty": "1 dash (optional)"},
      {"item": "Orange peel", "qty": "for garnish"}
    ],
    "instructions": [
      "Place sugar cube in rocks glass.",
      "Add bitters and a splash of water; muddle until dissolved.",
      "Fill with ice and add whiskey.",
      "Stir 20–30 seconds until well-chilled.",
      "Express orange peel over glass and garnish."
    ],
    "glass_type": "Rocks",
    "garnish": "Orange peel",
    "difficulty": "Beginner"
  },
  {
    "slug": "martini",
    "name": "Martini",
    "description": "Gin and vermouth in a cold, stirred embrace. The benchmark of elegance.",
    "image_url": "",
    "ingredients": [
      {"item": "London dry gin", "qty": "2.5 oz"},
      {"item": "Dry vermouth", "qty": "0.5 oz"},
      {"item": "Lemon twist or olive", "qty": "for garnish"}
    ],
    "instructions": [
      "Chill mixing glass and bar spoon.",
      "Add gin and vermouth over ice.",
      "Stir 30 seconds until very cold.",
      "Strain into coupe and garnish."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist or olive",
    "difficulty": "Beginner"
  },
  {
    "slug": "manhattan",
    "name": "Manhattan",
    "description": "Rye whiskey, sweet vermouth, and bitters. A drink with gravitas since the 1870s.",
    "image_url": "",
    "ingredients": [
      {"item": "Rye whiskey", "qty": "2 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Angostura bitters", "qty": "2 dashes"},
      {"item": "Brandied cherry", "qty": "for garnish"}
    ],
    "instructions": [
      "Combine all ingredients with ice in mixing glass.",
      "Stir until well-chilled.",
      "Strain into coupe.",
      "Garnish with brandied cherry."
    ],
    "glass_type": "Coupe",
    "garnish": "Brandied cherry",
    "difficulty": "Beginner"
  },
  {
    "slug": "daiquiri",
    "name": "Daiquiri",
    "description": "Not the frozen slush — the real one is shaken, fresh, and sharp.",
    "image_url": "",
    "ingredients": [
      {"item": "White rum", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.75 oz"},
      {"item": "Lime wheel", "qty": "for garnish"}
    ],
    "instructions": [
      "Add rum, lime, and syrup to shaker with ice.",
      "Shake hard until tin is frosted.",
      "Double strain into coupe.",
      "Garnish with lime wheel."
    ],
    "glass_type": "Coupe",
    "garnish": "Lime wheel",
    "difficulty": "Beginner"
  },
  {
    "slug": "margarita",
    "name": "Margarita",
    "description": "Tequila, lime, and a salted rim. Mexico's gift to the world.",
    "image_url": "",
    "ingredients": [
      {"item": "Blanco tequila", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "1 oz"},
      {"item": "Triple sec or Cointreau", "qty": "0.5 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz"},
      {"item": "Salt", "qty": "for rim"}
    ],
    "instructions": [
      "Run lime wedge around half of rim; dip in salt.",
      "Add tequila, lime, triple sec, and syrup to shaker with ice.",
      "Shake hard.",
      "Fill rocks glass with ice and strain in.",
      "Garnish with lime wheel."
    ],
    "glass_type": "Rocks",
    "garnish": "Lime wheel",
    "difficulty": "Beginner"
  },
  {
    "slug": "negroni",
    "name": "Negroni",
    "description": "Bittersweet, bold, and equal-parts iconic. Campari, gin, and vermouth.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "1 oz"},
      {"item": "Campari", "qty": "1 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Orange peel", "qty": "for garnish"}
    ],
    "instructions": [
      "Add all ingredients to mixing glass with ice.",
      "Stir until well-chilled.",
      "Strain over one large ice cube in rocks glass.",
      "Express orange peel and garnish."
    ],
    "glass_type": "Rocks",
    "garnish": "Orange peel",
    "difficulty": "Beginner"
  },
  {
    "slug": "mojito",
    "name": "Mojito",
    "description": "Havana's highball. White rum, mint, lime, and soda.",
    "image_url": "",
    "ingredients": [
      {"item": "White rum", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.75 oz"},
      {"item": "Fresh mint leaves", "qty": "8–10"},
      {"item": "Soda water", "qty": "top"}
    ],
    "instructions": [
      "Gently muddle mint with lime juice and syrup.",
      "Add rum and fill glass with crushed ice.",
      "Top with soda water.",
      "Stir gently and garnish with mint sprig."
    ],
    "glass_type": "Highball",
    "garnish": "Mint sprig",
    "difficulty": "Beginner"
  },
  {
    "slug": "cosmopolitan",
    "name": "Cosmopolitan",
    "description": "Vodka, triple sec, lime, and cranberry. Pink, tart, and perfectly balanced.",
    "image_url": "",
    "ingredients": [
      {"item": "Citrus vodka", "qty": "1.5 oz"},
      {"item": "Triple sec or Cointreau", "qty": "1 oz"},
      {"item": "Fresh lime juice", "qty": "0.75 oz"},
      {"item": "Cranberry juice", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Add all ingredients to shaker with ice.",
      "Shake hard until tin is frosty.",
      "Double strain into coupe.",
      "Garnish with orange twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Orange twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "whiskey-sour",
    "name": "Whiskey Sour",
    "description": "Whiskey, lemon, sugar, shaken hard. A foundational sour from 1862.",
    "image_url": "",
    "ingredients": [
      {"item": "Bourbon", "qty": "2 oz"},
      {"item": "Fresh lemon juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.75 oz"},
      {"item": "Egg white", "qty": "1 (optional)"}
    ],
    "instructions": [
      "Dry shake all ingredients without ice.",
      "Add ice and shake again until chilled.",
      "Double strain into rocks glass over ice.",
      "Garnish with Angostura bitters on foam."
    ],
    "glass_type": "Rocks",
    "garnish": "Lemon slice / cherry",
    "difficulty": "Beginner"
  },
  {
    "slug": "tom-collins",
    "name": "Tom Collins",
    "description": "Tall, refreshing, and slightly deceptive. Gin, lemon, sugar, and soda.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "2 oz"},
      {"item": "Fresh lemon juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.75 oz"},
      {"item": "Soda water", "qty": "3–4 oz"}
    ],
    "instructions": [
      "Add gin, lemon, and syrup to shaker with ice.",
      "Shake and strain into highball over ice.",
      "Top with soda water.",
      "Garnish with lemon slice and cherry."
    ],
    "glass_type": "Highball",
    "garnish": "Lemon slice / cherry",
    "difficulty": "Beginner"
  },
  {
    "slug": "milk-punch",
    "name": "Milk Punch",
    "description": "Clarified milk-wash punch. Silky, shelf-stable, and historic.",
    "image_url": "",
    "ingredients": [
      {"item": "Bourbon", "qty": "1.5 oz"},
      {"item": "Dark rum", "qty": "1.5 oz"},
      {"item": "Fresh lemon juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.75 oz"},
      {"item": "Whole milk", "qty": "3–4 oz"}
    ],
    "instructions": [
      "Combine spirit, citrus, and syrup.",
      "Add milk slowly while stirring.",
      "Let rest 30 minutes for curds to form.",
      "Strain through cheesecloth or coffee filter twice.",
      "Serve over ice, grated nutmeg on top."
    ],
    "glass_type": "Coupe",
    "garnish": "Nutmeg grate",
    "difficulty": "Intermediate"
  }
]

# These 11 are already in DB; we'll skip them in insertion below.
existing_slugs = {c["slug"] for c in cocktails}
new_cocktails = [c for c in cocktails if c["slug"] not in existing_slugs]

print(f"Total prepared: {len(cocktails)}")
print(f"Already in DB: {len(existing_slugs)}")
print(f"To insert now: {len(new_cocktails)}")

# Verify API is reachable
try:
    r = requests.get(f"{BASE}/api/cocktails", timeout=10)
    print(f"API check: {r.status_code}")
    r.raise_for_status()
except Exception as e:
    print(f"API check failed: {e}")
    sys.exit(1)

# Insert
inserted = 0
for c in new_cocktails:
    try:
        r = requests.post(COCKTAIL_URL, json=c, timeout=15)
        if r.status_code == 201:
            inserted += 1
            print(f"OK: {c['name']}")
        else:
            print(f"FAIL {c['name']}: {r.status_code} {r.text[:200]}")
    except Exception as e:
        print(f"ERR {c['name']}: {e}")

print(f"\nInserted {inserted}/{len(new_cocktails)}")
