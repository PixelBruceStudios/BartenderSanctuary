export interface Bottle {
  name: string;
  description: string;
  related: string[];
  image?: string;
}

export interface Ingredient {
  name: string;
  category: string;
  description: string;
  brands: string[];
  notes: string;
  bottles?: Bottle[];
}

export const ingredients: Ingredient[] = [
  // WHISKIES
  { name: "Scotch whisky", category: "Whiskies", description: "Whisky produced in Scotland, typically aged in oak casks for at least 3 years. Ranges from light and floral (Lowlands) to smoky and peaty (Islay).", brands: ["Glenfiddich", "The Glenlivet", "Macallan", "Lagavulin", "Laphroaig", "Ardbeg", "Balvenie", "Oban", "Talisker", "Johnnie Walker"], notes: "Use blended for mixed drinks, single malt for sipping or spirit-forward cocktails.", bottles: [
    { name: "Glenfiddich 12", description: "Scotland's most popular single malt. Light, fruity, with pear and oak notes. The ideal introduction to Speyside whiskies.", related: ["Glenfiddich 14", "Glenfiddich 18", "Glenfiddich 21"], image: "/images/bottles/glenfiddich-12.png" },
    { name: "The Glenlivet 12", description: "Smooth, elegant Speyside single malt. Citrus, vanilla, and stone fruit. A classic gateway whisky.", related: ["The Glenlivet 15", "The Glenlivet 18", "The Glenlivet 21"], image: "/images/bottles/glenlivet-12.png" },
    { name: "Macallan 12 Double Cask", description: "Rich, sherried Speyside single malt. Honey, ginger, and dried fruit. Luxury benchmark for cocktails like Rob Roy.", related: ["Macallan 18", "Macallan 25", "Macallan Rare Cask"], image: "/images/bottles/macallan-12.png" },
    { name: "Laphroaig 10", description: "Iconic Islay single malt. Intense peat smoke, seaweed, and medicinal iodine. Love it or hate it — unforgettable.", related: ["Laphroaig Quarter Cask", "Laphroaig 18", "Laphroaig Lore"], image: "/images/bottles/laphroaig-10.png" },
    { name: "Ardbeg 10", description: "Peaty Islay single malt with surprising sweetness. Tar, smoked fish, and citrus. The balanced Islay experience.", related: ["Ardbeg Uigeadail", "Ardbeg Corryvreckan", "Ardbeg 10"], image: "/images/bottles/ardbeg-10.png" },
    { name: "Lagavulin 16", description: "The king of Islay. Deep peat smoke, dried fruit, and maritime salt. The definitive smoky whisky.", related: ["Lagavulin 12", "Lagavulin 25", "Lagavulin Distillers Edition"], image: "/images/bottles/lagavulin-16.png" },
  ] },
  { name: "Blended scotch", category: "Whiskies", description: "A blend of malt and grain whiskies from multiple Scottish distilleries. Consistent year-round character, smoother and more approachable.", brands: ["Johnnie Walker Black", "Chivas Regal 12", "Ballantine's Finest", "Dewar's 12", "Cutty Sark"], notes: "Workhorse for Rusty Nail, Blood and Sand, Rob Roy.", bottles: [
    { name: "Johnnie Walker Red Label", description: "The original Johnnie Walker blend. Bold, fiery, and versatile. Designed for mixing in highballs and cocktails — not meant for sipping neat.", related: ["Johnnie Walker Black Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], image: "/images/bottles/jw-red.png" },
    { name: "Johnnie Walker Black Label", description: "12-year-old blended Scotch. Rich, smooth, with notes of vanilla, honey, and dried fruit. The benchmark for mixed drinks and sipping alike.", related: ["Johnnie Walker Red Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label", "Johnnie Walker Double Black"], image: "/images/bottles/jw-black.png" },
    { name: "Johnnie Walker Gold Label", description: "Luxurious blend of rare single malts and grains. Honeyed, floral, and remarkably smooth. Reserved for special occasions.", related: ["Johnnie Walker Black Label", "Johnnie Walker Platinum Label", "Johnnie Walker Blue Label"], image: "/images/bottles/jw-gold.png" },
    { name: "Johnnie Walker Blue Label", description: "The pinnacle. A rare blend of exceptional single malts from across Scotland. Unmatched depth, complexity, and smoothness.", related: ["Johnnie Walker Gold Label", "Johnnie Walker Platinum Label", "Johnnie Walker King George V"], image: "/images/bottles/jw-blue.png" },
    { name: "Chivas Regal 12", description: "The benchmark for smooth, balanced blended Scotch. Honey, ripe pear, and hazelnut. Excellent for cocktails and sipping.", related: ["Chivas Regal 18", "Chivas Regal Extra"], image: "/images/bottles/chivas-12.png" },
    { name: "Ballantine's Finest", description: "Light, elegant blended Scotch. Soft, sweet, with floral notes. The classic choice for a Rusty Nail.", related: ["Ballantine's 12 Year", "Ballantine's 17 Year"], image: "/images/bottles/ballantines.png" },
  ]},
  { name: "Blended Scotch", category: "Whiskies", description: "Same as blended scotch — kept as separate entry because it appeared in recipe text with capital S.", brands: ["Johnnie Walker Black", "Chivas Regal 12", "Ballantine's"], notes: "Deduplicated with Blended scotch at runtime.", bottles: [
    { name: "Johnnie Walker Black Label", description: "12-year-old blended Scotch. Rich, smooth, with notes of vanilla, honey, and dried fruit. The benchmark for mixed drinks and sipping alike.", related: ["Johnnie Walker Red Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], image: "/images/bottles/jw-black.png" },
    { name: "Chivas Regal 12", description: "The benchmark for smooth, balanced blended Scotch. Honey, ripe pear, and hazelnut. Excellent for cocktails and sipping.", related: ["Chivas Regal 18", "Chivas Regal Extra"], image: "/images/bottles/chivas-12.png" },
  ]},
  { name: "Islay Scotch", category: "Whiskies", description: "Single malt Scotch from Islay island, known for intense peat smoke, medicinal iodine, and maritime salinity.", brands: ["Laphroaig 10", "Ardbeg 10", "Lagavulin 16", "Bowmore 12", "Caol Ila 12"], notes: "Use sparingly — a ½ oz can dominate a cocktail. Great in Penicillin or Blood and Sand variation.", bottles: [
    { name: "Bowmore 12", description: "Islay single malt with balanced peat smoke, heather honey, and citrus. Less aggressive than Laphroaig or Lagavulin — a gentler introduction to Islay.", related: ["Bowmore 15", "Caol Ila 12", "Laphroaig 10"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bowmore_12_Year_Old.jpg/320px-Bowmore_12_Year_Old.jpg" },
    { name: "Caol Ila 12", description: "Islay malt known for peaty smoke with a lighter, floral edge. Often used in blended scotches; versatile for smoky cocktails.", related: ["Caol Ila 18", "Ardbeg 10", "Lagavulin 16"] }
  ] },
  { name: "Irish whiskey", category: "Whiskies", description: "Triple-distilled Irish whiskey, typically lighter and smoother than Scotch with notes of honey, vanilla, and green apple.", brands: ["Jameson", "Bushmills Original", "Redbreast 12", "Tullamore D.E.W.", "Green Spot"], notes: "Key for Irish Coffee, Tipperary, Forty-Three.", bottles: [
    { name: "Jameson", description: "Ireland's best-selling whiskey. Triple-distilled, smooth, with honey, vanilla, and green apple. The standard for Irish Coffee and mixers.", related: ["Jameson Black Barrel", "Jameson Caskmates", "Bushmills Original"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Jameson_whiskey_bottle.jpg/320px-Jameson_whiskey_bottle.jpg" },
    { name: "Bushmills Original", description: "Smooth Irish whiskey from the Old Bushmills Distillery. Triple-distilled, light, with vanilla and oak. A classic alternative to Jameson.", related: ["Bushmills 10", "Bushmills 16", "Jameson"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Jameson_whiskey_bottle.jpg/320px-Jameson_whiskey_bottle.jpg" }
  ] },
  { name: "Rye whiskey", category: "Whiskies", description: "American whiskey made with at least 51% rye grain. Spicy, herbal, and drier than bourbon with a peppery finish.", brands: ["Rittenhouse Rye", "Bulleit Rye", "Sazerac Rye", "Wild Turkey Rye", "WhistlePig 10"], notes: "Essential for Manhattan, Sazerac, Boulevardier.", bottles: [
    { name: "Rittenhouse Rye", description: "100-proof bonded rye whiskey from Heaven Hill. Bold, spicy, with pepper, clove, and cinnamon. The standard for classic Manhattans and Sazeracs.", related: ["Bulleit Rye", "Sazerac Rye", "Wild Turkey Rye"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Rittenhouse_Rye.jpg/320px-Rittenhouse_Rye.jpg" },
    { name: "Bulleit Rye", description: "High-rye whiskey from Bulleit. Spicy, clean, with pepper and vanilla. Sourced from MGP; easy-mixing for Manhattan and Boulevardier.", related: ["Rittenhouse Rye", "WhistlePig 10", "Bulleit Bourbon"] }
  ] },
  { name: "Bourbon", category: "Whiskies", description: "American whiskey made with at least 51% corn, aged in new charred American oak. Sweet vanilla, caramel, and oak notes.", brands: ["Buffalo Trace", "Maker's Mark", "Woodford Reserve", "Bulleit Bourbon", "Wild Turkey 101", "Four Roses Small Batch"], notes: "Versatile: Mint Julep, Old Fashioned, Whiskey Sour, Boulevardier.", bottles: [
    { name: "Buffalo Trace", description: "Kentucky straight bourbon from Buffalo Trace Distillery. Rich vanilla, caramel, and mint with a smooth finish. The benchmark affordable bourbon.", related: ["Buffalo Trace Eagle Rare", "Wild Turkey 101", "Maker's Mark"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Buffalo_Trace_Bourbon.jpg/320px-Buffalo_Trace_Bourbon.jpg" },
    { name: "Wild Turkey 101", description: "High-rye Kentucky bourbon. Bold, spicy, with caramel, vanilla, and a peppery finish. 101 proof for extra kick.", related: ["Wild Turkey 81", "Wild Turkey Rare Breed", "Buffalo Trace"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Wild_Turkey_101_Bourbon.jpg/320px-Wild_Turkey_101_Bourbon.jpg" }
  ] },
  { name: "Bourbon or rye", category: "Whiskies", description: "Either bourbon or rye whiskey depending on preference. Bourbon = sweeter; rye = spicier/drier.", brands: ["Buffalo Trace", "Rittenhouse Rye"], notes: "Manhattan flexibility.", bottles: [
    { name: "Buffalo Trace", description: "Kentucky straight bourbon. Rich vanilla, caramel, and mint. Widely available and affordable — the go-to when a recipe just says bourbon.", related: ["Wild Turkey 101", "Maker's Mark", "Rittenhouse Rye"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Buffalo_Trace_Bourbon.jpg/320px-Buffalo_Trace_Bourbon.jpg" },
    { name: "Rittenhouse Rye", description: "100-proof bonded rye. Bold, spicy, with pepper and clove. The rye pick for Manhattan flexibility.", related: ["Bulleit Rye", "Buffalo Trace", "Sazerac Rye"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Rittenhouse_Rye.jpg/320px-Rittenhouse_Rye.jpg" }
  ] },
  { name: "Brandy", category: "Whiskies", description: "General term for spirit distilled from fermented fruit juice, most commonly grapes (cognac is the finest brandy).", brands: ["Remy Martin VSOP", "Hennessy VS", "Martell VSOP"], notes: "Covers Brandy Alexander, Sidecar, Between the Sheets.", bottles: [
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac from Remy Martin. Rich, smooth, with vanilla, dried fruit, and cocoa. A step up from VS for cocktails.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Remy_Martin_VSOP_Cognac.jpg/320px-Remy_Martin_VSOP_Cognac.jpg" },
    { name: "Hennessy VS", description: "World's most popular cognac. A blend of eaux-de-vie aged at least 2 years. Bold, warm, with vanilla, spice, and toasted oak.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hennessy_VS_cognac.jpg/320px-Hennessy_VS_cognac.jpg" }
  ] },
  { name: "Brandy or Cognac", category: "Whiskies", description: "Cognac is a specific type of brandy from the Cognac region of France, always double-distilled in copper pot stills.", brands: ["Remy Martin VSOP", "Hennessy VS", "Martell Cordon Bleu", "Courvoisier VS"], notes: "Cognac gives richer fruit notes in Brandy Alexander, Sazerac variation.", bottles: [
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac. Rich, smooth, with vanilla, dried fruit, and cocoa.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Remy_Martin_VSOP_Cognac.jpg/320px-Remy_Martin_VSOP_Cognac.jpg" },
    { name: "Hennessy VS", description: "World's most popular cognac. Bold, warm, with vanilla, spice, and toasted oak.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hennessy_VS_cognac.jpg/320px-Hennessy_VS_cognac.jpg" }
  ] },
  { name: "Cognac", category: "Whiskies", description: "Fine French brandy from Cognac region. VS (very special, min 2 years), VSOP (min 4 years), XO (min 10 years).", brands: ["Remy Martin VS", "Hennessy VS", "Martell VS", "Courvoisier VS", "Remy Martin VSOP", "Hennessy VSOP"], notes: "Sidecar, Brandy Alexander, B&B.", bottles: [
    { name: "Hennessy VS", description: "World's most popular cognac. A blend of eaux-de-vie aged at least 2 years. Bold, warm, with vanilla, spice, and toasted oak. The standard for Sidecars and Brandy Alexander.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hennessy_VS_cognac.jpg/320px-Hennessy_VS_cognac.jpg" },
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac from Remy Martin. Rich, smooth, with vanilla, dried fruit, and cocoa. A step up from VS for cocktails.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Remy_Martin_VSOP_Cognac.jpg/320px-Remy_Martin_VSOP_Cognac.jpg" }
  ] },
  { name: "Cognac or VSOP brandy", category: "Whiskies", description: "VSOP-grade cognac or equivalent brandy, aged minimum 4 years. Smooth with dried fruit and vanilla.", brands: ["Remy Martin VSOP", "Hennessy VSOP", "Martell VSOP"], notes: "VSOP specifically required for some classic recipes.",
  bottles: [
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac. Rich, smooth, with vanilla, dried fruit, and cocoa.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Remy_Martin_VSOP_Cognac.jpg/320px-Remy_Martin_VSOP_Cognac.jpg" },
    { name: "Hennessy VSOP", description: "Popular VSOP cognac. Smooth, with vanilla, spice, and toasted oak.", related: ["Hennessy VS", "Hennessy XO", "Remy Martin VSOP"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hennessy_VS_cognac.jpg/320px-Hennessy_VS_cognac.jpg" }
  ]
},
  { name: "Apple brandy", category: "Whiskies", description: "Brandy distilled from apples, also called applejack when American. Clear or lightly aged. Apple-forward with warm spice.", brands: ["Calvados Boulard", "Laird's Applejack", "Clear Creek Apple Brandy", "St-Germain (not apple — Calvados)"], notes: "Jack Rose, Applejack Rabbit.", bottles: [
    { name: "Laird's Applejack", description: "America's oldest apple brandy, dating to 1780. Made from blended apple cider and neutral spirits. Apple-forward, warm, and versatile for Jack Rose and Applejack Rabbit.", related: ["Laird's 100 Proof", "Clear Creek Apple Brandy", "Calvados Boulard"] }
  ] },
  { name: "Apricot brandy", category: "Whiskies", description: "Brandy infused with or distilled from apricots. Sweet, fruity, golden-amber.", brands: ["Marie Brizard Apricot Brandy", "Bols Apricot Brandy", "Rothman & Winter"], notes: "B&B, Apricot Sour.",
  bottles: [
    { name: "Marie Brizard Apricot Brandy", description: "Sweet apricot brandy. Golden-amber, fruity, with warm stone-fruit character.", related: ["Bols Apricot Brandy", "Rothman & Winter"] },
    { name: "Bols Apricot Brandy", description: "Dutch apricot brandy. Sweet, smooth, with natural apricot flavor.", related: ["Marie Brizard Apricot Brandy", "Rothman & Winter"] }
  ]
},
  { name: "Cherry brandy", category: "Whiskies", description: "Fruit brandy made from cherries, distinct from cherry liqueur which is sweeter and red. More spirit-forward.", brands: ["Clear Creek Kirschwasser", "Luxardo Maraschino (semi-related)", "G.E. Massenez Kirsch"], notes: "Japanese Cocktail, certain Boulevardier variations.",
  bottles: [
    { name: "Clear Creek Kirschwasser", description: "Oregon-made kirschwasser. Dry, clear cherry eau-de-vie.", related: ["G.E. Massenez Kirsch", "Luxardo Maraschino"] },
    { name: "G.E. Massenez Kirsch", description: "French kirsch from Alsace. Dry, clean, aromatic cherry spirit.", related: ["Clear Creek Kirschwasser", "Distillerie de Neuchâtel"] }
  ]
},
  { name: "Kirsch", category: "Whiskies", description: "Clear, dry cherry brandy from Germany/France. Unaged, eau-de-vie style. Pure cherry with no added sugar.", brands: ["G.E. Massenez Kirsch", "Clear Creek Kirschwasser", "Distillerie de Neuchâtel"], notes: "White Lady, Kirsch Royal, Tiki drinks.",
  bottles: [
    { name: "G.E. Massenez Kirsch", description: "French kirsch from Alsace. Distilled from Griotte cherries. Dry, clear, pure cherry flavor.", related: ["Clear Creek Kirschwasser", "Distillerie de Neuchâtel"] },
    { name: "Clear Creek Kirschwasser", description: "Oregon-made kirschwasser. Dry, clear cherry eau-de-vie. Unaged, no sugar.", related: ["G.E. Massenez Kirsch", "Luxardo Maraschino"] }
  ]
},
  { name: "Pisco", category: "Whiskies", description: "Un-aged or lightly aged grape brandy from Peru or Chile. Fragrant, floral, with citrus and stone fruit notes.", brands: ["Macchu Pisco (Peru)", "Campo de Encanto (Peru)", "Alto del Carmen (Chile)", "La Botija (Peru)"], notes: "Pisco Sour, Chilcano.", bottles: [
    { name: "Campo de Encanto Pisco", description: "Peruvian pisco from the Ica Valley. Distilled from Quebranta grapes. Smooth, aromatic, with citrus and stone fruit. The standard for Pisco Sour.", related: ["Macchu Pisco", "La Botija", "Alto del Carmen"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Pisco_Campo_de_Encanto.jpg/320px-Pisco_Campo_de_Encanto.jpg" },
    { name: "Macchu Pisco", description: "Peruvian pisco from the valleys of Ica. Aromatic, floral, with grape and citrus notes. Smooth and versatile.", related: ["Campo de Encanto", "La Botija", "Alto del Carmen"] }
  ] },

  // RUMS
  { name: "White rum", category: "Rums", description: "Light, clean rum aged briefly (often 1 year) and filtered to remove color. Mild sweetness, subtle vanilla.", brands: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars", "Cruzan Aged Light", "Havana Club 3"], notes: "Mojito, Daiquiri, Cuba Libre.", bottles: [
    { name: "Bacardi Superior", description: "The world's best-selling white rum. Light, clean, with mild sweetness and subtle vanilla. Aged in American oak then charcoal-filtered. The standard for Mojito and Daiquiri.", related: ["Bacardi Gold", "Don Q Cristal", "Plantation 3 Stars"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Bacardi_Superior_rum_bottle.jpg/320px-Bacardi_Superior_rum_bottle.jpg" },
    { name: "Plantation 3 Stars", description: "Premium Trinidadian white rum. Smooth, soft, with notes of vanilla, citrus, and tropical fruit. Ideal for Ti' Punch and mixed drinks.", related: ["Plantation 5 Year", "Bacardi Superior", "Don Q Cristal"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Plantation_3_Stars_Rum.jpg/320px-Plantation_3_Stars_Rum.jpg" }
  ] },
  { name: "Light rum", category: "Rums", description: "Same as white rum — light-bodied, clear or pale gold, mild flavor.", brands: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], notes: "Deduplicated with White rum.",
  bottles: [
    { name: "Bacardi Superior", description: "The world's best-selling white rum. Light, clean, with mild sweetness and subtle vanilla.", related: ["Bacardi Gold", "Don Q Cristal", "Plantation 3 Stars"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Bacardi_Superior_rum_bottle.jpg/320px-Bacardi_Superior_rum_bottle.jpg" },
    { name: "Don Q Cristal", description: "Puerto Rican light rum. Smooth, clean, with mild sweetness and vanilla.", related: ["Bacardi Superior", "Don Q Gold", "Don Q Añejo"] }
  ]
},
  { name: "Dark rum", category: "Rums", description: "Rich, full-bodied rum aged longer in heavily charred barrels. Notes of molasses, caramel, toffee, and spice.", brands: ["Gosling's Black Seal", "Myers's Original Dark", "Plantation XO", "Flor de Caña 7", "Diplomático Reserva"], notes: "Dark 'n' Stormy, Mai Tai, Jungle Bird.", bottles: [
    { name: "Gosling's Black Seal", description: "Bermudan dark rum. Rich, full-bodied, with molasses, caramel, and spice. The essential ingredient for a Dark 'n' Stormy.", related: ["Gosling's Gold", "Myers's Original Dark", "Plantation XO"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Goslings_Black_Seal_Rum.jpg/320px-Goslings_Black_Seal_Rum.jpg" },
    { name: "Myers's Original Dark", description: "Jamaican dark rum. Intensely dark, full-bodied, with heavy molasses, chocolate, and spice. Bold choice for Tiki and tropical drinks.", related: ["Gosling's Black Seal", "Plantation XO", "Flor de Caña 7"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Myers%27s_Original_Dark_Rum.jpg/320px-Myers%27s_Original_Dark_Rum.jpg" }
  ] },
  { name: "Aged rum", category: "Rums", description: "Rum aged in oak barrels for 3+ years. Complex with vanilla, oak, dried fruit, and spice notes.", brands: ["Flor de Caña 7", "Diplomático Reserva", "Plantation 5 Year", "Mount Gay XO", "Zacapa 23"], notes: "Ti' Punch, Rum Old Fashioned.",
  bottles: [
        { name: "Diplomático Reserva Exclusiva", description: "Venezuelan aged rum from Diplomático. Blended from rums aged up to 8 years. Rich molasses, caramel, and vanilla with dried fruit. Smooth enough for sipping; complex enough for cocktails.", related: ["Diplomático Mantuano", "Diplomático Planas", "Ron Zacapa 23"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Diplomatico_Reserva_Exclusiva.jpg/320px-Diplomatico_Reserva_Exclusiva.jpg" }
  ]
},
  { name: "Overproof rum", category: "Rums", description: "High-ABV rum (57%+ / 114 proof+). Intense, fiery, used in small dashes in Tiki and flaming cocktails.", brands: ["Wray & Nephew Overproof", "Lemon Hart 151", "Plantation O.F.T.D.", "Hamilton 151"], notes: "Use ¼–½ oz dashes. Flaming Dr. Pepper, Zombie.", bottles: [
    { name: "Wray & Nephew Overproof", description: "Jamaican white overproof rum at 63% ABV. Intense, fiery, with funky Jamaican ester character. A single dash transforms Tiki drinks.", related: ["Wray & Nephew White", "Plantation O.F.T.D.", "Hamilton 151"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Wray_and_Nephew_Overproof_Rum.jpg/320px-Wray_and_Nephew_Overproof_Rum.jpg" }
  ] },

  // GINS
  { name: "Gin", category: "Gins", description: "Juniper-flavored spirit. Can range from crisp and citrusy (London dry) to floral and herbal (Plymouth) to bold and experimental (new Western).", brands: ["Beefeater", "Tanqueray", "Bombay Sapphire", "Plymouth", "Hendrick's", "Monkey 47"], notes: "Gin is a category — use specific type when a recipe calls for it.",
  bottles: [
        { name: "Hendrick's Gin", description: "Scottish gin from William Grant & Sons. Infused with rose and cucumber. Silky, floral, and unusual. 41.4% ABV.", related: ["Hendrick's Orbium", "Hendrick's Lunar", "Hendrick's Midsummer Solstice"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Hendricks_Gin_2010.jpg/320px-Hendricks_Gin_2010.jpg" }
  ]
},
  { name: "London dry gin", category: "Gins", description: "The strictest gin style. Juniper-forward with citrus peel and coriander. No added flavoring after distillation.", brands: ["Beefeater", "Tanqueray", "Bombay Sapphire", "Plymouth (also qualifies)", "Sipsmith VJS"], notes: "Martini, Negroni, Gin & Tonic, Tom Collins.",
  bottles: [
        { name: "Tanqueray London Dry", description: "London dry gin from Charles Tanqueray & Co. Distilled with juniper, coriander, angelica root, and liquorice. Four-time distilled. Crisp juniper-forward profile with citrus and spice. 43.1% ABV.", related: ["Tanqueray No. Ten", "Tanqueray Rangpur", "Beefeater London Dry"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tanqueray_gin_bottle.jpg/320px-Tanqueray_gin_bottle.jpg" }
  ]
},
  { name: "Geneva gin", category: "Gins", description: "Also known as Holland gin or genever. Malty, fuller-bodied, less juniper-forward than London dry. Can be aged (oude) or younger (jonge).", brands: ["Bols Genever", "Rutte Genever", "Hooghoudt", "Filliers Dry Gin 28"], notes: "Dutch Courage, Martinez (traditional), Corpse Reviver #2 variation.", bottles: [
    { name: "Bols Genever", description: "Dutch genever from the Bols distillery, dating to 1575. Malt wine base gives a mellow, slightly sweet, malty character with a hint of juniper. Less assertive than London dry.", related: ["Rutte Genever", "Filliers Dry Gin 28", "Hooghoudt"] }
  ] },

  // TEQUILA & MEZCAL
  { name: "Tequila", category: "Tequila & Mezcal", description: "Mexican spirit made from blue agave in designated regions. Blanco (unaged), Reposado (rested 2–12 months), Añejo (aged 1–3+ years).", brands: ["Patrón Silver", "Don Julio 1942", "Casamigos Reposado", "Espolòn Blanco", "Casa Noble Reposado", "Fortaleza"], notes: "Margarita, Paloma, Tequila Sunrise.",
  bottles: [
        { name: "Fortaleza Blanco", description: "100% blue agave tequila from the Fortaleza distillery in Jalisco. Stone ovens and tahona wheel. Bright agave with pepper, citrus, and earth. Unaged, pure expression.", related: ["Fortaleza Reposado", "Fortaleza Añejo", "Patrón Silver"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Fortaleza_Blanco_tequila.jpg/320px-Fortaleza_Blanco_tequila.jpg" }
  ]
},
  { name: "Blanco tequila", category: "Tequila & Mezcal", description: "Unaged or aged <60 days tequila. Bright, crisp, pure agave flavor with pepper and citrus.", brands: ["Patrón Silver", "Espolòn Blanco", "Fortaleza Blanco", "Casamigos Blanco", "Don Julio Blanco"], notes: "Required when a recipe specifies Blanco — reposado would be too oaky.",
  bottles: [
    { name: "Patrón Silver", description: "Premium 100% blue agave blanco. Smooth, crisp, with sweet agave, citrus, and pepper.", related: ["Patrón Reposado", "Patrón Añejo", "Espolòn Blanco"] },
    { name: "Espolòn Blanco", description: "100% blue agave blanco from Jalisco. Bright agave, pepper, citrus.", related: ["Espolòn Reposado", "Patrón Silver", "Fortaleza Blanco"] }
  ]
},

  // VODKA
  { name: "Vodka", category: "Vodka", description: "Neutral, unaged spirit distilled from grains, potatoes, or grapes. Clean, versatile base for flavored and mixed drinks.", brands: ["Grey Goose", "Ketel One", "Belvedere", "Tito's", "Stolichnaya", "Cîroc", "Absolut"], notes: "Vodka Martini, Cosmopolitan, Screwdriver, Moscow Mule.",
  bottles: [
        { name: "Belvedere Vodka", description: "Polish rye vodka from Belvedere. Quadruple distilled from Dankowskie rye. Creamy texture with white pepper, vanilla, and almond. 40% ABV.", related: ["Grey Goose", "Ketel One", "Chopin Rye"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Belvedere_Vodka.jpg/320px-Belvedere_Vodka.jpg" }
  ]
},

  // LIQUEURS
  { name: "Amaretto", category: "Liqueurs", description: "Italian almond-flavored liqueur, sweet and nutty with notes of apricot kernel. ~28% ABV.", brands: ["Disaronno", "Lazzaroni", "DeKuyper", "Bardinet"], notes: "Amaretto Sour, Godmother, Nutcracker.",
  bottles: [
        { name: "Disaronno Amaretto", description: "Italian amaretto liqueur from Saronno. Apricot kernel and almond character with sweet vanilla and cherry notes. 28% ABV.", related: ["Lazzaroni Amaretto", "DeKuyper Amaretto", "Bardinet Amaretto"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Disaronno_Originale.jpg/320px-Disaronno_Originale.jpg" }
  ]
},
  { name: "Aperol", category: "Liqueurs", description: "Italian bitter-orange aperitif. Bright orange, bittersweet, 11% ABV. Lighter than Campari.", brands: ["Aperol ( Campari Group )"], notes: "Aperol Spritz, Aperol Sour, Paper Plane.", bottles: [
    { name: "Aperol", description: "Iconic Italian bitter-orange aperitif from the Campari Group. Bright orange, bittersweet, with rhubarb and orange peel. 11% ABV. Lighter than Campari; the standard for Aperol Spritz.", related: ["Campari", "Select Aperitivo", "Cynar"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Aperol_bottle.jpg/320px-Aperol_bottle.jpg" }
  ] },
  { name: "Bénédictine", category: "Liqueurs", description: "French herbal liqueur from Fécamp. Complex: honey, herbs, spices, citrus, stone fruit. 40% ABV.", brands: ["Bénédictine D.O.M.", "B&B (Bénédictine + Brandy)"], notes: "B&B, Vieux Carré, Jamaica Mule.", bottles: [
    { name: "Bénédictine D.O.M.", description: "French herbal liqueur produced by Benedictine monks since 1510. Complex layers of honey, herbs, spices, citrus, and stone fruit. 40% ABV. The base for B&B.", related: ["B&B (B&B Liqueur)", "Chartreuse Green", "Drambuie"] }
  ] },
  { name: "Campari", category: "Liqueurs", description: "Italian bitter aperitif. Intensely red, bitter, herbal — notes of rhubarb, cherry, cinnamon, and citrus peel. 20.5% ABV.", brands: ["Campari"], notes: "Negroni, Boulevardier, Americano, Jungle Bird.", bottles: [
    { name: "Campari", description: "The iconic Italian bitter aperitif. Bright red, intensely herbal and bitter with rhubarb, cherry, and citrus peel. 20.5% ABV. Essential for Negroni and Americano.", related: ["Aperol", "Cynar", "Select Aperitivo"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Campari_bottle.jpg/320px-Campari_bottle.jpg" }
  ] },
  { name: "Cherry liqueur", category: "Liqueurs", description: "Sweet, red cherry-flavored liqueur. Brighter and sweeter than cherry brandy.", brands: ["Luxardo Maraschino", "Maraska", "Bols Cherry"], notes: "Singapore Sling, Blood and Sand.", bottles: [
    { name: "Luxardo Maraschino", description: "Premium Italian cherry liqueur from Marasca cherry pits. Complex cherry, almond, and spice notes. 32% ABV. The standard for Singapore Sling and Aviation.", related: ["Maraska Maraschino", "Bols Cherry", "Luxardo Amaretto"] }
  ] },
  { name: "Cointreau", category: "Liqueurs", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish. The standard for classic cocktails.", brands: ["Cointreau"], notes: "Margarita, Cosmopolitan, Sidecar, White Lady.", bottles: [
    { name: "Cointreau", description: "Premium French triple sec from the Cointreau family. Distilled from sweet and bitter orange peels. Crisp, clean, dry orange flavor at 40% ABV. The gold standard for Margarita and Sidecar.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg" }
  ] },
  { name: "Coffee liqueur", category: "Liqueurs", description: "Coffee-flavored liqueur, typically 20–25% ABV. Sweet, dark, with strong coffee notes.", brands: ["Kahlúa", "Tia Maria", "Mr Black", "St- Brendan's", "Licor 43 (not coffee)"], notes: "Espresso Martini, White Russian, Black Russian.", bottles: [
    { name: "Kahlúa", description: "The world's most popular coffee liqueur from Mexico. Made from Arabica coffee, sugarcane spirit, and vanilla. Sweet, rich, dark. Essential for Espresso Martini and White Russian.", related: ["Tia Maria", "Mr Black Cold Brew", "St Brendan's Irish Coffee Liqueur"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Kahlua_bottle_2011.jpg/320px-Kahlua_bottle_2011.jpg" }
  ] },
  { name: "Crème de banane", category: "Liqueurs", description: "Banana-flavored crème liqueur. Bright, artificial-yet-fun banana flavor. 25% ABV.", brands: ["Marie Brizard", "Bols", "DeKuyper"], notes: "Flaming Dr. Pepper, certain Tiki drinks.", bottles: [
    { name: "Marie Brizard Crème de Banane", description: "Bright banana-flavored crème liqueur. Sweet, fun, tropical banana character. 25% ABV. The classic choice for Flaming Dr. Pepper.", related: ["Bols Crème de Banane", "DeKuyper Banana"] }
  ] },
  { name: "Crème de cassis", category: "Liqueurs", description: "Blackcurrant crème liqueur from France. Deep purple, tart-sweet, 15–20% ABV.", brands: ["Joseph Cartron", "Briottet", "Giffard", "Marie Brizard"], notes: "Kir, Kir Royal, Cassis Spritz.",
  bottles: [
    { name: "Joseph Cartron Crème de Cassis", description: "French blackcurrant crème liqueur. Deep purple, tart-sweet, 15% ABV.", related: ["Giffard Crème de Cassis", "Briottet Crème de Cassis"] },
    { name: "Giffard Crème de Cassis", description: "Premium French blackcurrant crème liqueur. Rich, dark, balanced sweet-tart.", related: ["Joseph Cartron", "Briottet"] }
  ]
},
  { name: "Crème de mûre", category: "Liqueurs", description: "Blackberry crème liqueur. Rich, dark, sweet-tart blackberry flavor.", brands: ["Joseph Cartron", "Giffard", "Briottet", "Bols"], notes: "Bramble, French 75 variation.",
  bottles: [
    { name: "Giffard Crème de Mûre", description: "French blackberry crème liqueur. Rich, dark, sweet-tart blackberry flavor.", related: ["Joseph Cartron Crème de Mûre", "Briottet"] },
    { name: "Briottet Crème de Mûre", description: "Savoyard blackberry crème liqueur. Deep purple, intense blackberry character.", related: ["Giffard Crème de Mûre", "Bols Blackberry"] }
  ]
},
  { name: "Crème de violette", category: "Liqueurs", description: "Violet flower crème liqueur. Floral, sweet, perfumed. 20–25% ABV. Rare and expensive.", brands: ["Giffard Crème de Violette", "Briottet", "Rothman & Winter"], notes: "Aviation — ¼ oz is enough. Violet Fizz.",
  bottles: [
    { name: "Giffard Crème de Violette", description: "French violet flower crème liqueur. Floral, sweet, perfumed. 20% ABV.", related: ["Briottet Crème de Violette", "Rothman & Winter Violet"] },
    { name: "Briottet Crème de Violette", description: "French violet liqueur from Savoie. Fragrant, sweet, perfumed.", related: ["Giffard Crème de Violette", "Rothman & Winter"] }
  ]
},
  { name: "Drambuie", category: "Liqueurs", description: "Scottish honey-herbal liqueur. Scotch whisky base with heather honey, herbs, and spices. 40% ABV.", brands: ["Drambuie"], notes: "Rusty Nail, Civil Service, Godfather variation.", bottles: [
    { name: "Drambuie", description: "Scottish honey-herbal liqueur. Scotch whisky base infused with heather honey, herbs, and spices. 40% ABV. The classic finish for Rusty Nail.", related: ["Bénédictine", "Glayva", "Liqueur 44"] }
  ] },
  { name: "Elderflower liqueur", category: "Liqueurs", description: "Fragrant elderflower blossom liqueur. Floral, sweet, honeyed, with pear and lychee undertones. 20% ABV.", brands: ["St-Germain"], notes: "St-Germain Spritz, Elderflower Collins, Hugo.", bottles: [
    { name: "St-Germain", description: "French elderflower liqueur. Each bottle contains up to 1,000 elderflower blossoms hand-harvested in the French Alps. Floral, sweet, honeyed, with lychee undertones. 20% ABV.", related: ["Elderflower cordials", "Monin Elderflower Syrup"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/St-Germain_elderflower_liqueur.jpg/320px-St-Germain_elderflower_liqueur.jpg" }
  ] },
  { name: "Galliano", category: "Liqueurs", description: "Italian vanilla-herbal liqueur. Bright yellow, complex with vanilla, anise, and 30+ botanicals. 42.3% ABV.", brands: ["Galliano L'Autentico", "Galliano Vanilla"], notes: "Harvey Wallbanger, Yellow Bird.",
  bottles: [
    { name: "Galliano L'Autentico", description: "Iconic Italian vanilla-herbal liqueur. Bright yellow, complex. 42.3% ABV.", related: ["Galliano Vanilla"] },
    { name: "Galliano Vanilla", description: "Smooth vanilla liqueur from Galliano. Rich vanilla with hints of herbs and spice.", related: ["Galliano L'Autentico"] }
  ]
},
  { name: "Green crème de menthe", category: "Liqueurs", description: "Bright green mint crème liqueur. Sweet, minty, artificial-bright green color.", brands: ["Marie Brizard", "Bols", "DeKuyper"], notes: "Grasshopper, Stinger variation, certain Shooters.",
  bottles: [
        { name: "Marie Brizard Green Crème de Menthe", description: "Bright green mint crème liqueur. Sweet, minty, artificial-bright green color.", related: ["Bols Pepermunt", "DeKuyper Peppermint"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Marie_Brizard_Cr%C3%A8me_de_Menthe.jpg/320px-Marie_Brizard_Cr%C3%A8me_de_Menthe.jpg" }
  ]
},
  { name: "Grenadine", category: "Liqueurs", description: "Pomegranate syrup-liqueur. Deep red, sweet-tart. Modern grenadine is often just pomegranate juice + sugar; some have a hint of orange.", brands: ["Monin Grenadine", "Fee Brothers", "Roses", "Small Hand Foods Pomegranate Molasses (mix with water)"], notes: "Tequila Sunrise, Shirley Temple, Planter's Punch.",
  bottles: [
        { name: "Fee Brothers Grenadine", description: "American grenadine from Fee Brothers. Deep red, sweet-tart pomegranate syrup-liqueur.", related: ["Monin Grenadine", "Roses Grenadine", "Small Hand Foods"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Fee_Brothers_Grenadine.jpg/320px-Fee_Brothers_Grenadine.jpg" }
  ]
},
  { name: "Irish cream", category: "Liqueurs", description: "Cream liqueur with Irish whiskey, cream, and chocolate/coffee. Smooth, sweet, 17% ABV.", brands: ["Baileys Irish Cream", "Ryan's", "Saint Brendan's"], notes: "B-52, Irish Car Bomb, White Russian variation.",
  bottles: [
    { name: "Baileys Irish Cream", description: "The original Irish cream liqueur. Irish whiskey, cream, and chocolate. 17% ABV.", related: ["Ryan's Irish Cream", "Saint Brendan's"] },
    { name: "Saint Brendan's Irish Cream", description: "Irish cream liqueur from Ireland. Smooth, rich, with Irish whiskey and cream.", related: ["Baileys Irish Cream", "Ryan's"] }
  ]
},
  { name: "Maraschino liqueur", category: "Liqueurs", description: "Luxardo-style cherry liqueur from Marasca cherry pits. Complex: cherry, almond, spice. 32% ABV.", brands: ["Luxardo Maraschino", "Maraska"], notes: "Aviation, Hemingway Daiquiri, Martinez.",
  bottles: [
    { name: "Luxardo Maraschino", description: "Premium Italian maraschino liqueur from Marasca cherry pits. 32% ABV.", related: ["Maraska Maraschino", "Luxardo Amaretto"] },
    { name: "Maraska Maraschino", description: "Croatian maraschino liqueur from Zadar. Dry, complex, made from Marasca cherries.", related: ["Luxardo Maraschino", "Bols Cherry Brandy"] }
  ]
},
  { name: "Orange curaçao", category: "Liqueurs", description: "Orange-flavored liqueur made from dried curaçao orange peels (from Caribbean island). Dry, bitter-orange, 40% ABV.", brands: ["Pierre Ferrand Dry Curaçao", "Bols Orange Curaçao", "Marie Brizard"], notes: "Margarita (when not using triple sec), Sidecar.",
  bottles: [
    { name: "Pierre Ferrand Dry Curaçao", description: "Premium dry orange curaçao from Pierre Ferrand. Made from dried curaçao orange peels. 40% ABV.", related: ["Bols Orange Curaçao", "Marie Brizard Orange Curaçao", "Cointreau"] },
    { name: "Bols Orange Curaçao", description: "Dutch orange curaçao from Bols. Dry, bitter-orange flavor. 35% ABV.", related: ["Pierre Ferrand Dry Curaçao", "Marie Brizard"] }
  ]
},
  { name: "Orange liqueur", category: "Liqueurs", description: "General term for orange-flavored liqueurs including triple sec, curaçao, and Cointreau.", brands: ["Cointreau", "Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard"], notes: "Encompasses Triple sec, Cointreau, and Orange curaçao.",
  bottles: [
    { name: "Cointreau", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg" },
    { name: "Pierre Ferrand Dry Curaçao", description: "Dry orange curaçao from Pierre Ferrand. 40% ABV.", related: ["Cointreau", "Bols Orange Curaçao", "Marie Brizard"] }
  ]
},
  { name: "Peach schnapps", category: "Liqueurs", description: "Peach-flavored schnapps. Sweet, often artificially flavored, 15–20% ABV. Very 1980s-90s.", brands: ["DeKuyper Peach Schnapps", "Archers", "Hiram Walker"], notes: "Sex on the Beach, Fuzzy Navel, certain Shooters.",
  bottles: [
    { name: "DeKuyper Peach Schnapps", description: "American peach schnapps from DeKuyper. Sweet, peach-forward, 15% ABV.", related: ["Archers Peach Schnapps", "Hiram Walker Peach"] },
    { name: "Archers Peach Schnapps", description: "UK peach schnapps. Sweet, smooth, with ripe peach flavor.", related: ["DeKuyper Peach Schnapps", "Hiram Walker"] }
  ]
},
  { name: "St-Germain elderflower liqueur", category: "Liqueurs", description: "Premium elderflower liqueur. Each bottle contains up to 1,000 elderflower blossoms hand-harvested in France.", brands: ["St-Germain"], notes: "St-Germain Spritz, Elderflower Collins, Hugo.", bottles: [
    { name: "St-Germain", description: "French elderflower liqueur. Each bottle contains up to 1,000 elderflower blossoms hand-harvested in the French Alps. Floral, sweet, honeyed, with lychee undertones. 20% ABV.", related: ["Elderflower cordials", "Monin Elderflower Syrup"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/St-Germain_elderflower_liqueur.jpg/320px-St-Germain_elderflower_liqueur.jpg" }
  ] },
  { name: "Triple sec", category: "Liqueurs", description: "Generic orange-flavored liqueur. Usually 15–40% ABV, sweeter than curaçao. Cointreau is the premium triple sec.", brands: ["Cointreau", "Combier", "Marie Brizard", "Bols", "DeKuyper"], notes: "Margarita, Cosmopolitan, Long Island Iced Tea.",
  bottles: [
    { name: "Cointreau", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg" },
    { name: "Combier Triple Sec", description: "French triple sec from Combier, made since 1834. 40% ABV.", related: ["Cointreau", "Marie Brizard Triple Sec", "Bols Triple Sec"] }
  ]
},
  { name: "Triple sec or Cointreau", category: "Liqueurs", description: "Same as Triple sec — just specifying Cointreau as the premium option.", brands: ["Cointreau"], notes: "Deduplicated with Triple sec.",
  bottles: [
    { name: "Cointreau", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cointreau_bottle.jpg/320px-Cointreau_bottle.jpg" },
    { name: "Combier Triple Sec", description: "French triple sec from Combier, made since 1834. 40% ABV.", related: ["Cointreau", "Marie Brizard Triple Sec", "Bols Triple Sec"] }
  ]
},
  { name: "White crème de menthe", category: "Liqueurs", description: "Clear/white mint crème liqueur. Same mint flavor as green but without artificial coloring. Useful in shaken cocktails.", brands: ["Marie Brizard", "Bols", "DeKuyper"], notes: "Stinger, Grasshopper (white version).",
  bottles: [
        { name: "Marie Brizard White Crème de Menthe", description: "Clear white mint crème liqueur. Same mint flavor as green but without artificial coloring.", related: ["Bols White Pepermunt", "DeKuyper White Peppermint"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/White_Cr%C3%A8me_de_Menthe_Marie_Brizard.jpg/320px-White_Cr%C3%A8me_de_Menthe_Marie_Brizard.jpg" }
  ]
},

  // BITTERS & APERITIFS
  { name: "Absinthe", category: "Bitters & Aperitifs", description: "High-proof anise-flavored spirit (45–74% ABV). Wormwood, anise, fennel. Turns cloudy when water is added (louche).", brands: ["Pernod Absinthe", "Absinthe Original", "La Fee", "Lucid Absinthe Supérieure"], notes: "Sazerac rinse, Corpse Reviver #2, Death in the Afternoon.",
  bottles: [
    { name: "Pernod Absinthe", description: "French absinthe from Pernod. Anise, wormwood, fennel. 68% ABV.", related: ["Lucid Absinthe Supérieure", "La Fee Absinthe"] },
    { name: "Lucid Absinthe Supérieure", description: "First legally imported absinthe to the US. 62.5% ABV.", related: ["Pernod Absinthe", "La Fee Absinthe"] }
  ]
},
  { name: "Angostura bitters", category: "Bitters & Aperitifs", description: "The iconic dash of bitters. Concentrated herbal extract with gentian root, spices, and herbs. Over 150 years old. 44.7% ABV.", brands: ["Angostura (the standard — no alternatives needed)"], notes: "In virtually every stirred cocktail. Old Fashioned, Manhattan, Martini garnish.",
  bottles: [
        { name: "Angostura Aromatic Bitters", description: "The iconic dash of bitters. Concentrated herbal extract with gentian root, spices, and herbs. Over 150 years old. 44.7% ABV.", related: ["Fee Brothers Aromatic Bitters", "Bitter Truth Aromatic"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Angostura_bitters.jpg/320px-Angostura_bitters.jpg" }
  ]
},
  { name: "Fernet-Branca", category: "Bitters & Aperitifs", description: "Italian amaro bitter digestif. Intensely bitter, minty, menthol, eucalyptus, and herbaceous. 39% ABV.", brands: ["Fernet-Branca"], notes: "Toronto, Hanky Panky, Fernet & Coke (Argentina).",
  bottles: [
    { name: "Fernet-Branca", description: "Italian amaro bitter digestif. Intensely bitter, minty, menthol, eucalyptus. 39% ABV.", related: ["Fernet-Branca Menta", "Amaro Averna"] },
    { name: "Fernet-Branca Menta", description: "Mint version of Fernet-Branca. Even more menthol and minty.", related: ["Fernet-Branca", "Amaro Montenegro"] }
  ]
},
  { name: "Green Chartreuse", category: "Bitters & Aperitifs", description: "French herbal liqueur made by Carthusian monks since 1605. 130+ botanicals. Bright green, complex, 55% ABV.", brands: ["Green Chartreuse V.P. (55%)", "Green Chartreuse (41%) — 'Alpine Strength'"], notes: "Last Word, Chartreuse Swizzle, Ti' Punch variation.",
  bottles: [
    { name: "Green Chartreuse V.P.", description: "French herbal liqueur made by Carthusian monks since 1605. 130+ botanicals. 55% ABV.", related: ["Green Chartreuse (41%)", "Yellow Chartreuse", "Bénédictine"] },
    { name: "Green Chartreuse (41%)", description: "Lower-ABV version of Green Chartreuse. 41% ABV.", related: ["Green Chartreuse V.P.", "Yellow Chartreuse"] }
  ]
},
  { name: "Lillet Blanc", category: "Bitters & Aperitifs", description: "French aromatised wine. Citrus, honey, and quinine. 17% ABV. Similar to dry vermouth but with more citrus.", brands: ["Lillet Blanc"], notes: "Vesper, 20th Century, Corpse Reviver #2.",
  bottles: [
    { name: "Lillet Blanc", description: "French aromatised wine. Citrus, honey, and quinine. 17% ABV.", related: ["Lillet Rosé", "Lillet Rouge", "Dolin Dry"] },
    { name: "Lillet Rosé", description: "Rosé version of Lillet. Fruity, red-berry, and citrus notes. 17% ABV.", related: ["Lillet Blanc", "Lillet Rouge"] }
  ]
},
  { name: "Orange bitters", category: "Bitters & Aperitifs", description: "Citrusy bitters made from dried orange peel. Lighter and more aromatic than Angostura.", brands: ["Regans' Orange Bitters No. 6", "Fee Brothers Orange Bitters", "Bitter Truth Orange"], notes: "Martini, Old Fashioned, Manhattan.",
  bottles: [
    { name: "Regans' Orange Bitters No. 6", description: "Citrusy bitters from dried orange peel by Gary Regan.", related: ["Fee Brothers Orange Bitters", "Bitter Truth Orange"] },
    { name: "Fee Brothers Orange Bitters", description: "American orange bitters. Bright orange peel flavor.", related: ["Regans' Orange Bitters No. 6", "Bitter Truth Orange"] }
  ]
},
  { name: "Peychaud's bitters", category: "Bitters & Aperitifs", description: "Aromatic bitters from New Orleans. Anise, gentian, cherry. Distinctive red color. 35% ABV.", brands: ["Peychaud's Bitters"], notes: "Sazerac — essential. Manhattan variation.",
  bottles: [
        { name: "Peychaud's Aromatic Bitters", description: "New Orleans aromatic bitters. Anise, gentian, cherry. Distinctive red color. 35% ABV.", related: ["Angostura Bitters", "Fee Brothers Bitters"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Peychauds_Bitters.jpg/320px-Peychauds_Bitters.jpg" }
  ]
},
  { name: "Pimm's No. 1", category: "Bitters & Aperitifs", description: "British summer cup. Gin-based fruit liqueur with herbal and citrus notes. 25% ABV.", brands: ["Pimm's No. 1"], notes: "Pimm's Cup — mix with lemonade, mint, cucumber, fruit.",
  bottles: [
    { name: "Pimm's No. 1", description: "British summer cup. Gin-based fruit liqueur. 25% ABV. Pimm's Cup.", related: ["Plymouth Gin", "Lemonade", "Cucumber"] },
    { name: "Plymouth Gin", description: "English gin from Plymouth. Slightly drier, earthier. 41.2% ABV.", related: ["Pimm's No. 1", "Beefeater", "Tanqueray"] }
  ]
},
  { name: "Amaro Nonino", category: "Bitters & Aperitifs", description: "Premium Italian amaro. Made from grappa macerated with herbs, roots, and alpine flowers. Bitter-sweet, 35% ABV.", brands: ["Amaro Nonino Quintessentia"], notes: "Paper Plane, Boulevardier variation, Paper Plane.",
  bottles: [
    { name: "Amaro Nonino Quintessentia", description: "Premium Italian amaro from Nonino. Bitter-sweet, 35% ABV.", related: ["Amaro Averna", "Amaro Montenegro", "Aperol"] },
    { name: "Amaro Averna", description: "Sicilian amaro from Averna. Bitter-sweet. 29% ABV.", related: ["Amaro Nonino", "Amaro Montenegro", "Fernet-Branca"] }
  ]
},

  // SHERRIES & VERMOUTHS
  { name: "Amontillado sherry", category: "Sherries & Vermouths", description: "Sherry style between fino and oloroso. Initially aged under flor, then exposed to air. Nutty, dry, complex.", brands: ["Lustau Amontillado", "Gonzalez Byass Amontillado"], notes: "Adonis, Bamboo, certain Manhattan variations.",
  bottles: [
    { name: "Lustau Amontillado", description: "Spanish amontillado sherry from Lustau. Nutty, dry, complex.", related: ["Lustau Fino", "Lustau Oloroso", "Gonzalez Byass"] },
    { name: "Gonzalez Byass Amontillado", description: "Classic amontillado sherry from Jerez. Dry, nutty.", related: ["Lustau Amontillado", "Tio Pepe Fino"] }
  ]
},
  { name: "Dry vermouth", category: "Sherries & Vermouths", description: "Fortified, aromatised wine. Dry, herbal, botanical. ~18% ABV. Keep refrigerated after opening.", brands: ["Dolin Dry", "Noilly Prat", "Martini & Rossi Dry", "Carpano Antica (sweet)"], notes: "Martini, Manhattan (dry version), Gibson.",
  bottles: [
        { name: "Noilly Prat Original French Dry", description: "Classic French dry vermouth from Noilly Prat in Marseillan. Macerated with herbs and spices from the Languedoc region. Herbal, bright, with chamomile and orange peel.", related: ["Dolin Dry", "Martini & Rossi Dry", "Carpano Antica Formula"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Noilly_Prat_Vermouth_Bottle.jpg/320px-Noilly_Prat_Vermouth_Bottle.jpg" }
  ]
},
  { name: "Fino sherry", category: "Sherries & Vermouths", description: "Lightest, driest sherry style. Aged under flor (yeast film). Pale, saline, almond, and green apple.", brands: ["Tio Pepe Fino", "Lustau Fino", "Gonzalez Byass Fino"], notes: "Adonis, Bamboo, Sherry Cobbler.",
  bottles: [
    { name: "Tio Pepe Fino", description: "Spain's most famous fino sherry. Pale, dry, saline, almond, green apple.", related: ["Lustau Fino", "Lustau Amontillado", "Gonzalez Byass Fino"] },
    { name: "Lustau Fino", description: "Fine fino sherry from Lustau. Pale, bone-dry, saline almond and apple notes.", related: ["Tio Pepe", "Lustau Amontillado", "Lustau Palo Cortado"] }
  ]
},
  { name: "Sweet vermouth", category: "Sherries & Vermouths", description: "Sweet, rich aromatised wine. Caramel, vanilla, herbs, citrus. ~16% ABV. Keep refrigerated.", brands: ["Carpano Antica", "Dolin Sweet", "Martini & Rossi Rosso", "Cinzano Rosso"], notes: "Negroni, Manhattan, Boulevardier, Americano, Rob Roy.",
  bottles: [
        { name: "Carpano Antica Formula", description: "Premium Italian sweet vermouth from Fratelli Branca. First vermouth created by Antonio Carpano in 1786. Intensely herbal, vanilla-forward, with dried fruit and toffee. 23% ABV.", related: ["Carpano Punt e Mes", "Dolin Sweet", "Martini & Rossi Rosso"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Carpano_Antica_Formula_Verouth.jpg/320px-Carpano_Antica_Formula_Verouth.jpg" }
  ]
},

  // WINES & SPARKLING
  { name: "Champagne", category: "Wines & Sparkling", description: "Sparkling wine from Champagne region of France. Méthode Champenoise. Fine bubbles, toasty, complex.", brands: ["Moët & Chandon", "Veuve Clicquot", "Ruinart", "Krug", "Bollinger"], notes: "French 75, Champagne Cocktail, Champagne Sour.",
  bottles: [
        { name: "Moët & Chandon Brut Impérial", description: "Iconic Champagne from Moët & Chandon. Bright, lively, with green apple, citrus, and brioche. The standard for celebrations and French 75.", related: ["Veuve Clicquot Yellow Label", "Ruinart Blanc de Blancs", "Bollinger Special Cuvée"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mo%C3%ABt_%26_Chandon_2010.jpg/320px-Mo%C3%ABt_%26_Chandon_2010.jpg" }
  ]
},
  { name: "Champagne or sparkling wine", category: "Wines & Sparkling", description: "Either Champagne or a quality sparkling wine (Cava, Prosecco, Crémant).", brands: ["Moët & Chandon", "Veuve Clicquot", "Prosecco brands"], notes: "Use for top-ups in French 75, Champagne cocktails.",
  bottles: [
    { name: "Moët & Chandon Brut Impérial", description: "Iconic Champagne. Bright, lively, with green apple, citrus, and brioche.", related: ["Veuve Clicquot Yellow Label", "Ruinart Blanc de Blancs"], image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mo%C3%ABt_%26_Chandon_2010.jpg/320px-Mo%C3%ABt_%26_Chandon_2010.jpg" },
    { name: "Veuve Clicquot Yellow Label", description: "Brut Champagne. Bright, balanced, with brioche and citrus.", related: ["Moët & Chandon Brut", "Ruinart Blanc de Blancs", "Bollinger Special Cuvée"] }
  ]
},
  { name: "Prosecco", category: "Wines & Sparkling", description: "Italian sparkling wine from Veneto region. Light, fruity, Glera grape. 10.5–11.5% ABV.", brands: ["Nino Franco Rustico", "Bisol Jeio", "Santa Margherita", "Zonin", "La Marca"], notes: "Aperol Spritz, Bellini, Mimosa.",
  bottles: [
    { name: "La Marca Prosecco", description: "Italian Prosecco from Veneto. Light, fruity, Glera grape.", related: ["Nino Franco Rustico", "Bisol Jeio", "Santa Margherita"] },
    { name: "Santa Margherita Prosecco", description: "Crisp, clean Prosecco from Valdobbiadene.", related: ["La Marca", "Zonin Prosecco", "Bisol Jeio"] }
  ]
},
  { name: "Dry white wine", category: "Wines & Sparkling", description: "Unfortified dry white wine. Sauvignon Blanc, Pinot Grigio, etc. Used in wine-based cocktails.", brands: ["House pour"], notes: "Wine Spritzer, Sangria, certain Coolers.",
  bottles: [
    { name: "Dry Sauvignon Blanc", description: "Crisp, dry white wine. Citrus, green apple, herbaceous.", related: ["Dry Pinot Grigio", "Dry Chardonnay"] },
    { name: "Dry Pinot Grigio", description: "Light, dry Italian white wine. Clean, citrus, mineral.", related: ["Dry Sauvignon Blanc", "Pinot Gris"] }
  ]
},

  // JUICES & MIXERS
  { name: "Cranberry juice", category: "Juices & Mixers", description: "Tart-sweet juice from cranberries. Mix with soda or use as a mixer. Often sweetened.", brands: ["Ocean Spray", "Lakewood", "R.W. Knudsen"], notes: "Cape Codder, Cosmopolitan, Woo Woo." },
  { name: "Grapefruit juice", category: "Juices & Mixers", description: "Bitter-sweet juice from grapefruit. Can be white (blond) or ruby (red). Freshest when juiced.", brands: ["Fresh"], notes: "Greyhound, Paloma, Hemingway Daiquiri." },
  { name: "Fresh grapefruit juice", category: "Juices & Mixers", description: "Same as grapefruit juice — fresh-squeezed for better flavor and no added sugar.", brands: ["Fresh"], notes: "Deduplicated with Grapefruit juice; fresh preferred." },
  { name: "Lemon juice", category: "Juices & Mixers", description: "Fresh lemon juice is essential for cocktails. Bottled lacks brightness. Always use fresh.", brands: ["Fresh lemons"], notes: "Whiskey Sour, Tom Collins, Gimlet, 90% of sour cocktails." },
  { name: "Fresh lemon juice", category: "Juices & Mixers", description: "Same as lemon juice — specifying fresh-squeezed as the standard.", brands: ["Fresh lemons"], notes: "Deduplicated with Lemon juice." },
  { name: "Lime juice", category: "Juices & Mixers", description: "Persian lime juice, fresh-squeezed. Bright, sharp acidity. Key for Tiki and tropical drinks.", brands: ["Fresh limes"], notes: "Daiquiri, Mojito, Margarita, Gimlet (traditional)." },
  { name: "Fresh lime", category: "Juices & Mixers", description: "Whole fresh lime — juiced as needed.", brands: ["Fresh limes"], notes: "Same as Lime juice." },
  { name: "Fresh lime juice", category: "Juices & Mixers", description: "Freshly squeezed lime juice. The standard for all Tiki and tropical drinks.", brands: ["Fresh limes"], notes: "Deduplicated with Lime juice." },
  { name: "Orange juice", category: "Juices & Mixers", description: "Fresh orange juice for cocktails. Sweet, fruity, bright.", brands: ["Fresh oranges"], notes: "Screwdriver, Mimosa, Brass Monkey." },
  { name: "Fresh orange juice", category: "Juices & Mixers", description: "Fresh-squeezed orange juice. Superior to carton for cocktails.", brands: ["Fresh oranges"], notes: "Deduplicated with Orange juice." },
  { name: "Papaya juice", category: "Juices & Mixers", description: "Tropical juice from papaya. Sweet, mild, creamy texture. Rare in classic cocktails.", brands: ["Fresh or canned"], notes: "Tiki drinks, tropical variations." },
  { name: "Passion fruit juice", category: "Juices & Mixers", description: "Tart, aromatic juice from passion fruit pulp. Intensely tropical.", brands: ["Fresh or frozen puree"], notes: "Passion fruit Daiquiri, certain Tiki drinks." },
  { name: "Pineapple juice", category: "Juices & Mixers", description: "Sweet, tropical juice. Best when fresh, acceptable from can for mixing.", brands: ["Dole, fresh"], notes: "Piña Colada, Jungle Bird, Hawaii Five-O." },
  { name: "Clamato juice", category: "Juices & Mixers", description: "Tomato juice + clam broth blend. Savory, briny. Used in savory cocktails.", brands: ["Clamato ( Mott's )"], notes: "Michelada, Caesar (Canadian Bloody Mary)." },
  { name: "Tomato juice", category: "Juices & Mixers", description: "Savory juice from tomatoes. Base for Bloody Mary and savory cocktails.", brands: ["Campbell's, fresh"], notes: "Bloody Mary, Bloody Caesar." },
  { name: "Cola", category: "Juices & Mixers", description: "Carbonated cola drink. Used as a mixer in highball-style cocktails.", brands: ["Coca-Cola", "Pepsi", "Mexican Coke (real sugar)"], notes: "Cuba Libre, Long Island Iced Tea." },
  { name: "Soda water", category: "Juices & Mixers", description: "Carbonated water with no added flavor. Essential for highballs, Tom Collins, Tom Collins.", brands: ["Schweppes, Pellegrino, Topo Chico"], notes: "Tom Collins, Mojito top-up, Americano top-up, Rickey." },
  { name: "Sparkling water", category: "Juices & Mixers", description: "Same as soda water — may include mineral/sparkling waters like Topo Chico or Perrier.", brands: ["Topo Chico", "Perrier", "Pellegrino", "Schweppes"], notes: "Deduplicated with Soda water." },
  { name: "Ginger beer", category: "Juices & Mixers", description: "Spicy, sweet ginger-flavored carbonated drink. Non-alcoholic (unlike ginger ale). Stronger ginger kick.", brands: ["Fever-Tree Ginger Beer", "Bundaberg", "Gosling's Stormy", "Q Tonic Ginger Beer"], notes: "Dark 'n' Stormy, Moscow Mule." },
  { name: "Lemonade", category: "Juices & Mixers", description: "Sweetened lemon drink. Often used in British/Irish cocktails.", brands: ["Fresh or commercial"], notes: "Lemonade & Gin, certain Collins variations." },
  { name: "Hot coffee", category: "Juices & Mixers", description: "Freshly brewed hot coffee. Used as a base or addition in coffee cocktails.", brands: ["Fresh brew"], notes: "Irish Coffee, Espresso Martini." },
  { name: "Hot sauce", category: "Juices & Mixers", description: "Spicy condiment sauce. Used in small quantities for heat in savory cocktails.", brands: ["Tabasco", "Cholula", "Sriracha", "Valentina"], notes: "Michelada, Bloody Maria, Bloody Caesar." },
  { name: "Worcestershire sauce", category: "Juices & Mixers", description: "Fermented savory condiment. Umami, vinegar, anchovy. Used in Bloody Mary-style drinks.", brands: ["Lea & Perrins"], notes: "Bloody Mary, Bloody Caesar — 2–3 dashes." },

  // SYRUPS & SWEETENERS
  { name: "Cinnamon syrup", category: "Syrups & Sweeteners", description: "Simple syrup infused with cinnamon sticks. Warm, spicy sweetener.", brands: ["Homemade (1:1 sugar:water + cinnamon sticks)"], notes: "Hot Toddies, certain Fall/Winter cocktails." },
  { name: "Honey syrup", category: "Syrups & Sweeteners", description: "Honey thinned with hot water (usually 2:1 honey:water) for pourability. Floral, rich sweetness.", brands: ["Homemade"], notes: "Bee's Knees, Gold Rush, Penicillin." },
  { name: "Honey-ginger syrup", category: "Syrups & Sweeteners", description: "Honey syrup infused with fresh ginger. Spicy, warming sweetener.", brands: ["Homemade"], notes: "Penicillin, Dark 'n' Stormy variation." },
  { name: "Orgeat syrup", category: "Syrups & Sweeteners", description: "Almond-orange blossom water syrup. Nutty, floral, essential in Tiki drinks.", brands: ["Monin Orgeat", "Fee Brothers", "Small Hand Foods"], notes: "Maï Taï, Scorpion, Saturn." },
  { name: "Raspberry syrup", category: "Syrups & Sweeteners", description: "Syrup made from raspberries. Tart-sweet, deep pink-red.", brands: ["Monin", "Fee Brothers", "Homemade"], notes: "Raspberry Collins, certain Sours." },
  { name: "Simple syrup", category: "Syrups & Sweeteners", description: "Equal parts sugar and water, dissolved. The standard neutral sweetener for cocktails. 1:1 ratio.", brands: ["Homemade", "Monin Simple Syrup"], notes: "Almost every cocktail that needs sweetness. ¾ oz per sour cocktail." },
  { name: "Sugar", category: "Syrups & Sweeteners", description: "Granulated white sugar. Used for Old Fashioned muddling, sugar rims, or making simple syrup.", brands: ["Any white granulated sugar"], notes: "Old Fashioned (muddled with bitters), rimming glasses." },
  { name: "Sugar cube", category: "Syrups & Sweeteners", description: "Compressed sugar cubes. Traditional for Old Fashioned — muddled with bitters.", brands: ["Any sugar cube brand"], notes: "Old Fashioned — standard presentation." },

  // FRESH & GARNISH
  { name: "Celery salt", category: "Fresh & Garnish", description: "Coarse salt blended with ground celery seeds. Savory, briny rim salt.", brands: ["McCormick", "Diamond Crystal"], notes: "Bloody Caesar rim, Bloody Mary rim." },
  { name: "Cucumber slices", category: "Fresh & Garnish", description: "Fresh cucumber, thinly sliced. Cool, watery, mild flavor for garnish or muddling.", brands: ["Fresh"], notes: "Hendrick's garnish, Pimm's Cup garnish." },
  { name: "Egg white", category: "Fresh & Garnish", description: "Fresh egg white for foaming cocktails. Dry shake (no ice) to emulsify, then add ice and shake again.", brands: ["Fresh eggs"], notes: "Whiskey Sour, Gin Sour, Clover Club — ¾–1 egg white per cocktail." },
  { name: "Fresh blackberries", category: "Fresh & Garnish", description: "Fresh blackberries for muddling, garnish, or as a flavor component.", brands: ["Fresh seasonal"], notes: "Bramble garnish, muddled in Berry Sours." },
  { name: "Fresh espresso", category: "Fresh & Garnish", description: "Freshly brewed espresso shot. Concentrated coffee flavor for coffee cocktails.", brands: ["Fresh brew"], notes: "Espresso Martini." },
  { name: "Fresh mint", category: "Fresh & Garnish", description: "Fresh mint sprigs. Muddled gently for flavor or used as a garnish slap.", brands: ["Fresh spearmint"], notes: "Mojito, Mint Julep, Southside." },
  { name: "Fresh mint leaves", category: "Fresh & Garnish", description: "Same as Fresh mint — individual leaves for muddling or garnish.", brands: ["Fresh spearmint"], notes: "Deduplicated with Fresh mint." },
  { name: "Nutmeg", category: "Fresh & Garnish", description: "Freshly grated nutmeg. Warm, nutty, aromatic spice for garnish.", brands: ["Whole nutmeg + grater"], notes: "Brandy Alexander garnish, Eggnog, certain punches." },
  { name: "Orange blossom water", category: "Fresh & Garnish", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", brands: ["Cortas", "Moussel", "Food-grade"], notes: "Bee's Knees, certain Ramos Fizz, Arabic cocktails." },

  // DAIRY & CREAM
  { name: "Coconut cream", category: "Dairy & Cream", description: "Thick, rich cream from coconut meat. Not coconut milk — higher fat content. Separates when chilled.", brands: ["Chaokoh", "Aroy-D", "Savoy"], notes: "Piña Colada, Blue Hawaii." },
  { name: "Heavy cream", category: "Dairy & Cream", description: "High-fat dairy cream (36–40% fat). Used for body and richness in shaken cocktails.", brands: ["Any heavy cream brand"], notes: "Brandy Alexander, White Russian, Ramos Gin Fizz." },

  // OTHER SPIRITS & INGREDIENTS
  { name: "Falernum", category: "Other Spirits", description: "Caribbean syrup-spice liqueur. Almond, ginger, clove, allspice. Sweet, warm, 11% ABV.", brands: ["Fee Brothers Falernum", "Old Professor Falernum", "Romilly's"], notes: "Tiki Punch, Scorpion, certain Mai Tai recipes." },
  { name: "Applejack", category: "Other Spirits", description: "American apple brandy made from hard cider. Strong apple character, warm spirit.", brands: ["Laird's Applejack (100 proof or 80 proof)"], notes: "Jack Rose, Applejack Rabbit." },
  { name: "Cachaça", category: "Other Spirits", description: "Brazilian spirit from fermented sugarcane juice. Funky, grassy, herbaceous. Unlike rum (molasses).", brands: ["Leblon", "Avuá", "Novo Fogo", "Ypióca"], notes: "Caipirinha, Caipiroska, Batida." },
  { name: "White peach purée", category: "Other Spirits", description: "Puréed white peach, strained. Sweet, floral, velvety.", brands: ["Bardezzo, Boiron, or fresh purée"], notes: "Bellini (with Prosecco), Peach Sour." },
];

export function getIngredientByName(name: string): Ingredient | undefined {
  return ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
}

export function getCategories(): string[] {
  return [...new Set(ingredients.map(i => i.category))];
}

export function getIngredientsByCategory(category: string): Ingredient[] {
  return ingredients.filter(i => i.category === category);
}
