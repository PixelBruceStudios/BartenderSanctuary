import re

with open('data/ingredients.ts', 'r') as f:
    content = f.read()

# Update brands list for Rye whiskey
old_brands = 'brands: ["Rittenhouse Rye", "Bulleit Rye", "Sazerac Rye", "Wild Turkey Rye", "WhistlePig 10"]'
new_brands = 'brands: ["Rittenhouse Rye", "Bulleit Rye", "Sazerac Rye", "Wild Turkey Rye", "WhistlePig 10", "Templeton Rye", "Old Overholt Rye", "High West Rye", "Jim Beam Rye"]'

if old_brands in content:
    content = content.replace(old_brands, new_brands, 1)
    with open('data/ingredients.ts', 'w') as f:
        f.write(content)
    print('Brands list updated successfully')
else:
    print('ERROR: old brands string not found')
    idx = content.find('Rye whiskey')
    if idx >= 0:
        print(repr(content[idx:idx+200]))

# Verify no duplicates in Rye whiskey block
m = re.search(r'\{ name: "Rye whiskey",.*?bottles: \[(.*?)\] \}', content, re.DOTALL)
if m:
    bottles_block = m.group(1)
    names = re.findall(r'\{ name: "([^"]+)"', bottles_block)
    print(f'Bottle count: {len(names)}')
    print(f'Bottles: {names}')
    duplicates = [n for n in names if names.count(n) > 1]
    if duplicates:
        print(f'DUPLICATES: {set(duplicates)}')
    else:
        print('No duplicates')
else:
    print('Could not find Rye whiskey block')
