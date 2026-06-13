import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
INGREDIENTS = BASE / "data" / "ingredients.ts"
QUEUE_FILE = BASE / "scripts" / "bottle-queue.json"
MAINTENANCE_LOG = BASE / "scripts" / "maintenance_log.json"


def load_ingredients() -> str:
    return INGREDIENTS.read_text(encoding="utf-8")


def save_ingredients(text: str) -> None:
    INGREDIENTS.write_text(text, encoding="utf-8")


def parse_ingredients(text: str):
    ingredients = []
    # Match each ingredient object; capture everything after `bottles: [` to the matching `]`
    pattern = re.compile(r"\{\s*name:\s*\"(?P<name>.+?)\",\s*category:\s*\"(?P<category>.+?)\",\s*description:\s*\".+?\",\s*brands:\s*\[(?P<brands>.+?)\],\s*notes:\s*\".*?\"(?:,\s*bottles:\s*(?P<bottles>\[.+?\])\s*)?\}", re.DOTALL)
    for m in pattern.finditer(text):
        name = m.group("name")
        category = m.group("category")
        brands_raw = m.group("brands")
        brands = re.findall(r"\"([^\"]+)\"", brands_raw)
        bottles_raw = m.group("bottles") or ""
        bottles = []
        # Split bottle objects crudely: each starts with `{ name:`
        if bottles_raw.strip():
            bottle_pattern = re.compile(r"\{\s*name:\s*\"(?P<name>[^\"]+)\",\s*description:\s*\"(?P<desc>[^\"]*)\",\s*related:\s*\[(?P<related>.+?)\],\s*image:\s*\"(?P<image>[^\"]*)\"\s*\}")
            for b in bottle_pattern.finditer(bottles_raw):
                bottles.append({
                    "name": b.group("name"),
                    "description": b.group("desc"),
                    "related": re.findall(r"\"([^\"]+)\"", b.group("related")),
                    "image": b.group("image"),
                })
        ingredients.append({
            "name": name,
            "category": category,
            "brands": brands,
            "bottles": bottles,
        })
    return ingredients


def build_bottle_entry(bottle: dict) -> str:
    name = bottle["name"].replace('"', '\\"')
    desc = bottle["description"].replace('"', '\\"')
    related = json.dumps(bottle["related"], ensure_ascii=False)
    image = bottle["image"].replace('"', '\\"')
    return f'    {{ name: "{name}", description: "{desc}", related: {related}, image: "{image}" }}'


def find_closing_brace(text: str, start: int) -> int:
    depth = 1
    i = start
    while i < len(text) and depth > 0:
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return -1


def enrich_bottle(text: str, ingredient_name: str, bottle: dict) -> str:
    pattern = re.compile(r"\{\s*name:\s*\"" + re.escape(ingredient_name) + r"\"")
    match = None
    for m in pattern.finditer(text):
        match = m
        break
    if not match:
        return text
    start = match.start()
    end = find_closing_brace(text, match.end() - 1)
    if end == -1:
        return text
    block = text[start:end]
    bname = bottle["name"]
    # Find existing bottle entry
    bpattern = re.compile(r"\{\s*name:\s*\"" + re.escape(bname) + r"\",\s*description:\s*\".*?\",\s*related:\s*\[.*?\],\s*image:\s*\".*?\"\s*\}")
    bmatch = bpattern.search(block)
    if not bmatch:
        return text
    old_entry = bmatch.group(0)
    new_entry = build_bottle_entry(bottle)
    if old_entry == new_entry:
        return text
    new_block = block[:bmatch.start()] + new_entry + block[bmatch.end():]
    return text[:start] + new_block + text[end:]


def process_enrichments() -> dict:
    if not QUEUE_FILE.exists():
        return {"status": "error", "message": "bottle-queue.json not found"}
    queue = json.loads(QUEUE_FILE.read_text(encoding="utf-8"))
    text = load_ingredients()
    updated = 0
    for ingredient_name, bottles in queue.items():
        for bottle in bottles:
            before = text
            text = enrich_bottle(text, ingredient_name, bottle)
            if text != before:
                updated += 1
                save_ingredients(text)
                return {"status": "enriched", "bottle": bottle["name"], "ingredient": ingredient_name}
    return {"status": "queue_empty"}


if __name__ == "__main__":
    print(process_enrichments())
