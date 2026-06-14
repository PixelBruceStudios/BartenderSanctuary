import re

with open('data/ingredients.ts', 'r') as f:
    lines = f.readlines()

# Bottle definitions
bottles_data = {
    'Cognac or VSOP brandy': [
        {'name': 'Remy Martin VSOP', 'description': 'Premium VSOP cognac. Rich, smooth, with vanilla, dried fruit, and cocoa.', 'related': ['Remy Martin VS', 'Remy Martin XO', 'Martell VSOP'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Remy_Martin_VSOP_Cognac.jpg/320px-Remy_Martin_VSOP_Cognac.jpg'},
        {'name': 'Hennessy VSOP', 'description': 'Popular VSOP cognac. Smooth, with vanilla, spice, and toasted oak.', 'related': ['Hennessy VS', 'Hennessy XO', 'Remy Martin VSOP'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hennessy_VS_cognac.jpg/320px-Hennessy_VS_cognac.jpg'},
    ],
    'Apricot brandy': [
        {'name': 'Marie Brizard Apricot Brandy', 'description': 'Sweet apricot brandy. Golden-amber, fruity, with warm stone-fruit character.', 'related': ['Bols Apricot Brandy', 'Rothman & Winter']},
        {'name': 'Bols Apricot Brandy', 'description': 'Dutch apricot brandy. Sweet, smooth, with natural apricot flavor.', 'related': ['Marie Brizard Apricot Brandy', 'Rothman & Winter']},
    ],
    'Cherry brandy': [
        {'name': 'Clear Creek Kirschwasser', 'description': 'Oregon-made kirschwasser. Dry, clear cherry eau-de-vie.', 'related': ['G.E. Massenez Kirsch', 'Luxardo Maraschino']},
        {'name': 'G.E. Massenez Kirsch', 'description': 'French kirsch from Alsace. Dry, clean, aromatic cherry spirit.', 'related': ['Clear Creek Kirschwasser', 'Distillerie de Neuchâtel']},
    ],
    'Kirsch': [
        {'name': 'G.E. Massenez Kirsch', 'description': 'French kirsch from Alsace. Distilled from Griotte cherries. Dry, clear, pure cherry flavor.', 'related': ['Clear Creek Kirschwasser', 'Distillerie de Neuchâtel']},
        {'name': 'Clear Creek Kirschwasser', 'description': 'Oregon-made kirschwasser. Dry, clear cherry eau-de-vie. Unaged, no sugar.', 'related': ['G.E. Massenez Kirsch', 'Luxardo Maraschino']},
    ],
    'Light rum': [
        {'name': 'Bacardi Superior', 'description': "The world's best-selling white rum. Light, clean, with mild sweetness and subtle vanilla.", 'related': ['Bacardi Gold', 'Don Q Cristal', 'Plantation 3 Stars'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Bacardi_Superior_rum_bottle.jpg/320px-Bacardi_Superior_rum_bottle.jpg'},
        {'name': 'Don Q Cristal', 'description': 'Puerto Rican light rum. Smooth, clean, with mild sweetness and vanilla.', 'related': ['Bacardi Superior', 'Don Q Gold', 'Don Q Añejo']},
    ],
    'Blanco tequila': [
        {'name': 'Patrón Silver', 'description': 'Premium 100% blue agave blanco. Smooth, crisp, with sweet agave, citrus, and pepper.', 'related': ['Patrón Reposado', 'Patrón Añejo', 'Espolòn Blanco']},
        {'name': 'Espolòn Blanco', 'description': '100% blue agave blanco from Jalisco. Bright agave, pepper, citrus.', 'related': ['Espolòn Reposado', 'Patrón Silver', 'Fortaleza Blanco']},
    ],
    'Crème de cassis': [
        {'name': 'Joseph Cartron Crème de Cassis', 'description': 'French blackcurrant crème liqueur. Deep purple, tart-sweet, 15% ABV.', 'related': ['Giffard Crème de Cassis', 'Briottet Crème de Cassis']},
        {'name': 'Giffard Crème de Cassis', 'description': 'Premium French blackcurrant crème liqueur. Rich, dark, balanced sweet-tart.', 'related': ['Joseph Cartron', 'Briottet']},
    ],
    'Crème de mûre': [
        {'name': 'Giffard Crème de Mûre', 'description': 'French blackberry crème liqueur. Rich, dark, sweet-tart blackberry flavor.', 'related': ['Joseph Cartron Crème de Mûre', 'Briottet']},
        {'name': 'Briottet Crème de Mûre', 'description': 'Savoyard blackberry crème liqueur. Deep purple, intense blackberry character.', 'related': ['Giffard Crème de Mûre', 'Bols Blackberry']},
    ],
    'Crème de violette': [
        {'name': 'Giffard Crème de Violette', 'description': 'French violet flower crème liqueur. Floral, sweet, perfumed. 20% ABV.', 'related': ['Briottet Crème de Violette', 'Rothman & Winter Violet']},
        {'name': 'Briottet Crème de Violette', 'description': 'French violet liqueur from Savoie. Fragrant, sweet, perfumed.', 'related': ['Giffard Crème de Violette', 'Rothman & Winter']},
    ],
    'Galliano': [
        {'name': "Galliano L'Autentico", 'description': "Iconic Italian vanilla-herbal liqueur. Bright yellow, complex. 42.3% ABV.", 'related': ['Galliano Vanilla']},
        {'name': 'Galliano Vanilla', 'description': 'Smooth vanilla liqueur from Galliano. Rich vanilla with hints of herbs and spice.', 'related': ["Galliano L'Autentico"]},
    ],
    'Irish cream': [
        {'name': "Baileys Irish Cream", 'description': "The original Irish cream liqueur. Irish whiskey, cream, and chocolate. 17% ABV.", 'related': ["Ryan's Irish Cream", "Saint Brendan's"]},
        {'name': "Saint Brendan's Irish Cream", 'description': 'Irish cream liqueur from Ireland. Smooth, rich, with Irish whiskey and cream.', 'related': ["Baileys Irish Cream", "Ryan's"]},
    ],
    'Maraschino liqueur': [
        {'name': 'Luxardo Maraschino', 'description': 'Premium Italian maraschino liqueur from Marasca cherry pits. 32% ABV.', 'related': ['Maraska Maraschino', 'Luxardo Amaretto']},
        {'name': 'Maraska Maraschino', 'description': 'Croatian maraschino liqueur from Zadar. Dry, complex, made from Marasca cherries.', 'related': ['Luxardo Maraschino', 'Bols Cherry Brandy']},
    ],
    'Orange curaçao': [
        {'name': 'Pierre Ferrand Dry Curaçao', 'description': 'Premium dry orange curaçao from Pierre Ferrand. Made from dried curaçao orange peels. 40% ABV.', 'related': ['Bols Orange Curaçao', 'Marie Brizard Orange Curaçao', 'Cointreau']},
        {'name': 'Bols Orange Curaçao', 'description': 'Dutch orange curaçao from Bols. Dry, bitter-orange flavor. 35% ABV.', 'related': ['Pierre Ferrand Dry Curaçao', 'Marie Brizard']},
    ],
    'Orange liqueur': [
        {'name': 'Cointreau', 'description': 'Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.', 'related': ['Pierre Ferrand Dry Curaçao', 'Combier', 'Marie Brizard Triple Sec'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg'},
        {'name': 'Pierre Ferrand Dry Curaçao', 'description': 'Dry orange curaçao from Pierre Ferrand. 40% ABV.', 'related': ['Cointreau', 'Bols Orange Curaçao', 'Marie Brizard']},
    ],
    'Peach schnapps': [
        {'name': 'DeKuyper Peach Schnapps', 'description': 'American peach schnapps from DeKuyper. Sweet, peach-forward, 15% ABV.', 'related': ['Archers Peach Schnapps', 'Hiram Walker Peach']},
        {'name': 'Archers Peach Schnapps', 'description': 'UK peach schnapps. Sweet, smooth, with ripe peach flavor.', 'related': ['DeKuyper Peach Schnapps', 'Hiram Walker']},
    ],
    'Triple sec': [
        {'name': 'Cointreau', 'description': 'Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.', 'related': ['Pierre Ferrand Dry Curaçao', 'Combier', 'Marie Brizard Triple Sec'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg'},
        {'name': 'Combier Triple Sec', 'description': 'French triple sec from Combier, made since 1834. 40% ABV.', 'related': ['Cointreau', 'Marie Brizard Triple Sec', 'Bols Triple Sec']},
    ],
    'Triple sec or Cointreau': [
        {'name': 'Cointreau', 'description': 'Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.', 'related': ['Pierre Ferrand Dry Curaçao', 'Combier', 'Marie Brizard Triple Sec'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg'},
        {'name': 'Combier Triple Sec', 'description': 'French triple sec from Combier, made since 1834. 40% ABV.', 'related': ['Cointreau', 'Marie Brizard Triple Sec', 'Bols Triple Sec']},
    ],
    'Absinthe': [
        {'name': 'Pernod Absinthe', 'description': 'French absinthe from Pernod. Anise, wormwood, fennel. 68% ABV.', 'related': ['Lucid Absinthe Supérieure', 'La Fee Absinthe']},
        {'name': 'Lucid Absinthe Supérieure', 'description': 'First legally imported absinthe to the US. 62.5% ABV.', 'related': ['Pernod Absinthe', 'La Fee Absinthe']},
    ],
    'Fernet-Branca': [
        {'name': 'Fernet-Branca', 'description': 'Italian amaro bitter digestif. Intensely bitter, minty, menthol, eucalyptus. 39% ABV.', 'related': ['Fernet-Branca Menta', 'Amaro Averna']},
        {'name': 'Fernet-Branca Menta', 'description': 'Mint version of Fernet-Branca. Even more menthol and minty.', 'related': ['Fernet-Branca', 'Amaro Montenegro']},
    ],
    'Green Chartreuse': [
        {'name': 'Green Chartreuse V.P.', 'description': 'French herbal liqueur made by Carthusian monks since 1605. 130+ botanicals. 55% ABV.', 'related': ['Green Chartreuse (41%)', 'Yellow Chartreuse', 'Bénédictine']},
        {'name': 'Green Chartreuse (41%)', 'description': 'Lower-ABV version of Green Chartreuse. 41% ABV.', 'related': ['Green Chartreuse V.P.', 'Yellow Chartreuse']},
    ],
    'Lillet Blanc': [
        {'name': 'Lillet Blanc', 'description': 'French aromatised wine. Citrus, honey, and quinine. 17% ABV.', 'related': ['Lillet Rosé', 'Lillet Rouge', 'Dolin Dry']},
        {'name': 'Lillet Rosé', 'description': 'Rosé version of Lillet. Fruity, red-berry, and citrus notes. 17% ABV.', 'related': ['Lillet Blanc', 'Lillet Rouge']},
    ],
    'Orange bitters': [
        {"name": "Regans' Orange Bitters No. 6", 'description': 'Citrusy bitters from dried orange peel by Gary Regan.', 'related': ['Fee Brothers Orange Bitters', 'Bitter Truth Orange']},
        {'name': 'Fee Brothers Orange Bitters', 'description': 'American orange bitters. Bright orange peel flavor.', 'related': ["Regans' Orange Bitters No. 6", 'Bitter Truth Orange']},
    ],
    "Pimm's No. 1": [
        {"name": "Pimm's No. 1", 'description': "British summer cup. Gin-based fruit liqueur. 25% ABV. Pimm's Cup.", 'related': ['Plymouth Gin', 'Lemonade', 'Cucumber']},
        {'name': 'Plymouth Gin', 'description': 'English gin from Plymouth. Slightly drier, earthier. 41.2% ABV.', 'related': ["Pimm's No. 1", 'Beefeater', 'Tanqueray']},
    ],
    'Amaro Nonino': [
        {'name': 'Amaro Nonino Quintessentia', 'description': 'Premium Italian amaro from Nonino. Bitter-sweet, 35% ABV.', 'related': ['Amaro Averna', 'Amaro Montenegro', 'Aperol']},
        {'name': 'Amaro Averna', 'description': 'Sicilian amaro from Averna. Bitter-sweet. 29% ABV.', 'related': ['Amaro Nonino', 'Amaro Montenegro', 'Fernet-Branca']},
    ],
    'Amontillado sherry': [
        {'name': 'Lustau Amontillado', 'description': 'Spanish amontillado sherry from Lustau. Nutty, dry, complex.', 'related': ['Lustau Fino', 'Lustau Oloroso', 'Gonzalez Byass']},
        {'name': 'Gonzalez Byass Amontillado', 'description': 'Classic amontillado sherry from Jerez. Dry, nutty.', 'related': ['Lustau Amontillado', 'Tio Pepe Fino']},
    ],
    'Fino sherry': [
        {"name": "Tio Pepe Fino", 'description': "Spain's most famous fino sherry. Pale, dry, saline, almond, green apple.", 'related': ['Lustau Fino', 'Lustau Amontillado', 'Gonzalez Byass Fino']},
        {'name': 'Lustau Fino', 'description': 'Fine fino sherry from Lustau. Pale, bone-dry, saline almond and apple notes.', 'related': ['Tio Pepe', 'Lustau Amontillado', 'Lustau Palo Cortado']},
    ],
    'Champagne or sparkling wine': [
        {'name': 'Moët & Chandon Brut Impérial', 'description': 'Iconic Champagne. Bright, lively, with green apple, citrus, and brioche.', 'related': ['Veuve Clicquot Yellow Label', 'Ruinart Blanc de Blancs'], 'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mo%C3%ABt_%26_Chandon_2010.jpg/320px-Mo%C3%ABt_%26_Chandon_2010.jpg'},
        {'name': 'Veuve Clicquot Yellow Label', 'description': 'Brut Champagne. Bright, balanced, with brioche and citrus.', 'related': ['Moët & Chandon Brut', 'Ruinart Blanc de Blancs', 'Bollinger Special Cuvée']},
    ],
    'Prosecco': [
        {'name': 'La Marca Prosecco', 'description': 'Italian Prosecco from Veneto. Light, fruity, Glera grape.', 'related': ['Nino Franco Rustico', 'Bisol Jeio', 'Santa Margherita']},
        {'name': 'Santa Margherita Prosecco', 'description': 'Crisp, clean Prosecco from Valdobbiadene.', 'related': ['La Marca', 'Zonin Prosecco', 'Bisol Jeio']},
    ],
    'Dry white wine': [
        {'name': 'Dry Sauvignon Blanc', 'description': 'Crisp, dry white wine. Citrus, green apple, herbaceous.', 'related': ['Dry Pinot Grigio', 'Dry Chardonnay']},
        {'name': 'Dry Pinot Grigio', 'description': 'Light, dry Italian white wine. Clean, citrus, mineral.', 'related': ['Dry Sauvignon Blanc', 'Pinot Gris']},
    ],
}

# Find entry start indices
entry_starts = []
for i, line in enumerate(lines):
    if re.match(r'^  \{ name:', line):
        m = re.search(r'name:\s*"([^"]+)"', line)
        name = m.group(1) if m else 'UNKNOWN'
        entry_starts.append((i, name))

# Determine which entries need bottles
missing_entries = []
for idx in range(len(entry_starts)):
    start_line, name = entry_starts[idx]
    end_line = entry_starts[idx + 1][0] if idx + 1 < len(entry_starts) else len(lines)
    segment = ''.join(lines[start_line:end_line])
    if 'bottles:' not in segment:
        missing_entries.append((name, start_line, end_line))

print(f"Missing: {len(missing_entries)}")

# Build replacement function
def build_replacement(name, bottles):
    bottle_lines = []
    for b in bottles:
        img = ', image: "' + b['image'] + '"' if b.get('image') else ''
        related = ', '.join('"' + r + '"' for r in b.get('related', []))
        bottle_lines.append('    { name: "' + b['name'] + '", description: "' + b['description'] + '", related: [' + related + ']' + img + ' }')
    bottles_block = ',\n  bottles: [\n' + ',\n'.join(bottle_lines) + '\n  ]'
    return bottles_block

# Process from bottom to top to preserve line indices
insertions = []
for name, start_line, end_line in missing_entries:
    bottles = bottles_data.get(name)
    if not bottles:
        print(f"WARNING: No bottles for {name}")
        continue
    
    replacement = build_replacement(name, bottles)
    
    # Check if single-line entry (closing brace on same line as opening)
    entry_line = lines[start_line].rstrip()
    if entry_line.endswith('},') or entry_line.endswith('}'):
        # Single-line entry
        if entry_line.endswith('},'):
            base = entry_line[:-2].rstrip().rstrip(',')
            suffix = '},'
        else:
            base = entry_line[:-1].rstrip().rstrip(',')
            suffix = '}'
        
        new_line = base + replacement + '\n' + suffix + '\n'
        # Replace the line
        insertions.append((start_line, 'REPLACE_LINE', new_line))
    else:
        # Multi-line entry: find closing brace
        closing_idx = None
        for j in range(start_line + 1, end_line):
            stripped = lines[j].rstrip()
            if re.match(r'^\s*\},$', stripped) or re.match(r'^\s*\}$', stripped):
                closing_idx = j
                break
        
        if closing_idx is None:
            print(f"WARNING: Could not find closing brace for {name}")
            continue
        
        insertions.append((closing_idx, 'INSERT_BEFORE', replacement + '\n'))

# Apply insertions from bottom to top
insertions.sort(key=lambda x: x[0], reverse=True)
for line_idx, action, content in insertions:
    if action == 'REPLACE_LINE':
        lines[line_idx] = content
    elif action == 'INSERT_BEFORE':
        lines.insert(line_idx, content)

print(f"Processed {len(insertions)} entries")

with open('data/ingredients.ts', 'w') as f:
    f.writelines(lines)

print("Updated data/ingredients.ts")

# Verify
with open('data/ingredients.ts', 'r') as f:
    content = f.read()

entries = re.split(r'\n(?=  \{ name:)', content)
still_missing = 0
for entry in entries:
    if not entry.strip().startswith('{ name:'):
        continue
    name_match = re.search(r'name:\s*"([^"]+)"', entry)
    if not name_match:
        continue
    if 'bottles:' not in entry:
        still_missing += 1

print(f"Still missing bottles: {still_missing}")
