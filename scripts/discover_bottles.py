import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
INGREDIENTS = BASE / "data" / "ingredients.ts"
DISCOVERED = BASE / "scripts" / "discovered_bottles.json"

# Brand expansions per ingredient — brand -> bottle candidates
# Format: { ingredient_name: { brand: [candidate_bottle_names] } }
# Only brands that appear in the ingredient's brand list but have no bottle yet will be queued.
BRAND_EXPANSIONS = {
  "Bourbon": {
    "Maker's Mark": ["Maker's Mark 46", "Maker's Mark Private Select"],
    "Woodford Reserve": ["Woodford Reserve Double Oaked", "Woodford Reserve Bourbon"],
    "Bulleit Bourbon": ["Bulleit Bourbon", "Bulleit Rye (already queued under Rye)"],
    "Wild Turkey 101": ["Wild Turkey 101", "Wild Turkey Rare Breed"],
    "Four Roses Small Batch": ["Four Roses Small Batch", "Four Roses Single Barrel"],
  },
  "Rye whiskey": {
    "WhistlePig 10": ["WhistlePig 10 Year", "WhistlePig 12 Year"],
    "Bulleit Rye": ["Bulleit Rye Whiskey"],
    "Wild Turkey Rye": ["Wild Turkey Rye (if distinct from 101)"],
  },
  "Aged rum": {
    "Mount Gay XO": ["Mount Gay XO"],
    "Zacapa 23": ["Ron Zacapa 23"],
    "Flor de Caña 7": ["Flor de Caña 7 Year", "Flor de Caña 12 Year"],
  },
  "Dark rum": {
    "Myers's Original Dark": ["Myers's Original Dark"],
    "Plantation XO": ["Plantation XO 20th Anniversary"],
  },
  "London dry gin": {
    "Beefeater London Dry": ["Beefeater London Dry", "Beefeater 24"],
    "Bombay Sapphire": ["Bombay Sapphire", "Bombay Sapphire East"],
    "Plymouth": ["Plymouth Gin"],
    "Sipsmith VJS": ["Sipsmith London Dry"],
  },
  "Blended scotch": {
    "Dewar's 12": ["Dewar's 12 Year", "Dewar's White Label"],
    "Cutty Sark": ["Cutty Sark Original"],
  },
  "Tequila": {
    "Patrón Silver": ["Patrón Silver", "Patrón Reposado", "Patrón Añejo"],
    "Casamigos Reposado": ["Casamigos Reposado", "Casamigos Blanco"],
    "Casa Noble Reposado": ["Casa Noble Reposado", "Casa Noble Añejo"],
  },
  "Blanco tequila": {
    "Patrón Silver": ["Patrón Silver ( Blanco )"],
    "Espolòn Blanco": ["Espolòn Blanco"],
    "Casamigos Blanco": ["Casamigos Blanco"],
  },
  "Vodka": {
    "Grey Goose": ["Grey Goose Vodka", "Grey Goose VX"],
    "Ketel One": ["Ketel One Vodka"],
    "Tito's": ["Tito's Handmade Vodka"],
    "Stolichnaya": ["Stolichnaya Elit"],
    "Cîroc": ["Ciroc Vodka"],
    "Absolut": ["Absolut Vodka", "Absolut Elyx"],
  },
  "Campari": {
    "Campari": ["Campari Bitter", "Campari Soda"],
  },
  "Orange liqueur": {
    "Combier": ["Combier Triple Sec"],
    "Marie Brizard": ["Marie Brizard Triple Sec", "Marie Brizard Orange Curaçao"],
    "Bols": ["Bols Triple Sec"],
    "DeKuyper": ["DeKuyper Triple Sec"],
  },
  "Amontillado sherry": {
    "Gonzalez Byass Amontillado": ["González Byass Amontillado"],
  },
  "Sweet vermouth": {
    "Martini & Rossi Rosso": ["Martini & Rossi Rosso", "Martini & Rossi Riserva Speciale Rubino"],
    "Cinzano Rosso": ["Cinzano Rosso"],
    "Dolin Sweet": ["Dolin Sweet Vermouth"],
  },
  "Dry vermouth": {
    "Martini & Rossi Dry": ["Martini & Rossi Dry"],
    "Dolin Dry": ["Dolin Dry Vermouth"],
  },
  "Fino sherry": {
    "Lustau Fino": ["Lustau Fino", "Lustau Manzanilla"],
    "Gonzalez Byass Fino": ["González Byass Fino", "Tío Pepe Fino"],
  },
  "Prosecco": {
    "Santa Margherita": ["Santa Margherita Prosecco"],
    "La Marca": ["La Marca Prosecco"],
    "Bisol Jeio": ["Bisol Crede Prosecco"],
  },
  "Champagne": {
    "Veuve Clicquot Yellow Label": ["Veuve Clicquot Brut Yellow Label"],
    "Ruinart Blanc de Blancs": ["Ruinart Blanc de Blancs"],
    "Bollinger Special Cuvée": ["Bollinger Special Cuvée"],
  },
  "Orange curaçao": {
    "Bols Orange Curaçao": ["Bols Orange Curaçao"],
    "Marie Brizard Orange Curaçao": ["Marie Brizard Orange Curaçao"],
  },
}


def load_ingredients() -> str:
    return INGREDIENTS.read_text(encoding="utf-8")


def parse_ingredients(text: str):
    # Returns list of { name, category, brands, bottles }
    # We use a simple regex-based parser suitable for this file format.
    ingredients = []
    pattern = re.compile(r"\{\s*name:\s*\"(?P<name>.+?)\",\s*category:\s*\"(?P<category>.+?)\",\s*description:\s*\".+?\",\s*brands:\s*\[(?P<brands>.+?)\],\s*notes:\s*\".*?\"(?:,\s*bottles:\s*\[(?P<bottles>.+?)\]\s*)?\}", re.DOTALL)
    for m in pattern.finditer(text):
        name = m.group("name")
        category = m.group("category")
        brands_raw = m.group("brands")
        brands = re.findall(r"\"([^\"]+)\"", brands_raw)
        bottles_raw = m.group("bottles") or ""
        bottle_names = re.findall(r"name:\s*\"([^\"]+)\"", bottles_raw)
        ingredients.append({
            "name": name,
            "category": category,
            "brands": brands,
            "bottles": bottle_names,
        })
    return ingredients


def discover() -> dict:
    text = load_ingredients()
    ingredients = parse_ingredients(text)
    name_to_ing = {ing["name"]: ing for ing in ingredients}

    new_items = []
    seen = set()
    for ingredient_name, expansions in BRAND_EXPANSIONS.items():
        ing = name_to_ing.get(ingredient_name)
        if not ing:
            continue
        existing = set(ing["bottles"])
        for brand, candidates in expansions.items():
            # If brand is in the ingredient's brand list and no bottle from this brand exists yet
            brand_in_ing = any(b.lower() == brand.lower() for b in ing["brands"])
            if not brand_in_ing:
                continue
            already_covered = any(
                any(c.lower() == b.lower() for b in ing["brands"])
                for c in candidates
                if c in existing
            )
            if already_covered:
                continue
            # Pick first candidate that isn't already present
            chosen = None
            for c in candidates:
                key = f"{ingredient_name}::{c}"
                if key not in seen and c not in existing:
                    chosen = c
                    break
            if not chosen:
                continue
            seen.add(f"{ingredient_name}::{chosen}")
            new_items.append({
                "ingredient_name": ingredient_name,
                "bottle_name": chosen,
                "brand": brand,
                "status": "needs_enrichment",
            })

    # Load previous discoveries so we don't re-emit
    if DISCOVERED.exists():
        prev = json.loads(DISCOVERED.read_text(encoding="utf-8"))
    else:
        prev = []

    merged = {f"{x['ingredient_name']}::{x['bottle_name']}": x for x in prev}
    for item in new_items:
        key = f"{item['ingredient_name']}::{item['bottle_name']}"
        merged.setdefault(key, item)

    DISCOVERED.write_text(json.dumps(list(merged.values()), indent=2, ensure_ascii=False), encoding="utf-8")
    return {"status": "ok", "discovered": len(new_items), "total_known": len(merged)}


if __name__ == "__main__":
    print(discover())
