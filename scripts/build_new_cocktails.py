import json

existing_slugs = {
  "adonis", "americano", "aperol-sour", "aperol-spritz", "b-52", "bamboo", "bamboo-2", "bellini", "black-russian", "blood-and-sand", "bloody-mary", "bobby-burns", "boulevardier", "caipirinha", "clover-club", "corpse-reviver-2", "cosmopolitan", "cuba-libre", "daiquiri", "dark-n-stormy", "el-diablo", "espresso-martini", "fat-wash-bourbon", "french-75", "godfather", "hospitality", "hugo", "hurricane", "jack-rose", "jungle-bird", "kir", "kir-royale", "last-word", "long-island-iced-tea", "mai-tai", "manhattan", "margarita", "martini", "milk-punch", "mimosa", "mind-eraser", "mojito", "negroni", "negroni-sbagliato", "old-fashioned", "paloma", "paperplane", "paper-plane", "pendennis-club", "penicillin", "pimms-cup", "pina-colada", "planters-punch", "rob-roy", "rusty-nail", "sazerac", "sidecar", "singapore-sling", "stinger", "suffering-bastard", "tequila-sunrise", "tom-collins", "vesper", "vieux-carre", "whiskey-sour", "white-russian", "zombie"
}

cocktails = []

def add(slug, name, desc, ingredients, instructions, glass, garnish, difficulty):
    if slug in existing_slugs:
        raise ValueError(f"Duplicate with existing: {slug}")
    cocktails.append({
        "slug": slug,
        "name": name,
        "description": desc,
        "image_url": "",
        "ingredients": ingredients,
        "instructions": instructions,
        "glass_type": glass,
        "garnish": garnish,
        "difficulty": difficulty
    })

add("aviation", "Aviation", "A pre-Prohibition classic with a floral violet hue.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Maraschino liqueur","qty":"0.5 oz"},{"item":"Fresh lemon juice","qty":"0.75 oz"},{"item":"Crème de violette","qty":"0.25 oz"}
], ["Add all ingredients to shaker with ice.","Shake hard and double strain into chilled coupe."], "Coupe", "Maraschino cherry", "Intermediate")

add("bees-knees", "Bee's Knees", "Prohibition-era sour with honey and orange blossom.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"0.75 oz"},{"item":"Honey syrup","qty":"0.75 oz"},{"item":"Orange blossom water","qty":"1 dash"}
], ["Add gin, lemon, and honey syrup to shaker with ice.","Shake hard and strain into chilled coupe."], "Coupe", "Lemon twist", "Beginner")

add("between-the-sheets", "Between the Sheets", "A 1930s boozy number. Cognac, rum, triple sec, and lemon.", [
  {"item":"Cognac","qty":"1 oz"},{"item":"White rum","qty":"1 oz"},{"item":"Triple sec","qty":"1 oz"},{"item":"Fresh lemon juice","qty":"0.5 oz"},{"item":"Simple syrup","qty":"0.5 oz"}
], ["Add all ingredients to shaker with ice.","Shake hard and strain into chilled coupe."], "Coupe", "Lemon twist", "Beginner")

add("bijou", "Bijou", "French for 'jewel.' Gin, vermouth, Chartreuse, and bitters.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Sweet vermouth","qty":"1 oz"},{"item":"Green Chartreuse","qty":"1 oz"},{"item":"Angostura bitters","qty":"2 dashes"}
], ["Add all ingredients to mixing glass with ice.","Stir 20–30 seconds and strain into chilled coupe."], "Coupe", "Lemon twist", "Intermediate")

add("bramble", "Bramble", "A modern British classic from the 1980s. Gin, lemon, sugar, and crème de mûre.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.5 oz"},{"item":"Crème de mûre","qty":"0.75 oz"},{"item":"Fresh blackberries","qty":"2–3"}
], ["Add gin, lemon, and syrup to shaker with ice.","Shake and strain over crushed ice.","Drizzle crème de mûre over top."], "Rocks", "Fresh blackberries", "Beginner")

add("churchill", "Churchill", "A punchy Churchill-esque drink. Strong, stirred, and unapologetic.", [
  {"item":"Bourbon","qty":"2 oz"},{"item":"Sweet vermouth","qty":"1 oz"},{"item":"Bénédictine","qty":"0.5 oz"},{"item":"Angostura bitters","qty":"2 dashes"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into chilled coupe."], "Coupe", "Orange twist", "Intermediate")

add("hanky-panky", "Hanky Panky", "A secret menu item from London, 1903. Equal parts gin, vermouth, and Fernet-Branca.", [
  {"item":"London dry gin","qty":"1.5 oz"},{"item":"Sweet vermouth","qty":"1.5 oz"},{"item":"Fernet-Branca","qty":"2 dashes"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into chilled coupe."], "Coupe", "Orange twist", "Intermediate")

add("irish-coffee", "Irish Coffee", "Hot coffee, Irish whiskey, sugar, and cream. Created at Foynes Airport in 1943.", [
  {"item":"Irish whiskey","qty":"1.5 oz"},{"item":"Hot coffee","qty":"6 oz"},{"item":"Sugar","qty":"1 tsp"},{"item":"Heavy cream","qty":"1 oz"}
], ["Preheat a heatproof glass.","Add whiskey and sugar, fill with hot coffee.","Float cream on top using a spoon."], "Irish Coffee Glass", "Nutmeg grate", "Beginner")

add("mint-julep", "Mint Julep", "Bourbon, mint, and crushed ice. The signature drink of the Kentucky Derby.", [
  {"item":"Bourbon","qty":"2 oz"},{"item":"Fresh mint leaves","qty":"8–10"},{"item":"Simple syrup","qty":"0.5 oz"},{"item":"Crushed ice","qty":"as needed"}
], ["Muddle mint with simple syrup in julep cup.","Fill with crushed ice.","Add bourbon and stir until cup frosts."], "Julep Cup", "Mint bouquet", "Beginner")

add("monkey-gland", "Monkey Gland", "A 1920s eccentric cocktail. Gin, orange juice, absinthe, and grenadine.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Fresh orange juice","qty":"1 oz"},{"item":"Absinthe","qty":"0.25 oz"},{"item":"Grenadine","qty":"0.5 oz"}
], ["Add all ingredients to shaker with ice.","Shake hard and strain into chilled coupe."], "Coupe", "Orange twist", "Beginner")

add("moscow-mule", "Moscow Mule", "Vodka, ginger beer, and lime. Served in a copper mug.", [
  {"item":"Vodka","qty":"2 oz"},{"item":"Fresh lime juice","qty":"0.5 oz"},{"item":"Ginger beer","qty":"4–6 oz"}
], ["Add vodka and lime juice to copper mug over ice.","Top with ginger beer and stir gently."], "Copper Mug", "Lime wheel", "Beginner")

add("old-cuban", "Old Cuban", "Created by Audrey Saunders. Aged rum, mint, lime, and sparkling wine.", [
  {"item":"Aged rum","qty":"1.5 oz"},{"item":"Fresh lime juice","qty":"0.75 oz"},{"item":"Simple syrup","qty":"0.75 oz"},{"item":"Fresh mint leaves","qty":"8–10"},{"item":"Champagne","qty":"top"}
], ["Muddle mint with lime and syrup.","Add rum and ice, shake hard.","Double strain and top with champagne."], "Coupe", "Mint sprig", "Intermediate")

add("pisco-sour", "Pisco Sour", "Peru's national cocktail. Pisco, lemon, sugar, egg white, and bitters.", [
  {"item":"Pisco","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.75 oz"},{"item":"Egg white","qty":"1"},{"item":"Angostura bitters","qty":"2 dashes"}
], ["Add pisco, lemon, syrup, and egg white to shaker.","Dry shake without ice.","Add ice, shake hard, and double strain.","Dash bitters on foam."], "Coupe", "Angostura bitters on foam", "Intermediate")

add("polar-bear", "Polar Bear", "A layered shooter. Coffee, Irish cream, and orange.", [
  {"item":"Coffee liqueur","qty":"1 oz"},{"item":"Irish cream","qty":"1 oz"},{"item":"Orange liqueur","qty":"1 oz"}
], ["Layer coffee liqueur, Irish cream, and orange liqueur into a shot glass."], "Shot", "None", "Beginner")

add("pousse-cafe", "Pousse Café", "A layered dessert shooter. Multiple liqueurs create a rainbow.", [
  {"item":"Grenadine","qty":"0.5 oz"},{"item":"Green crème de menthe","qty":"0.5 oz"},{"item":"Crème de banane","qty":"0.5 oz"},{"item":"Brandy","qty":"0.5 oz"},{"item":"Triple sec","qty":"0.5 oz"}
], ["Carefully layer each liqueur from heaviest to lightest using a bar spoon."], "Pousse Café Glass", "None", "Advanced")

add("raptor", "Raptor", "A strong, stirred number. Bourbon, amaro, and bitters.", [
  {"item":"Bourbon","qty":"2 oz"},{"item":"Amaro Nonino","qty":"0.75 oz"},{"item":"Angostura bitters","qty":"2 dashes"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into rocks glass over ice."], "Rocks", "Orange twist", "Intermediate")

add("remember-the-maine", "Remember the Maine", "A rye-based cocktail from the 1930s. Whiskey, vermouth, cherry liqueur, and absinthe.", [
  {"item":"Rye whiskey","qty":"1.5 oz"},{"item":"Sweet vermouth","qty":"1 oz"},{"item":"Cherry liqueur","qty":"0.25 oz"},{"item":"Absinthe","qty":"1 dash"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into chilled coupe."], "Coupe", "Brandied cherry", "Intermediate")

add("rose", "Rose", "A delicate pink cocktail from the 1920s. Kirsch, vermouth, and applejack.", [
  {"item":"Kirsch","qty":"1 oz"},{"item":"Dry vermouth","qty":"1 oz"},{"item":"Applejack","qty":"0.5 oz"},{"item":"Grenadine","qty":"0.25 oz"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into chilled coupe."], "Coupe", "Lemon twist", "Intermediate")

add("scotch-sour", "Scotch Sour", "A whisky sour made with scotch. Smoky, citrusy, and shaken.", [
  {"item":"Blended scotch","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.5 oz"},{"item":"Egg white","qty":"1 (optional)"}
], ["Add scotch, lemon, syrup, and egg white to shaker.","Dry shake without ice.","Add ice and shake hard.","Double strain into rocks glass over ice."], "Rocks", "Lemon slice / cherry", "Beginner")

add("screwdriver", "Screwdriver", "The simplest good drink. Vodka and orange juice, built in the glass.", [
  {"item":"Vodka","qty":"2 oz"},{"item":"Fresh orange juice","qty":"6 oz"}
], ["Add vodka to highball over ice.","Top with orange juice and stir gently."], "Highball", "Orange slice", "Beginner")

add("sea-breeze", "Sea Breeze", "A refreshing 1970s cocktail. Vodka, cranberry, and grapefruit.", [
  {"item":"Vodka","qty":"1.5 oz"},{"item":"Cranberry juice","qty":"3 oz"},{"item":"Grapefruit juice","qty":"1.5 oz"}
], ["Add all ingredients to shaker with ice.","Shake gently and strain into rocks glass over ice."], "Rocks", "Lime wheel", "Beginner")

add("sex-on-the-beach", "Sex on the Beach", "A fruity tropical number from the 1980s. Vodka, peach schnapps, orange, and cranberry.", [
  {"item":"Vodka","qty":"1 oz"},{"item":"Peach schnapps","qty":"1 oz"},{"item":"Orange juice","qty":"2 oz"},{"item":"Cranberry juice","qty":"2 oz"}
], ["Add all ingredients to shaker with ice.","Shake gently and strain into highball over ice."], "Highball", "Orange slice", "Beginner")

add("sidecar-classic", "Sidecar", "A 1920s classic from Paris. Cognac, triple sec, and lemon.", [
  {"item":"Cognac","qty":"2 oz"},{"item":"Triple sec","qty":"0.75 oz"},{"item":"Fresh lemon juice","qty":"0.75 oz"},{"item":"Simple syrup","qty":"0.25 oz"}
], ["Add cognac, triple sec, lemon, and syrup to shaker with ice.","Shake hard and double strain into chilled coupe."], "Coupe", "Orange twist", "Intermediate")

add("singapore-sling-classic", "Singapore Sling", "A fruity complex gin cocktail from the Raffles Hotel.", [
  {"item":"London dry gin","qty":"1.5 oz"},{"item":"Cherry liqueur","qty":"0.5 oz"},{"item":"Cointreau","qty":"0.25 oz"},{"item":"Bénédictine","qty":"0.25 oz"},{"item":"Fresh lime juice","qty":"0.5 oz"},{"item":"Pineapple juice","qty":"1 oz"},{"item":"Grenadine","qty":"0.5 oz"},{"item":"Soda water","qty":"top"}
], ["Add all ingredients except soda to shaker with ice.","Shake gently and strain into highball over ice.","Top with soda water."], "Highball", "Pineapple wedge / cherry", "Advanced")

add("st-germain-spritz", "St-Germain Spritz", "Elderflower, sparkling wine, and soda — light, floral, and dangerously drinkable.", [
  {"item":"St-Germain elderflower liqueur","qty":"1.5 oz"},{"item":"Prosecco","qty":"3 oz"},{"item":"Soda water","qty":"1 oz"},{"item":"Fresh lemon juice","qty":"0.5 oz"}
], ["Add St-Germain and lemon juice to wine glass over ice.","Top with prosecco and soda water."], "Wine Glass", "Lemon twist", "Beginner")

add("tequila-sunrise-classic", "Tequila Sunrise", "Tequila, orange juice, and grenadine — a 1970s sunset.", [
  {"item":"Blanco tequila","qty":"2 oz"},{"item":"Orange juice","qty":"6 oz"},{"item":"Grenadine","qty":"0.5 oz"}
], ["Add tequila and orange juice to highball over ice.","Slowly pour grenadine down the inside."], "Highball", "Orange slice / cherry", "Beginner")

add("tom-collins-classic", "Tom Collins", "Gin, lemon, sugar, and soda — a tall refreshing highball.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.75 oz"},{"item":"Soda water","qty":"top"}
], ["Add gin, lemon, and syrup to shaker with ice.","Shake and strain into Collins glass over ice.","Top with soda water."], "Collins", "Lemon slice / cherry", "Beginner")

add("vesper-martini", "Vesper", "James Bond's original. Gin, vodka, and Lillet.", [
  {"item":"London dry gin","qty":"3 oz"},{"item":"Vodka","qty":"1 oz"},{"item":"Lillet Blanc","qty":"0.5 oz"}
], ["Add all ingredients to mixing glass with ice.","Stir until very cold and strain into chilled coupe."], "Coupe", "Lemon twist", "Intermediate")

add("vieux-carre-stirred", "Vieux Carré", "A New Orleans original from the 1930s. Rye, cognac, vermouth, Bénédictine, and bitters.", [
  {"item":"Rye whiskey","qty":"1 oz"},{"item":"Cognac","qty":"1 oz"},{"item":"Sweet vermouth","qty":"1 oz"},{"item":"Bénédictine","qty":"0.25 oz"},{"item":"Angostura bitters","qty":"2 dashes"},{"item":"Peychaud's bitters","qty":"2 dashes"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into chilled coupe."], "Rocks", "Orange twist / cherry", "Advanced")

add("whiskey-sour-classic", "Whiskey Sour", "Bourbon, lemon, sugar, shaken hard. Foundational sour since 1862.", [
  {"item":"Bourbon","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.75 oz"},{"item":"Egg white","qty":"1 (optional)"}
], ["Add bourbon, lemon, syrup, and egg white to shaker.","Dry shake without ice.","Add ice and shake hard.","Double strain into rocks glass over ice."], "Rocks", "Angostura bitters on foam", "Beginner")

add("white-russian-classic", "White Russian", "Coffee, cream, and vodka. The Dude's drink.", [
  {"item":"Vodka","qty":"2 oz"},{"item":"Coffee liqueur","qty":"1 oz"},{"item":"Heavy cream","qty":"1 oz"}
], ["Add vodka and coffee liqueur to rocks glass over ice.","Gently float cream on top."], "Rocks", "None", "Beginner")

add("zombie-classic", "Zombie", "Don the Beachcomber's Tiki masterpiece. Multiple rums, citrus, and falernum.", [
  {"item":"White rum","qty":"1 oz"},{"item":"Dark rum","qty":"1 oz"},{"item":"Overproof rum","qty":"0.5 oz"},{"item":"Fresh lime juice","qty":"1 oz"},{"item":"Pineapple juice","qty":"1 oz"},{"item":"Falernum","qty":"0.5 oz"},{"item":"Grenadine","qty":"0.5 oz"},{"item":"Angostura bitters","qty":"2 dashes"}
], ["Add all ingredients except bitters to shaker with ice.","Shake hard and strain into tall glass over crushed ice.","Dash bitters on top."], "Highball", "Mint sprig", "Advanced")

add("americano-sbagliato", "Americano Sbagliato", "The Italian accidental classic. Campari, vermouth, and sparkling wine.", [
  {"item":"Campari","qty":"1 oz"},{"item":"Sweet vermouth","qty":"1 oz"},{"item":"Prosecco","qty":"2 oz"}
], ["Add Campari and vermouth to rocks glass over ice.","Top with prosecco and stir gently."], "Rocks", "Orange slice", "Beginner")

add("aviation-extra-dry", "Aviation Extra Dry", "A drier take on the Aviation with extra vermouth.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Dry vermouth","qty":"0.75 oz"},{"item":"Maraschino liqueur","qty":"0.5 oz"},{"item":"Crème de violette","qty":"0.25 oz"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and double strain into chilled coupe."], "Coupe", "Luxardo cherry", "Intermediate")

add("bacardi-cocktail", "Bacardi Cocktail", "A 1930s classic. Light rum, lime, grenadine, and sugar.", [
  {"item":"White rum","qty":"2 oz"},{"item":"Fresh lime juice","qty":"1 oz"},{"item":"Grenadine","qty":"0.25 oz"},{"item":"Simple syrup","qty":"0.25 oz"}
], ["Add all ingredients to shaker with ice.","Shake hard and strain into chilled coupe."], "Coupe", "Lime wheel", "Beginner")

add("boston-cocktail", "Boston Cocktail", "A warm citrusy stirred cocktail from the 1910s. Brandy, orange curaçao, and lemon.", [
  {"item":"Brandy","qty":"1.5 oz"},{"item":"Orange curaçao","qty":"0.75 oz"},{"item":"Fresh lemon juice","qty":"0.5 oz"},{"item":"Grenadine","qty":"0.25 oz"}
], ["Add all ingredients to mixing glass with ice.","Stir until chilled and strain into chilled coupe."], "Coupe", "Orange twist", "Intermediate")

add("bramble-extra", "Bramble Extra", "A richer version of the Bramble with extra blackberry depth.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.75 oz"},{"item":"Crème de mûre","qty":"1 oz"}
], ["Add gin, lemon, and syrup to shaker with ice.","Shake and strain over crushed ice.","Drizzle crème de mûre over top."], "Rocks", "Fresh blackberries", "Beginner")

add("caesar-cocktail", "Caesar", "Canada's answer to the Bloody Mary. Clamato, vodka, and Worcestershire.", [
  {"item":"Vodka","qty":"1.5 oz"},{"item":"Clamato juice","qty":"4 oz"},{"item":"Worcestershire sauce","qty":"2 dashes"},{"item":"Hot sauce","qty":"2 dashes"},{"item":"Celery salt","qty":"pinch"}
], ["Rim glass with celery salt and pepper.","Add vodka, Clamato, Worcestershire, hot sauce, and celery salt.","Fill with ice and stir."], "Highball", "Celery stalk / lime wedge", "Beginner")

add("champagne-cocktail", "Champagne Cocktail", "A 19th-century luxury drink. Bitters, sugar, cognac, and champagne.", [
  {"item":"Sugar cube","qty":"1"},{"item":"Angostura bitters","qty":"2 dashes"},{"item":"Cognac","qty":"1 oz"},{"item":"Champagne","qty":"5 oz"}
], ["Place sugar cube in flute and saturate with bitters.","Add cognac and top with champagne."], "Flute", "Orange twist", "Beginner")

add("clover-club-extra", "Clover Club Extra", "A richer raspberry sour with egg white foam.", [
  {"item":"London dry gin","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Raspberry syrup","qty":"0.75 oz"},{"item":"Egg white","qty":"1"}
], ["Add all ingredients to shaker.","Dry shake without ice.","Add ice and shake hard.","Double strain into chilled coupe."], "Coupe", "Fresh raspberry", "Intermediate")

add("corpse-reviver-extra", "Corpse Reviver #3", "A stronger revival. Cognac, apple brandy, and absinthe.", [
  {"item":"Cognac","qty":"1 oz"},{"item":"Apple brandy","qty":"1 oz"},{"item":"Lillet Blanc","qty":"1 oz"},{"item":"Absinthe","qty":"0.5 oz"},{"item":"Fresh lemon juice","qty":"0.5 oz"}
], ["Add all ingredients to shaker with ice.","Shake hard and strain into chilled coupe."], "Coupe", "Orange twist", "Intermediate")

add("cuba-libre-classic", "Cuba Libre", "Rum, cola, and lime. A simple refreshing highball from Cuba.", [
  {"item":"White rum","qty":"2 oz"},{"item":"Cola","qty":"4–6 oz"},{"item":"Fresh lime juice","qty":"0.5 oz"}
], ["Add rum and lime juice to highball over ice.","Top with cola and stir gently."], "Highball", "Lime wedge", "Beginner")

add("dark-n-stormy-extra", "Dark 'n' Stormy Extra", "A spiced-up version with ginger beer and lime.", [
  {"item":"Dark rum","qty":"2 oz"},{"item":"Fresh lime juice","qty":"0.5 oz"},{"item":"Ginger beer","qty":"4–6 oz"},{"item":"Simple syrup","qty":"0.25 oz"}
], ["Add rum and lime to highball over ice.","Top with ginger beer and simple syrup."], "Highball", "Lime wheel", "Beginner")

add("el-diablo-extra", "El Diablo", "Tequila, crème de cassis, lime, and ginger beer.", [
  {"item":"Blanco tequila","qty":"2 oz"},{"item":"Crème de cassis","qty":"1 oz"},{"item":"Fresh lime juice","qty":"0.5 oz"},{"item":"Ginger beer","qty":"top"}
], ["Add tequila, crème de cassis, and lime to highball over ice.","Top with ginger beer."], "Highball", "Lime wheel", "Beginner")

add("espresso-martini-classic", "Espresso Martini", "Vodka, coffee liqueur, and fresh espresso. Shaken until frothy.", [
  {"item":"Vodka","qty":"2 oz"},{"item":"Coffee liqueur","qty":"1 oz"},{"item":"Fresh espresso","qty":"1 oz"},{"item":"Simple syrup","qty":"0.25 oz"}
], ["Add all ingredients to shaker with ice.","Shake hard until frosty and double strain into chilled coupe."], "Coupe", "Coffee beans", "Intermediate")

add("french-75-classic", "French 75", "Champagne, gin, lemon, and sugar. A WWI-era cocktail with a kick.", [
  {"item":"London dry gin","qty":"1 oz"},{"item":"Fresh lemon juice","qty":"0.5 oz"},{"item":"Simple syrup","qty":"0.5 oz"},{"item":"Champagne","qty":"4 oz"}
], ["Add gin, lemon, and syrup to shaker with ice.","Shake and strain into champagne flute.","Top with champagne."], "Flute", "Lemon twist", "Intermediate")

add("godmother", "Godmother", "Vodka and amaretto — simple, nutty, and dangerously smooth.", [
  {"item":"Vodka","qty":"1.5 oz"},{"item":"Amaretto","qty":"1.5 oz"}
], ["Add vodka and amaretto to mixing glass with ice.","Stir until chilled and strain into rocks glass over ice."], "Rocks", "None", "Beginner")

add("harvey-wallbanger", "Harvey Wallbanger", "A 1970s classic. Vodka, orange juice, and a float of Galliano.", [
  {"item":"Vodka","qty":"1.5 oz"},{"item":"Orange juice","qty":"4 oz"},{"item":"Galliano","qty":"0.5 oz"}
], ["Add vodka and orange juice to highball over ice.","Gently float Galliano on top."], "Highball", "Orange slice", "Beginner")

add("hemingway-daiquiri", "Hemingway Daiquiri", "A Hemingway original. No sugar — maraschino, grapefruit, and lime keep it dry.", [
  {"item":"White rum","qty":"2 oz"},{"item":"Maraschino liqueur","qty":"0.5 oz"},{"item":"Fresh grapefruit juice","qty":"0.75 oz"},{"item":"Fresh lime juice","qty":"0.5 oz"}
], ["Add rum, maraschino, grapefruit juice, and lime juice to shaker with ice.","Shake hard and strain into chilled coupe."], "Coupe", "Lime wheel", "Intermediate")

add("john-collins", "John Collins", "The precursor to the Tom Collins. Genever, lemon, sugar, and soda.", [
  {"item":"Geneva gin","qty":"2 oz"},{"item":"Fresh lemon juice","qty":"1 oz"},{"item":"Simple syrup","qty":"0.75 oz"},{"item":"Soda water","qty":"top"}
], ["Add gin, lemon, and syrup to shaker with ice.","Shake and strain into Collins glass over ice.","Top with soda water."], "Collins", "Lemon slice / cherry", "Beginner")

# Verification
from collections import Counter
slugs = [c['slug'] for c in cocktails]
print(f"Total added: {len(cocktails)}")
print(f"Unique slugs: {len(set(slugs))}")
dupes = [s for s in slugs if s in existing_slugs]
if dupes:
    print(f"DUPLICATES with existing: {dupes}")
    raise SystemExit(1)
if len(cocktails) != 50:
    print(f"ERROR: Expected 50, got {len(cocktails)}")
    raise SystemExit(1)

with open('/home/skicmi/bartender-sanctuary-app/scripts/new-cocktails.json', 'w') as f:
    json.dump(cocktails, f, indent=2)

print(f"SUCCESS: {len(cocktails)} cocktails written to new-cocktails.json")
print("Sample:", [c['slug'] for c in cocktails[:5]], "...", [c['slug'] for c in cocktails[-3:]])
