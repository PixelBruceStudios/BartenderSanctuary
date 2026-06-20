import re

with open('data/ingredients.ts', 'r') as f:
    content = f.read()

old = '''    { name: "DeKuyper Banana Liqueur", description: "American banana liqueur from DeKuyper. Bright, sweet, with artificial banana flavor. 24% ABV. A reliable, widely available choice for Flaming Dr. Pepper and Tiki shooters.", related: ["Marie Brizard Crème de Banane", "Bols Crème de Banane"] }
  ] },'''

new = '''    { name: "DeKuyper Banana Liqueur", description: "American banana liqueur from DeKuyper. Bright, sweet, with artificial banana flavor. 24% ABV. A reliable, widely available choice for Flaming Dr. Pepper and Tiki shooters.", related: ["Marie Brizard Crème de Banane", "Bols Crème de Banane"] }
  ,
    { name: "Giffard Crème de Banane", description: "French banana crème liqueur from Giffard. Rich, creamy banana flavor with vanilla notes. 25% ABV. A premium choice for tropical cocktails and dessert drinks.", related: ["Marie Brizard Crème de Banane", "Bols Crème de Banane"] }
  ,
    { name: "RumChata Banana Liqueur", description: "Creamy banana liqueur from RumChata. Sweet, smooth, with real banana and cream flavors. Lower ABV, perfect for dessert shooters and creamy cocktails.", related: ["Marie Brizard Crème de Banane", "DeKuyper Banana Liqueur"] }
  ] },'''

if old not in content:
    print("ERROR: old string not found in file")
    idx = content.find('DeKuyper Banana Liqueur')
    if idx != -1:
        print("Found nearby context:")
        print(repr(content[idx-50:idx+300]))
else:
    content = content.replace(old, new, 1)
    with open('data/ingredients.ts', 'w') as f:
        f.write(content)
    print("SUCCESS: patched Crème de banane")
