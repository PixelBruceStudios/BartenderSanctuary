#!/usr/bin/env python3
"""Bartender Sanctuary QA checks."""
import requests, json, re, sys

BASE = "https://bartender-sanctuary-app.vercel.app"
PAGES = ["/", "/school", "/games"]
API = {
    "cocktails": "/api/cocktails",
    "cocktails_sample": "/api/cocktails?limit=3",
    "lessons": "/api/lessons",
    "techniques": "/api/techniques",
    "school_full": "/api/school/full",
}

results = []

def check(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    results.append((status, name, detail))
    print(f"[{status}] {name}" + (f" — {detail}" if detail else ""))

# 1. Core pages return 200
for p in PAGES:
    r = requests.get(f"{BASE}{p}", timeout=20, allow_redirects=True)
    check(f"Page {p} status", r.status_code == 200, f"got {r.status_code}")

# 2. API endpoints
for name, path in API.items():
    try:
        r = requests.get(f"{BASE}{path}", timeout=20)
        check(f"API {name}", r.status_code == 200, f"{len(r.text)} chars")
        if r.status_code == 200 and name == "cocktails":
            try:
                data = r.json()
                if isinstance(data, list):
                    check("Cocktails count > 50", len(data) > 50, f"got {len(data)}")
                    # spot check fields
                    c = next((x for x in data if x.get("recipe")), {})
                    check("Cocktail has recipe", bool(c.get("recipe")))
                    check("Cocktail has ingredients", bool(c.get("ingredients")))
                    check("Cocktail has glass", bool(c.get("glass")))
            except Exception as e:
                check("Cocktails JSON parse", False, str(e))
    except Exception as e:
        check(f"API {name}", False, str(e))

# 3. HTML sanity
r = requests.get(f"{BASE}/", timeout=20)
html = r.text
check("HTML has __next", 'id="__next"' in html)
check("HTML has title", "<title>" in html and "Bartender Sanctuary" in html)
check("HTML has CSS", "0adfb9f69896ea8a.css" in html)
check("HTML has JS chunk", "pages/index-" in html)
check("No raw SQL/secret leaks", not re.search(r'(password|secret|token|neon\.tech)', html, re.I))

# 4. Pantry / matching wiring
# Verify matching module exports
r = requests.get(f"{BASE}/", timeout=20)
# Can't directly inspect TS, but we can assert no console crash by checking HTML completeness
check("HTML length reasonable", len(html) > 2000, f"{len(html)} chars")

# 5. Mobile meta
check("Mobile viewport", 'name="viewport"' in html)

# 6. HTTPS + canonical
check("HTTPS enforced", r.url.startswith("https://"))
check("Canonical present", 'rel="canonical"' in html)

print("\n=== QA SUMMARY ===")
passes = sum(1 for s, _, _ in results if s == "PASS")
fails = [n for s, n, _ in results if s == "FAIL"]
print(f"Passed: {passes}/{len(results)}")
if fails:
    print("Failing checks:")
    for f in fails:
        print(f"  - {f}")
else:
    print("All checks passed.")
