import requests, json, os, sys

BASE = "https://bartender-sanctuary-app.vercel.app"
COCKTAIL_URL = f"{BASE}/api/cocktails"

with open(os.path.expanduser("~/Desktop/NeonDbPass")) as f:
    DB_PASS = f.read().strip()

cocktails = [
  {
    "slug": "mai-tai",
    "name": "Mai Tai",
    "description": "The quintessential tiki cocktail. Aged rum, lime, orgeat, and orange liqueur over crushed ice.",
    "image_url": "",
    "ingredients": [
      {"item": "Aged rum", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "0.75 oz"},
      {"item": "Orange curaçao", "qty": "0.5 oz"},
      {"item": "Orgeat syrup", "qty": "0.5 oz"},
      {"item": "Simple syrup", "qty": "0.25 oz"},
      {"item": "Light rum", "qty": "0.5 oz (float)"}
    ],
    "instructions": [
      "Shake aged rum, lime, curaçao, orgeat, and syrup with ice.",
      "Strain into rocks glass filled with crushed ice.",
      "Float light rum on top.",
      "Garnish with mint sprig and lime wedge."
    ],
    "glass_type": "Rocks",
    "garnish": "Mint sprig, lime wedge",
    "difficulty": "Intermediate"
  },
  {
    "slug": "pina-colada",
    "name": "Piña Colada",
    "description": "Blended rum, coconut, and pineapple. Pure tropical escape.",
    "image_url": "",
    "ingredients": [
      {"item": "White rum", "qty": "2 oz"},
      {"item": "Coconut cream", "qty": "1 oz"},
      {"item": "Pineapple juice", "qty": "3 oz"}
    ],
    "instructions": [
      "Add all ingredients to blender with ice.",
      "Blend until smooth.",
      "Pour into hurricane glass.",
      "Garnish with pineapple wedge and maraschino cherry."
    ],
    "glass_type": "Hurricane",
    "garnish": "Pineapple wedge, cherry",
    "difficulty": "Beginner"
  },
  {
    "slug": "long-island-iced-tea",
    "name": "Long Island Iced Tea",
    "description": "A potent blend of spirits topped with cola. Deceptively smooth.",
    "image_url": "",
    "ingredients": [
      {"item": "Vodka", "qty": "0.5 oz"},
      {"item": "Gin", "qty": "0.5 oz"},
      {"item": "White rum", "qty": "0.5 oz"},
      {"item": "Tequila", "qty": "0.5 oz"},
      {"item": "Triple sec", "qty": "0.5 oz"},
      {"item": "Lemon juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "1 oz"},
      {"item": "Cola", "qty": "top"}
    ],
    "instructions": [
      "Add all spirits, lemon, and syrup to shaker with ice.",
      "Shake and strain into highball over ice.",
      "Top with cola.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Highball",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "cuba-libre",
    "name": "Cuba Libre",
    "description": "Rum, cola, and lime. Simple, refreshing, and iconic.",
    "image_url": "",
    "ingredients": [
      {"item": "White rum", "qty": "2 oz"},
      {"item": "Cola", "qty": "4–6 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Fill highball with ice.",
      "Add rum and lime juice.",
      "Top with cola.",
      "Garnish with lime wedge."
    ],
    "glass_type": "Highball",
    "garnish": "Lime wedge",
    "difficulty": "Beginner"
  },
  {
    "slug": "dark-n-stormy",
    "name": "Dark 'n' Stormy",
    "description": "Dark rum and ginger beer. The official cocktail of Bermuda.",
    "image_url": "",
    "ingredients": [
      {"item": "Dark rum", "qty": "2 oz"},
      {"item": "Ginger beer", "qty": "4–6 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Fill highball with ice.",
      "Add rum and lime.",
      "Top with ginger beer.",
      "Garnish with lime wedge."
    ],
    "glass_type": "Highball",
    "garnish": "Lime wedge",
    "difficulty": "Beginner"
  },
  {
    "slug": "caipirinha",
    "name": "Caipirinha",
    "description": "Brazil's national cocktail. Cachaça, lime, and sugar, muddled and shaken.",
    "image_url": "",
    "ingredients": [
      {"item": "Cachaça", "qty": "2 oz"},
      {"item": "Fresh lime", "qty": "1 (cut into wedges)"},
      {"item": "Simple syrup", "qty": "1–2 tsp"}
    ],
    "instructions": [
      "Muddle lime wedges with syrup in rocks glass.",
      "Fill with ice.",
      "Add cachaça and stir.",
      "Garnish with lime wedge."
    ],
    "glass_type": "Rocks",
    "garnish": "Lime wedge",
    "difficulty": "Beginner"
  },
  {
    "slug": "tequila-sunrise",
    "name": "Tequila Sunrise",
    "description": "Tequila, orange juice, and grenadine. A gradient in a glass.",
    "image_url": "",
    "ingredients": [
      {"item": "Tequila", "qty": "2 oz"},
      {"item": "Orange juice", "qty": "4 oz"},
      {"item": "Grenadine", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Add tequila and orange juice to highball over ice.",
      "Slowly pour grenadine down the inside of the glass.",
      "Let it settle to create gradient.",
      "Garnish with orange slice and cherry."
    ],
    "glass_type": "Highball",
    "garnish": "Orange slice, cherry",
    "difficulty": "Beginner"
  },
  {
    "slug": "paloma",
    "name": "Paloma",
    "description": "Tequila, grapefruit, and lime. Mexico's most popular cocktail.",
    "image_url": "",
    "ingredients": [
      {"item": "Blanco tequila", "qty": "2 oz"},
      {"item": "Fresh grapefruit juice", "qty": "1 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz"},
      {"item": "Soda water", "qty": "top"}
    ],
    "instructions": [
      "Rim half of glass with salt.",
      "Add tequila, grapefruit, lime, and syrup to shaker with ice.",
      "Shake and strain over ice.",
      "Top with soda water and garnish with grapefruit wedge."
    ],
    "glass_type": "Rocks",
    "garnish": "Grapefruit wedge",
    "difficulty": "Beginner"
  },
  {
    "slug": "mimosa",
    "name": "Mimosa",
    "description": "Champagne and orange juice. Brunch in a glass.",
    "image_url": "",
    "ingredients": [
      {"item": "Champagne or sparkling wine", "qty": "3 oz"},
      {"item": "Orange juice", "qty": "3 oz"}
    ],
    "instructions": [
      "Pour orange juice into champagne flute.",
      "Top with champagne.",
      "Stir gently.",
      "Garnish with orange twist."
    ],
    "glass_type": "Champagne flute",
    "garnish": "Orange twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "bellini",
    "name": "Bellini",
    "description": "Prosecco and peach purée. Invented at Harry's Bar in Venice.",
    "image_url": "",
    "ingredients": [
      {"item": "Prosecco", "qty": "3 oz"},
      {"item": "White peach purée", "qty": "2 oz"}
    ],
    "instructions": [
      "Pour peach purée into champagne flute.",
      "Top with prosecco.",
      "Stir gently.",
      "Garnish with peach slice."
    ],
    "glass_type": "Champagne flute",
    "garnish": "Peach slice",
    "difficulty": "Beginner"
  },
  {
    "slug": "aperol-spritz",
    "name": "Aperol Spritz",
    "description": "Aperol, prosecco, and soda. Italy's favourite aperitivo.",
    "image_url": "",
    "ingredients": [
      {"item": "Aperol", "qty": "3 oz"},
      {"item": "Prosecco", "qty": "3 oz"},
      {"item": "Soda water", "qty": "1 oz"}
    ],
    "instructions": [
      "Add Aperol to wine glass over ice.",
      "Top with prosecco and soda.",
      "Stir gently.",
      "Garnish with orange slice."
    ],
    "glass_type": "Wine",
    "garnish": "Orange slice",
    "difficulty": "Beginner"
  },
  {
    "slug": "boulevardier",
    "name": "Boulevardier",
    "description": "The Negroni's whiskey cousin. Bourbon, Campari, and vermouth.",
    "image_url": "",
    "ingredients": [
      {"item": "Bourbon or rye", "qty": "1.5 oz"},
      {"item": "Campari", "qty": "1 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe or rocks glass over ice.",
      "Garnish with orange peel."
    ],
    "glass_type": "Coupe",
    "garnish": "Orange peel",
    "difficulty": "Beginner"
  },
  {
    "slug": "americano",
    "name": "Americano",
    "description": "Campari, vermouth, and soda. The predecessor to the Negroni.",
    "image_url": "",
    "ingredients": [
      {"item": "Campari", "qty": "1.5 oz"},
      {"item": "Sweet vermouth", "qty": "1.5 oz"},
      {"item": "Soda water", "qty": "top"}
    ],
    "instructions": [
      "Add Campari and vermouth to rocks glass over ice.",
      "Top with soda.",
      "Stir gently.",
      "Garnish with orange slice."
    ],
    "glass_type": "Rocks",
    "garnish": "Orange slice",
    "difficulty": "Beginner"
  },
  {
    "slug": "hugo",
    "name": "Hugo",
    "description": "Prosecco, elderflower, mint, and soda. A refreshing spritz from Alto Adige.",
    "image_url": "",
    "ingredients": [
      {"item": "Prosecco", "qty": "4 oz"},
      {"item": "Elderflower liqueur", "qty": "1 oz"},
      {"item": "Soda water", "qty": "1 oz"},
      {"item": "Fresh mint", "qty": "few leaves"}
    ],
    "instructions": [
      "Muddle mint gently in wine glass.",
      "Add ice, elderflower, and prosecco.",
      "Top with soda.",
      "Stir and garnish with mint sprig."
    ],
    "glass_type": "Wine",
    "garnish": "Mint sprig",
    "difficulty": "Beginner"
  },
  {
    "slug": "aperol-sour",
    "name": "Aperol Sour",
    "description": "Bittersweet, orange-forward, and perfectly balanced.",
    "image_url": "",
    "ingredients": [
      {"item": "Aperol", "qty": "2 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz"},
      {"item": "Egg white", "qty": "1 (optional)"}
    ],
    "instructions": [
      "Dry shake all ingredients without ice.",
      "Add ice and shake again.",
      "Double strain into rocks glass over ice.",
      "Garnish with orange twist."
    ],
    "glass_type": "Rocks",
    "garnish": "Orange twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "negroni-sbagliato",
    "name": "Negroni Sbagliato",
    "description": "Prosecco replaces gin in this lighter, fizzier Negroni variation.",
    "image_url": "",
    "ingredients": [
      {"item": "Campari", "qty": "1 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Prosecco", "qty": "1.5 oz"}
    ],
    "instructions": [
      "Add Campari and vermouth to rocks glass over ice.",
      "Top with prosecco.",
      "Stir gently.",
      "Garnish with orange slice."
    ],
    "glass_type": "Rocks",
    "garnish": "Orange slice",
    "difficulty": "Beginner"
  },
  {
    "slug": "white-russian",
    "name": "White Russian",
    "description": "Vodka, coffee liqueur, and cream. The Dude's favourite.",
    "image_url": "",
    "ingredients": [
      {"item": "Vodka", "qty": "2 oz"},
      {"item": "Coffee liqueur", "qty": "1 oz"},
      {"item": "Heavy cream", "qty": "1 oz"}
    ],
    "instructions": [
      "Add vodka and coffee liqueur to rocks glass over ice.",
      "Float cream on top.",
      "Stir gently before drinking."
    ],
    "glass_type": "Rocks",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "black-russian",
    "name": "Black Russian",
    "description": "Vodka and coffee liqueur. The White Russian without the cream.",
    "image_url": "",
    "ingredients": [
      {"item": "Vodka", "qty": "2 oz"},
      {"item": "Coffee liqueur", "qty": "1 oz"}
    ],
    "instructions": [
      "Add both ingredients to rocks glass over ice.",
      "Stir gently."
    ],
    "glass_type": "Rocks",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "espresso-martini",
    "name": "Espresso Martini",
    "description": "Vodka, espresso, coffee liqueur. A modern classic with a foamy head.",
    "image_url": "",
    "ingredients": [
      {"item": "Vodka", "qty": "2 oz"},
      {"item": "Fresh espresso", "qty": "1 oz"},
      {"item": "Coffee liqueur", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz (optional)"}
    ],
    "instructions": [
      "Add all ingredients to shaker with ice.",
      "Shake hard until tin is frosty.",
      "Double strain into coupe.",
      "Garnish with three coffee beans."
    ],
    "glass_type": "Coupe",
    "garnish": "Three coffee beans",
    "difficulty": "Beginner"
  },
  {
    "slug": "b-52",
    "name": "B-52",
    "description": "A layered shooter. Coffee, Irish cream, and orange liqueur.",
    "image_url": "",
    "ingredients": [
      {"item": "Coffee liqueur", "qty": "0.5 oz"},
      {"item": "Irish cream", "qty": "0.5 oz"},
      {"item": "Orange liqueur", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Layer coffee liqueur in bottom of shot glass.",
      "Slowly layer Irish cream over back of spoon.",
      "Top with orange liqueur.",
      "Serve upright."
    ],
    "glass_type": "Shot",
    "garnish": "None",
    "difficulty": "Intermediate"
  },
  {
    "slug": "mind-eraser",
    "name": "Mind Eraser",
    "description": "Vodka, coffee liqueur, and sparkling water. A refreshing highball shooter.",
    "image_url": "",
    "ingredients": [
      {"item": "Vodka", "qty": "1 oz"},
      {"item": "Coffee liqueur", "qty": "0.5 oz"},
      {"item": "Sparkling water", "qty": "top"}
    ],
    "instructions": [
      "Add vodka and coffee liqueur to highball over ice.",
      "Top with sparkling water.",
      "Stir gently."
    ],
    "glass_type": "Highball",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "godfather",
    "name": "Godfather",
    "description": "Scotch and amaretto. A simple, nutty, spirit-forward drink.",
    "image_url": "",
    "ingredients": [
      {"item": "Scotch whisky", "qty": "1.5 oz"},
      {"item": "Amaretto", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Add both ingredients to rocks glass over ice.",
      "Stir gently."
    ],
    "glass_type": "Rocks",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "rusty-nail",
    "name": "Rusty Nail",
    "description": "Scotch and Drambuie. A warming, herbal, and slightly sweet pour.",
    "image_url": "",
    "ingredients": [
      {"item": "Scotch whisky", "qty": "1.5 oz"},
      {"item": "Drambuie", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Add both ingredients to rocks glass over ice.",
      "Stir gently."
    ],
    "glass_type": "Rocks",
    "garnish": "Lemon twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "stinger",
    "name": "Stinger",
    "description": "Brandy and crème de menthe. A minty after-dinner drink from the 1890s.",
    "image_url": "",
    "ingredients": [
      {"item": "Brandy or Cognac", "qty": "1.5 oz"},
      {"item": "White crème de menthe", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Add both ingredients to shaker with ice.",
      "Shake and strain into coupe or rocks glass.",
      "Stir if served over ice."
    ],
    "glass_type": "Coupe",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "sidecar",
    "name": "Sidecar",
    "description": "Cognac, triple sec, and lemon. A tart, elegant sour from the 1920s.",
    "image_url": "",
    "ingredients": [
      {"item": "Cognac or VSOP brandy", "qty": "2 oz"},
      {"item": "Triple sec or Cointreau", "qty": "0.75 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with orange twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Orange twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "corpse-reviver-2",
    "name": "Corpse Reviver #2",
    "description": "Gin, Lillet, Cointreau, lemon, and absinthe. A hangover cure in a glass.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "0.75 oz"},
      {"item": "Lillet Blanc", "qty": "0.75 oz"},
      {"item": "Triple sec or Cointreau", "qty": "0.75 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"},
      {"item": "Absinthe", "qty": "1 dash"}
    ],
    "instructions": [
      "Shake gin, Lillet, triple sec, and lemon with ice.",
      "Strain into coupe.",
      "Rinse glass with absinthe and discard.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "last-word",
    "name": "Last Word",
    "description": "Equal parts gin, green Chartreuse, maraschino, and lime. Prohibition-era and potent.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "0.75 oz"},
      {"item": "Green Chartreuse", "qty": "0.75 oz"},
      {"item": "Maraschino liqueur", "qty": "0.75 oz"},
      {"item": "Fresh lime juice", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with brandied cherry."
    ],
    "glass_type": "Coupe",
    "garnish": "Brandied cherry",
    "difficulty": "Intermediate"
  },
  {
    "slug": "paper-plane",
    "name": "Paper Plane",
    "description": "Bourbon, Aperol, Amaro Nonino, and lemon. Modern, bright, and balanced.",
    "image_url": "",
    "ingredients": [
      {"item": "Bourbon", "qty": "0.75 oz"},
      {"item": "Aperol", "qty": "0.75 oz"},
      {"item": "Amaro Nonino", "qty": "0.75 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into rocks glass over ice.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Rocks",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "jungle-bird",
    "name": "Jungle Bird",
    "description": "Dark rum, Campari, pineapple, and lime. A bitter, tropical original from Malaysia.",
    "image_url": "",
    "ingredients": [
      {"item": "Dark rum", "qty": "1.5 oz"},
      {"item": "Campari", "qty": "0.75 oz"},
      {"item": "Pineapple juice", "qty": "1.5 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into rocks glass over ice.",
      "Garnish with pineapple wedge."
    ],
    "glass_type": "Rocks",
    "garnish": "Pineapple wedge",
    "difficulty": "Intermediate"
  },
  {
    "slug": "zombie",
    "name": "Zombie",
    "description": "A potent tiki blend of multiple rums, citrus, and falernum.",
    "image_url": "",
    "ingredients": [
      {"item": "White rum", "qty": "1 oz"},
      {"item": "Dark rum", "qty": "1 oz"},
      {"item": "Overproof rum", "qty": "0.5 oz"},
      {"item": "Fresh lime juice", "qty": "1 oz"},
      {"item": "Pineapple juice", "qty": "1 oz"},
      {"item": "Papaya juice", "qty": "1 oz"},
      {"item": "Cinnamon syrup", "qty": "0.25 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice (except overproof rum).",
      "Strain into tiki mug over crushed ice.",
      "Float overproof rum on top.",
      "Garnish with mint sprig."
    ],
    "glass_type": "Tiki",
    "garnish": "Mint sprig",
    "difficulty": "Advanced"
  },
  {
    "slug": "hurricane",
    "name": "Hurricane",
    "description": "Rum, passion fruit, and lime. New Orleans' signature cocktail.",
    "image_url": "",
    "ingredients": [
      {"item": "White rum", "qty": "2 oz"},
      {"item": "Dark rum", "qty": "1 oz"},
      {"item": "Passion fruit juice", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into hurricane glass over ice.",
      "Garnish with orange slice and cherry."
    ],
    "glass_type": "Hurricane",
    "garnish": "Orange slice, cherry",
    "difficulty": "Intermediate"
  },
  {
    "slug": "suffering-bastard",
    "name": "Suffering Bastard",
    "description": "Gin, bourbon, lime, ginger, and Angostura. A hangover cure with a kick.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "1 oz"},
      {"item": "Bourbon", "qty": "1 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"},
      {"item": "Ginger beer", "qty": "top"},
      {"item": "Angostura bitters", "qty": "2 dashes"}
    ],
    "instructions": [
      "Add gin, bourbon, lime, and bitters to shaker with ice.",
      "Shake and strain into highball over ice.",
      "Top with ginger beer.",
      "Garnish with mint sprig and lime wedge."
    ],
    "glass_type": "Highball",
    "garnish": "Mint sprig, lime wedge",
    "difficulty": "Intermediate"
  },
  {
    "slug": "planters-punch",
    "name": "Planter's Punch",
    "description": "Dark rum, citrus, sugar, and spice. A classic Jamaican punch.",
    "image_url": "",
    "ingredients": [
      {"item": "Dark rum", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "1 oz"},
      {"item": "Simple syrup", "qty": "0.75 oz"},
      {"item": "Pineapple juice", "qty": "1 oz"},
      {"item": "Nutmeg", "qty": "grate"}
    ],
    "instructions": [
      "Shake rum, lime, syrup, and pineapple with ice.",
      "Strain into rocks glass over ice.",
      "Grate nutmeg on top."
    ],
    "glass_type": "Rocks",
    "garnish": "Nutmeg grate",
    "difficulty": "Beginner"
  },
  {
    "slug": "singapore-sling",
    "name": "Singapore Sling",
    "description": "Gin, cherry brandy, citrus, and soda. A fruity, complex original from the Raffles Hotel.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "1.5 oz"},
      {"item": "Cherry brandy", "qty": "0.5 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"},
      {"item": "Pineapple juice", "qty": "1 oz"},
      {"item": "Grenadine", "qty": "0.25 oz"},
      {"item": "Soda water", "qty": "top"}
    ],
    "instructions": [
      "Shake gin, brandy, lime, pineapple, and grenadine with ice.",
      "Strain into highball over ice.",
      "Top with soda.",
      "Garnish with cherry and pineapple wedge."
    ],
    "glass_type": "Highball",
    "garnish": "Cherry, pineapple wedge",
    "difficulty": "Intermediate"
  },
  {
    "slug": "pimms-cup",
    "name": "Pimm's Cup",
    "description": "Pimm's No. 1, lemonade, cucumber, and mint. Wimbledon's favourite.",
    "image_url": "",
    "ingredients": [
      {"item": "Pimm's No. 1", "qty": "1.5 oz"},
      {"item": "Lemonade", "qty": "4 oz"},
      {"item": "Cucumber slices", "qty": "few"},
      {"item": "Fresh mint", "qty": "sprig"}
    ],
    "instructions": [
      "Add Pimm's and lemonade to highball over ice.",
      "Add cucumber and mint.",
      "Stir gently."
    ],
    "glass_type": "Highball",
    "garnish": "Cucumber, mint",
    "difficulty": "Beginner"
  },
  {
    "slug": "french-75",
    "name": "French 75",
    "description": "Gin, lemon, sugar, and champagne. A sparkling classic from WWI Paris.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "1 oz"},
      {"item": "Fresh lemon juice", "qty": "0.5 oz"},
      {"item": "Simple syrup", "qty": "0.5 oz"},
      {"item": "Champagne", "qty": "top"}
    ],
    "instructions": [
      "Shake gin, lemon, and syrup with ice.",
      "Strain into champagne flute.",
      "Top with champagne.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Champagne flute",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "kir",
    "name": "Kir",
    "description": "Crème de cassis and dry white wine. A simple French apéritif.",
    "image_url": "",
    "ingredients": [
      {"item": "Crème de cassis", "qty": "0.5 oz"},
      {"item": "Dry white wine", "qty": "5 oz"}
    ],
    "instructions": [
      "Add crème de cassis to wine glass.",
      "Top with white wine.",
      "Stir gently."
    ],
    "glass_type": "Wine",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "kir-royale",
    "name": "Kir Royale",
    "description": "Crème de cassis and champagne. The celebratory version of a Kir.",
    "image_url": "",
    "ingredients": [
      {"item": "Crème de cassis", "qty": "0.5 oz"},
      {"item": "Champagne", "qty": "5 oz"}
    ],
    "instructions": [
      "Add crème de cassis to champagne flute.",
      "Top with champagne.",
      "Stir gently."
    ],
    "glass_type": "Champagne flute",
    "garnish": "None",
    "difficulty": "Beginner"
  },
  {
    "slug": "bloody-mary",
    "name": "Bloody Mary",
    "description": "Vodka, tomato juice, and spice. The ultimate brunch saviour.",
    "image_url": "",
    "ingredients": [
      {"item": "Vodka", "qty": "2 oz"},
      {"item": "Tomato juice", "qty": "4 oz"},
      {"item": "Fresh lemon juice", "qty": "0.5 oz"},
      {"item": "Worcestershire sauce", "qty": "2 dashes"},
      {"item": "Hot sauce", "qty": "2 dashes"},
      {"item": "Celery salt", "qty": "pinch"}
    ],
    "instructions": [
      "Add all ingredients to shaker with ice.",
      "Shake gently.",
      "Strain into highball over ice.",
      "Garnish with celery stalk and lemon wedge."
    ],
    "glass_type": "Highball",
    "garnish": "Celery stalk",
    "difficulty": "Beginner"
  },
  {
    "slug": "sazerac",
    "name": "Sazerac",
    "description": "Rye whiskey, absinthe, Peychaud's bitters. New Orleans' official cocktail.",
    "image_url": "",
    "ingredients": [
      {"item": "Rye whiskey", "qty": "2 oz"},
      {"item": "Absinthe", "qty": "1 rinse"},
      {"item": "Sugar cube", "qty": "1"},
      {"item": "Peychaud's bitters", "qty": "3 dashes"}
    ],
    "instructions": [
      "Rinse rocks glass with absinthe and discard.",
      "Muddle sugar with bitters in separate glass.",
      "Add rye and ice; stir.",
      "Strain into absinthe-rinsed glass.",
      "Garnish with lemon peel."
    ],
    "glass_type": "Rocks",
    "garnish": "Lemon peel",
    "difficulty": "Intermediate"
  },
  {
    "slug": "vieux-carre",
    "name": "Vieux Carré",
    "description": "Rye, Cognac, vermouth, Bénédictine, and bitters. A complex New Orleans original.",
    "image_url": "",
    "ingredients": [
      {"item": "Rye whiskey", "qty": "1 oz"},
      {"item": "Cognac", "qty": "1 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Bénédictine", "qty": "0.25 oz"},
      {"item": "Peychaud's bitters", "qty": "2 dashes"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into rocks glass over ice.",
      "Garnish with lemon twist and brandied cherry."
    ],
    "glass_type": "Rocks",
    "garnish": "Lemon twist, cherry",
    "difficulty": "Intermediate"
  },
  {
    "slug": "pendennis-club",
    "name": "Pendennis Club",
    "description": "Gin, apricot brandy, and lemon. A refreshing, fruity sour from Louisville.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "2 oz"},
      {"item": "Apricot brandy", "qty": "0.75 oz"},
      {"item": "Fresh lemon juice", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "clover-club",
    "name": "Clover Club",
    "description": "Gin, raspberry, lemon, and egg white. A tart, pink, pre-Prohibition sour.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "1.5 oz"},
      {"item": "Raspberry syrup", "qty": "0.75 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"},
      {"item": "Egg white", "qty": "1"}
    ],
    "instructions": [
      "Dry shake all ingredients without ice.",
      "Add ice and shake again.",
      "Double strain into coupe.",
      "Garnish with brandied cherry."
    ],
    "glass_type": "Coupe",
    "garnish": "Brandied cherry",
    "difficulty": "Intermediate"
  },
  {
    "slug": "jack-rose",
    "name": "Jack Rose",
    "description": "Applejack, lime, and grenadine. A tart, apple-forward sour from the 1920s.",
    "image_url": "",
    "ingredients": [
      {"item": "Applejack", "qty": "2 oz"},
      {"item": "Fresh lime juice", "qty": "0.75 oz"},
      {"item": "Grenadine", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with lime wheel."
    ],
    "glass_type": "Coupe",
    "garnish": "Lime wheel",
    "difficulty": "Beginner"
  },
  {
    "slug": "bamboo",
    "name": "Bamboo",
    "description": "Sherry and dry vermouth. A light, refreshing, and underrated pre-dinner drink.",
    "image_url": "",
    "ingredients": [
      {"item": "Fino sherry", "qty": "2 oz"},
      {"item": "Dry vermouth", "qty": "1 oz"},
      {"item": "Angostura bitters", "qty": "1 dash"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "adonis",
    "name": "Adonis",
    "description": "Sherry, vermouth, and orange bitters. A low-ABV, sophisticated cooler.",
    "image_url": "",
    "ingredients": [
      {"item": "Fino sherry", "qty": "1.5 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Orange bitters", "qty": "2 dashes"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe over ice.",
      "Garnish with orange twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Orange twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "bamboo-2",
    "name": "Bamboo #2",
    "description": "Sherry and dry vermouth with bitters. A refreshing light cocktail.",
    "image_url": "",
    "ingredients": [
      {"item": "Amontillado sherry", "qty": "2 oz"},
      {"item": "Dry vermouth", "qty": "1 oz"},
      {"item": "Angostura bitters", "qty": "1 dash"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "el-diablo",
    "name": "El Diablo",
    "description": "Tequila, crème de cassis, lime, and ginger beer. A spicy, fizzy highball.",
    "image_url": "",
    "ingredients": [
      {"item": "Tequila", "qty": "2 oz"},
      {"item": "Crème de cassis", "qty": "0.75 oz"},
      {"item": "Fresh lime juice", "qty": "0.5 oz"},
      {"item": "Ginger beer", "qty": "top"}
    ],
    "instructions": [
      "Add tequila, cassis, and lime to shaker with ice.",
      "Shake and strain into highball over ice.",
      "Top with ginger beer.",
      "Garnish with lime wedge."
    ],
    "glass_type": "Highball",
    "garnish": "Lime wedge",
    "difficulty": "Beginner"
  },
  {
    "slug": "hospitality",
    "name": "Hospitality",
    "description": "Gin, Lillet, and orange bitters. A light, elegant, and underrated French-inspired cocktail.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "2 oz"},
      {"item": "Lillet Blanc", "qty": "1 oz"},
      {"item": "Orange bitters", "qty": "2 dashes"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with orange twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Orange twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "vesper",
    "name": "Vesper",
    "description": "Gin, vodka, and Lillet. James Bond's original invention.",
    "image_url": "",
    "ingredients": [
      {"item": "Gin", "qty": "3 oz"},
      {"item": "Vodka", "qty": "1 oz"},
      {"item": "Lillet Blanc", "qty": "0.5 oz"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist",
    "difficulty": "Beginner"
  },
  {
    "slug": "rob-roy",
    "name": "Rob Roy",
    "description": "Scotch, sweet vermouth, and bitters. Scotland's answer to the Manhattan.",
    "image_url": "",
    "ingredients": [
      {"item": "Scotch whisky", "qty": "2 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Angostura bitters", "qty": "2 dashes"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with brandied cherry."
    ],
    "glass_type": "Coupe",
    "garnish": "Brandied cherry",
    "difficulty": "Beginner"
  },
  {
    "slug": "blood-and-sand",
    "name": "Blood and Sand",
    "description": "Scotch, cherry brandy, sweet vermouth, and orange juice. A fruity, Scotch-based sour.",
    "image_url": "",
    "ingredients": [
      {"item": "Scotch whisky", "qty": "0.75 oz"},
      {"item": "Cherry brandy", "qty": "0.75 oz"},
      {"item": "Sweet vermouth", "qty": "0.75 oz"},
      {"item": "Fresh orange juice", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Double strain into coupe.",
      "Garnish with brandied cherry and orange twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Cherry, orange twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "bobby-burns",
    "name": "Bobby Burns",
    "description": "Scotch, sweet vermouth, and Bénédictine. A rich, herbal Scotch cocktail.",
    "image_url": "",
    "ingredients": [
      {"item": "Scotch whisky", "qty": "1.5 oz"},
      {"item": "Sweet vermouth", "qty": "1 oz"},
      {"item": "Bénédictine", "qty": "0.25 oz"}
    ],
    "instructions": [
      "Stir all ingredients with ice.",
      "Strain into coupe.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Coupe",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  },
  {
    "slug": "penicillin",
    "name": "Penicillin",
    "description": "Scotch, honey-ginger, lemon, and Islay. A modern classic with medicinal depth.",
    "image_url": "",
    "ingredients": [
      {"item": "Blended Scotch", "qty": "2 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"},
      {"item": "Honey-ginger syrup", "qty": "0.75 oz"},
      {"item": "Islay Scotch", "qty": "0.25 oz (float)"}
    ],
    "instructions": [
      "Shake blended Scotch, lemon, and syrup with ice.",
      "Strain into rocks glass over ice.",
      "Float Islay Scotch on top.",
      "Garnish with candied ginger."
    ],
    "glass_type": "Rocks",
    "garnish": "Candied ginger",
    "difficulty": "Intermediate"
  },
  {
    "slug": "paperplane",
    "name": "Paper Plane",
    "description": "Bourbon, Aperol, Amaro Nonino, and lemon. Equal parts modern balance.",
    "image_url": "",
    "ingredients": [
      {"item": "Bourbon", "qty": "0.75 oz"},
      {"item": "Aperol", "qty": "0.75 oz"},
      {"item": "Amaro Nonino", "qty": "0.75 oz"},
      {"item": "Fresh lemon juice", "qty": "0.75 oz"}
    ],
    "instructions": [
      "Shake all ingredients with ice.",
      "Strain into rocks glass over ice.",
      "Garnish with lemon twist."
    ],
    "glass_type": "Rocks",
    "garnish": "Lemon twist",
    "difficulty": "Intermediate"
  }
]

print(f"Prepared: {len(cocktails)} cocktails")

try:
    r = requests.get(f"{BASE}/api/cocktails", timeout=10)
    print(f"API check: {r.status_code}")
    r.raise_for_status()
except Exception as e:
    print(f"API failed: {e}")
    sys.exit(1)

inserted = 0
for c in cocktails:
    try:
        r = requests.post(COCKTAIL_URL, json=c, timeout=15)
        if r.status_code == 201:
            inserted += 1
            print(f"INSERTED: {c['name']}")
        elif r.status_code == 409 or 'already exists' in r.text.lower() or 'unique' in r.text.lower():
            print(f"EXISTS:  {c['name']}")
        else:
            print(f"FAIL {c['name']}: {r.status_code} {r.text[:200]}")
    except Exception as e:
        print(f"ERR {c['name']}: {e}")

print(f"\nInserted {inserted} new cocktails")
