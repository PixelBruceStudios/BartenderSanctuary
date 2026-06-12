#!/usr/bin/env python3
"""Prepare title update JSON for all 50 lessons."""
import json, urllib.request

with urllib.request.urlopen('https://bartender-sanctuary-app.vercel.app/api/school/full') as r:
    data = json.loads(r.read())

lesson_map = {}
for cat in data:
    for tech in cat['techniques']:
        for lesson in tech['lessons']:
            lesson_map[lesson['id']] = {
                'cat_slug': cat['slug'],
                'tech_slug': tech['slug'],
                'lesson_slug': lesson['slug'],
                'title': lesson['title'],
            }

seo_titles = {
    '012c6c1a-87af-420e-9601-11b01420434c': 'Ancient Fermentation & Distillation | History of Alcoholic Beverages',
    'a5f8a169-3045-43ea-abe6-77f94732e8c2': 'Taverns, Saloons & Speakeasies | History of Drinking Culture',
    'f4906e85-7678-4a7f-a6bd-38e80e2d2b7b': 'Prohibition & Its Legacy | How 1920-1933 Shaped American Drinking',
    '87ebb9a7-0f05-43e4-8692-7c817271ecd9': 'Golden Age of Cocktails (1860-1920) | Classic Bartending History',
    '613bbeea-a813-4ee6-8d12-27dea54a1413': 'Tiki Era (1930s-1960s) | Polynesian Cocktail Culture & History',
    'b527161f-6c83-401d-8a15-7082d597ee3f': 'Disco Era Decline (1970s-1980s) | The Dark Age of Cocktails',
    '7ee4cc1d-252a-4978-83a0-e972553415fb': 'Craft Cocktail Renaissance (2000s-Present) | Modern Bartending Revival',
    'c9e50fe3-78ec-4c3c-b180-d5b2dc6719f0': 'Anatomy of a Professional Bar | Layout, Zones & Equipment',
    '3efb31d5-b794-404a-8483-635f01fe11e8': 'Essential Bar Glassware Guide | Coupes, Rocks, Highballs & More',
    '05cb1ecb-af70-4552-8e18-3400d5e3c12f': 'Essential Bartender Tools | Shakers, Strainers, Bar Spoons & Jiggers',
    '2138ef4b-7075-43bd-a96a-f98e05c5f9ba': 'Bar Measurements & Pouring Guide | Ounces, ML, Dashes & Jiggers',
    '2fcf08e3-c2db-4b8e-82c5-1c519ff1acb0': 'Bartender Slang & Industry Vocabulary | Well Drinks, Call Drinks & More',
    'fa40245a-bc66-40bb-acda-1bcf07d0c4ab': 'Bar Hygiene & Food Safety | Glass Washing, Sanitation & Health Code',
    '83db1329-4429-421b-96f6-6ff6dd389ee4': 'The 5 Taste Profiles | Sweet, Sour, Salty, Bitter & Umami in Cocktails',
    '2e0e3b27-eea3-4ad4-908f-4eb961054a52': 'How Alcohol Affects Flavour Perception | Taste Science for Bartenders',
    '11ee214f-0679-4715-a41b-2bbc60bcb435': 'Training Your Nose | Aroma Identification & Smell Training',
    '2a01cd56-ee85-4d4e-a4f9-e7ca0b80703c': 'Professional Tasting Methodology | How to Taste & Evaluate Cocktails',
    '16cd8a0e-cdef-42a0-9f21-1e8327fc95c4': 'Building Flavour Memory | Association Techniques for Bartenders',
    '6934280a-744f-406d-b2a6-3b264e4ab2a3': 'Bourbon Rules & Production | Legal Requirements, Mash Bills & Aging',
    '1a4f8aee-48fd-4741-8b5e-1b681a685fa8': 'How Whiskey Is Made | Grain to Glass Production Process',
    'a37dea8f-e42a-4d1c-8123-3b1a7498c66e': 'Irish Whiskey Guide | History, Production & Triple Distillation',
    'eab63898-a347-4a02-9b33-ffb3f19fe1b5': 'Japanese Whisky Guide | History, Production & Regional Styles',
    '6ed9a9a1-543c-4cc9-92b6-95f5d1fa3213': 'Reading a Whiskey Label | Age Statements, NAS & Label Terminology',
    'ebad100c-28b4-4b7e-89e4-a31271edfeef': 'Rye Whiskey Guide | History, Flavour Profile & Cocktail Uses',
    '5b257ab3-03e5-467e-b383-6e345aed9e0f': 'Scotch Regions & Styles | Highlands, Islay, Speyside & More',
    'd2030440-cf20-4507-89e8-5e0305258f5f': 'Whiskey & Food Pairing | Cheese, Chocolate & Smoked Meat',
    '1303475b-748a-4d09-a283-847a6d8efc0f': 'World Whisky Guide | Beyond Scotch, Bourbon & Irish Whiskey',
    '66f71f65-d607-4d9e-a60f-132be3ee214a': 'Grain Bills & Mash Bills | How Grain Ratios Shape Whiskey Flavour',
    'cf9bf9cd-dae6-4517-bb0b-a7daa6385d35': 'How Gin Is Made | From Juniper to London Dry Production',
    '2d4cfde9-437a-47f8-a0c6-43d924f329ee': 'Key Gin Botanicals & Their Flavours | Juniper, Coriander, Citrus & More',
    '4348ffcd-b43e-4ce9-b9a7-f59e1924ef50': 'London Dry Gin vs Other Styles | Old Tom, Plymouth & New Western',
    '76772b0f-5136-4641-8ce8-907d913cf85e': 'New Western & Contemporary Gin | Modern American & Craft Styles',
    '9ec72547-a6af-4a1c-95bf-a428ea615eb2': 'Sloe Gin & Liqueur Gins | Production, Styles & Cocktail Uses',
    '9b727183-62a6-4450-adae-62a575b7bf2d': 'Tonic Water & Gin Pairings | Quinine, Botanicals & G&T Chemistry',
    '70a53cb3-e298-4482-af31-14abf3f16f71': 'Caribbean Rum Regions | Barbados, Jamaica, Martinique & Cuba',
    '7e70c5b1-969e-4755-989d-1c2cfc549135': 'How Rum Is Made | From Sugar Cane to Distilled Spirit',
    '09904465-7e7f-46c2-ae3f-6d89bc36cd2c': 'Rhum Agricole vs Molasses Rum | French Caribbean vs Colonial Styles',
    '03ac88de-57a0-4d19-a0fc-ee7528b1c951': 'White, Aged, Dark & Spiced Rum | Styles & Cocktail Uses',
    '230bca2b-1e6f-4acb-8325-350cddabcc35': 'Classic Sours Cocktail Family | Daiquiri, Whiskey Sour & Sidecar',
    'de34138d-ac62-45f1-bf21-3710c8289af8': 'The Cocktail Formula | Base, Modifier, Accent & Balance',
    '251a6e67-8021-4bc7-8905-a3687662350c': 'Shaking Technique | Hard Shake, Dry Shake & Aeration',
    'ad42951b-6725-4159-b497-877a30fbfa13': 'Ice Chemistry in Cocktails | Chilling, Dilution & Ice Shape Effects',
    '0beb24f6-2101-47e6-9505-984daba9b4af': 'Milk Wash Clarification | Clarify Cocktails with Milk Protein',
    'a2b7f34b-c7e1-4c2e-ab70-55292c1583f4': 'Fat Washing Technique | Infusing Spirits with Butter, Bacon & Nut Fats',
    '8a26af56-044c-4ef4-9071-5e287e2aedd4': 'How Carbonation Works | CO2 Solubility, Soda Siphons & Mixers',
    'cfab3407-5726-46f1-8999-8804ceced1bd': 'Egg White Chemistry | Foam Stability, pH & Dry Shake Emulsification',
    'c500e44f-f516-44b6-9439-9613b48fb5e8': 'Spherification in Cocktails | Molecular Techniques for Bartenders',
    'f515e744-1bd9-4438-a8fa-8394b4adb157': 'Bar Station Setup | Speed, Efficiency & mise en place',
    '76076c78-2df3-4a00-bc70-f9369b017168': 'Opening & Decanting Wine | Service Techniques for Beverage Programs',
    '811b4bab-abc9-485c-b8fc-3de783f0f216': 'Bar Concept Development | How to Design & Launch a Bar Business',
}

updates = []
for lid, info in lesson_map.items():
    if lid in seo_titles:
        new_title = seo_titles[lid]
        updates.append({
            'id': lid,
            'cat_slug': info['cat_slug'],
            'tech_slug': info['tech_slug'],
            'lesson_slug': info['lesson_slug'],
            'title': new_title,
        })

with open('/tmp/title_updates.json', 'w') as f:
    json.dump(updates, f, indent=2)

print(f'Title updates ready: {len(updates)} lessons')
PYEOF