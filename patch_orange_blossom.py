with open('data/ingredients.ts', 'r') as f:
    content = f.read()

old = '''  { name: "Orange blossom water", category: "Fresh & Garnish", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", brands: ["Cortas", "Moussel", "Food-grade"], notes: "Bee's Knees, certain Ramos Fizz, Arabic cocktails.",
  bottles: [
    { name: "Cortas Orange Blossom Water", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", related: ["Moussel Orange Blossom Water", "Food-grade orange blossom water"] }
  ,
    { name: "Moussel Orange Blossom Water", description: "Orange blossom water from Moussel. Distilled water with orange blossom essence. Floral, perfumed.", related: ["Cortas Orange Blossom Water", "Food-grade orange blossom water"] }
  ] },'''

new = '''  { name: "Orange blossom water", category: "Fresh & Garnish", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", brands: ["Cortas", "Moussel", "Food-grade"], notes: "Bee's Knees, certain Ramos Fizz, Arabic cocktails.",
  bottles: [
    { name: "Cortas Orange Blossom Water", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", related: ["Moussel Orange Blossom Water", "Food-grade orange blossom water"] }
  ,
    { name: "Moussel Orange Blossom Water", description: "Orange blossom water from Moussel. Distilled water with orange blossom essence. Floral, perfumed.", related: ["Cortas Orange Blossom Water", "Food-grade orange blossom water"] }
  ,
    { name: "Sadoff Orange Blossom Water", description: "Orange blossom water from Sadoff. Distilled water with orange blossom essence. Floral, perfumed. Used in Middle Eastern and Mediterranean cocktails.", related: ["Cortas Orange Blossom Water", "Moussel Orange Blossom Water"] }
  ,
    { name: "Odysea Orange Blossom Water", description: "Orange blossom water from Odysea. Distilled water with orange blossom essence. Floral, perfumed. Greek brand used in cocktails and pastries.", related: ["Cortas Orange Blossom Water", "Moussel Orange Blossom Water"] }
  ] },'''

if old not in content:
    print("ERROR: old block not found exactly")
else:
    content = content.replace(old, new, 1)
    with open('data/ingredients.ts', 'w') as f:
        f.write(content)
    print("Replacement done")
