import re

with open('data/ingredients.ts', 'r') as f:
    lines = f.readlines()

ingredients = []
current_ingredient = None
current_bottles_count = 0
in_bottles_block = False
bracket_depth = 0
pending_bottles = False

for line in lines:
    stripped = line.strip()
    
    if stripped.startswith('{ name:') and 'category:' in stripped:
        if current_ingredient is not None:
            ingredients.append((current_ingredient, current_bottles_count))
        
        name_match = re.search(r'name:\s*"([^"]+)"', stripped)
        current_ingredient = name_match.group(1) if name_match else 'UNKNOWN'
        current_bottles_count = 0
        in_bottles_block = False
        bracket_depth = 0
        pending_bottles = False
        
        if 'bottles: [' in stripped:
            bracket_pos = stripped.index('bottles: [') + len('bottles: [') - 1 + (len(line) - len(stripped) - 1)
            if bracket_pos < len(line) and line[bracket_pos] == '[':
                in_bottles_block = True
                bracket_depth = 1
                pending_bottles = False
    
    elif not in_bottles_block and pending_bottles and 'bottles: [' in stripped:
        bracket_pos = stripped.index('bottles: [') + len('bottles: [') - 1 + (len(line) - len(stripped) - 1)
        if bracket_pos < len(line) and line[bracket_pos] == '[':
            in_bottles_block = True
            bracket_depth = 1
            pending_bottles = False
        else:
            pending_bottles = False
    
    elif not in_bottles_block and not pending_bottles and stripped == 'bottles: [':
        in_bottles_block = True
        bracket_depth = 1
    
    elif not in_bottles_block and not pending_bottles and stripped.startswith('bottles:') and '[' in stripped:
        in_bottles_block = True
        bracket_depth = 1
    
    if stripped.startswith('{ name:') and 'category:' in stripped and not in_bottles_block:
        pending_bottles = True
    
    if in_bottles_block:
        for ch in line:
            if ch == '[':
                bracket_depth += 1
            elif ch == ']':
                bracket_depth -= 1
                if bracket_depth == 0:
                    in_bottles_block = False
                    break
        
        if in_bottles_block:
            if bracket_depth >= 2:
                entry = stripped
                if entry.startswith(','):
                    entry = entry[1:].strip()
                if entry.startswith('{ name:') and 'category:' not in entry:
                    current_bottles_count += 1

if current_ingredient is not None:
    ingredients.append((current_ingredient, current_bottles_count))

ingredients.sort(key=lambda x: x[1])

print("=== INGREDIENT BOTTLE COUNTS ===")
for name, count in ingredients:
    marker = " <-- CANDIDATE" if count < 5 else ""
    print(str(count) + " | " + name + marker)

print("")
print("=== TOTAL: " + str(len(ingredients)) + " ingredients ===")
