import requests, json, os, sys

BASE = "https://bartender-sanctuary-app.vercel.app"
COCKTAIL_URL = f"{BASE}/api/cocktails"

with open(os.path.expanduser("~/Desktop/NeonDbPass")) as f:
    DB_PASS = f.read().strip()

# Load new cocktails from JSON
with open("scripts/new-cocktails.json") as f:
    cocktails = json.load(f)

print(f"Loaded {len(cocktails)} cocktails from new-cocktails.json")

# Verify API is reachable
try:
    r = requests.get(f"{BASE}/api/cocktails", timeout=10)
    print(f"API check: {r.status_code}")
    r.raise_for_status()
    existing = r.json()
    existing_slugs = {c['slug'] for c in existing}
    print(f"Existing cocktails in DB: {len(existing_slugs)}")
except Exception as e:
    print(f"API check failed: {e}")
    sys.exit(1)

# Filter out any that might already exist
new_cocktails = [c for c in cocktails if c['slug'] not in existing_slugs]
print(f"To insert: {len(new_cocktails)}")

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
print(f"DB now has approximately {len(existing_slugs) + inserted} cocktails")
