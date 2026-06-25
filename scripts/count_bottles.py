#!/usr/bin/env python3
"""Verify bottle counts per ingredient in data/ingredients.ts.

Usage:
    python scripts/count_bottles.py [ingredient_name]

If ingredient_name is provided, prints detailed bottle list for that ingredient.
Otherwise prints all ingredients sorted by bottle count.

NOTE: This script uses the brace-fragment method (see references/ingredients-bottle-counting.md)
because naive regex fails on this file's nested brackets and mixed formatting.
"""

import re
import sys
from pathlib import Path


def count_bottles(content: str) -> dict[str, int]:
    """Return mapping of ingredient name -> bottle count using brace-fragment parsing."""
    ingredients = {}
    # Match each top-level ingredient block by requiring the `category:` anchor
    # then walk braces to find the full block, then locate bottles: [...] and count { name: fragments
    for m in re.finditer(r'\{\s*name:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"', content):
        name = m.group(1)
        start = m.start()
        depth = 0
        i = start
        while i < len(content):
            if content[i] == '{':
                depth += 1
            elif content[i] == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        block = content[start:i + 1]

        m2 = re.search(r'bottles:\s*\[', block)
        if not m2:
            ingredients[name] = 0
            continue
        arr_start = m2.end()
        d = 1
        j = arr_start
        while j < len(block):
            if block[j] == '[':
                d += 1
            elif block[j] == ']':
                d -= 1
                if d == 0:
                    break
            j += 1
        bottles_block = block[arr_start:j]
        count = 0
        pos = 0
        while True:
            brace = bottles_block.find('{', pos)
            if brace == -1:
                break
            sub = 1
            k = brace + 1
            while k < len(bottles_block):
                if bottles_block[k] == '{':
                    sub += 1
                elif bottles_block[k] == '}':
                    sub -= 1
                    if sub == 0:
                        break
                k += 1
            if 'name:' in bottles_block[brace:k + 1]:
                count += 1
            pos = k + 1
        ingredients[name] = count
    return ingredients


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    ts_path = root / "data" / "ingredients.ts"
    content = ts_path.read_text()

    ingredients = count_bottles(content)

    if len(sys.argv) > 1:
        query = sys.argv[1]
        matches = [n for n in ingredients if query.lower() in n.lower()]
        if not matches:
            print(f"No ingredient matching '{query}' found.")
            sys.exit(1)
        for name in matches:
            print(f"{ingredients[name]:3d} | {name}")
    else:
        for name, count in sorted(ingredients.items(), key=lambda x: x[1], reverse=True):
            print(f"{count:3d} | {name}")


if __name__ == "__main__":
    main()
