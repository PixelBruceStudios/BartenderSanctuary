import re

with open('data/ingredients.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Aperol Amaro to the Aperol ingredient
# The block ends with: "    { name: "Cynar", ... }\n  ] },"
old_aperol = '''    { name: "Cynar", description: "Italian bitter aperitif made from artichokes. Bitter, herbal, complex. 16.5% ABV. Unique vegetal character for spritzes and Negroni variations.", related: ["Aperol", "Campari", "Select Aperitivo"], image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Cynar_%280.7_l_bottle%29.jpg" }
  ] },'''

new_aperol = '''    { name: "Cynar", description: "Italian bitter aperitif made from artichokes. Bitter, herbal, complex. 16.5% ABV. Unique vegetal character for spritzes and Negroni variations.", related: ["Aperol", "Campari", "Select Aperitivo"], image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Cynar_%280.7_l_bottle%29.jpg" }
  ,
    { name: "Aperol Amaro", description: "Orange-amaro variant from the Aperol family. Bitter-orange base enriched with additional herbal and amaro botanicals. 11% ABV. A complex spritz alternative bridging the Aperol and Campari profiles.", related: ["Aperol", "Select Aperitivo", "Cynar"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aperol_001_2025_06_08.jpg" }
  ] },'''

if old_aperol not in content:
    print('ERROR: Aperol Cynar block not found')
    # Debug: show what we're looking for
    import difflib
    # Find the Cynar line in content
    idx = content.find('{ name: "Cynar"')
    if idx >= 0:
        print('Found Cynar at index', idx)
        print('Context:', repr(content[idx:idx+300]))
else:
    content = content.replace(old_aperol, new_aperol, 1)
    with open('data/ingredients.ts', 'w') as f:
        f.write(content)
    print('Aperol Amaro added')
