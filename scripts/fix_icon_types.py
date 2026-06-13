import re
from pathlib import Path

path = Path('/home/skicmi/bartender-sanctuary-app/data/cocktails.ts')
text = path.read_text()

# Mapping: glass text -> icon_type
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

def normalize_glass(g: str) -> str:
    return g.strip().lower()

# Extract each object block (simple brace count)
objects = []
start = text.index('export const cocktails: Cocktail[] = [') + len('export const cocktails: Cocktail[] = [')
end = text.rindex('];')
body = text[start:end]

# Split by top-level object starts
parts = re.split(r'\n\s*\{', body)
header = parts[0]
objects_raw = parts[1:]

new_objects = []
for obj in objects_raw:
    # find closing brace at top level
    depth = 0
    for i, ch in enumerate(obj):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                obj_block = '{' + obj[:i+1]
                break
    else:
        obj_block = '{' + obj

    glass_m = re.search(r'glass:\s*"([^"]+)"', obj_block)
    icon_m = re.search(r'icon_type:\s*"([^"]+)"', obj_block)
    if glass_m and icon_m:
        glass = normalize_glass(glass_m.group(1))
        icon = GLASS_TO_ICON.get(glass, 'martini')
        # replace icon_type value
        new_block = re.sub(r'icon_type:\s*"[^"]+"', f'icon_type: "{icon}"', obj_block)
        new_objects.append(new_block)
    else:
        new_objects.append(obj_block)

new_body = header + '\n'.join(new_objects)
new_text = text[:start] + new_body + text[end:]
path.write_text(new_text)
print(f"Updated icon_type in {len(new_objects)} cocktails")
