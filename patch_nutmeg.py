import re

with open('data/ingredients.ts', 'r') as f:
    content = f.read()

old = '''{ name: "Nutmeg", category: "Fresh & Garnish", description: "Freshly grated nutmeg. Warm, nutty, aromatic spice for garnish.", brands: ["Whole nutmeg + grater"], notes: "Brandy Alexander garnish, Eggnog, certain punches.",
  bottles: [
    { name: "Whole Nutmeg", description: "Whole nutmeg freshly grated. Warm, nutty, aromatic garnish for Brandy Alexander and Eggnog.", related: ["Ground nutmeg", "Nutmeg grater"] }
  ,
    { name: "Ground Nutmeg", description: "Pre-ground nutmeg. Convenient for garnish when fresh grating isn't practical. Less aromatic than fresh.", related: ["Whole Nutmeg", "Nutmeg grater"] }
  ] },'''

new = '''{ name: "Nutmeg", category: "Fresh & Garnish", description: "Freshly grated nutmeg. Warm, nutty, aromatic spice for garnish.", brands: ["Whole nutmeg + grater"], notes: "Brandy Alexander garnish, Eggnog, certain punches.",
  bottles: [
    { name: "Whole Nutmeg", description: "Whole nutmeg freshly grated. Warm, nutty, aromatic garnish for Brandy Alexander and Eggnog.", related: ["Ground nutmeg", "Nutmeg grater"] }
  ,
    { name: "Ground Nutmeg", description: "Pre-ground nutmeg. Convenient for garnish when fresh grating isn't practical. Less aromatic than fresh.", related: ["Whole Nutmeg", "Nutmeg grater"] }
  ,
    { name: "McCormick Ground Nutmeg", description: "Ground nutmeg from McCormick. Widely available supermarket brand, consistent quality for cocktail garnish.", related: ["Whole Nutmeg", "Ground Nutmeg"] }
  ,
    { name: "Nutmeg Grater", description: "Small handheld grater designed specifically for nutmeg. Essential tool for fresh cocktail garnish.", related: ["Whole Nutmeg", "Ground Nutmeg"] }
  ,
    { name: "Indian Whole Nutmeg", description: "Whole nutmeg from Indian origin. Warm, nutty, aromatic profile suitable for cocktails and baking.", related: ["Whole Nutmeg", "Ground Nutmeg"] }
  ] },'''

if old in content:
    content = content.replace(old, new, 1)
    with open('data/ingredients.ts', 'w') as f:
        f.write(content)
    print("Patch applied successfully")
    # Verify indentation
    m = re.search(r'Nutmeg.*?bottles: \[.*?\] \},', content, re.DOTALL)
    if m:
        lines = m.group().split('\n')
        print("--- Nutmeg block lines ---")
        for i, line in enumerate(lines[-15:]):
            print(f"  {line}")
else:
    print("ERROR: old string not found in file")
    # Show what we have
    m = re.search(r'\{ name: "Nutmeg".*?bottles: \[.*?\] \}', content, re.DOTALL)
    if m:
        print("Found actual block (first 400 chars):")
        print(repr(m.group()[:400]))
