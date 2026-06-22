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
    { name: "Glenfiddich 12", description: "Scotland's most popular single malt. Light, fruity, with pear and oak notes. The ideal introduction to Speyside whiskies.", related: ["Glenfiddich 14", "Glenfiddich 18", "Glenfiddich 21"], },
    { name: "The Glenlivet 12", description: "Smooth, elegant Speyside single malt. Citrus, vanilla, and stone fruit. A classic gateway whisky.", related: ["The Glenlivet 15", "The Glenlivet 18", "The Glenlivet 21"], },
    { name: "Macallan 12 Double Cask", description: "Rich, sherried Speyside single malt. Honey, ginger, and dried fruit. Luxury benchmark for cocktails like Rob Roy.", related: ["Macallan 18", "Macallan 25", "Macallan Rare Cask"], },
    { name: "Laphroaig 10", description: "Iconic Islay single malt. Intense peat smoke, seaweed, and medicinal iodine. Love it or hate it — unforgettable.", related: ["Laphroaig Quarter Cask", "Laphroaig 18", "Laphroaig Lore"], },
    { name: "Ardbeg 10", description: "Peaty Islay single malt with surprising sweetness. Tar, smoked fish, and citrus. The balanced Islay experience.", related: ["Ardbeg Uigeadail", "Ardbeg Corryvreckan", "Ardbeg 10"], },
    { name: "Lagavulin 16", description: "The king of Islay. Deep peat smoke, dried fruit, and maritime salt. The definitive smoky whisky.", related: ["Lagavulin 12", "Lagavulin 25", "Lagavulin Distillers Edition"], },
    { name: "Johnnie Walker Black Label", description: "The world's most recognized blended Scotch. 12-year-old, rich and smooth with vanilla, honey, and dried fruit. The workhorse for Rusty Nail, Blood and Sand, and Rob Roy.", related: ["Johnnie Walker Red Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], },
    { name: "The Glenlivet 15", description: "Mature, complex Speyside single malt. Ripe fruit, honey, and oak spice. A step up from the 12 with deeper character.", related: ["The Glenlivet 12", "The Glenlivet 18", "The Glenlivet 21"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Glenlivet_Single_Malt_Scotch_Whisky_15_years_old.jpg" },
    { name: "Talisker 10", description: "The signature Isle of Skye single malt. Peppery, maritime, with chili heat and smoky sweetness. The core of many whisky-forward cocktails.", related: ["Talisker 18", "Talisker 25", "Talisker Distillers Edition"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Talisker_10_gruen_voll.jpg" },
    { name: "Highland Park 12", description: "Orkney's benchmark single malt. Heathery, honeyed peat smoke with citrus and spice. Balanced and versatile.", related: ["Highland Park 18", "Highland Park 25", "Highland Park Viking Honour"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Highland_Park_12_yo_new.png" },
    { name: "Balvenie DoubleWood 12", description: "Speyside classic aged in traditional oak and sherry casks. Honey, vanilla, and nutty spice with a smooth finish.", related: ["Balvenie 14", "Balvenie 15", "Balvenie 17"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Balvenie_Whisky_Doublewood_12_years_old.jpg" }
  ]},
  { name: "Blended scotch", category: "Whiskies", description: "A blend of malt and grain whiskies from multiple Scottish distilleries. Consistent year-round character, smoother and more approachable.", brands: ["Johnnie Walker Black", "Chivas Regal 12", "Ballantine's Finest", "Dewar's 12", "Cutty Sark"], notes: "Workhorse for Rusty Nail, Blood and Sand, Rob Roy.", bottles: [
    { name: "Johnnie Walker Red Label", description: "The original Johnnie Walker blend. Bold, fiery, and versatile. Designed for mixing in highballs and cocktails — not meant for sipping neat.", related: ["Johnnie Walker Black Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], },
    { name: "Johnnie Walker Black Label", description: "12-year-old blended Scotch. Rich, smooth, with notes of vanilla, honey, and dried fruit. The benchmark for mixed drinks and sipping alike.", related: ["Johnnie Walker Red Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label", "Johnnie Walker Double Black"], },
    { name: "Johnnie Walker Gold Label", description: "Luxurious blend of rare single malts and grains. Honeyed, floral, and remarkably smooth. Reserved for special occasions.", related: ["Johnnie Walker Black Label", "Johnnie Walker Platinum Label", "Johnnie Walker Blue Label"], },
    { name: "Johnnie Walker Blue Label", description: "The pinnacle. A rare blend of exceptional single malts from across Scotland. Unmatched depth, complexity, and smoothness.", related: ["Johnnie Walker Gold Label", "Johnnie Walker Platinum Label", "Johnnie Walker King George V"], },
    { name: "Chivas Regal 12", description: "The benchmark for smooth, balanced blended Scotch. Honey, ripe pear, and hazelnut. Excellent for cocktails and sipping.", related: ["Chivas Regal 18", "Chivas Regal Extra"], },
    { name: "Ballantine's Finest", description: "Light, elegant blended Scotch. Soft, sweet, with floral notes. The classic choice for a Rusty Nail.", related: ["Ballantine's 12 Year", "Ballantine's 17 Year"], },
    { name: "Johnnie Walker Double Black", description: "Peated blended Scotch from Johnnie Walker. Richer, smokier, and more intense than Black Label. Layered smoke, dried fruit, and black pepper. For those who want Islay-style depth in a blend.", related: ["Johnnie Walker Black Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/JW_Double_Black.jpg" },
    { name: "The Famous Grouse", description: "Scotland's most popular blended Scotch whisky. Smooth, balanced, and approachable with honey, vanilla, citrus, and a hint of smoke. Consistently reliable for highballs and mixed drinks.", related: ["Johnnie Walker Red Label", "Cutty Sark", "Ballantine's Finest"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Famous_Grouse.JPG" },
    { name: "Monkey Shoulder", description: "Blended malt whisky from Scotland. Made from single malts at Craigellachie, Balvenie, and Kininvie distilleries. Smooth, honeyed, with vanilla and spice. The distinctive monkey logo is a bar staple.", related: ["Hendrick's Gin", "Bombay Sapphire", "Tanqueray London Dry"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Monkey_Shoulder_scotch_bottle.jpg" },
    { name: "Johnnie Walker Green Label", description: "15-year-old blended malt Scotch from Johnnie Walker. No grain whisky — all single malts. Elegant, complex, with grass, hay, pepper, and tropical fruit. A sophisticated mixer for Manhattans and stirred cocktails.", related: ["Johnnie Walker Black Label", "Johnnie Walker Gold Label", "The Glenlivet 12"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/JW_Greens.jpg" },
    { name: "Cutty Sark", description: "Light, approachable blended Scotch. Soft, fruity, with a hint of smoke. An affordable, versatile mixer for highballs and long drinks. The distinctive ship-label design is a bar classic.", related: ["Johnnie Walker Red Label", "The Famous Grouse", "Ballantine's Finest"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bottle_of_Cutty_Sark_Scotch_Whisky_with_box.JPG" },
  ]},
  { name: "Blended Scotch", category: "Whiskies", description: "Same as blended scotch — kept as separate entry because it appeared in recipe text with capital S.", brands: ["Johnnie Walker Black", "Chivas Regal 12", "Ballantine's"], notes: "Deduplicated with Blended scotch at runtime.", bottles: [
    { name: "Johnnie Walker Black Label", description: "12-year-old blended Scotch. Rich, smooth, with notes of vanilla, honey, and dried fruit. The benchmark for mixed drinks and sipping alike.", related: ["Johnnie Walker Red Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], },
    { name: "Chivas Regal 12", description: "The benchmark for smooth, balanced blended Scotch. Honey, ripe pear, and hazelnut. Excellent for cocktails and sipping.", related: ["Chivas Regal 18", "Chivas Regal Extra"], },
    { name: "Ballantine's Finest", description: "Light, elegant blended Scotch. Soft, sweet, with floral notes. The classic choice for a Rusty Nail.", related: ["Johnnie Walker Black Label", "Chivas Regal 12", "Ballantine's 17 Year"], image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Johnnie_Walker_Red_Label_Blended_Scotch_Whisky_01.jpg" },
    { name: "Dewar's 12 Year", description: "Smooth, well-rounded blended Scotch aged 12 years. Honey, vanilla, and subtle oak. A reliable mixing whisky for Rusty Nail and highballs.", related: ["Johnnie Walker Black Label", "Chivas Regal 12", "Ballantine's Finest"] },
    { name: "Cutty Sark", description: "Light, approachable blended Scotch. Soft, fruity, with a hint of smoke. An affordable mixer for highballs and long drinks.", related: ["Johnnie Walker Black Label", "Chivas Regal 12", "Ballantine's Finest"] },
    { name: "Monkey Shoulder", description: "Blended malt whisky from Scotland. Known for its distinctive monkey-shaped logo and smooth, approachable character. Made from single malts at Craigellachie, Balvenie, and Kininvie distilleries.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Monkey_Shoulder_Whisky.jpg", related: ["Hendrick's Gin", "Bombay Sapphire", "Tanqueray London Dry"] },
    { name: "Black & White", description: "Classic blended Scotch whisky with a distinctive black and white terrier logo. Smooth, medium-bodied with notes of vanilla, oak, and subtle smoke.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Black_%26_White_(whisky)_bottle_01.jpg", related: ["Johnnie Walker Black Label", "Chivas Regal 12", "Ballantine's Finest"] },
    { name: "The Famous Grouse", description: "Iconic blended Scotch whisky from Scotland. Smooth, balanced, and approachable with notes of honey, vanilla, and a hint of citrus. The most popular whisky in Scotland.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Famous_Grouse.JPG", related: ["Johnnie Walker Red Label", "Cutty Sark", "Ballantine's Finest"] }
  ]},
  { name: "Islay Scotch", category: "Whiskies", description: "Single malt Scotch from Islay island, known for intense peat smoke, medicinal iodine, and maritime salinity.", brands: ["Laphroaig 10", "Ardbeg 10", "Lagavulin 16", "Bowmore 12", "Caol Ila 12"], notes: "Use sparingly — a ½ oz can dominate a cocktail. Great in Penicillin or Blood and Sand variation.", bottles: [
    { name: "Laphroaig 10", description: "Iconic Islay single malt. Intense peat smoke, seaweed, and medicinal iodine. Love it or hate it — unforgettable.", related: ["Laphroaig Quarter Cask", "Laphroaig 18", "Laphroaig Lore"], },
    { name: "Lagavulin 16", description: "The king of Islay. Deep peat smoke, dried fruit, and maritime salt. The definitive smoky whisky.", related: ["Lagavulin 12", "Lagavulin 25", "Lagavulin Distillers Edition"], },
    { name: "Ardbeg 10", description: "Peaty Islay single malt with surprising sweetness. Tar, smoked fish, and citrus. The balanced Islay experience.", related: ["Ardbeg Uigeadail", "Ardbeg Corryvreckan", "Ardbeg 10"], },
    { name: "Bowmore 12", description: "Islay single malt with balanced peat smoke, heather honey, and citrus. Less aggressive than Laphroaig or Lagavulin — a gentler introduction to Islay.", related: ["Bowmore 15", "Caol Ila 12", "Laphroaig 10"] },
    { name: "Johnnie Walker Black Label", description: "The world's most recognized blended Scotch. 12-year-old, rich and smooth with vanilla, honey, and dried fruit. The workhorse for Rusty Nail, Blood and Sand, and Rob Roy.", related: ["Johnnie Walker Red Label", "Johnnie Walker Gold Label", "Johnnie Walker Blue Label"], }
  ,
    { name: "Caol Ila 12", description: "Islay single malt from Caol Ila distillery. Lightly peated with coastal salinity, citrus, and vanilla. A more approachable Islay for those who find Laphroaig too intense.", related: ["Caol Ila 18", "Laphroaig 10", "Lagavulin 16"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Caol_Ila_12_years_old_whisky.jpg" }
  ,
    { name: "Laphroaig Quarter Cask", description: "Matured in ex-bourbon quarter casks for an intense, sweet-peat experience. Smaller barrels mean more oak contact — richer vanilla and toffee beneath the signature Laphroaig smoke.", related: ["Laphroaig 10", "Laphroaig 18", "Laphroaig Lore"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Laphroaig_Quarter_Cask.jpg" }
  ,
    { name: "Bruichladdich Scottish Barley", description: "Unpeated Islay single malt from Bruichladdich. Made from Scottish barley. Floral, fruity, with barley sugar and vanilla. The opposite end of the Islay spectrum from the peaty heavyweights.", related: ["Bruichladdich The Classic Laddie", "Bruichladdich Port Charlotte", "Bruichladdich Octomore"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bruichladdich_Scottish_Barley_Single_Malt_Scotch_Whisky.jpg" }
  ,
    { name: "Port Charlotte Scottish Barley", description: "Heavily peated Islay single malt from Bruichladdich's Port Charlotte range. 50% ABV. Intense smoke, citrus, and brine balanced by barley sweetness. A bridge between classic Islay peat and Bruichladdich's floral side.", related: ["Bruichladdich Scottish Barley", "Port Charlotte 10", "Bruichladdich Octomore"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Port_Charlotte_Scottish_Barley_Islay_Single_Malt_Scotch_Whisky.jpg" }
  ,
    { name: "Lagavulin Distillers Edition", description: "Lagavulin finished in Pedro Ximénez sherry casks. Rich peat smoke layered with dried fruit, dark chocolate, and spice. A luxurious, sweeter take on Islay smoke.", related: ["Lagavulin 16", "Lagavulin 12", "Lagavulin 25"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lagavulin_Islay_Single_Malt_Scotch_Whisky_The_Distillers_edition.jpg" }
  ] },
  { name: "Irish whiskey", category: "Whiskies", description: "Triple-distilled Irish whiskey, typically lighter and smoother than Scotch with notes of honey, vanilla, and green apple.", brands: ["Jameson", "Bushmills Original", "Redbreast 12", "Tullamore D.E.W.", "Green Spot"], notes: "Key for Irish Coffee, Tipperary, Forty-Three.", bottles: [
    { name: "Jameson", description: "Ireland's best-selling whiskey. Triple-distilled, smooth, with honey, vanilla, and green apple. The standard for Irish Coffee and mixers.", related: ["Jameson Black Barrel", "Jameson Caskmates", "Bushmills Original"], },
    { name: "Bushmills Original", description: "Smooth Irish whiskey from the Old Bushmills Distillery. Triple-distilled, light, with vanilla and oak. A classic alternative to Jameson.", related: ["Bushmills 10", "Bushmills 16", "Jameson"], },
    { name: "Redbreast 12", description: "Single pot still Irish whiskey from Midleton Distillery. Rich, full, with dried fruit, spice, and toasted oak. The premium choice for Irish Coffee or neat sipping.", related: ["Jameson", "Bushmills Original", "Redbreast 15"] },
    { name: "Tullamore D.E.W.", description: "Irish whiskey from Tullamore. Triple-distilled with a touch of pot still malt. Smooth, balanced, with honey and spice. Great for Irish Coffee.", related: ["Jameson", "Bushmills Original", "Redbreast 12"] },
    { name: "Redbreast 15", description: "Premium single pot still Irish whiskey from Midleton Distillery. Older sibling to Redbreast 12. Rich, full-bodied, with dried fruit, spice, toasted oak, and a long warming finish. 46% ABV, non-chill-filtered.", related: ["Jameson", "Bushmills Original", "Redbreast 12"] },
    { name: "Powers Gold Label", description: "Classic Irish single pot still whiskey from John Powers & Co. Rich, spicy, with notes of apple, pepper, and toasted oak. The original gold label Irish whiskey, unchanged for over a century.", related: ["Jameson", "Bushmills Original", "Redbreast 12"] }
  ] },
  { name: "Rye whiskey", category: "Whiskies", description: "American whiskey made with at least 51% rye grain. Spicy, herbal, and drier than bourbon with a peppery finish.", brands: ["Rittenhouse Rye", "Bulleit Rye", "Sazerac Rye", "Wild Turkey Rye", "WhistlePig 10", "Templeton Rye", "Old Overholt Rye", "High West Rye", "Jim Beam Rye"], notes: "Essential for Manhattan, Sazerac, Boulevardier.", bottles: [
    { name: "Rittenhouse Rye", description: "100-proof bonded rye whiskey from Heaven Hill. Bold, spicy, with pepper, clove, and cinnamon. The standard for classic Manhattans and Sazeracs.", related: ["Bulleit Rye", "Sazerac Rye", "Wild Turkey Rye"], },
    { name: "Bulleit Rye", description: "High-rye whiskey from Bulleit. Spicy, clean, with pepper and vanilla. Sourced from MGP; easy-mixing for Manhattan and Boulevardier.", related: ["Rittenhouse Rye", "WhistlePig 10 Year", "Bulleit Bourbon"] },
    { name: "Sazerac Rye", description: "Straight rye whiskey from the Sazerac Company. Spicy, bold, with cinnamon and clove. The classic pick for a Sazerac cocktail.", related: ["Rittenhouse Rye", "Bulleit Rye", "Wild Turkey Rye"] },
    { name: "Wild Turkey Rye", description: "Rye whiskey from Wild Turkey Distillery in Kentucky. Bold, spicy, with pepper, clove, and caramel. Less common than their bourbon but excellent for Manhattan and Boulevardier.", related: ["Wild Turkey 101", "Rittenhouse Rye", "Bulleit Rye"] },
    { name: "WhistlePig 10 Year", description: "Premium 100% rye whiskey from WhistlePig Distillery in Vermont. Aged 10 years in new American oak. Bold, spicy, with pepper, cinnamon, and a long warming finish. A sought-after sipper and cocktail rye.", related: ["WhistlePig 12 Year", "Rittenhouse Rye", "Bulleit Rye"] }
  ,
    { name: "Templeton Rye", description: "American rye whiskey from Templeton Distillery in Iowa. Spicy, bold, with pepper, clove, and vanilla. 100-proof. A widely available craft cocktail rye for Manhattan and Boulevardier.", related: ["Rittenhouse Rye", "Bulleit Rye", "Old Overholt Rye"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Old_Overholt_RyeWhiskey_bottle.jpg" }
  ,
    { name: "Old Overholt Rye", description: "Historic American straight rye whiskey from Pennsylvania. One of the oldest continuously produced rye brands in the US. Spicy, bold, with pepper and oak. A classic mixer for Manhattan and Sazerac.", related: ["Rittenhouse Rye", "Templeton Rye", "Wild Turkey Rye"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Old_Overholt_RyeWhiskey_bottle.jpg" }
  ,
    { name: "High West Rye", description: "American rye whiskey from High West Distillery in Utah. Blended and aged in the American West. Bold, spicy, with pepper, vanilla, and oak. A craft favorite for sipping and cocktails.", related: ["Rittenhouse Rye", "Bulleit Rye", "Templeton Rye"] }
  ,
    { name: "Jim Beam Rye", description: "American rye whiskey from Jim Beam. Spicy, bold, with pepper, clove, and caramel. 90 proof. A widely available, affordable rye for Manhattan and Boulevardier.", related: ["Rittenhouse Rye", "Wild Turkey Rye", "Old Overholt Rye"] }
  ] },
  { name: "Bourbon", category: "Whiskies", description: "American whiskey made with at least 51% corn, aged in new charred American oak. Sweet vanilla, caramel, and oak notes.", brands: ["Buffalo Trace", "Maker's Mark", "Woodford Reserve", "Bulleit Bourbon", "Wild Turkey 101", "Four Roses Small Batch"], notes: "Versatile: Mint Julep, Old Fashioned, Whiskey Sour, Boulevardier.", bottles: [
    { name: "Buffalo Trace", description: "Kentucky straight bourbon from Buffalo Trace Distillery. Rich vanilla, caramel, and mint with a smooth finish. The benchmark affordable bourbon.", related: ["Buffalo Trace Eagle Rare", "Wild Turkey 101", "Maker's Mark"] },
    { name: "Wild Turkey 101", description: "High-rye Kentucky bourbon. Bold, spicy, with caramel, vanilla, and a peppery finish. 101 proof for extra kick.", related: ["Wild Turkey 81", "Wild Turkey Rare Breed", "Buffalo Trace"] },
    { name: "Maker's Mark", description: "Kentucky straight bourbon with a distinctive red wax seal. Made with winter wheat for a soft, sweet profile of caramel, vanilla, and oak. Widely available and approachable.", related: ["Buffalo Trace", "Wild Turkey 101", "Bulleit Bourbon"] },
    { name: "Bulleit Bourbon", description: "High-rye Kentucky bourbon. Spicy, bold, with caramel, vanilla, and oak. A versatile mixer for Old Fashioned and Boulevardier.", related: ["Bulleit Rye", "Buffalo Trace", "Wild Turkey 101"] },
    { name: "Woodford Reserve", description: "Kentucky straight bourbon from Woodford Reserve Distillery. Rich, complex, with dark fruit, vanilla, and toasted oak. 45.2% ABV. A premium choice for Old Fashioned and Mint Julep.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Woodford_Reserve_Bourbon_01.jpg" },
    { name: "Four Roses Small Batch", description: "Kentucky straight bourbon from Four Roses. Smooth, balanced, with red fruit, cocoa, and spice. 90 proof. A versatile sipper and cocktail bourbon.", related: ["Buffalo Trace", "Maker's Mark", "Wild Turkey 101"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Four_Roses_Small_Batch_Bourbon.jpg" },
    { name: "Evan Williams Black Label", description: "Value Kentucky straight bourbon from Evan Williams. Sweet vanilla, caramel, and oak. 86 proof. Widely available and affordable workhorse for mixed drinks.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"] },
    { name: "Knob Creek 9 Year", description: "Kentucky straight bourbon from Beam Suntory. Aged 9 years in charred oak. Rich caramel, vanilla, and oak with a bold 100-proof finish. Excellent for Old Fashioneds and Manhattan flexibility.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Knob_Creek.JPG" },
    { name: "Elijah Craig Small Batch", description: "Kentucky straight bourbon from Heaven Hill. Aged 4–8 years. Sweet caramel, vanilla, and toasted oak with a smooth 94-proof profile. The benchmark for small-batch bourbon cocktails.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Elijah_Craig_Small_Batch.jpg" },
    { name: "Wild Turkey Rare Breed", description: "Unfiltered, uncut Kentucky bourbon from Wild Turkey. Bottled at 101 proof. Bold, intense, with caramel, vanilla, pepper, and oak. The boldest expression in the Wild Turkey lineup.", related: ["Wild Turkey 101", "Buffalo Trace", "Rittenhouse Rye"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Wild_Turkey_Rare_Breed.jpg" },
    { name: "Old Forester 86", description: "Kentucky straight bourbon from Old Forester. Bottled in bond. Rich caramel, vanilla, and oak with a spicy finish. 86 proof. A reliable, affordable mixer.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Old_Forester_86_proof_and_100_proof.jpg" },
    { name: "Blanton's Single Barrel", description: "Premium Kentucky straight bourbon from Buffalo Trace Distillery. Single barrel, 93 proof. Rich vanilla, caramel, orange, and spice with a distinctive collectible bottle design. A top-shelf choice for Old Fashioneds.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Blanton%27s_Single_Barrel_Bourbon.jpg" }
  ] },
  { name: "Bourbon or rye", category: "Whiskies", description: "Either bourbon or rye whiskey depending on preference. Bourbon = sweeter; rye = spicier/drier.", brands: ["Buffalo Trace", "Rittenhouse Rye"], notes: "Manhattan flexibility.", bottles: [
    { name: "Buffalo Trace", description: "Kentucky straight bourbon. Rich vanilla, caramel, and mint. Widely available and affordable — the go-to when a recipe just says bourbon.", related: ["Wild Turkey 101", "Maker's Mark", "Rittenhouse Rye"] },
    { name: "Rittenhouse Rye", description: "100-proof bonded rye. Bold, spicy, with pepper and clove. The rye pick for Manhattan flexibility.", related: ["Bulleit Rye", "Buffalo Trace", "Sazerac Rye"], },
    { name: "Knob Creek 9 Year", description: "Kentucky straight bourbon from Beam Suntory. Aged 9 years in charred oak. Rich caramel, vanilla, and oak with a bold 100-proof finish. Excellent for Old Fashioneds and Manhattan flexibility.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"] },
    { name: "Elijah Craig Small Batch", description: "Kentucky straight bourbon from Heaven Hill. Aged 4–8 years. Sweet caramel, vanilla, and toasted oak with a smooth 94-proof profile. The benchmark for small-batch bourbon cocktails.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"] },
    { name: "Old Forester 86", description: "Kentucky straight bourbon from Old Forester. Bottled in bond. Rich caramel, vanilla, and oak with a spicy finish. 86 proof. A reliable, affordable mixer.", related: ["Buffalo Trace", "Wild Turkey 101", "Maker's Mark"] },
    { name: "Wild Turkey 101", description: "High-rye Kentucky bourbon. Bold, spicy, with caramel, vanilla, and a peppery finish. 101 proof for extra kick.", related: ["Wild Turkey 81", "Wild Turkey Rare Breed", "Buffalo Trace"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/WildTurkeyBottle_no1.jpg" },
    { name: "Bulleit Bourbon", description: "High-rye Kentucky bourbon. Spicy, bold, with caramel, vanilla, and oak. A versatile mixer for Old Fashioned and Boulevardier.", related: ["Bulleit Rye", "Buffalo Trace", "Wild Turkey 101"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bulleit_Bourbon_Frontier_Whiskey.jpg" },
    { name: "Maker's Mark", description: "Kentucky straight bourbon with a distinctive red wax seal. Made with winter wheat for a soft, sweet profile of caramel, vanilla, and oak. Widely available and approachable.", related: ["Buffalo Trace", "Wild Turkey 101", "Knob Creek 9 Year"] },
    { name: "Jim Beam Rye", description: "American rye whiskey from Jim Beam. Spicy, bold, with pepper, clove, and caramel. 90 proof. A widely available, affordable rye for Manhattan and Boulevardier.", related: ["Rittenhouse Rye", "Bulleit Rye", "Wild Turkey Rye"] }
  ] },
  { name: "Brandy", category: "Brandy & Cognac", description: "General term for spirit distilled from fermented fruit juice, most commonly grapes (cognac is the finest brandy).", brands: ["Remy Martin VSOP", "Hennessy VS", "Martell VSOP"], notes: "Covers Brandy Alexander, Sidecar, Between the Sheets.", bottles: [
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac from Remy Martin. Rich, smooth, with vanilla, dried fruit, and cocoa. A step up from VS for cocktails.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], },
    { name: "Hennessy VS", description: "World's most popular cognac. A blend of eaux-de-vie aged at least 2 years. Bold, warm, with vanilla, spice, and toasted oak.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], }
  ,
    { name: "E&J VSOP Brandy", description: "California VSOP brandy from Ernest & Julio Gallo. Aged in oak. Smooth, sweet, with vanilla, caramel, and dried fruit. An accessible mixing brandy for Sidecar and Brandy Alexander.", related: ["Remy Martin VSOP", "Hennessy VS", "Torres 10 Year Brandy"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/E%26J_VSOP_Brandy_Bottle.jpg" }
  ,
    { name: "Torres 10 Year Brandy", description: "Spanish brandy from Torres in Catalonia. Aged 10 years in oak. Rich, smooth, with vanilla, caramel, and dried fruit. The benchmark Spanish brandy for Sidecar.", related: ["E&J VSOP Brandy", "Hennessy VS", "Asbach Uralt Brandy"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Torres_10_Brandy.jpg" }
  ,
    { name: "Asbach Uralt Brandy", description: "German brandy from Asbach. Aged in small oak barrels. Smooth, warm, with vanilla, spice, and stone fruit. The classic German brandy for mixed drinks.", related: ["E&J VSOP Brandy", "Hennessy VS", "Torres 10 Year Brandy"] }
  ,
    { name: "Martell VSOP", description: "Classic VSOP cognac from the world's oldest cognac house (founded 1715). Smooth, elegant, with vanilla, dried fruit, and toasted oak. 4-year minimum aging. A cornerstone for Sidecar and Brandy Alexander.", related: ["Remy Martin VSOP", "Hennessy VSOP", "Martell XO"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Martell_Vsop.jpg" }
  ,
    { name: "Courvoisier VS", description: "French cognac from the Cognac region. Youngest in the Courvoisier lineup. Bright, clean, with fresh fruit and light oak. The entry point to the Courvoisier range.", related: ["Courvoisier VSOP", "Remy Martin VS", "Hennessy VS"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Courvoisier_VS.jpg" }
  ,
    { name: "Fundador - Brandy de Jerez", description: "Spanish brandy de Jerez from Fundador. Aged in American oak solera barrels. Rich, warm, with vanilla, caramel, dried fruit, and nutty sherry influence. The benchmark brandy de Jerez for Brandy Alexander and Sidecar.", related: ["Torres 10 Year Brandy", "E&J VSOP Brandy", "Asbach Uralt Brandy"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Fundador_-_Brandy_de_Jerez.JPG" }
  ,
    { name: "Larsen VS cognac", description: "French cognac from Larsen. Young VS expression. Bright, clean, with fresh fruit and light oak. An accessible entry-level cognac for mixing.", related: ["Remy Martin VSOP", "Hennessy VS", "Courvoisier VS"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Larsen_VS.jpg" }
  ,
    { name: "Meukow VS", description: "French cognac from Meukow. VS grade. Smooth, approachable, with vanilla and fresh fruit notes. A reliable mixing cognac for Sidecar and Brandy Alexander.", related: ["Remy Martin VSOP", "Hennessy VS", "Martell VSOP"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meukow_VS_bottle.jpg" }
  ] },
  { name: "Brandy or Cognac", category: "Brandy & Cognac", description: "Cognac is a specific type of brandy from the Cognac region of France, always double-distilled in copper pot stills.", brands: ["Remy Martin VSOP", "Hennessy VS", "Martell Cordon Bleu", "Courvoisier VS"], notes: "Cognac gives richer fruit notes in Brandy Alexander, Sazerac variation.", bottles: [
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac. Rich, smooth, with vanilla, dried fruit, and cocoa.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], },
    { name: "Hennessy VS", description: "World's most popular cognac. Bold, warm, with vanilla, spice, and toasted oak.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], },
    { name: "Courvoisier VS", description: "French cognac from the Cognac region. Youngest in the Courvoisier lineup. Bright, clean, with fresh fruit and light oak. The entry point to the Courvoisier range.", related: ["Courvoisier VSOP", "Remy Martin VS", "Hennessy VS"] },
    { name: "Martell VSOP", description: "Classic VSOP cognac from the world's oldest cognac house (founded 1715). Smooth, elegant, with vanilla, dried fruit, and toasted oak. 4-year minimum aging. A cornerstone for Sidecar and Brandy Alexander.", related: ["Remy Martin VSOP", "Hennessy VSOP", "Martell XO"] },
    { name: "Bardinet VSOP Brandy", description: "French VSOP brandy from Bardinet. Smooth, warm, with vanilla, dried fruit, and spice. An affordable mixing brandy for Sidecar and Brandy Alexander when a VSOP-grade spirit is desired.", related: ["Remy Martin VSOP", "Hennessy VS", "E&J VSOP Brandy"] }
  ] },
  { name: "Cognac", category: "Brandy & Cognac", description: "Fine French brandy from Cognac region. VS (very special, min 2 years), VSOP (min 4 years), XO (min 10 years).", brands: ["Remy Martin VS", "Hennessy VS", "Martell VS", "Courvoisier VS", "Remy Martin VSOP", "Hennessy VSOP"], notes: "Sidecar, Brandy Alexander, B&B.", bottles: [
    { name: "Hennessy VS", description: "World's most popular cognac. A blend of eaux-de-vie aged at least 2 years. Bold, warm, with vanilla, spice, and toasted oak. The standard for Sidecars and Brandy Alexander.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], },
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac from Remy Martin. Rich, smooth, with vanilla, dried fruit, and cocoa. A step up from VS for cocktails.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], },
    { name: "Hennessy XO", description: "Premium XO cognac from Hennessy. Rich, powerful, with dried fruit, cocoa, spice, and toasted oak. Minimum 10 years aging. The luxury choice for Sidecar or neat sipping.", related: ["Hennessy VS", "Hennessy VSOP", "Remy Martin XO"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hennessy_XO_Cognac_01.jpg" },
    { name: "Martell XO", description: "Premium XO cognac from Martell. Rich, powerful, with dried fruit, cocoa, spice, and toasted oak. The luxury expression from the world's oldest cognac house.", related: ["Martell VSOP", "Remy Martin VSOP", "Hennessy XO"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Martell_XO_Cognac_01.jpg" },
    { name: "Courvoisier VSOP", description: "VSOP cognac from Courvoisier. Smooth, elegant, with vanilla, dried fruit, and toasted oak. A solid middle-tier cognac for Sidecar and mixed drinks.", related: ["Courvoisier VS", "Remy Martin VSOP", "Hennessy VSOP"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Courvoisier_VSOP_Cognac_01.jpg" }
  ] },
  { name: "Cognac or VSOP brandy", category: "Brandy & Cognac", description: "VSOP-grade cognac or equivalent brandy, aged minimum 4 years. Smooth with dried fruit and vanilla.", brands: ["Remy Martin VSOP", "Hennessy VSOP", "Martell VSOP"], notes: "VSOP specifically required for some classic recipes.",
  bottles: [
    { name: "Remy Martin VSOP", description: "Premium VSOP cognac. Rich, smooth, with vanilla, dried fruit, and cocoa.", related: ["Remy Martin VS", "Remy Martin XO", "Martell VSOP"], },
    { name: "Hennessy VSOP", description: "Popular VSOP cognac. Smooth, with vanilla, spice, and toasted oak.", related: ["Hennessy VS", "Hennessy XO", "Remy Martin VSOP"], },
    { name: "Martell VSOP", description: "Classic VSOP cognac from the world's oldest cognac house. Smooth, elegant, with vanilla, dried fruit, and toasted oak. 4-year minimum aging.", related: ["Remy Martin VSOP", "Hennessy VSOP", "Martell XO"], },
    { name: "Remy Martin VS", description: "Entry-level VS cognac from Remy Martin. Young, vibrant, with fresh fruit and floral notes. The most accessible Remy Martin for mixed drinks.", related: ["Remy Martin VSOP", "Remy Martin XO", "Hennessy VS"], },
    { name: "Hennessy VS", description: "The world's best-selling VS cognac. Bold, warm, with vanilla, spice, and toasted oak. Aged minimum 2 years. The standard for Sidecars and Brandy Alexander when VSOP is not specified.", related: ["Hennessy VSOP", "Hennessy XO", "Remy Martin VS"], }
  ]
},
  { name: "Apple brandy", category: "Brandy & Cognac", description: "Brandy distilled from apples, also called applejack when American. Clear or lightly aged. Apple-forward with warm spice.", brands: ["Calvados Boulard", "Laird's Applejack", "Clear Creek Apple Brandy", "St-Germain (not apple — Calvados)"], notes: "Jack Rose, Applejack Rabbit.", bottles: [
    { name: "Laird's Applejack", description: "America's oldest apple brandy, dating to 1780. Made from blended apple cider and neutral spirits. Apple-forward, warm, and versatile for Jack Rose and Applejack Rabbit.", related: ["Laird's 100 Proof", "Clear Creek Apple Brandy", "Calvados Boulard"] },
    { name: "Clear Creek Apple Brandy", description: "Oregon-made apple brandy from Clear Creek Distillery. Distilled from whole apples. Clean, bright apple character. A classic American alternative to Calvados.", related: ["Laird's Applejack", "Calvados Boulard", "Laird's 100 Proof"] },
    { name: "Calvados Boulard", description: "Premium Calvados from Normandy, France. Made from carefully selected apples, aged in oak barrels. Rich apple and pear flavors with vanilla, spice, and toasted oak notes. 40% ABV. The benchmark French apple brandy for cocktails.", related: ["Laird's Applejack", "Clear Creek Apple Brandy", "Laird's 100 Proof Applejack"] },
    { name: "Laird's 100 Proof Applejack", description: "Higher-proof version of Laird's Applejack at 50% ABV. Bolder apple character and more spirit-forward than the 80-proof expression. The traditional pick for Jersey Lightning and stronger apple-forward cocktails.", related: ["Laird's Applejack", "Clear Creek Apple Brandy", "Calvados Boulard"] },
    { name: "Château Breuil VSOP Calvados", description: "Premium Calvados from the Pays d'Auge region in Normandy. Aged a minimum of 4 years in oak barrels. Smooth apple and pear character with vanilla, spice, and toasted oak. The benchmark for sipping and premium cocktails.", related: ["Château Breuil VS", "Calvados Boulard", "Laird's 100 Proof Applejack"] },
    { name: "Château Breuil VS Calvados", description: "Younger Calvados from Château Breuil in Normandy. Bright apple fruit with soft oak and spice. A more approachable everyday apple brandy for mixing and casual sipping. Minimum 2 years aging.", related: ["Château Breuil VSOP Calvados", "Calvados Boulard", "Laird's Applejack"] }
  ] },
  { name: "Apricot brandy", category: "Brandy & Cognac", description: "Brandy infused with or distilled from apricots. Sweet, fruity, golden-amber.", brands: ["Marie Brizard Apricot Brandy", "Bols Apricot Brandy", "Rothman & Winter"], notes: "B&B, Apricot Sour.",
  bottles: [
    { name: "Marie Brizard Apricot Brandy", description: "Sweet apricot brandy. Golden-amber, fruity, with warm stone-fruit character.", related: ["Bols Apricot Brandy", "Rothman & Winter"] },
    { name: "Bols Apricot Brandy", description: "Dutch apricot brandy. Sweet, smooth, with natural apricot flavor.", related: ["Marie Brizard Apricot Brandy", "Rothman & Winter"] },
    { name: "Rothman & Winter Apricot Brandy", description: "Austrian apricot brandy from Rothman & Winter. Made from ripe apricots. Sweet, rich, with authentic stone-fruit character.", related: ["Marie Brizard Apricot Brandy", "Bols Apricot Brandy"] },
    { name: "DeKuyper Apricot Brandy", description: "American apricot brandy from DeKuyper. Sweet, smooth, with natural apricot flavor. Widely available.", related: ["Marie Brizard Apricot Brandy", "Bols Apricot Brandy"] },
    { name: "Bardinet Apricot Brandy", description: "French apricot brandy from Bardinet. Sweet, fruity, with warm stone-fruit notes. Versatile for cocktails.", related: ["Marie Brizard Apricot Brandy", "Bols Apricot Brandy"] }
  ]
},
  { name: "Cherry brandy", category: "Brandy & Cognac", description: "Fruit brandy made from cherries, distinct from cherry liqueur which is sweeter and red. More spirit-forward.", brands: ["Clear Creek Kirschwasser", "Luxardo Maraschino (semi-related)", "G.E. Massenez Kirsch"], notes: "Japanese Cocktail, certain Boulevardier variations.",
  bottles: [
    { name: "Clear Creek Kirschwasser", description: "Oregon-made kirschwasser. Dry, clear cherry eau-de-vie.", related: ["G.E. Massenez Kirsch", "Luxardo Maraschino Liqueur"] },
    { name: "G.E. Massenez Kirsch", description: "French kirsch from Alsace. Dry, clean, aromatic cherry spirit.", related: ["Clear Creek Kirschwasser", "Luxardo Maraschino Liqueur"] },
    { name: "Luxardo Maraschino Liqueur", description: "Italian cherry liqueur from Luxardo. Made from sour Marasca cherries. Sweet, complex, with cherry and almond notes. The standard for Aviation and Last Word cocktails.", related: ["Clear Creek Kirschwasser", "G.E. Massenez Kirsch", "Luxardo Amaro"] },
    { name: "Cherry Heering", description: "Danish cherry liqueur from Peter Heering since 1818. Sweet, rich, with ripe cherry, spice, and almond notes. 24% ABV. A cornerstone of Singapore Sling and B-52.", related: ["Luxardo Maraschino Liqueur", "Maraska Maraschino", "G.E. Massenez Kirsch"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cherry_Heering_-_Peter_Heering_Liqueur_70cl_bottle.jpg" },
    { name: "Maraska Maraschino", description: "Croatian cherry liqueur from the Maraska distillery in Zadar. Made from Marasca cherries. Sweet, complex, with deep cherry, spice, and almond notes. The traditional choice for cocktails and sipping.", related: ["Luxardo Maraschino Liqueur", "Cherry Heering", "G.E. Massenez Kirsch"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Maraschino_Maraska_Bottle.jpg" }
  ]
},
  { name: "Kirsch", category: "Brandy & Cognac", description: "Clear, dry cherry brandy from Germany/France. Unaged, eau-de-vie style. Pure cherry with no added sugar.", brands: ["G.E. Massenez Kirsch", "Clear Creek Kirschwasser", "Distillerie de Neuchâtel"], notes: "White Lady, Kirsch Royal, Tiki drinks.",
  bottles: [
    { name: "G.E. Massenez Kirsch", description: "French kirsch from Alsace. Distilled from Griotte cherries. Dry, clear, pure cherry flavor.", related: ["Clear Creek Kirschwasser", "Distillerie de Neuchâtel"] },
    { name: "Clear Creek Kirschwasser", description: "Oregon-made kirschwasser. Dry, clear cherry eau-de-vie. Unaged, no sugar.", related: ["G.E. Massenez Kirsch", "Luxardo Maraschino"] },
    { name: "Distillerie de Neuchâtel Kirsch", description: "Swiss kirschwasser from the Neuchâtel region. Clear, dry, refined cherry eau-de-vie with crisp mineral notes. Traditionally paired with Swiss fondue.", related: ["G.E. Massenez Kirsch", "Clear Creek Kirschwasser"] },
    { name: "Schwarzwälder Kirschwasser", description: "Traditional Black Forest kirsch from Germany. Distilled from locally grown sour cherries. Known for its clean, pure cherry character with subtle almond notes from the cherry pits. Often enjoyed neat or in cocktails like the Black Forest.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kirschwasser_Bavaria.JPG", related: ["G.E. Massenez Kirsch", "Clear Creek Kirschwasser"] },
    { name: "Etter Zuger Kirsch", description: "Swiss kirsch from the Zug region, produced by Etter Söhne Distillerie. Double-distilled from rare old cherry varieties. Clean, elegant, and slightly nutty with a long mineral finish. One of Switzerland's most celebrated kirsch brands.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Zuger-Kirsch-Etter-Flaschen-2013.jpg", related: ["Distillerie de Neuchâtel Kirsch", "G.E. Massenez Kirsch"] }
  ]
},
  { name: "Pisco", category: "Brandy & Cognac", description: "Un-aged or lightly aged grape brandy from Peru or Chile. Fragrant, floral, with citrus and stone fruit notes.", brands: ["Macchu Pisco (Peru)", "Campo de Encanto (Peru)", "Alto del Carmen (Chile)", "La Botija (Peru)"], notes: "Pisco Sour, Chilcano.", bottles: [
    { name: "Campo de Encanto Pisco", description: "Peruvian pisco from the Ica Valley. Distilled from Quebranta grapes. Smooth, aromatic, with citrus and stone fruit. The standard for Pisco Sour.", related: ["Macchu Pisco", "La Botija", "Alto del Carmen"], },
    { name: "Macchu Pisco", description: "Peruvian pisco from the valleys of Ica. Aromatic, floral, with grape and citrus notes. Smooth and versatile.", related: ["Campo de Encanto", "La Botija", "Alto del Carmen"] },
    { name: "La Botija Pisco", description: "Peruvian pisco from the Ica Valley. Distilled from Quebranta grapes. Smooth, aromatic, with citrus and stone fruit notes. A well-regarded boutique pisco.", related: ["Campo de Encanto Pisco", "Macchu Pisco", "Alto del Carmen"] },
    { name: "Alto del Carmen Pisco", description: "Chilean pisco from the Huasco Valley in the Atacama region. Distilled from Pedro Jiménez and Muscat grapes. Bright, aromatic, with citrus, tropical fruit, and floral notes.", related: ["Campo de Encanto Pisco", "Macchu Pisco", "La Botija"] },
    { name: "Montelongo Pisco", description: "Peruvian pisco from the Ica Valley. Distilled from Quebranta grapes in small batches. Smooth, balanced, with citrus, stone fruit, and gentle floral notes. A craft expression ideal for Pisco Sour.", related: ["Campo de Encanto Pisco", "Macchu Pisco", "La Botija"] },
    { name: "Pisco Mistral", description: "Chilean pisco from the Elqui Valley. Distilled from Pedro Jiménez and Muscat grapes. Smooth, aromatic, with citrus, stone fruit, and gentle floral notes. A benchmark Chilean pisco for Pisco Sour and cocktails.", related: ["Alto del Carmen Pisco", "Campo de Encanto Pisco", "Pisco Control"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pisco_Mistral.jpg" },
    { name: "Don Alfredo Pisco", description: "Peruvian pisco from the Ica Valley. Distilled from Quebranta grapes. Smooth, aromatic, with citrus and stone fruit. A well-regarded boutique pisco ideal for Pisco Sour.", related: ["Campo de Encanto Pisco", "Macchu Pisco", "La Botija"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Don_Alfredo_Bottle.jpg" },
    { name: "Pisco La Caravedo Centenario", description: "Premium Peruvian pisco from Bodega La Caravedo. Special Centenario edition. Rich, complex, with citrus, stone fruit, and floral notes. A craft expression for Pisco Sour.", related: ["Campo de Encanto Pisco", "Macchu Pisco", "Montelongo Pisco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pisco_centenario-Photoroom.png" },
    { name: "Acholado Rajaz", description: "Peruvian acholado pisco (blend of different grape varieties). Smooth, balanced, with citrus, stone fruit, and gentle spice. A versatile mixer for Pisco Sour and Chilcano.", related: ["Campo de Encanto Pisco", "Macchu Pisco", "Alto del Carmen Pisco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Acholados11.jpg" },
    { name: "Pisco Control", description: "Chilean pisco from the Elqui Valley. Distilled from Muscat and Pedro Jiménez grapes. Clean, crisp, with citrus and floral notes. A classic Chilean pisco for cocktails and mixed drinks.", related: ["Pisco Mistral", "Alto del Carmen Pisco", "Don Alfredo Pisco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Botella_antigua_pisco_control1.jpg" }
  ]
},
  // RUMS
  { name: "White rum", category: "Rums", description: "Light, clean rum aged briefly (often 1 year) and filtered to remove color. Mild sweetness, subtle vanilla.", brands: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars", "Cruzan Aged Light", "Havana Club 3"], notes: "Mojito, Daiquiri, Cuba Libre.", bottles: [
    { name: "Bacardi Superior", description: "The world's best-selling white rum. Light, clean, with mild sweetness and subtle vanilla. Aged in American oak then charcoal-filtered. The standard for Mojito and Daiquiri.", related: ["Bacardi Gold", "Don Q Cristal", "Plantation 3 Stars"], },
    { name: "Plantation 3 Stars", description: "Premium Trinidadian white rum. Smooth, soft, with notes of vanilla, citrus, and tropical fruit. Ideal for Ti' Punch and mixed drinks.", related: ["Plantation 5 Year", "Bacardi Superior", "Don Q Cristal"] }
  , { name: "Don Q Cristal", description: "Puerto Rican light rum from Destilería Serrallés. Smooth, clean, with mild sweetness and vanilla. The standard rum for Piña Colada and Cuba Libre in Puerto Rico.", related: ["Bacardi Superior", "Plantation 3 Stars", "Don Q Gold"] }
  , { name: "Cruzan Aged Light Rum", description: "Light rum from Cruzan Distillery in St. Croix, US Virgin Islands. Aged in American oak barrels then filtered for clarity. Smooth, with vanilla, coconut, and mild spice. 40% ABV. A versatile mixer for Daiquiri and tropical drinks.", related: ["Bacardi Superior", "Plantation 3 Stars", "Don Q Cristal"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cruzan_Rum.jpg" },
    { name: "Havana Club 3", description: "Cuban white rum aged 3 years. Smooth, sweet, with vanilla, caramel, and subtle spice. The standard for Mojito and Cuba Libre in Cuba.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Havana_Club_(_RUM_)_Cuba.jpg" }
  ,
    { name: "Captain Morgan White Rum", description: "Popular Caribbean white rum from Diageo. Light, smooth, with mild sweetness and vanilla. The standard for Captain Morgan-based cocktails and mixed drinks.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Captain_Morgan_White_Rum_Bottles.jpg" }
  ,
    { name: "Ron Cartavio", description: "Peruvian white rum from Cartavio Distillery. Smooth, clean, with mild sweetness, vanilla, and subtle tropical notes. A versatile mixer for Pisco Sour variants and Latin cocktails.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ron_Cartavio.jpg" }
  ,
    { name: "Rhum La Favorite blanc", description: "Martinique rhum agricole blanc from La Favorite distillery. Pure cane juice rum, unaged or lightly aged. Fresh, grassy, with vibrant tropical fruit and pepper notes. Essential for Ti' Punch.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rhum_La_Favorite_blanc.jpg" }
  ,
    { name: "Rhum Neisson blanc", description: "Martinique rhum agricole blanc from Neisson distillery. Pure cane juice rum, crisp and vibrant with grassy, herbal, and tropical fruit notes. The benchmark for agricole blanc in Ti' Punch and Caipirinha.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rhum_Neisson.jpg" }
  ,
    { name: "Rhum agricole Montebello", description: "Guadeloupe rhum agricole blanc from Montebello distillery. Pure cane juice rum, fresh and grassy with pepper and citrus notes. A classic French Caribbean white rum for Ti' Punch and mixers.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rhum_agricole_Montebello.jpg" }
 ] },
  { name: "Light rum", category: "Rums", description: "Same as white rum — light-bodied, clear or pale gold, mild flavor.", brands: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], notes: "Deduplicated with White rum.",
  bottles: [
    { name: "Bacardi Superior", description: "The world's best-selling white rum. Light, clean, with mild sweetness and subtle vanilla.", related: ["Bacardi Gold", "Don Q Cristal", "Plantation 3 Stars"], },
    { name: "Don Q Cristal", description: "Puerto Rican light rum. Smooth, clean, with mild sweetness and vanilla.", related: ["Bacardi Superior", "Don Q Gold", "Don Q Añejo"] },
    { name: "Mount Gay Eclipse", description: "Barbadian white rum from the world's oldest rum distillery (founded 1703). Light, clean, with vanilla and tropical fruit notes. 40% ABV.", related: ["Mount Gay XO", "Bacardi Superior", "Don Q Cristal"], },
    { name: "Havana Club Añejo Especial", description: "Cuban light rum aged in oak barrels. Smooth, sweet, with vanilla, caramel, and subtle spice. 40% ABV. Essential for Mojito and Cuba Libre.", related: ["Bacardi Superior", "Don Q Cristal", "Plantation 3 Stars"], image: "https://upload.wikimedia.org/wikipedia/commons/2/22/2023_Havana_Club_A%C3%B1ejo_Especial_%283%29.jpg" },
    { name: "Appleton Estate Signature", description: "Jamaican white rum. Light, smooth, with tropical fruit and vanilla notes. 40% ABV. A cornerstone of Jamaican rum production.", related: ["Appleton Estate rums", "Mount Gay Eclipse", "Bacardi Superior"] }
  ,
    { name: "Bacardi Gold", description: "Puerto Rican gold rum from Bacardi. Smooth, light, with mild sweetness and vanilla notes from brief oak aging. A step up from Bacardi Superior with richer character for Cuba Libre and rum-based cocktails.", related: ["Bacardi Superior", "Bacardi Black", "Don Q Cristal"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_Rum_Bacardi_Carta_Oro_(3).jpg" }
  ,
    { name: "Brugal Blanco", description: "Dominican white rum from Brugal. Light, smooth, with subtle sweetness and vanilla. A widely available Dominican rum for mixing in tropical cocktails and rum punches.", related: ["Brugal 1888", "Brugal Añejo", "Bacardi Superior"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Flickr_-_ronsaunders47_-_BRUGAL_WHITE_RUM_.DOMINICAN_REPUBLIC.jpg" }
  ,
    { name: "Cruzan Aged Light Rum", description: "Light rum from Cruzan Distillery in St. Croix, US Virgin Islands. Aged in American oak barrels then filtered for clarity. Smooth, with vanilla, coconut, and mild spice. 40% ABV. A versatile mixer for Daiquiri and tropical drinks.", related: ["Bacardi Superior", "Don Q Cristal", "Mount Gay Eclipse"] }
  ,
    { name: "Diplomatico Planas", description: "Venezuelan white rum from Diplomático. Light, smooth, with mild sweetness, vanilla, and subtle tropical fruit. A clean mixer for Daiquiri and rum Collins.", related: ["Diplomatico Reserva Exclusiva", "Diplomatico Mantuano", "Ron Zacapa 23"] }
  ]
},
  { name: "Dark rum", category: "Rums", description: "Rich, full-bodied rum aged longer in heavily charred barrels. Notes of molasses, caramel, toffee, and spice.", brands: ["Gosling's Black Seal", "Myers's Original Dark", "Plantation XO", "Flor de Caña 7", "Diplomático Reserva"], notes: "Dark 'n' Stormy, Mai Tai, Jungle Bird.", bottles: [
    { name: "Gosling's Black Seal", description: "Bermudan dark rum. Rich, full-bodied, with molasses, caramel, and spice. The essential ingredient for a Dark 'n' Stormy.", related: ["Gosling's Gold", "Myers's Original Dark", "Plantation XO"] },
    { name: "Myers's Original Dark", description: "Jamaican dark rum. Intensely dark, full-bodied, with heavy molasses, chocolate, and spice. Bold choice for Tiki and tropical drinks.", related: ["Gosling's Black Seal", "Plantation XO", "Flor de Caña 7"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Myers%27s_Original_Dark_Rum.JPG" },
    { name: "Flor de Caña 7", description: "Nicaraguan dark rum aged 7 years. Smooth, complex, with caramel, vanilla, and oak. Versatile for Dark 'n' Stormy, Mai Tai, and aged rum cocktails.", related: ["Flor de Caña 12", "Diplomático Reserva Exclusiva", "Mount Gay XO"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Flor_de_Cana_rum.JPG" },
    { name: "Mount Gay XO", description: "Barbadian dark rum from the world's oldest rum distillery (founded 1703). Blend of rums aged 8–15 years. Rich toffee, vanilla, spice, and banana. Complex for Dark 'n' Stormy variations.", related: ["Mount Gay Eclipse", "Diplomático Reserva Exclusiva", "Flor de Caña 7"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Gay_Distilleries_Origin_Series%2C_Black_Barrel_and_XO.JPG" },
    { name: "Plantation XO", description: "Barbadian dark rum from Plantation. Aged in ex-cognac barrels. Rich molasses, caramel, vanilla, and spice. A premium sipper and cocktail mixer for Mai Tai and Jungle Bird.", related: ["Gosling's Black Seal", "Myers's Original Dark", "Flor de Caña 7"] }
  ,
    { name: "Hampden The Maverick", description: "Jamaican single pot still dark rum from Hampden Estate. Funky, complex, with overproof intensity and notes of tropical fruit, molasses, and oak. A craft cocktail staple for Ti' Punch and Jungle Bird.", related: ["Appleton Estate Signature", "Worthy Park", "Gosling's Black Seal"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hampden_The_Maverick.jpg" }
  ,
    { name: "Diageo Pusser's", description: "British West Indies dark rum from Diageo. Traditional Barbados-style blend with molasses, caramel, and spice. The standard for Pusser's Painkiller and Navy-style cocktails.", related: ["Gosling's Black Seal", "Myers's Original Dark", "Plantation XO"] }
  ,
    { name: "Foursquare", description: "Barbadian dark rum from Foursquare Distillery. Pot and column still blend, rich and full-bodied with molasses, vanilla, and spice. A craft cocktail favorite for Old Fashioned and Mai Tai variations.", related: ["Mount Gay XO", "Plantation XO", "Gosling's Black Seal"] }
  ,
    { name: "Doorly's", description: "Barbadian dark rum from Doorly's distillery. Smooth, approachable, with caramel, vanilla, and oak. A reliable mixer for Dark 'n' Stormy and aged rum cocktails.", related: ["Gosling's Black Seal", "Myers's Original Dark", "Flor de Caña 7"] }
  ] },
  { name: "Aged rum", category: "Rums", description: "Rum aged in oak barrels for 3+ years. Complex with vanilla, oak, dried fruit, and spice notes.", brands: ["Flor de Caña 7", "Diplomático Reserva", "Plantation 5 Year", "Mount Gay XO", "Zacapa 23"], notes: "Ti' Punch, Rum Old Fashioned.",
  bottles: [
        { name: "Diplomático Reserva Exclusiva", description: "Venezuelan aged rum from Diplomático. Blended from rums aged up to 8 years. Rich molasses, caramel, and vanilla with dried fruit. Smooth enough for sipping; complex enough for cocktails.", related: ["Diplomático Mantuano", "Diplomático Planas", "Ron Zacapa 23"] },
        { name: "Flor de Caña 7", description: "Nicaraguan aged rum from the Flor de Caña distillery. 7-year-old, smooth, with caramel, vanilla, and oak. Widely available and versatile.", related: ["Flor de Caña 12", "Diplomático Reserva Exclusiva", "Mount Gay XO"] },
        { name: "Mount Gay XO", description: "Barbadian aged rum from the world's oldest rum distillery. Blend of rums aged 8–15 years. Rich toffee, vanilla, spice, and banana. Complex for aged rum cocktails.", related: ["Mount Gay Eclipse", "Diplomático Reserva Exclusiva", "Flor de Caña 7"] },
        { name: "Zacapa 23", description: "Guatemalan aged rum from the Zacapa distillery. Solera-aged for up to 23 years in ex-bourbon barrels. Rich, smooth, with vanilla, caramel, dried fruit, and spice. A benchmark premium sipping rum.", related: ["Diplomático Reserva Exclusiva", "Flor de Caña 7", "Mount Gay XO"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ron_Zacapa_Centenario_23_anos.jpg" },
        { name: "Plantation 5 Year", description: "Barbadian aged rum from Plantation. Aged 5 years in ex-bourbon barrels then finished in Cognac casks. Smooth, complex, with vanilla, caramel, spice, and tropical fruit. Versatile for Ti' Punch and rum Old Fashioned.", related: ["Diplomático Reserva Exclusiva", "Flor de Caña 7", "Mount Gay XO"] },
        { name: "El Dorado 12 Year", description: "Guyanese aged rum from El Dorado Distillery. Aged 12 years in ex-bourbon barrels. Rich molasses, caramel, vanilla, and spice with a smooth, full-bodied finish. A benchmark aged rum for Dark 'n' Stormy and rum Old Fashioned.", related: ["El Dorado 15 Year", "Zacapa 23", "Plantation 5 Year"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/El_Dorado_Rum.JPG" },
        { name: "Angostura 1919", description: "Trinidad aged rum from Angostura. A blend of rums aged up to 9 years. Rich molasses, caramel, vanilla, and spice with a smooth, warming finish. A classic Caribbean aged rum for rum Old Fashioned and sipping.", related: ["Angostura 1824", "Zacapa 23", "Plantation 5 Year"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Angostura_1919_%281%29.jpg" },
        { name: "Ron del Barrilito 3 Star", description: "Puerto Rican aged rum from Ron del Barrilito. Aged 3–5 years in oak barrels. Smooth, balanced, with vanilla, caramel, and subtle spice. A classic Puerto Rican rum for sipping and mixing.", related: ["Ron del Barrilito 2 Star", "Bacardi 8", "Flor de Caña 7"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ron_del_Barrilito_rum.jpg" },
        { name: "Bacardi 8", description: "Premium aged white rum from Bacardi. Aged 8 years in American oak barrels then charcoal-filtered for clarity. Smooth, complex, with vanilla, caramel, and oak. A sophisticated mixer for rum Old Fashioned and Daiquiri variations.", related: ["Bacardi Superior", "Bacardi Gold", "Bacardi 10"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bacardi_8_On_The_Bar.jpg" }
  ]
},
  { name: "Overproof rum", category: "Rums", description: "High-ABV rum (57%+ / 114 proof+). Intense, fiery, used in small dashes in Tiki and flaming cocktails.", brands: ["Wray & Nephew Overproof", "Lemon Hart 151", "Plantation O.F.T.D.", "Hamilton 151"], notes: "Use ¼–½ oz dashes. Flaming Dr. Pepper, Zombie.", bottles: [
    { name: "Wray & Nephew Overproof", description: "Jamaican white overproof rum at 63% ABV. Intense, fiery, with funky Jamaican ester character. A single dash transforms Tiki drinks.", related: ["Wray & Nephew White", "Plantation O.F.T.D.", "Hamilton 151"] },
    { name: "Plantation O.F.T.D. (Overproof)", description: "Overproof rum from Plantation. Bold, intense, with deep molasses and spice. 69% ABV. The Barbados overproof standard for Tiki.", related: ["Wray & Nephew Overproof", "Hamilton 151", "Lemon Hart 151"] },
    { name: "Lemon Hart 151", description: "Bermudan overproof rum at 75.5% ABV (151 proof). Intense, rich, with deep molasses, tropical fruit, and spice. A long-standing Navy Rum staple for flaming cocktails and Tiki.", related: ["Wray & Nephew Overproof", "Plantation O.F.T.D. (Overproof)", "Hamilton 151"] },
    { name: "Hamilton 151", description: "Demerara rum from Guyana bottled at 75.5% ABV (151 proof). Rich, bold, with deep molasses, oak, and tropical fruit. The overproof Demerara backbone for flaming cocktails and Jungle Bird variations.", related: ["Wray & Nephew Overproof", "Plantation O.F.T.D. (Overproof)", "Lemon Hart 151"] },
    { name: "Cruzan 151 Rum", description: "Overproof rum from Cruzan Distillery in St. Croix, US Virgin Islands. Bottled at 75.5% ABV (151 proof). Bold, intense, with tropical fruit, molasses, and spice. A fiery Caribbean overproof for Tiki and flaming cocktails.", related: ["Wray & Nephew Overproof", "Plantation O.F.T.D. (Overproof)", "Hamilton 151"] },
    { name: "Appleton Estate Overproof Rum", description: "Jamaican overproof rum from Appleton Estate. Bold, full-bodied, with tropical fruit, molasses, and characteristic Jamaican funk. A classic overproof for Tiki drinks and daiquiris.", related: ["Wray & Nephew Overproof", "Hamilton 151", "Lemon Hart 151"] },
    { name: "Pusser's Navy Rum", description: "Traditional British Navy rum from Pusser's. Bold, full-bodied, with molasses, tropical fruit, and spice. Historically issued to sailors; now the standard for Painkiller cocktails. 54.5% ABV.", related: ["Wray & Nephew Overproof", "Hamilton 151", "Lemon Hart 151"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pussers_Rum_Painkiller.JPG" },
    { name: "Gosling's Overproof Rum", description: "Bermudan overproof rum from Gosling's. Intense, rich, with dark molasses, caramel, and spice. The fiery backbone for a Dark 'n' Stormy variation or rum-based Tiki drinks.", related: ["Wray & Nephew Overproof", "Hamilton 151", "Lemon Hart 151"] }
  ] },

  // GINS
  { name: "Gin", category: "Gins", description: "Juniper-flavored spirit. Can range from crisp and citrusy (London dry) to floral and herbal (Plymouth) to bold and experimental (new Western).", brands: ["Beefeater", "Tanqueray", "Bombay Sapphire", "Plymouth", "Hendrick's", "Monkey 47"], notes: "Gin is a category — use specific type when a recipe calls for it.",
  bottles: [
        { name: "Hendrick's Gin", description: "Scottish gin from William Grant & Sons. Infused with rose and cucumber. Silky, floral, and unusual. 41.4% ABV.", related: ["Hendrick's Orbium", "Hendrick's Lunar", "Hendrick's Midsummer Solstice"] },
        { name: "Beefeater London Dry", description: "London dry gin from Beefeater. Classic juniper-forward profile with citrus and spice. 40% ABV. The benchmark affordable gin for Martinis and G&Ts.", related: ["Tanqueray London Dry", "Bombay Sapphire", "Plymouth Gin"] },
        { name: "Bombay Sapphire", description: "London dry gin with a lighter, floral character. 10 botanicals including juniper, coriander, and lemon peel. 40% ABV.", related: ["Beefeater London Dry", "Tanqueray London Dry", "Hendrick's Gin"] },
        { name: "Tanqueray London Dry", description: "London dry gin from Charles Tanqueray & Co. Four-time distilled with juniper, coriander, angelica root, and liquorice. Crisp, juniper-forward, 43.1% ABV.", related: ["Tanqueray No. Ten", "Tanqueray Rangpur", "Beefeater London Dry"] },
        { name: "Plymouth Gin", description: "English gin from Plymouth with a slightly earthier, more aromatic profile than London dry. 41.2% ABV. Protected PGI status.", related: ["Tanqueray London Dry", "Beefeater London Dry", "Bombay Sapphire"], image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Plymouth_Gin_1793_Black_Friars_Distillery_2.jpg" },
        { name: "Seagram's Extra Dry Gin", description: "Classic American dry gin from Seagram's. Clean, juniper-forward with citrus and spice. 40% ABV. A widely available workhorse for Martinis and mixed drinks.", related: ["Tanqueray London Dry", "Beefeater London Dry", "Bombay Sapphire"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Seagram%27s_Extra_Dry_Gin_(53074621048).jpg" },
        { name: "Sloane's Gin", description: "Belgian gin from Sloane's Distillery. Smooth, balanced, with juniper, citrus, and subtle spice. 44% ABV. A modern European craft gin for Martinis and G&Ts.", related: ["Tanqueray London Dry", "Beefeater London Dry", "Bombay Sapphire"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sloane%27s_Gin_Bottle.jpg" },
        { name: "Whitley Neill Lemongrass and Ginger Gin", description: "British small-batch gin from Whitley Neill. Distinctive lemongrass and ginger botanicals create a zesty, spicy profile. 43% ABV. Excellent for a Gin & Tonic or creative cocktails.", related: ["Tanqueray London Dry", "Beefeater London Dry", "Bombay Sapphire"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Whitley_Neill_Lemongrass_and_Ginger_Gin.jpg" },
        { name: "Victoria Gin", description: "Craft gin from Victoria Distillers in British Columbia, Canada. Juniper-forward with Pacific Northwest botanicals. Smooth, clean, with citrus and herbal notes. 44% ABV. A Canadian craft expression for Martini and Negroni.", related: ["Tanqueray London Dry", "Beefeater London Dry", "Bombay Sapphire"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/VictoriaGin_bottle_750ml.jpg" }
  ]},
  { name: "London dry gin", category: "Gins", description: "The strictest gin style. Juniper-forward with citrus peel and coriander. No added flavoring after distillation.", brands: ["Beefeater", "Tanqueray", "Bombay Sapphire", "Plymouth (also qualifies)", "Sipsmith VJS"], notes: "Martini, Negroni, Gin & Tonic, Tom Collins.",
  bottles: [
        { name: "Tanqueray London Dry", description: "London dry gin from Charles Tanqueray & Co. Distilled with juniper, coriander, angelica root, and liquorice. Four-time distilled. Crisp juniper-forward profile with citrus and spice. 43.1% ABV.", related: ["Tanqueray No. Ten", "Tanqueray Rangpur", "Beefeater London Dry"] },
        { name: "Beefeater London Dry", description: "Classic London dry gin from Beefeater. Juniper-forward with citrus and spice. 40% ABV. The benchmark affordable gin for Martinis and G&Ts.", related: ["Tanqueray London Dry", "Bombay Sapphire", "Plymouth Gin"] },
        { name: "Bombay Sapphire", description: "London dry gin with a lighter, floral character. 10 botanicals including juniper, coriander, and lemon peel. 40% ABV.", related: ["Beefeater London Dry", "Tanqueray London Dry", "Hendrick's Gin"] },
        { name: "Hendrick's Gin", description: "Scottish London dry gin with a distinctive floral character from rose and cucumber infusions. 41.4% ABV. Best enjoyed in a Gin & Tonic or a Hendrick's Fizz.", related: ["Bombay Sapphire", "Tanqueray London Dry", "Beefeater London Dry"] },
        { name: "Plymouth Gin", description: "English gin from Plymouth with a slightly earthier, more aromatic profile than London dry. 41.2% ABV. Protected PGI status.", related: ["Tanqueray London Dry", "Beefeater London Dry", "Bombay Sapphire"] },
        { name: "Tanqueray No. Ten", description: "Premium London dry gin from Tanqueray, distilled with fresh citrus (lime, grapefruit, orange) and juniper. 47.3% ABV. A more complex, citrus-forward expression than the original Tanqueray London Dry. Exceptional for Martinis and G&Ts.", related: ["Tanqueray London Dry", "Tanqueray Rangpur", "Beefeater London Dry"] },
        { name: "Gordon's London Dry", description: "Iconic London dry gin from Gordon's, established 1769. Crisp, juniper-forward with citrus and spice. 40% ABV. One of the world's best-selling gins, a reliable choice for Martinis, G&Ts, and classic cocktails.", related: ["Beefeater London Dry", "Tanqueray London Dry", "Bombay Sapphire"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gordon%27s_Gin_cropped.jpg" },
        { name: "Bombay Bramble", description: "London dry gin from Bombay with a distinctive blackberry-infused character. Juniper-forward with a natural blackberry twist. 37.5% ABV. A modern London dry expression perfect for Bramble cocktails or G&Ts with a fruity edge.", related: ["Bombay Sapphire", "Hendrick's Gin", "Beefeater London Dry"] },
        { name: "The Botanist", description: "Islay dry gin from Bruichladdich Distillery, distilled with 22 hand-foraged botanicals from the Isle of Islay. Complex, aromatic, with citrus, spice, and maritime notes. 46% ABV. A rich, expressive gin for Martinis and Negronis.", related: ["Hendrick's Gin", "Tanqueray London Dry", "Beefeater London Dry"] }
  ] },
  { name: "Geneva gin", category: "Gins", description: "Also known as Holland gin or genever. Malty, fuller-bodied, less juniper-forward than London dry. Can be aged (oude) or younger (jonge).", brands: ["Bols Genever", "Rutte Genever", "Hooghoudt", "Filliers Dry Gin 28"], notes: "Dutch Courage, Martinez (traditional), Corpse Reviver #2 variation.", bottles: [
   { name: "Bols Genever", description: "Dutch genever from the Bols distillery, dating to 1575. Malt wine base gives a mellow, slightly sweet, malty character with a hint of juniper. Less assertive than London dry.", related: ["Rutte Genever", "Filliers Dry Gin 28", "Hooghoudt"] }
 ,
   { name: "Rutte Genever", description: "Craft Dutch genever from Rutte Distillery. Malted barley and juniper-forward. Smooth, malty, and complex. A modern classic for Martinez.", related: ["Bols Genever", "Filliers Dry Gin 28", "Hooghoudt"] },
   { name: "Filliers Dry Gin 28", description: "Belgian genever from Filliers Distillery. Malt wine base with juniper and herbal complexity. Smooth, malty, with a hint of spice. 28% ABV. A classic Belgian genever for Martinez and Dutch Courage.", related: ["Bols Genever", "Rutte Genever", "Hooghoudt Oude Genever"] },
   { name: "Hooghoudt Oude Genever", description: "Dutch genever from Hooghoudt Distillery in Groningen. Traditional malt wine base with juniper and herbs. Mellow, slightly sweet, with a long history dating back to 1751. A classic oude genever for sipping or mixing.", related: ["Bols Genever", "Rutte Genever", "Filliers Dry Gin 28"] },
   { name: "Zuidam Oude Genever", description: "Dutch genever from Zuidam Distillery in the Netherlands. Traditional malt wine base with juniper-forward character. Smooth, malty, with a clean herbal finish. A well-regarded craft genever for Martinez and Negroni variations.", related: ["Bols Genever", "Rutte Genever", "Filliers Dry Gin 28"] },
   { name: "Hooghoudt Jonge Genever", description: "Young Dutch genever from Hooghoudt Distillery in Groningen. Lighter, fresher expression than their Oude Genever with a clean malt backbone and subtle juniper. Perfect for long drinks and highballs.", related: ["Hooghoudt Oude Genever", "Bols Genever", "Zuidam Jonge Genever"] },
   { name: "Zuidam Jonge Genever", description: "Young Dutch genever from Zuidam Distillery. Crisp, light malt wine base with gentle juniper and herbal notes. A refreshing, mixable genever for Collins-style drinks and G&Ts.", related: ["Zuidam Oude Genever", "Hooghoudt Jonge Genever", "Bols Genever"] },
   { name: "Onder de Boompjes Genever", description: "Dutch genever produced by the historic Onder de Boompjes distillery. Traditional malt wine base with a smooth, slightly sweet profile and balanced juniper. A classic genever for sipping or mixing in Dutch Courage.", related: ["Bols Genever", "Hooghoudt Oude Genever", "Rutte Genever"] },
   { name: "Rutte Oude Genever", description: "Aged Dutch genever from Rutte Distillery. matured in small batches for a richer, more complex malt character with deepened juniper and spice notes. An elevated genever for stirred cocktails and neat sipping.", related: ["Rutte Genever", "Bols Genever", "Hooghoudt Oude Genever"] },
   { name: "Boomsma Oude Genever", description: "Traditional Dutch genever from Boomsma Distillery in Friesland. Rich malt wine base with pronounced juniper and herbal complexity. A well-respected craft genever for classic cocktails and neat appreciation.", related: ["Bols Genever", "Rutte Genever", "Filliers Dry Gin 28"] }
 ]},

  // TEQUILA & MEZCAL
  { name: "Tequila", category: "Tequila & Mezcal", description: "Mexican spirit made from blue agave in designated regions. Blanco (unaged), Reposado (rested 2–12 months), Añejo (aged 1–3+ years).", brands: ["Patrón Silver", "Don Julio 1942", "Casamigos Reposado", "Espolòn Blanco", "Casa Noble Reposado", "Fortaleza"], notes: "Margarita, Paloma, Tequila Sunrise.",
  bottles: [
        { name: "Fortaleza Blanco", description: "100% blue agave tequila from the Fortaleza distillery in Jalisco. Stone ovens and tahona wheel. Bright agave with pepper, citrus, and earth. Unaged, pure expression.", related: ["Fortaleza Reposado", "Fortaleza Añejo", "Patrón Silver"] },
        { name: "Patrón Silver", description: "Premium 100% blue agave blanco. Smooth, crisp, with sweet agave, citrus, and pepper. The recognizable choice for Margaritas and shots.", related: ["Patrón Reposado", "Patrón Añejo", "Fortaleza Blanco"] },
        { name: "Espolòn Blanco", description: "100% blue agave blanco from Jalisco. Bright agave, pepper, citrus. Great value and widely available.", related: ["Espolòn Reposado", "Fortaleza Blanco", "Patrón Silver"] },
        { name: "Don Julio 1942", description: "Premium 100% blue agave añejo tequila from the Casa Don Julio distillery in Jalisco. Aged at least 2.5 years in American oak ex-bourbon barrels. Rich cooked agave with vanilla, caramel, and toasted oak. The benchmark luxury tequila for sipping or premium cocktails like the Añejo Old Fashioned.", related: ["Don Julio Blanco", "Patrón Añejo", "Fortaleza Añejo"] },
        { name: "Casamigos Reposado", description: "Premium 100% blue agave reposado tequila from Casamigos. Aged 7 months in American oak barrels. Smooth, sweet agave with vanilla, caramel, and light oak. A premium sipping reposado.", related: ["Casamigos Blanco", "Casamigos Añejo", "Don Julio 1942"] },
        { name: "Fortaleza Reposado", description: "100% blue agave reposado from the Fortaleza distillery in Jalisco. Aged 8–10 months in American oak. Bright agave with vanilla, caramel, and pepper. A classic, traditional reposado.", related: ["Fortaleza Blanco", "Fortaleza Añejo", "Patrón Reposado"] },
        { name: "Herradura Reposado", description: "100% blue agave reposado from Casa Herradura in Jalisco. Aged 11 months in American oak barrels. Smooth, balanced agave with vanilla, oak, and spice. A reliable, widely available reposado.", related: ["Herradura Silver", "Herradura Añejo", "Patrón Reposado"] },
  ]
},
  { name: "Blanco tequila", category: "Tequila & Mezcal", description: "Unaged or aged <60 days tequila. Bright, crisp, pure agave flavor with pepper and citrus.", brands: ["Patrón Silver", "Espolòn Blanco", "Fortaleza Blanco", "Casamigos Blanco", "Don Julio Blanco"], notes: "Required when a recipe specifies Blanco — reposado would be too oaky.",
  bottles: [
    { name: "Patrón Silver", description: "Premium 100% blue agave blanco. Smooth, crisp, with sweet agave, citrus, and pepper.", related: ["Patrón Reposado", "Patrón Añejo", "Espolòn Blanco"] },
    { name: "Espolòn Blanco", description: "100% blue agave blanco from Jalisco. Bright agave, pepper, citrus.", related: ["Espolòn Reposado", "Patrón Silver", "Fortaleza Blanco"] },
    { name: "Fortaleza Blanco", description: "100% blue agave tequila from the Fortaleza distillery in Jalisco. Stone ovens and tahona wheel. Bright agave with pepper, citrus, and earth. Unaged, pure expression.", related: ["Fortaleza Reposado", "Fortaleza Añejo", "Patrón Silver"] },
    { name: "Don Julio Blanco", description: "100% blue agave blanco from Jalisco. Bright, crisp agave with pepper, citrus, and light pepper finish. 38% ABV. Widely considered one of the finest blancos.", related: ["Don Julio 1942", "Patrón Silver", "Casamigos Blanco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Don_Julio_Blanco_Tequila_01.tif" },
    { name: "Casamigos Blanco", description: "100% blue agave blanco co-founded by George Clooney. Smooth, sweet agave with citrus and vanilla notes. 40% ABV. Ideal for Margaritas and sipping.", related: ["Casamigos Reposado", "Patrón Silver", "Don Julio Blanco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Casamigos_Blanco_Tequila_01.jpg" },
    { name: "Patrón Reposado", description: "Premium 100% blue agave reposado aged up to 12 months in oak barrels. Smooth, sweet agave with vanilla, caramel, and light oak. The well-rounded middle sibling of the Patrón lineup for Margarita variations.", related: ["Patrón Silver", "Patrón Añejo", "Don Julio Reposado"] },
    { name: "Cazadores Reposado", description: "100% blue agave reposado from the Cazadores distillery in Jalisco. Aged 2–12 months in American oak. Balanced agave with vanilla, light oak, and citrus. A reliable mid-shelf reposado for Margaritas.", related: ["Patrón Reposado", "Don Julio Reposado", "Espolòn Reposado"] },
    { name: "Sauza Blanco", description: "100% blue agave blanco tequila from the Sauza distillery. Bright, crisp agave with pepper and citrus. A classic, widely available Mexican blanco for Margaritas and shots.", related: ["Sauza Gold", "Sauza Añejo", "Patrón Silver"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sauza_blanco.jpg" },
    { name: "Jose Cuervo Especial Silver", description: "100% blue agave blanco tequila from Jose Cuervo. Bright, crisp agave with pepper and citrus. The world's best-selling tequila, a reliable mixer for Margaritas and shots.", related: ["Jose Cuervo Gold", "Jose Cuervo Tradicional", "Patrón Silver"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jose_cuervo.jpg" },
    { name: "Corralejo Blanco", description: "100% blue agave blanco tequila from the Corralejo distillery in Jalisco. Bright, pure agave with pepper and citrus. A traditional, artisanal Mexican blanco.", related: ["Corralejo Reposado", "Corralejo Añejo", "Patrón Silver"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tequila_Corralejo_100ml_(Blanco),_Mexico,_2026-03-30.jpg" },
    { name: "Gran Centenario Blanco", description: "100% blue agave blanco tequila from Gran Centenario. Bright, crisp agave with pepper and citrus. A mid-shelf Mexican blanco for Margaritas and cocktails.", related: ["Gran Centenario Reposado", "Gran Centenario Añejo", "Patrón Silver"] }
  ]
},

  // VODKA
  { name: "Vodka", category: "Vodka", description: "Neutral, unaged spirit distilled from grains, potatoes, or grapes. Clean, versatile base for flavored and mixed drinks.", brands: ["Grey Goose", "Ketel One", "Belvedere", "Tito's", "Stolichnaya", "Cîroc", "Absolut"], notes: "Vodka Martini, Cosmopolitan, Screwdriver, Moscow Mule.",
  bottles: [
        { name: "Belvedere Vodka", description: "Polish rye vodka from Belvedere. Quadruple distilled from Dankowskie rye. Creamy texture with white pepper, vanilla, and almond. 40% ABV.", related: ["Grey Goose", "Ketel One", "Chopin Rye"], },
        { name: "Grey Goose", description: "French vodka from the Cognac region. Made from soft winter wheat and spring water. Smooth, clean, with a hint of pepper and anise. 40% ABV.", related: ["Belvedere Vodka", "Ketel One", "Cîroc"] },
        { name: "Absolut Vodka", description: "Swedish vodka from Åhus. Made from winter wheat and pure water. Clean, smooth, with a hint of vanilla and pepper. The most widely distributed vodka in the world.", related: ["Grey Goose", "Ketel One", "Belvedere Vodka"] },
    { name: "Tito's Handmade Vodka", description: "American corn-based vodka from Texas. Smooth, clean, with a mild sweetness. 40% ABV. A cult favorite for Moscow Mules.", related: ["Grey Goose", "Ketel One", "Stolichnaya"] },
    { name: "Ketel One Vodka", description: "Dutch vodka from the Nolet Family distillery, founded 1691. Distilled in copper pot stills from 100% wheat. Smooth, crisp, with subtle citrus and pepper. 40% ABV.", related: ["Grey Goose", "Belvedere Vodka", "Absolut Vodka"] },
    { name: "Stolichnaya Vodka", description: "Russian vodka from the Stolichnaya brand. Triple distilled from winter wheat and rye grains. Clean, smooth, with a hint of pepper and sweetness. 40% ABV.", related: ["Absolut Vodka", "Grey Goose", "Ketel One"] },
    { name: "Cîroc Vodka", description: "French vodka from the Cognac region, made from cold-pressed grapes. Smooth, fresh, with distinctive fruity and floral notes. 40% ABV.", related: ["Grey Goose", "Belvedere Vodka", "Absolut Vodka"] },
    { name: "Russian Standard Vodka", description: "Russian vodka distilled from winter wheat and purified water. Clean, crisp, with a smooth finish. 40% ABV. One of Russia's most popular premium vodkas.", related: ["Stolichnaya Vodka", "Grey Goose", "Absolut Vodka"] },
    { name: "Svedka Vodka", description: "Swedish vodka distilled from Swedish winter wheat. Smooth, clean, with a hint of vanilla. 40% ABV. An affordable, widely available option for cocktails.", related: ["Absolut Vodka", "Grey Goose", "Ketel One Vodka"] },
    { name: "Reyka Vodka", description: "Icelandic vodka distilled from wheat and spring water. Smooth, crisp, with a touch of minerality from glacial water. 40% ABV. A small-batch premium option.", related: ["Belvedere Vodka", "Grey Goose", "Ketel One Vodka"] },
    { name: "Finlandia Vodka", description: "Finnish vodka distilled from pure Finnish spring water and barley. Smooth, clean, with a hint of citrus and pepper. 40% ABV. A classic Scandinavian vodka.", related: ["Absolut Vodka", "Grey Goose", "Ketel One Vodka"] }
  ,
    { name: "Chopin Rye Vodka", description: "Polish rye vodka from the Chopin distillery. Quadruple distilled from Dankowskie rye. Smooth, creamy, with white pepper, vanilla, and almond notes. 40% ABV. A premium craft rye vodka.", related: ["Belvedere Vodka", "Grey Goose", "Ketel One Vodka"] }
  ,
    { name: "Belvedere 8", description: "Premium Polish rye vodka from Belvedere, aged 8 years in oak barrels. Extra smooth, rich, with honey, vanilla, and toasted oak notes. 40% ABV. A luxury sipping vodka.", related: ["Belvedere Vodka", "Grey Goose", "Ketel One Vodka"] }
  ,
    { name: "Grey Goose VX", description: "Ultra-premium French vodka from the Grey Goose cellar master. Blend of Grey Goose vodka and a touch of Cognac. Smooth, complex, with citrus, floral, and vanilla notes. 40% ABV.", related: ["Grey Goose", "Belvedere Vodka", "Ketel One Vodka"] }
  ,
    { name: "Absolut Elyx", description: "Premium single-estate Swedish vodka from Absolut. Distilled from winter wheat grown on the Råå valley estate. Silky, smooth, with vanilla, white pepper, and brioche notes. 42.3% ABV. A handcrafted luxury vodka.", related: ["Absolut Vodka", "Grey Goose", "Ketel One Vodka"] }
  ]
},

  // LIQUEURS
  { name: "Amaretto", category: "Liqueurs", description: "Italian almond-flavored liqueur, sweet and nutty with notes of apricot kernel. ~28% ABV.", brands: ["Disaronno", "Lazzaroni", "DeKuyper", "Bardinet"], notes: "Amaretto Sour, Godmother, Nutcracker.",
  bottles: [
        { name: "Disaronno Amaretto", description: "Italian amaretto liqueur from Saronno. Apricot kernel and almond character with sweet vanilla and cherry notes. 28% ABV.", related: ["Lazzaroni Amaretto", "DeKuyper Amaretto", "Bardinet Amaretto"], }
  ,
    { name: "Lazzaroni Amaretto", description: "Italian amaretto made with drupe kernels from the Lazzaroni family recipe. Sweet, nutty, with almond and marzipan notes. 28% ABV.", related: ["Disaronno Amaretto", "DeKuyper Amaretto", "Bardinet Amaretto"] },
    { name: "DeKuyper Amaretto", description: "Dutch-made amaretto from DeKuyper. Smooth almond and apricot kernel character with sweet vanilla. A reliable mixer for Amaretto Sour and Godmother. 24% ABV.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "Bardinet Amaretto"] },
    { name: "Bardinet Amaretto", description: "French amaretto liqueur from Bardinet. Sweet almond and marzipan notes with a hint of apricot. An affordable alternative to Disaronno for mixing. 25% ABV.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "DeKuyper Amaretto"] }
  ,
    { name: "Luxardo Amaretto", description: "Italian amaretto liqueur from Luxardo. Sweet, rich almond character with marzipan and vanilla notes. 28% ABV. A premium Italian alternative to Disaronno for Amaretto Sour and mixing.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "Bardinet Amaretto"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Luxardo_Amaretto_bottle%2C_750ml.jpg" }
  ,
    { name: "Marie Brizard Amaretto", description: "French amaretto liqueur from Marie Brizard. Sweet almond and marzipan notes with apricot kernel. 24% ABV. A reliable European mixer for cocktails.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "DeKuyper Amaretto"] }
  ,
    { name: "Hiram Walker Amaretto", description: "American amaretto liqueur from Hiram Walker. Sweet almond flavor with vanilla notes. Widely available and affordable for mixing in Amaretto Sour and Godmother.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "DeKuyper Amaretto"] }
  ,
    { name: "Tempus Fugit Amaretto", description: "Craft amaretto from Tempus Fugit. Made with real apricot kernels and almonds. Complex, authentic almond-marzipan character. 30% ABV. A boutique option for craft cocktails.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "DeKuyper Amaretto"] }
  ,
    { name: "Mr Boston Amaretto", description: "American amaretto liqueur from Mr Boston. Sweet almond flavor with vanilla notes. 30% ABV. A higher-proof option for shots and mixed drinks.", related: ["Disaronno Amaretto", "Lazzaroni Amaretto", "DeKuyper Amaretto"] }
  ]
},
  { name: "Aperol", category: "Liqueurs", description: "Italian bitter-orange aperitif. Bright orange, bittersweet, 11% ABV. Lighter than Campari.", brands: ["Aperol ( Campari Group )"], notes: "Aperol Spritz, Aperol Sour, Paper Plane.", bottles: [
    { name: "Aperol", description: "Iconic Italian bitter-orange aperitif from the Campari Group. Bright orange, bittersweet, with rhubarb and orange peel. 11% ABV. Lighter than Campari; the standard for Aperol Spritz.", related: ["Campari", "Select Aperitivo", "Cynar"], }
  ,
    { name: "Select Aperitivo", description: "Venetian bitter aperitif. Similar to Aperol but with more herbal complexity and a hint of rhubarb. 17.5% ABV. The classic Venetian spritz alternative.", related: ["Aperol", "Cynar", "Campari"] },
    { name: "Cynar", description: "Italian bitter aperitif made from artichokes. Bitter, herbal, complex. 16.5% ABV. Unique vegetal character for spritzes and Negroni variations.", related: ["Aperol", "Campari", "Select Aperitivo"], image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Cynar_%280.7_l_bottle%29.jpg" }
  ,
    { name: "Aperol Amaro", description: "Orange-amaro variant from the Aperol family. Bitter-orange base enriched with additional herbal and amaro botanicals. 11% ABV. A complex spritz alternative bridging the Aperol and Campari profiles.", related: ["Aperol", "Select Aperitivo", "Cynar"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aperol_001_2025_06_08.jpg" }
  ,
    { name: "Campari", description: "The iconic Italian bitter aperitif from the Campari Group. Bright red, intensely herbal and bitter with rhubarb, cherry, cinnamon, and citrus peel. 20.5% ABV. The essential bitter for Negroni, Americano, and Boulevardier.", related: ["Aperol", "Cynar", "Select Aperitivo"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Campari_Bitter_Aperitif_01.jpg" }
  ,
    { name: "Cocchi Americano", description: "Italian bitter aperitif wine from Piedmont. Infused with herbs, roots, and citrus. Bitter-sweet, aromatic, and complex. The classic choice for Cocchi Americano and soda or as a spritz modifier.", related: ["Aperol", "Campari", "Cynar"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cocchi_Americano_Bianco.jpg" }
  ,
    { name: "Italicus Rosolio di Bergamotto", description: "Italian bergamot aperitif liqueur from Calabria. Bright citrus-forward profile with floral and herbal notes. 20% ABV. A refreshing alternative to Aperol for spritzes and citrus-forward cocktails.", related: ["Aperol", "Campari", "Cynar"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Italicus_Rosolio_di_Bergamotto.jpg" }
  ,
    { name: "Cappelletti Aperitivo", description: "Traditional Italian bitter aperitif from Trentino. Made with a secret blend of herbs and botanicals. Bright red-orange color, balanced bitter-sweet profile. The classic alpine spritz bitter.", related: ["Aperol", "Campari", "Select Aperitivo"] }
  ] },
  { name: "Bénédictine", category: "Liqueurs", description: "French herbal liqueur from Fécamp. Complex: honey, herbs, spices, citrus, stone fruit. 40% ABV.", brands: ["Bénédictine D.O.M.", "B&B (Bénédictine + Brandy)"], notes: "B&B, Vieux Carré, Jamaica Mule.", bottles: [
    { name: "Bénédictine D.O.M.", description: "French herbal liqueur produced by Benedictine monks since 1510. Complex layers of honey, herbs, spices, citrus, and stone fruit. 40% ABV. The base for B&B.", related: ["B&B (B&B Liqueur)", "Chartreuse Green", "Drambuie"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Benedictine_01_08.jpg" }
  ,
    { name: "B&B Liqueur", description: "Equal parts Bénédictine D.O.M. and brandy. Smoother, richer, and slightly lower ABV than straight Bénédictine. The classic digestif.", related: ["Bénédictine D.O.M.", "Drambuie", "Chartreuse Green"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/BandB_01_09.jpg" }
  ,
    { name: "Bénédictine & Brandy", description: "Classic blend of Bénédictine D.O.M. and fine brandy. Smoother and richer than straight Bénédictine with a velvety finish. The traditional French digestif.", related: ["Bénédictine D.O.M.", "B&B Liqueur", "Drambuie"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/D.O.M_Benedictine_French_Herbal_Liqueur_01.jpg" }
  ,
    { name: "Glayva", description: "Scottish honey-herbal liqueur. Similar to Drambuie but with more citrus and spice notes. Made with Scotch whisky and heather honey. A popular alternative in Rusty Nail and Godfather variations.", related: ["Drambuie", "Bénédictine D.O.M.", "Chartreuse Green"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Glayva.jpg" }
  ,
    { name: "Bénédictine D.O.M. 70cl", description: "70cl bottle of Bénédictine D.O.M. The standard French herbal liqueur from Fécamp. Complex honey, herbs, spices, citrus, and stone fruit. 40% ABV. The base for B&B.", related: ["Bénédictine D.O.M.", "B&B Liqueur", "Bénédictine & Brandy"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Benedictine_01_08.jpg" }
  ,
    { name: "Bénédictine D.O.M. 1L", description: "1L bottle of Bénédictine D.O.M. The standard French herbal liqueur from Fécamp. Complex honey, herbs, spices, citrus, and stone fruit. 40% ABV. The base for B&B.", related: ["Bénédictine D.O.M.", "B&B Liqueur", "Bénédictine & Brandy"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/D.O.M_Benedictine_French_Herbal_Liqueur_01.jpg" }
  ,
    { name: "B&B Liqueur 1L", description: "1L bottle of B&B Liqueur. Equal parts Bénédictine D.O.M. and brandy. Smoother, richer, and slightly lower ABV than straight Bénédictine. The classic digestif.", related: ["Bénédictine D.O.M.", "B&B Liqueur", "Bénédictine & Brandy"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/BandB_01_09.jpg" }
  ] },
  { name: "Campari", category: "Liqueurs", description: "Italian bitter aperitif. Intensely red, bitter, herbal — notes of rhubarb, cherry, cinnamon, and citrus peel. 20.5% ABV.", brands: ["Campari"], notes: "Negroni, Boulevardier, Americano, Jungle Bird.", bottles: [
    { name: "Campari", description: "The iconic Italian bitter aperitif. Bright red, intensely herbal and bitter with rhubarb, cherry, and citrus peel. 20.5% ABV. Essential for Negroni and Americano.", related: ["Aperol", "Cynar", "Select Aperitivo"], }
  ,
    { name: "Select Aperitivo", description: "Venetian bitter aperitif. Similar to Campari but with more herbal complexity. 17.5% ABV. The classic Venetian spritz bitter.", related: ["Campari", "Aperol", "Cynar"] },
    { name: "Campari Bitter Aperitif", description: "The classic Campari bitter aperitif. Bright red, intensely herbal and bitter with rhubarb, cherry, cinnamon, and citrus peel. 20.5% ABV. The essential Campari expression for Negroni, Americano, and Boulevardier.", related: ["Campari", "Aperol", "Select Aperitivo"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Campari_Bitter_Aperitif_01.jpg" },
    { name: "Campari Soda", description: "Pre-mixed Campari and soda water in the iconic Fortunato Depero-designed bottle. 10% ABV. A ready-to-drink Italian classic — simply pour over ice.", related: ["Campari", "Campari Bitter Aperitif", "Aperol"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Campari_Soda.jpg" },
    { name: "Aperol", description: "Italian bitter aperitif from Barbieri. Bright orange, lower bitterness than Campari with notes of rhubarb and gentian root. 11% ABV. The essential spritz bitter for Aperol Spritz.", related: ["Campari", "Select Aperitivo", "Cynar"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aperol_bottle.JPG" },
    { name: "Cynar", description: "Italian artichoke-based bitter liqueur from Campari group. Made from 13 herbs and vegetables including artichoke. 16.5% ABV. Unique vegetal bitterness for Cynar and soda or as a Negroni variation.", related: ["Campari", "Aperol", "Select Aperitivo"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cynar_%280.7_l_bottle%29.jpg" },
    { name: "Punt e Mes", description: "Italian vermouth with added Campari. Sweet vermouth base with a distinctive bitter finish. Amber-red color. The classic choice for a Punt e Mes and soda or as a Boulevardier variation.", related: ["Campari", "Aperol", "Cynar"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Punt_e_Mes_bottle_%282020%29.png" }
  ] },
  { name: "Cherry liqueur", category: "Liqueurs", description: "Sweet, red cherry-flavored liqueur. Brighter and sweeter than cherry brandy.", brands: ["Luxardo Maraschino", "Maraska", "Bols Cherry"], notes: "Singapore Sling, Blood and Sand.", bottles: [
    { name: "Luxardo Maraschino", description: "Premium Italian cherry liqueur from Marasca cherry pits. Complex cherry, almond, and spice notes. 32% ABV. The standard for Singapore Sling and Aviation.", related: ["Maraska Maraschino", "Bols Cherry", "Luxardo Amaretto"] }
  ,
    { name: "Bols Cherry Liqueur", description: "Dutch cherry liqueur from Bols. Sweet, bright red, with natural cherry flavor. 24% ABV. The budget-friendly option for Singapore Sling.", related: ["Luxardo Maraschino", "Maraska Maraschino", "Luxardo Amaretto"] }
  ,
    { name: "Maraska Maraschino", description: "Croatian cherry liqueur from the Maraska distillery in Zadar. Made from Marasca cherries. Rich, aromatic, with deep cherry and almond character. 28% ABV. A premium alternative to Luxardo for Aviation and Last Word.", related: ["Luxardo Maraschino", "Bols Cherry Liqueur", "Clear Creek Kirschwasser"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Maraschino_Maraska_Bottle.jpg" }
  ,
    { name: "Peter Heering Cherry Heering", description: "Danish cherry liqueur from Copenhagen, produced since 1818. Made from cherries, spices, and alcohol. Rich, deep cherry with warm spice notes. 24% ABV. Classic for Singapore Sling and Blood and Sand.", related: ["Luxardo Maraschino", "Maraska Maraschino", "Bols Cherry Liqueur"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cherry_Heering5.jpg" }
  ,
    { name: "Giffard Guignolet", description: "French cherry liqueur from Maison Giffard. Made from wild cherry and griotte cherry varieties. Bright, fruity cherry character with balanced sweetness and a hint of almond. 20% ABV. Used in sour cocktails and as a cherry liqueur substitute.", related: ["Luxardo Maraschino", "Maraska Maraschino", "Bols Cherry Liqueur"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Guignolet.jpg" }
  ] },
  { name: "Cointreau", category: "Liqueurs", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish. The standard for classic cocktails.", brands: ["Cointreau"], notes: "Margarita, Cosmopolitan, Sidecar, White Lady.", bottles: [
    { name: "Cointreau", description: "Premium French triple sec from the Cointreau family. Distilled from sweet and bitter orange peels. Crisp, clean, dry orange flavor at 40% ABV. The gold standard for Margarita and Sidecar.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], }
  ,
    { name: "Pierre Ferrand Dry Curaçao", description: "Dry orange curaçao from Pierre Ferrand. Made from dried curaçao orange peels. 40% ABV. The premium orange liqueur for Margarita.", related: ["Cointreau", "Combier", "Marie Brizard Orange Curaçao"] }
  ,
    { name: "Combier Triple Sec", description: "French triple sec from Combier, made since 1834 in the Loire Valley. 40% ABV. A historic alternative to Cointreau with a clean, bright orange character.", related: ["Cointreau", "Marie Brizard Triple Sec", "Bols Triple Sec"] }
  ,
    { name: "Marie Brizard Triple Sec", description: "French triple sec from Marie Brizard. Clean, bright orange flavor with balanced sweetness. 40% ABV. A reliable everyday mixer for Margarita and Sidecar.", related: ["Cointreau", "Combier Triple Sec", "Bols Triple Sec"] }
  ,
    { name: "Bols Triple Sec", description: "Dutch triple sec from Bols. Bright orange flavor with medium sweetness. 38% ABV. A versatile high-volume mixer for Cosmopolitan and Long Island Iced Tea.", related: ["Cointreau", "Combier Triple Sec", "Marie Brizard Triple Sec"] }
  ] },
  { name: "Coffee liqueur", category: "Liqueurs", description: "Coffee-flavored liqueur, typically 20–25% ABV. Sweet, dark, with strong coffee notes.", brands: ["Kahlúa", "Tia Maria", "Mr Black", "St- Brendan's", "Licor 43 (not coffee)"], notes: "Espresso Martini, White Russian, Black Russian.", bottles: [
    { name: "Kahlúa", description: "The world's most popular coffee liqueur from Mexico. Made from Arabica coffee, sugarcane spirit, and vanilla. Sweet, rich, dark. Essential for Espresso Martini and White Russian.", related: ["Tia Maria", "Mr Black Cold Brew", "St Brendan's Irish Coffee Liqueur"] },
    { name: "Tia Maria", description: "Jamaican coffee liqueur. Made from Arabica coffee, Jamaican rum, and vanilla. Smooth, dark, with balanced sweetness. The classic alternative to Kahlúa.", related: ["Kahlúa", "Mr Black Cold Brew", "St Brendan's Irish Coffee Liqueur"] },
    { name: "Mr Black Cold Brew Coffee Liqueur", description: "Australian cold brew coffee liqueur. Made with cold-pressed coffee, cane spirit, and chocolate. Bold, clean coffee flavor with minimal sweetness. 20% ABV. The craft cocktail bar standard for Espresso Martinis.", related: ["Kahlúa", "Tia Maria", "St Brendan's Irish Coffee Liqueur"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tia_Maria_%287._november_2018%29.jpg" },
    { name: "St Brendan's Irish Coffee Liqueur", description: "Irish coffee liqueur with Irish whiskey, cream, and coffee. Smooth, rich, with whiskey depth. The Irish alternative to Kahlúa for Irish Coffee or White Russian.", related: ["Kahlúa", "Tia Maria", "Mr Black Cold Brew Coffee Liqueur"] },
    { name: "Kahlúa Coffee Liqueur", description: "The world's most popular coffee liqueur from Mexico. Made from Arabica coffee, sugarcane spirit, and vanilla. Sweet, rich, dark. Essential for Espresso Martini and White Russian.", related: ["Tia Maria", "Mr Black Cold Brew Coffee Liqueur", "St Brendan's Irish Coffee Liqueur"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kahl%C3%BAa_Mexican_Coffee_Liquor_02.jpg" }
  ] },
  { name: "Crème de banane", category: "Liqueurs", description: "Banana-flavored crème liqueur. Bright, artificial-yet-fun banana flavor. 25% ABV.", brands: ["Marie Brizard", "Bols", "DeKuyper"], notes: "Flaming Dr. Pepper, certain Tiki drinks.", bottles: [
    { name: "Marie Brizard Crème de Banane", description: "Bright banana-flavored crème liqueur. Sweet, fun, tropical banana character. 25% ABV. The classic choice for Flaming Dr. Pepper.", related: ["Bols Crème de Banane", "DeKuyper Banana"] }
  ,
    { name: "Bols Crème de Banane", description: "Dutch banana crème liqueur. Bright, sweet, tropical banana flavor. 25% ABV. Good for Flaming Dr. Pepper and Tiki drinks.", related: ["Marie Brizard Crème de Banane", "DeKuyper Banana"] }
  ,
    { name: "DeKuyper Banana Liqueur", description: "American banana liqueur from DeKuyper. Bright, sweet, with artificial banana flavor. 24% ABV. A reliable, widely available choice for Flaming Dr. Pepper and Tiki shooters.", related: ["Marie Brizard Crème de Banane", "Bols Crème de Banane"] }
  ,
    { name: "Giffard Crème de Banane", description: "French banana crème liqueur from Giffard. Rich, creamy banana flavor with vanilla notes. 25% ABV. A premium choice for tropical cocktails and dessert drinks.", related: ["Marie Brizard Crème de Banane", "Bols Crème de Banane"] }
  ,
    { name: "RumChata Banana Liqueur", description: "Creamy banana liqueur from RumChata. Sweet, smooth, with real banana and cream flavors. Lower ABV, perfect for dessert shooters and creamy cocktails.", related: ["Marie Brizard Crème de Banane", "DeKuyper Banana Liqueur"] }
  ] },
  { name: "Crème de cassis", category: "Liqueurs", description: "Blackcurrant crème liqueur from France. Deep purple, tart-sweet, 15–20% ABV.", brands: ["Joseph Cartron", "Briottet", "Giffard", "Marie Brizard"], notes: "Kir, Kir Royal, Cassis Spritz.",
  bottles: [
    { name: "Joseph Cartron Crème de Cassis", description: "French blackcurrant crème liqueur. Deep purple, tart-sweet, 15% ABV.", related: ["Giffard Crème de Cassis", "Briottet Crème de Cassis"] },
    { name: "Giffard Crème de Cassis", description: "Premium French blackcurrant crème liqueur. Rich, dark, balanced sweet-tart.", related: ["Joseph Cartron", "Briottet"] },
    { name: "Briottet Crème de Cassis", description: "Savoyard blackcurrant crème liqueur. Intense, authentic Burgundian cassis character. 15% ABV.", related: ["Joseph Cartron Crème de Cassis", "Giffard Crème de Cassis"], image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Creme_de_Cassis.jpg" }
  ,
    { name: "Marie Brizard Crème de Cassis", description: "Classic French blackcurrant crème liqueur from Marie Brizard. Deep purple, sweet-tart, balanced cassis flavor. 20% ABV. A long-standing staple for Kir and Kir Royal.", related: ["Joseph Cartron Crème de Cassis", "Giffard Crème de Cassis", "Briottet Crème de Cassis"] }
  ,
    { name: "Lejay Crème de Cassis", description: "Iconic blackcurrant crème liqueur from Dijon, France. Made with Noir de Bourgogne berries. Deep purple, intense cassis character, 20% ABV. The benchmark for traditional crème de cassis.", related: ["Joseph Cartron Crème de Cassis", "Marie Brizard Crème de Cassis", "Briottet Crème de Cassis"] }
  ]
},
  { name: "Crème de mûre", category: "Liqueurs", description: "Blackberry crème liqueur. Rich, dark, sweet-tart blackberry flavor.", brands: ["Joseph Cartron", "Giffard", "Briottet", "Bols"], notes: "Bramble, French 75 variation.",
  bottles: [
    { name: "Giffard Crème de Mûre", description: "French blackberry crème liqueur. Rich, dark, sweet-tart blackberry flavor.", related: ["Joseph Cartron Crème de Mûre", "Briottet"] },
    { name: "Briottet Crème de Mûre", description: "Savoyard blackberry crème liqueur. Deep purple, intense blackberry character.", related: ["Giffard Crème de Mûre", "Bols Blackberry"] },
    { name: "Bols Blackberry Crème de Mûre", description: "Dutch blackberry crème liqueur. Sweet, dark, versatile cocktail ingredient. 17% ABV.", related: ["Giffard Crème de Mûre", "Briottet Crème de Mûre"] }
  ,
    { name: "Joseph Cartron Crème de Mûre", description: "French blackberry crème liqueur from Joseph Cartron in Burgundy. Made with wild blackberries. Rich, dark, with authentic sweet-tart blackberry character. A classic choice for Bramble and Kir variations.", related: ["Giffard Crème de Mûre", "Briottet Crème de Mûre", "Bols Blackberry Crème de Mûre"] }
  ,
    { name: "Maison Bartolomei Crème de Mûre", description: "Premium French blackberry crème liqueur from Maison Bartolomei in Provence. Crafted from wild Mediterranean blackberries. Intense, dark, with complex sweet-tart fruit and subtle earthy notes. A boutique expression for craft cocktails.", related: ["Giffard Crème de Mûre", "Briottet Crème de Mûre", "Joseph Cartron Crème de Mûre"] }
  ]
},
  { name: "Crème de violette", category: "Liqueurs", description: "Violet flower crème liqueur. Floral, sweet, perfumed. 20–25% ABV. Rare and expensive.", brands: ["Giffard Crème de Violette", "Briottet", "Rothman & Winter"], notes: "Aviation — ¼ oz is enough. Violet Fizz.",
  bottles: [
    { name: "Giffard Crème de Violette", description: "French violet flower crème liqueur. Floral, sweet, perfumed. 20% ABV.", related: ["Briottet Crème de Violette", "Rothman & Winter Violet"] },
    { name: "Briottet Crème de Violette", description: "French violet liqueur from Savoie. Fragrant, sweet, perfumed.", related: ["Giffard Crème de Violette", "Rothman & Winter"] },
    { name: "Rothman & Winter Violet", description: "Austrian violet crème liqueur. Made with natural violet petals. Floral, sweet, perfumed. 20% ABV. Classic Aviation ingredient.", related: ["Giffard Crème de Violette", "Briottet Crème de Violette"], image: "https://upload.wikimedia.org/wikipedia/commons/1/14/Creme_de_violette.jpg" }
  ,
    { name: "The Bitter Truth Crème de Violette", description: "European violet crème liqueur from The Bitter Truth. Floral, sweet, perfumed. Made with violet flower essence. 20% ABV. A modern craft alternative to Rothman & Winter for Aviation and Violet Fizz.", related: ["Giffard Crème de Violette", "Briottet Crème de Violette", "Rothman & Winter Violet"] }
  ,
    { name: "Parfait d'Amour", description: "French violet-orange liqueur. Floral, sweet, with pronounced vanilla and citrus notes. A descendant of crème de violette but with a different profile. Used for color in Aviation when true crème de violette is unavailable.", related: ["Giffard Crème de Violette", "Briottet Crème de Violette", "Rothman & Winter Violet"] }
  ]
},
  { name: "Drambuie", category: "Liqueurs", description: "Scottish honey-herbal liqueur. Scotch whisky base with heather honey, herbs, and spices. 40% ABV.", brands: ["Drambuie"], notes: "Rusty Nail, Civil Service, Godfather variation.", bottles: [
    { name: "Drambuie", description: "Scottish honey-herbal liqueur. Scotch whisky base infused with heather honey, herbs, and spices. 40% ABV. The classic finish for Rusty Nail.", related: ["Bénédictine", "Glayva", "Liqueur 44"] }
  ,
    { name: "Glayva", description: "Scottish honey-herbal liqueur. Similar to Drambuie but with more citrus and spice notes. Made with Scotch whisky and heather honey.", related: ["Drambuie", "Bénédictine", "Liqueur 44"] }
  , { name: "Liqueur 44", description: "Swiss herbal liqueur with a honey-herbal profile similar to Drambuie. Made with 44 herbs and botanicals. Complex, bittersweet, with orange and spice notes. The Swiss cousin to Drambuie, used in Rusty Nail and Godfather variations.", related: ["Drambuie", "Glayva", "Bénédictine D.O.M."] }
  ,
    { name: "Drambuie Royal Legacy of 1745", description: "Upscale Drambuie expression launched in 2009. Made with malt whisky base and heather honey. Complex, rich honey-herbal character with malt depth. 40% ABV. Won the Drinks International Travel Retail Award for Best Travel Retail Drinks Launch in 2009. The premium Drambuie for sipping or luxury Rusty Nail.", related: ["Drambuie", "Glayva", "Liqueur 44"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/New_drambuie_bottle.jpg" }
  ,
    { name: "Liqueur 44 Espresso", description: "Coffee variant of Liqueur 44. The honey-herbal Swiss liqueur combined with coffee notes. Complex, bittersweet, with orange, spice, and roasted coffee. 30% ABV. Used in coffee cocktails and after-dinner drinks.", related: ["Liqueur 44", "Drambuie", "Glayva"] }
  ] },
  { name: "Elderflower liqueur", category: "Liqueurs", description: "Fragrant elderflower blossom liqueur. Floral, sweet, honeyed, with pear and lychee undertones. 20% ABV.", brands: ["St-Germain"], notes: "St-Germain Spritz, Elderflower Collins, Hugo.", bottles: [
    { name: "St-Germain", description: "French elderflower liqueur. Each bottle contains up to 1,000 elderflower blossoms hand-harvested in the French Alps. Floral, sweet, honeyed, with lychee undertones. 20% ABV.", related: ["Elderflower cordials", "Monin Elderflower Syrup"], }
  ,
    { name: "Monin Elderflower Liqueur", description: "Elderflower liqueur from Monin. Floral, sweet, honeyed. 20% ABV. A more affordable alternative to St-Germain.", related: ["St-Germain", "Elderflower cordials", "Monin Elderflower Syrup"] }
  ,
    { name: "Giffard Crème de Sureau", description: "French elderflower liqueur from Giffard. Made from wild elderflower blossoms. Floral, sweet, with honey and lychee notes. 20% ABV. A premium alternative to St-Germain.", related: ["St-Germain", "Monin Elderflower Liqueur", "Rothman & Winter Elderflower Liqueur"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/St_Germain_Elderflower_Liqueur_01.jpg" }
  ,
    { name: "Rothman & Winter Elderflower Liqueur", description: "Austrian elderflower liqueur from Rothman & Winter. Crafted from wild alpine elderflowers. Floral, sweet, with honey and citrus blossom notes. 20% ABV. Popular in European cocktail bars.", related: ["St-Germain", "Giffard Crème de Sureau", "Monin Elderflower Liqueur"] }
  ,
    { name: "Chareau Elderflower Liqueur", description: "American elderflower liqueur distilled in Sonoma, California. Floral, bright, with pear and white tea undertones. 24% ABV. Made with locally sourced elderflowers.", related: ["St-Germain", "Giffard Crème de Sureau", "Rothman & Winter Elderflower Liqueur"] }
  ,
    { name: "Briottet Crème de Sureau", description: "French elderflower liqueur from Maison Briottet. Made from wild elderflowers in Burgundy. Floral, sweet, with subtle honey and white peach notes. 20% ABV. A craft alternative to St-Germain.", related: ["St-Germain", "Giffard Crème de Sureau", "Rothman & Winter Elderflower Liqueur"] }
  ],
},
  { name: "Galliano", category: "Liqueurs", description: "Italian vanilla-herbal liqueur. Bright yellow, complex with vanilla, anise, and 30+ botanicals. 42.3% ABV.", brands: ["Galliano L'Autentico", "Galliano Vanilla"], notes: "Harvey Wallbanger, Yellow Bird.",
  bottles: [
    { name: "Galliano L'Autentico", description: "Iconic Italian vanilla-herbal liqueur. Bright yellow, complex. 42.3% ABV.", related: ["Galliano Vanilla", "Galliano Ristretto"] },
    { name: "Galliano Vanilla", description: "Smooth vanilla liqueur from Galliano. Rich vanilla with hints of herbs and spice.", related: ["Galliano L'Autentico", "Galliano Ristretto"] },
    { name: "Galliano Ristretto", description: "Coffee-flavored variant of Galliano liqueur. 30% ABV. Combines vanilla-herbal Galliano with roasted coffee notes. Used in coffee cocktails.", related: ["Galliano L'Autentico", "Galliano Vanilla"] },
    { name: "Galliano Amaro", description: "Herbal bitter amaro variant from Galliano. Vanilla and herb base with a pronounced bitter finish. 30% ABV. The darker, more bitter expression from the Galliano lineup.", related: ["Galliano L'Autentico", "Amaro Montenegro", "Amaro Averna"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Galliano_l%27autentico.jpg" },
    { name: "Amaro Montenegro", description: "Classic Italian amaro from Bologna, produced since 1885. Balanced bitter-sweet profile with vanilla, citrus, and 40 botanicals. 23% ABV. A cornerstone amaro for Boulevardier and digestif service.", related: ["Galliano Amaro", "Amaro Averna", "Amaro Nonino"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Amaro_Montenegro.jpg" },
    { name: "Amaro Averna", description: "Sicilian amaro from Caltanissetta, produced by the Averna family since 1868. Bitter, sweet, with citrus, dried fruit, and Mediterranean herbs. 29% ABV. The benchmark for amaro-forward cocktails and neat digestif.", related: ["Galliano Amaro", "Amaro Montenegro", "Amaro Nonino"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Amaro_averna.jpg" }
  ] 
},
  { name: "Green crème de menthe", category: "Liqueurs", description: "Bright green mint crème liqueur. Sweet, minty, artificial-bright green color.", brands: ["Marie Brizard", "Bols", "DeKuyper"], notes: "Grasshopper, Stinger variation, certain Shooters.",
  bottles: [
        { name: "Marie Brizard Green Crème de Menthe", description: "Bright green mint crème liqueur. Sweet, minty, artificial-bright green color.", related: ["Bols Pepermunt", "DeKuyper Peppermint"] },
    { name: "Bols Pepermunt", description: "Dutch green crème de menthe from Bols. Bright green, sweet, minty. 24% ABV. The classic for Grasshopper and Stinger.", related: ["Marie Brizard Green Crème de Menthe", "DeKuyper Peppermint"] },
    { name: "DeKuyper Peppermint", description: "Dutch green crème de menthe from DeKuyper. Bright green, sweet, peppermint-forward. 24% ABV. Used in shooters and layered drinks.", related: ["Marie Brizard Green Crème de Menthe", "Bols Pepermunt"] }
  ,
    { name: "Hiram Walker Crème de Menthe", description: "Classic green mint crème liqueur from Hiram Walker. Bright green, sweet, minty. 24% ABV. A budget-friendly staple for Grasshopper and Stinger cocktails.", related: ["Marie Brizard Green Crème de Menthe", "Bols Pepermunt", "DeKuyper Peppermint"] },
    { name: "Get 31 Crème de Menthe", description: "Dutch green crème de menthe from Get 31. Bright green, sweet, peppermint-forward. 25% ABV. Used in shooters and mint-forward cocktails.", related: ["Marie Brizard Green Crème de Menthe", "Bols Pepermunt", "DeKuyper Peppermint"] }
  ]
},
  { name: "Grenadine", category: "Liqueurs", description: "Pomegranate syrup-liqueur. Deep red, sweet-tart. Modern grenadine is often just pomegranate juice + sugar; some have a hint of orange.", brands: ["Monin Grenadine", "Fee Brothers", "Roses", "Small Hand Foods Pomegranate Molasses (mix with water)"], notes: "Tequila Sunrise, Shirley Temple, Planter's Punch.",
  bottles: [
    { name: "Monin Grenadine", description: "French grenadine from Monin. Deep red, sweet-tart pomegranate syrup. Premium alternative to Fee Brothers.", related: ["Fee Brothers Grenadine", "Roses Grenadine", "Small Hand Foods"] },
    { name: "Roses Grenadine", description: "Classic American grenadine from Roses. Deep red, sweet-tart pomegranate syrup. The original mixer for Tequila Sunrise.", related: ["Fee Brothers Grenadine", "Monin Grenadine", "Small Hand Foods"] },
    { name: "Fee Brothers Grenadine", description: "Classic American grenadine from Fee Brothers. Bright red pomegranate syrup, the original mixer for the Tequila Sunrise. ~3% ABV.", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Grenadinesyrup.jpg", related: ["Monin Grenadine", "Roses Grenadine", "Small Hand Foods"] },
    { name: "Small Hand Foods Pomegranate Grenadine", description: "Premium pomegranate grenadine from Small Hand Foods. Made with real pomegranate juice, no artificial colors. Used in craft cocktail bars.", related: ["Monin Grenadine", "Roses Grenadine", "Fee Brothers Grenadine"] },
    { name: "B.G. Reynolds Grenadine", description: "Hawaiian grenadine from B.G. Reynolds. Rich red pomegranate syrup with a touch of vanilla. Popular in tiki cocktails.", related: ["Monin Grenadine", "Roses Grenadine", "Fee Brothers Grenadine"] }
  ]
},
  { name: "Irish cream", category: "Liqueurs", description: "Cream liqueur with Irish whiskey, cream, and chocolate/coffee. Smooth, sweet, 17% ABV.", brands: ["Baileys Irish Cream", "Ryan's", "Saint Brendan's"], notes: "B-52, Irish Car Bomb, White Russian variation.",
  bottles: [
    { name: "Baileys Irish Cream", description: "The original Irish cream liqueur. Irish whiskey, cream, and chocolate. 17% ABV.", related: ["Ryan's Irish Cream", "Saint Brendan's"] },
    { name: "Saint Brendan's Irish Cream", description: "Irish cream liqueur from Ireland. Smooth, rich, with Irish whiskey and cream.", related: ["Baileys Irish Cream", "Ryan's Irish Cream"] },
    { name: "Ryan's Irish Cream", description: "Irish cream liqueur with Irish whiskey and cream. Smooth, sweet, more affordable alternative to Baileys.", related: ["Baileys Irish Cream", "Saint Brendan's Irish Cream"] }
  ,
    { name: "Merrys Irish Cream", description: "Irish cream liqueur. Rich, creamy, with whiskey and chocolate notes. 17% ABV. A more affordable alternative to Baileys.", related: ["Baileys Irish Cream", "Saint Brendan's Irish Cream", "Ryan's Irish Cream"] }
  ,
    { name: "Saint Brendan's Reserve Irish Cream", description: "Premium Irish cream liqueur. Richer, smoother blend of Irish whiskey and fresh dairy cream with elevated chocolate and vanilla notes. 17% ABV. The upscale alternative to standard Irish cream for after-dinner cocktails.", related: ["Baileys Irish Cream", "Saint Brendan's Irish Cream", "Merrys Irish Cream"] }
  ]
},
  { name: "Maraschino liqueur", category: "Liqueurs", description: "Luxardo-style cherry liqueur from Marasca cherry pits. Complex: cherry, almond, spice. 32% ABV.", brands: ["Luxardo Maraschino", "Maraska"], notes: "Aviation, Hemingway Daiquiri, Martinez.",
  bottles: [
    { name: "Luxardo Maraschino", description: "Premium Italian maraschino liqueur from Marasca cherry pits. 32% ABV.", related: ["Maraska Maraschino", "Luxardo Amaretto"] },
    { name: "Maraska Maraschino", description: "Croatian maraschino liqueur from Zadar. Dry, complex, made from Marasca cherries.", related: ["Luxardo Maraschino", "Bols Cherry Brandy"] },
    { name: "Bols Maraschino", description: "Dutch maraschino liqueur from Bols. Cherry and almond notes with a hint of spice. 24% ABV.", related: ["Luxardo Maraschino", "Maraska Maraschino"] },
    { name: "Cherry Heering Liqueur", description: "Danish cherry liqueur produced since 1818. Made from steeping sour cherries in spirits and aging in oak. Rich, full-bodied cherry character with nutty and spicy undertones. 24% ABV. A classic ingredient for Singapore Sling and Blood and Sand.", related: ["Luxardo Maraschino", "Maraska Maraschino", "Bols Maraschino"] },
    { name: "Guignolet", description: "Traditional French cherry liqueur from the Loire Valley. Made from wild cherries macerated in eau-de-vie. Dry, fruity, and aromatic with bright cherry and almond notes. Traditionally used in Guinguette parties and regional French cocktails.", related: ["Luxardo Maraschino", "Maraska Maraschino", "Bols Maraschino"] }
  ]
},
  { name: "Orange curaçao", category: "Liqueurs", description: "Orange-flavored liqueur made from dried curaçao orange peels (from Caribbean island). Dry, bitter-orange, 40% ABV.", brands: ["Pierre Ferrand Dry Curaçao", "Bols Orange Curaçao", "Marie Brizard"], notes: "Margarita (when not using triple sec), Sidecar.",
  bottles: [
    { name: "Pierre Ferrand Dry Curaçao", description: "Premium dry orange curaçao from Pierre Ferrand. Made from dried curaçao orange peels. 40% ABV.", related: ["Bols Orange Curaçao", "Marie Brizard Orange Curaçao", "Cointreau"] },
    { name: "Marie Brizard Orange Curaçao", description: "French orange curaçao from Marie Brizard. Balanced dry-orange flavor from Caribbean curaçao peels. 40% ABV.", related: ["Pierre Ferrand Dry Curaçao", "Bols Orange Curaçao"] },
    { name: "Bols Orange Curaçao", description: "Dutch orange curaçao from Bols. Dry, bitter-orange flavor. 35% ABV.", related: ["Pierre Ferrand Dry Curaçao", "Marie Brizard"] }
  ,
    { name: "Cointreau", description: "Premium French triple sec / orange curaçao. Clean orange flavor with bitter orange peel, 40% ABV. The most widely used orange liqueur in classic cocktails like Margarita and Cosmopolitan.", related: ["Pierre Ferrand Dry Curaçao", "Marie Brizard Orange Curaçao", "Bols Orange Curaçao"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cointreau.jpg" }
  ,
    { name: "Combier Triple Sec", description: "Historic French triple sec from the Combier distillery in the Loire Valley, founded in 1834. Bright, clean orange flavor with a hint of bitter orange peel. 40% ABV. One of the original triple sec brands.", related: ["Cointreau", "Pierre Ferrand Dry Curaçao", "Marie Brizard Orange Curaçao"] }
  ]
},
  { name: "Orange liqueur", category: "Liqueurs", description: "General term for orange-flavored liqueurs including triple sec, curaçao, and Cointreau.", brands: ["Cointreau", "Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard"], notes: "Encompasses Triple sec, Cointreau, and Orange curaçao.",
  bottles: [
    { name: "Cointreau", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], },
    { name: "Pierre Ferrand Dry Curaçao", description: "Dry orange curaçao from Pierre Ferrand. 40% ABV.", related: ["Cointreau", "Bols Orange Curaçao", "Marie Brizard"] },
    { name: "Combier", description: "Historic French triple sec from the Combier distillery in the Loire Valley. Bright, clean orange flavor with a hint of bitter orange peel. 40% ABV. One of the original triple sec brands, founded in 1834.", related: ["Cointreau", "Pierre Ferrand Dry Curaçao", "Marie Brizard Triple Sec"] },
    { name: "Marie Brizard Triple Sec", description: "French triple sec liqueur from Marie Brizard. Sweet, aromatic orange flavor with a smooth finish. 25% ABV. Widely available and affordable for mixing in Sidecars and Margaritas.", related: ["Cointreau", "Pierre Ferrand Dry Curaçao", "Combier"] },
    { name: "Bols Orange Curaçao", description: "Dutch orange curaçao from the Bols distillery. Balanced sweet-orange flavor with a hint of bitterness. 35% ABV. A versatile mixer for cocktails and a staple in many bars.", related: ["Cointreau", "Pierre Ferrand Dry Curaçao", "Marie Brizard Triple Sec"] }
  ]
},
  { name: "Peach schnapps", category: "Liqueurs", description: "Peach-flavored schnapps. Sweet, often artificially flavored, 15–20% ABV. Very 1980s-90s.", brands: ["DeKuyper Peach Schnapps", "Archers", "Hiram Walker"], notes: "Sex on the Beach, Fuzzy Navel, certain Shooters.",
  bottles: [
    { name: "DeKuyper Peach Schnapps", description: "American peach schnapps from DeKuyper. Sweet, peach-forward, 15% ABV.", related: ["Archers Peach Schnapps", "Hiram Walker Peach Schnapps"] },
    { name: "Archers Peach Schnapps", description: "UK peach schnapps. Sweet, smooth, with ripe peach flavor.", related: ["DeKuyper Peach Schnapps", "Hiram Walker Peach Schnapps"] },
    { name: "Hiram Walker Peach Schnapps", description: "Canadian peach schnapps from Hiram Walker & Sons. Sweet, smooth peach flavor. 20% ABV. Widely available in North America for shots and mixed drinks.", related: ["DeKuyper Peach Schnapps", "Archers Peach Schnapps"] }
  ,
    { name: "Mr. Boston Peach Schnapps", description: "American peach schnapps from Mr. Boston. Sweet, peach-forward, 30% ABV. A higher-proof option for peach-forward cocktails and shooters.", related: ["DeKuyper Peach Schnapps", "Archers Peach Schnapps"] }
  ,
    { name: "Bols Peach Schnapps", description: "Dutch peach schnapps from Bols. Sweet, bright peach flavor. 24% ABV. A European alternative for peach-forward cocktails.", related: ["DeKuyper Peach Schnapps", "Archers Peach Schnapps"] }
  ,
    { name: "Rothman & Winter Peach Schnapps", description: "Austrian peach schnapps from Rothman & Winter. Made with real peach distillate. Smooth, authentic peach character, 20% ABV. A premium European alternative for craft cocktails.", related: ["DeKuyper Peach Schnapps", "Archers Peach Schnapps"] }
  ]
},
  { name: "St-Germain elderflower liqueur", category: "Liqueurs", description: "Premium elderflower liqueur. Each bottle contains up to 1,000 elderflower blossoms hand-harvested in France.", brands: ["St-Germain"], notes: "St-Germain Spritz, Elderflower Collins, Hugo.", bottles: [
    { name: "St-Germain", description: "French elderflower liqueur. Each bottle contains up to 1,000 elderflower blossoms hand-harvested in the French Alps. Floral, sweet, honeyed, with lychee undertones. 20% ABV.", related: ["Elderflower cordials", "Monin Elderflower Syrup"], }
  ,
    { name: "Monin Elderflower Liqueur", description: "Elderflower liqueur from Monin. Floral, sweet, honeyed. 20% ABV. A more affordable alternative to St-Germain.", related: ["St-Germain", "Elderflower cordials", "Monin Elderflower Syrup"] },
    { name: "Giffard Crème de Sureau", description: "French elderflower liqueur from Giffard. Made from wild elderflower blossoms. Floral, sweet, with honey and lychee notes. 20% ABV. A premium alternative to St-Germain.", related: ["St-Germain", "Monin Elderflower Liqueur", "Rothman & Winter Elderflower Liqueur"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/St_Germain_Elderflower_Liqueur_01.jpg" },
    { name: "Rothman & Winter Elderflower Liqueur", description: "Austrian elderflower liqueur from Rothman & Winter. Made from European elderflowers. Floral, sweet, with authentic elderflower character. 20% ABV. A boutique alternative to St-Germain.", related: ["St-Germain", "Monin Elderflower Liqueur", "Giffard Crème de Sureau"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/St_Germain_Elderflower_Liqueur_01.jpg" },
    { name: "St. Elder Elderflower Liqueur", description: "Italian elderflower liqueur. Floral, sweet, with citrus and honey notes. 20% ABV. An accessible St-Germain alternative for cocktails.", related: ["St-Germain", "Monin Elderflower Liqueur", "Giffard Crème de Sureau"] }
  ] },
  { name: "Triple sec", category: "Liqueurs", description: "Generic orange-flavored liqueur. Usually 15–40% ABV, sweeter than curaçao. Cointreau is the premium triple sec.", brands: ["Cointreau", "Combier", "Marie Brizard", "Bols", "DeKuyper"], notes: "Margarita, Cosmopolitan, Long Island Iced Tea.",
  bottles: [
        { name: "Cointreau", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish. The standard for classic cocktails.", related: ["Combier", "Marie Brizard Triple Sec", "Bols Triple Sec"] },
    { name: "Combier Triple Sec", description: "French triple sec from Combier, made since 1834. 40% ABV.", related: ["Cointreau", "Marie Brizard Triple Sec", "Bols Triple Sec"] },
    { name: "Marie Brizard Triple Sec", description: "French triple sec from Marie Brizard. Clean, bright orange flavor with balanced sweetness. 40% ABV. A workhorse mixer for Margarita and Sidecar when Cointreau is not specified.", related: ["Cointreau", "Combier Triple Sec", "Bols Triple Sec"] },
    { name: "Bols Triple Sec", description: "Dutch triple sec from Bols. Bright orange flavor with medium sweetness. 38% ABV. A reliable everyday orange liqueur for high-volume cocktails.", related: ["Cointreau", "Combier Triple Sec", "Marie Brizard Triple Sec"] }
  ,
    { name: "DeKuyper Triple Sec", description: "American triple sec from DeKuyper. Bright, clean orange flavor with medium sweetness. 30% ABV. A widely available and affordable mixer for high-volume cocktails like Cosmopolitan and Long Island Iced Tea.", related: ["Cointreau", "Combier Triple Sec", "Marie Brizard Triple Sec", "Bols Triple Sec"] }
  ]
},
  { name: "Triple sec or Cointreau", category: "Liqueurs", description: "Same as Triple sec — just specifying Cointreau as the premium option.", brands: ["Cointreau"], notes: "Deduplicated with Triple sec.",
  bottles: [
    { name: "Cointreau", description: "Premium French triple sec. Clean orange flavor, 40% ABV, dry finish.", related: ["Pierre Ferrand Dry Curaçao", "Combier", "Marie Brizard Triple Sec"], },
    { name: "Combier Triple Sec", description: "French triple sec from Combier, made since 1834. 40% ABV.", related: ["Cointreau", "Marie Brizard Triple Sec", "Bols Triple Sec"] }
  ,
    { name: "Pierre Ferrand Dry Curaçao", description: "Dry orange curaçao from Pierre Ferrand. Made from dried curaçao orange peels. 40% ABV. A premium orange liqueur for Margarita and Sidecar.", related: ["Cointreau", "Combier Triple Sec", "Marie Brizard Triple Sec"] }
  ,
    { name: "Marie Brizard Triple Sec", description: "French triple sec from Marie Brizard. Clean, bright orange flavor with balanced sweetness. 40% ABV. A workhorse mixer for Margarita and Sidecar when Cointreau is not specified.", related: ["Cointreau", "Combier Triple Sec", "Pierre Ferrand Dry Curaçao"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cura%C3%A7ao_Triple_Sec_Bottles.jpg" }
  ,
    { name: "Bols Triple Sec", description: "Dutch triple sec from Bols. Bright orange flavor with medium sweetness. 38% ABV. A reliable everyday orange liqueur for high-volume cocktails.", related: ["Cointreau", "Combier Triple Sec", "Marie Brizard Triple Sec"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cura%C3%A7ao_Triple_Sec_Bottles.jpg" }
  ]
},
  { name: "White crème de menthe", category: "Liqueurs", description: "Clear/white mint crème liqueur. Same mint flavor as green but without artificial coloring. Useful in shaken cocktails.", brands: ["Marie Brizard", "Bols", "DeKuyper"], notes: "Stinger, Grasshopper (white version).",
  bottles: [
    { name: "Marie Brizard White Crème de Menthe", description: "Clear white mint crème liqueur. Same mint flavor as green but without artificial coloring.", related: ["Bols White Pepermunt", "DeKuyper White Peppermint"] },
    { name: "Bols White Pepermunt", description: "Dutch white crème de menthe from Bols. Clear, minty, sweet. 24% ABV. The classic for Stinger.", related: ["Marie Brizard White Crème de Menthe", "DeKuyper White Peppermint"] },
    { name: "DeKuyper White Peppermint", description: "Dutch white crème de menthe from DeKuyper. Clear, minty, sweet, 24% ABV. A reliable alternative to Bols for Stinger and Grasshopper.", related: ["Marie Brizard White Crème de Menthe", "Bols White Pepermunt"] }
  ,
    { name: "Combier White Crème de Menthe", description: "French white crème de menthe from Combier. Clear, minty, and sweet. A premium alternative for Stinger and Grasshopper.", related: ["Marie Brizard White Crème de Menthe", "Bols White Pepermunt", "DeKuyper White Peppermint"] }
  ]
},

  // BITTERS & APERITIFS
  { name: "Absinthe", category: "Bitters & Aperitifs", description: "High-proof anise-flavored spirit (45–74% ABV). Wormwood, anise, fennel. Turns cloudy when water is added (louche).", brands: ["Pernod Absinthe", "Absinthe Original", "La Fee", "Lucid Absinthe Supérieure"], notes: "Sazerac rinse, Corpse Reviver #2, Death in the Afternoon.",
  bottles: [
    { name: "Pernod Absinthe", description: "French absinthe from Pernod. Anise, wormwood, fennel. 68% ABV.", related: ["Lucid Absinthe Supérieure", "La Fee Absinthe"] },
    { name: "Lucid Absinthe Supérieure", description: "First legally imported absinthe to the US. 62.5% ABV.", related: ["Pernod Absinthe", "La Fee Absinthe"] },
    { name: "La Fee Absinthe Supérieure", description: "Swiss-French absinthe. Traditional recipe with grande wormwood, anise, and fennel. 68% ABV. The classic for Sazerac rinse and Corpse Reviver #2.", related: ["Pernod Absinthe", "Lucid Absinthe Supérieure"] },
    { name: "St. George Absinthe Verte", description: "California-made absinthe from St. George Spirits. Wormwood, anise, fennel, hyssop. Complex herbal profile with bright anise and citrus. 60% ABV.", related: ["Pernod Absinthe", "Lucid Absinthe Supérieure", "La Fee Absinthe Supérieure"], image: "https://upload.wikimedia.org/wikipedia/commons/6/65/St._George_Absinthe_Verte.jpg" },
    { name: "Kubler Absinthe", description: "Swiss absinthe from the Val-de-Travers region. Traditional 19th-century recipe with grande wormwood, anise, and fennel. Clean, herbaceous, with balanced anise. 53% ABV.", related: ["Pernod Absinthe", "La Fee Absinthe Supérieure", "Lucid Absinthe Supérieure"] },
    { name: "Absinthe Original", description: "Swiss-style absinthe with classic grande wormwood, anise, and fennel. Smooth, herbal, with moderate anise intensity. Versatile for rinses and Corpse Reviver #2. 55% ABV.", related: ["Pernod Absinthe", "Kubler Absinthe", "La Fee Absinthe Supérieure"] }
  ,
    { name: "Duplais Swiss Absinthe", description: "Swiss absinthe based on the original 19th-century Duplais recipe. Grande wormwood, anise, and fennel. Balanced, herbal, with moderate anise intensity. 54% ABV. A faithful recreation of pre-ban Swiss absinthe.", related: ["Pernod Absinthe", "Kubler Absinthe", "La Fee Absinthe Supérieure"] }
  ,
    { name: "Tiny Foot Absinthe", description: "American absinthe produced in the historic tradition. Wormwood, anise, fennel. Bright herbal profile with citrus undertones. 60% ABV. A quality domestic option for Sazerac rinse and Corpse Reviver #2.", related: ["St. George Absinthe Verte", "Pernod Absinthe", "La Fee Absinthe Supérieure"] }
  ]
},
  { name: "Angostura bitters", category: "Bitters & Aperitifs", description: "The iconic dash of bitters. Concentrated herbal extract with gentian root, spices, and herbs. Over 150 years old. 44.7% ABV.", brands: ["Angostura (the standard — no alternatives needed)"], notes: "In virtually every stirred cocktail. Old Fashioned, Manhattan, Martini garnish.",
  bottles: [
        { name: "Angostura Aromatic Bitters", description: "The iconic dash of bitters. Concentrated herbal extract with gentian root, spices, and herbs. Over 150 years old. 44.7% ABV.", related: ["Fee Brothers Aromatic Bitters", "Bitter Truth Aromatic"] },
    { name: "Fee Brothers Aromatic Bitters", description: "American aromatic bitters from Fee Brothers. Concentrated herbal extract with gentian root, spices, and herbs. A classic alternative to Angostura.", related: ["Angostura Aromatic Bitters", "Bitter Truth Aromatic"] },
    { name: "Bitter Truth Aromatic Bitters", description: "German-made aromatic bitters. Similar herbal profile to Angostura with gentian root, spices, and herbs. 39% ABV. A quality alternative for Old Fashioneds and Manhattans.", related: ["Angostura Aromatic Bitters", "Fee Brothers Aromatic Bitters"] }
  ,
    { name: "Regans' Orange Bitters No. 6", description: "Iconic orange bitters created by bartender Gary Regan. Bright orange peel, warm baking spices, and subtle floral notes. The gold standard for Orange Sours and Mai Tais. 45% ABV.", related: ["Angostura Aromatic Bitters", "Fee Brothers Aromatic Bitters", "Fee Brothers Old Fashioned Bitters"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Angostura_bottle.jpg" }
  ,
    { name: "Fee Brothers Old Fashioned Bitters", description: "American aromatic bitters from Fee Brothers with notes of allspice, clove, and citrus peel. A classic aromatic bitters for Old Fashioneds and Manhattan variations.", related: ["Angostura Aromatic Bitters", "Bitter Truth Aromatic Bitters", "Regans' Orange Bitters No. 6"] }
  ,
    { name: "Peychaud's Bitters", description: "The iconic aromatic bitters from New Orleans. Bright red liquid with notes of cherry, gentian, and spices. Essential for Sazeracs and New Orleans-style cocktails. 35% ABV.", related: ["Angostura Aromatic Bitters", "Fee Brothers Aromatic Bitters", "Bitter Truth Aromatic Bitters"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Peychauds.jpg" }
  ]
},
  { name: "Fernet-Branca", category: "Bitters & Aperitifs", description: "Italian amaro bitter digestif. Intensely bitter, minty, menthol, eucalyptus, and herbaceous. 39% ABV.", brands: ["Fernet-Branca"], notes: "Toronto, Hanky Panky, Fernet & Coke (Argentina).",
  bottles: [
    { name: "Fernet-Branca", description: "Italian amaro bitter digestif. Intensely bitter, minty, menthol, eucalyptus. 39% ABV.", related: ["Fernet-Branca Menta", "Amaro Averna"] },
    { name: "Fernet-Branca Menta", description: "Mint version of Fernet-Branca. Even more menthol and minty.", related: ["Fernet-Branca", "Amaro Montenegro"] },
    { name: "Amaro Averna", description: "Sicilian amaro from Caltanissetta, produced by the Averna family since 1868. Bitter, sweet, with citrus, dried fruit, and Mediterranean herbs. 29% ABV. The benchmark for amaro-forward cocktails and neat digestif.", related: ["Fernet-Branca", "Amaro Montenegro", "Aperol"] },
    { name: "Amaro Montenegro", description: "Classic Italian amaro from Bologna, produced since 1885. Balanced bitter-sweet profile with vanilla, citrus, and 40 botanicals. 23% ABV. A cornerstone amaro for Boulevardier and digestif service.", related: ["Fernet-Branca", "Amaro Averna", "Amaro Nonino"] },
    { name: "Ramazzotti Amaro", description: "Italian amaro from the Ramazzotti house, produced since 1815. Bitter-sweet with rhubarb, citrus, and 30 botanicals. 30% ABV. A classic digestif for sipping or stirred cocktails.", related: ["Amaro Averna", "Amaro Montenegro", "Aperol"] }
  ]
},
  { name: "Green Chartreuse", category: "Bitters & Aperitifs", description: "French herbal liqueur made by Carthusian monks since 1605. 130+ botanicals. Bright green, complex, 55% ABV.", brands: ["Green Chartreuse V.P. (55%)", "Green Chartreuse (41%) — 'Alpine Strength'"], notes: "Last Word, Chartreuse Swizzle, Ti' Punch variation.",
  bottles: [
    { name: "Green Chartreuse V.P.", description: "French herbal liqueur made by Carthusian monks since 1605. 130+ botanicals. 55% ABV.", related: ["Green Chartreuse (41%)", "Yellow Chartreuse", "Bénédictine"] },
    { name: "Green Chartreuse (41%)", description: "Lower-ABV version of Green Chartreuse. 41% ABV.", related: ["Green Chartreuse V.P.", "Yellow Chartreuse"] },
    { name: "Yellow Chartreuse", description: "Milder, sweeter sibling of Green Chartreuse. 40% ABV. Vanilla, honey, and herbal notes. Used in Last Word and Chartreuse Swizzle variations.", related: ["Green Chartreuse V.P.", "Green Chartreuse (41%)"], image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Chartreuse_jaune.JPG" }
  ,
    { name: "Green Chartreuse VEP (55%)", description: "Modern V.P. (Voie Verte Ecologique) expression of Green Chartreuse. 55% ABV, the classic high-proof green herbal liqueur. Bright green color with intense mint, anise, and botanical complexity. The standard for Last Word and Chartreuse Swizzle.", related: ["Green Chartreuse V.P.", "Green Chartreuse (41%)", "Yellow Chartreuse"] }
  ,
    { name: "Green Chartreuse 41% Alpine Strength", description: "Green Chartreuse Alpine Strength expression at 41% ABV. Smoother and more approachable than the 55% V.P. while maintaining the signature 130-botanical herbal profile. Great for long drinks and cocktails where lower proof is preferred.", related: ["Green Chartreuse V.P.", "Green Chartreuse (41%)", "Yellow Chartreuse"] }
  ]
},
  { name: "Lillet Blanc", category: "Bitters & Aperitifs", description: "French aromatised wine. Citrus, honey, and quinine. 17% ABV. Similar to dry vermouth but with more citrus.", brands: ["Lillet Blanc"], notes: "Vesper, 20th Century, Corpse Reviver #2.",
  bottles: [
    { name: "Lillet Blanc", description: "French aromatised wine. Citrus, honey, and quinine. 17% ABV.", related: ["Lillet Rosé", "Lillet Rouge", "Dolin Dry"] },
    { name: "Lillet Dry", description: "Dry version of Lillet. Less sweet than Blanc, with more botanical and quinine-driven finish. 17% ABV. Preferred in classic Vesper recipes.", related: ["Lillet Blanc", "Lillet Rosé", "Dolin Dry Vermouth"] },
    { name: "Lillet Rosé", description: "Rosé version of Lillet. Fruity, red-berry, and citrus notes. 17% ABV.", related: ["Lillet Blanc", "Lillet Rouge"] },
    { name: "Lillet Rouge", description: "Red, tannic version of Lillet. Cocoa, red fruit, and spice notes. 17% ABV.", related: ["Lillet Blanc", "Lillet Rosé"], image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Lillet_Blanc_Aperitif_01.jpg" },
    { name: "Dolin Dry Vermouth", description: "French dry vermouth from Dolin. Lighter and more delicate than Noilly Prat. Herbal with chamomile, orange peel, and coriander. 17.5% ABV.", related: ["Lillet Blanc", "Lillet Rosé", "Lillet Rouge"], image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Dolin%27s_Vermouth_%28Dry%29_01.jpg" }
  ]
},
  { name: "Orange bitters", category: "Bitters & Aperitifs", description: "Citrusy bitters made from dried orange peel. Lighter and more aromatic than Angostura.", brands: ["Regans' Orange Bitters No. 6", "Fee Brothers Orange Bitters", "Bitter Truth Orange"], notes: "Martini, Old Fashioned, Manhattan.",
  bottles: [
    { name: "Regans' Orange Bitters No. 6", description: "Citrusy bitters from dried orange peel by Gary Regan.", related: ["Fee Brothers Orange Bitters", "Bitter Truth Orange"] },
    { name: "Fee Brothers Orange Bitters", description: "American orange bitters. Bright orange peel flavor.", related: ["Regans' Orange Bitters No. 6", "Bitter Truth Orange"] },
    { name: "Bitter Truth Orange Bitters", description: "Premium German orange bitters. Made from sun-dried Valencia orange peel. Bright, aromatic, with floral citrus notes. 39% ABV.", related: ["Regans' Orange Bitters No. 6", "Fee Brothers Orange Bitters"] }
  ]
},
  { name: "Peychaud's bitters", category: "Bitters & Aperitifs", description: "Aromatic bitters from New Orleans. Anise, gentian, cherry. Distinctive red color. 35% ABV.", brands: ["Peychaud's Bitters"], notes: "Sazerac — essential. Manhattan variation.",
  bottles: [
        { name: "Peychaud's Aromatic Bitters", description: "New Orleans aromatic bitters. Anise, gentian, cherry. Distinctive red color. 35% ABV.", related: ["Angostura Bitters", "Fee Brothers Bitters"] },
    { name: "Fee Brothers Bitters", description: "American aromatic bitters from Fee Brothers. A versatile all-purpose bitter for Old Fashioned and Manhattan when Peychaud's isn't specified.", related: ["Peychaud's Aromatic Bitters", "Angostura Bitters"] },
    { name: "Bittermens Boston Bitters", description: "Small-batch aromatic bitters from Bittermens. Baking spice, dried citrus, and tea-like tannins. A versatile modifier for stirred cocktails and spirit-forward drinks.", related: ["Peychaud's Aromatic Bitters", "Fee Brothers Bitters", "Angostura Bitters"] }
  ]
},
  { name: "Pimm's No. 1", category: "Bitters & Aperitifs", description: "British summer cup. Gin-based fruit liqueur with herbal and citrus notes. 25% ABV.", brands: ["Pimm's No. 1"], notes: "Pimm's Cup — mix with lemonade, mint, cucumber, fruit.",
  bottles: [
    { name: "Pimm's No. 1", description: "British summer cup. Gin-based fruit liqueur with herbal and citrus notes. 25% ABV. The essential for a Pimm's Cup.", related: ["Plymouth Gin", "Lemonade", "Cucumber"] },
    { name: "Plymouth Gin", description: "English gin from Plymouth. Slightly drier, earthier. 41.2% ABV. The historic gin base for Pimm's No. 1.", related: ["Pimm's No. 1", "Beefeater", "Tanqueray"] },
    { name: "Beefeater London Dry Gin", description: "Iconic London dry gin. Juniper-forward with citrus and spice notes. 40% ABV. A classic Pimm's Cup base.", related: ["Plymouth Gin", "Tanqueray", "Pimm's No. 1"] }
  ]
},
  { name: "Amaro Nonino", category: "Bitters & Aperitifs", description: "Premium Italian amaro. Made from grappa macerated with herbs, roots, and alpine flowers. Bitter-sweet, 35% ABV.", brands: ["Amaro Nonino Quintessentia"], notes: "Paper Plane, Boulevardier variation, Paper Plane.",
  bottles: [
    { name: "Amaro Nonino Quintessentia", description: "Premium Italian amaro from Nonino. Bitter-sweet, 35% ABV.", related: ["Amaro Averna", "Amaro Montenegro", "Aperol"] },
    { name: "Amaro Averna", description: "Sicilian amaro from Averna. Bitter-sweet. 29% ABV.", related: ["Amaro Nonino", "Amaro Montenegro", "Fernet-Branca"] },
    { name: "Amaro Montenegro", description: "Italian amaro from Montenegro. Bitter-sweet with notes of orange, eucalyptus, and herbs. 23% ABV.", related: ["Amaro Nonino", "Amaro Averna", "Aperol"] },
    { name: "Amaro Nonino Ciociara", description: "Bitterer, more herbal amaro from Nonino with additional roots and botanicals from the Ciociara region. 30% ABV. A bolder, darker alternative to Quintessentia for stirred cocktails.", related: ["Amaro Nonino Quintessentia", "Amaro Averna", "Fernet-Branca"] },
    { name: "Amaro Nonino Antica Ricetta", description: "The original recipe amaro from Nonino. Lighter, more citrus-forward than Quintessentia with orange zest and subtle spice. 35% ABV. Ideal for spritzes and lighter aperitivo builds.", related: ["Amaro Nonino Quintessentia", "Amaro Montenegro", "Aperol"] }
  ]
},

  // SHERRIES & VERMOUTHS
  { name: "Amontillado sherry", category: "Sherries & Vermouths", description: "Sherry style between fino and oloroso. Initially aged under flor, then exposed to air. Nutty, dry, complex.", brands: ["Lustau Amontillado", "Gonzalez Byass Amontillado"], notes: "Adonis, Bamboo, certain Manhattan variations.",
  bottles: [
    { name: "Lustau Amontillado", description: "Spanish amontillado sherry from Lustau. Nutty, dry, complex.", related: ["Lustau Fino", "Lustau Oloroso", "Gonzalez Byass"] },
    { name: "Gonzalez Byass Amontillado", description: "Classic amontillado sherry from Jerez. Dry, nutty.", related: ["Lustau Amontillado", "Tio Pepe Fino"] },
    { name: "Del Duque Amontillado Sherry", description: "VORS (Very Old Rare Sherry) amontillado from Del Duque. Rich, nutty, complex, aged for decades under solera.", related: ["Lustau Amontillado", "Gonzalez Byass Amontillado", "Tio Pepe Fino"] },
    { name: "Sanchez Romate NPU Amontillado Sherry", description: "NPU (No Puede Ser) amontillado from Sanchez Romate. Extremely rare, aged 60+ years in solera. Intensely nutty and complex.", related: ["Lustau Amontillado", "Gonzalez Byass Amontillado", "Del Duque Amontillado Sherry"] }
  ]
},
  { name: "Dry vermouth", category: "Sherries & Vermouths", description: "Fortified, aromatised wine. Dry, herbal, botanical. ~18% ABV. Keep refrigerated after opening.", brands: ["Dolin Dry", "Noilly Prat", "Martini & Rossi Dry", "Carpano Antica (sweet)"], notes: "Martini, Manhattan (dry version), Gibson.",
  bottles: [
    { name: "Noilly Prat Original French Dry", description: "Classic French dry vermouth from Noilly Prat in Marseillan. Macerated with herbs and spices from the Languedoc region. Herbal, bright, with chamomile and orange peel.", related: ["Dolin Dry", "Martini & Rossi Dry", "Carpano Antica Formula"] },
    { name: "Dolin Dry Vermouth", description: "French dry vermouth from Dolin. Lighter and more delicate than Noilly Prat. Herbal with chamomile, orange peel, and coriander. 17.5% ABV.", related: ["Noilly Prat Original French Dry", "Martini & Rossi Dry", "Carpano Antica Formula"] },
    { name: "Carpano Dry Vermouth", description: "Italian dry vermouth from Carpano. Bold, complex, with aromatic herbs and citrus. A versatile dry mixer for Martinis and Manhattans.", related: ["Noilly Prat Original French Dry", "Martini & Rossi Dry Vermouth", "Dolin Dry Vermouth"] },
    { name: "Martini & Rossi Dry Vermouth", description: "Classic Italian dry vermouth. Aromatic, crisp, with light herbal and citrus character. The standard dry vermouth for Martinis and Americanos.", related: ["Dolin Dry Vermouth", "Noilly Prat Original French Dry", "Carpano Dry Vermouth"] }
  ]
},
  { name: "Fino sherry", category: "Sherries & Vermouths", description: "Lightest, driest sherry style. Aged under flor (yeast film). Pale, saline, almond, and green apple.", brands: ["Tio Pepe Fino", "Lustau Fino", "Gonzalez Byass Fino"], notes: "Adonis, Bamboo, Sherry Cobbler.",
  bottles: [
    { name: "Tio Pepe Fino", description: "Spain's most famous fino sherry. Pale, dry, saline, almond, green apple.", related: ["Lustau Fino", "Lustau Amontillado", "Gonzalez Byass Fino"] },
    { name: "Lustau Fino", description: "Fine fino sherry from Lustau. Pale, bone-dry, saline almond and apple notes.", related: ["Tio Pepe", "Lustau Amontillado", "Lustau Palo Cortado"] },
    { name: "Gonzalez Byass Fino", description: "Fino sherry from the renowned González Byass house in Jerez. Pale, dry, saline with fresh yeast and green apple notes. A classic Tio Pepe sibling. 15% ABV.", related: ["Tio Pepe Fino", "Lustau Fino", "La Gitana Manzanilla"] },
    { name: "La Gitana Manzanilla", description: "Manzanilla fino from Bodega Hidalgo La Gitana in Sanlúcar de Barrameda. Bone-dry, saline, with floral yeast notes and a briny Atlantic character. 15% ABV. The defining Manzanilla.", related: ["Tio Pepe Fino", "Lustau Fino", "Gonzalez Byass Fino"] },
    { name: "Valdespino Fino", description: "Fino sherry from Valdespino, one of Jerez's oldest bodegas (founded 1430). Pale, dry, with refined saline and almond notes. A historic fino producer. 15% ABV.", related: ["Tio Pepe Fino", "Lustau Fino", "Gonzalez Byass Fino"] }
  ]
},
  { name: "Sweet vermouth", category: "Sherries & Vermouths", description: "Sweet, rich aromatised wine. Caramel, vanilla, herbs, citrus. ~16% ABV. Keep refrigerated.", brands: ["Carpano Antica", "Dolin Sweet", "Martini & Rossi Rosso", "Cinzano Rosso"], notes: "Negroni, Manhattan, Boulevardier, Americano, Rob Roy.",
  bottles: [
    { name: "Carpano Antica Formula", description: "Premium Italian sweet vermouth from Fratelli Branca. First vermouth created by Antonio Carpano in 1786. Intensely herbal, vanilla-forward, with dried fruit and toffee. 23% ABV.", related: ["Carpano Punt e Mes", "Dolin Sweet", "Martini & Rossi Rosso"] },
    { name: "Dolin Sweet Vermouth", description: "Classic French sweet vermouth from Dolin. Lighter and more delicate than Carpano, with subtle herbal notes, vanilla, and orange peel. 16% ABV. Perfect for Manhattan and Negroni.", related: ["Carpano Antica Formula", "Martini & Rossi Rosso", "Cinzano Rosso"] },
    { name: "Martini & Rossi Rosso", description: "Iconic Italian sweet vermouth from Martini & Rossi. Rich, fruity, with notes of vanilla, herbs, and caramel. 15% ABV. The backbone of the perfect Manhattan.", related: ["Carpano Antica Formula", "Dolin Sweet Vermouth", "Cinzano Rosso"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vermouth_Bottles.jpg" },
    { name: "Cinzano Rosso", description: "Traditional Italian sweet vermouth from Cinzano. Bold, aromatic, with hints of dried fruit, spices, and herbs. 15% ABV. A reliable choice for Manhattan, Negroni, and Americano.", related: ["Carpano Antica Formula", "Dolin Sweet Vermouth", "Martini & Rossi Rosso"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vermouth_Bottles.jpg" }
  ]
},

  // WINES & SPARKLING
  { name: "Champagne", category: "Wines & Sparkling", description: "Sparkling wine from Champagne region of France. Méthode Champenoise. Fine bubbles, toasty, complex.", brands: ["Moët & Chandon", "Veuve Clicquot", "Ruinart", "Krug", "Bollinger"], notes: "French 75, Champagne Cocktail, Champagne Sour.",
  bottles: [
        { name: "Moët & Chandon Brut Impérial", description: "Iconic Champagne from Moët & Chandon. Bright, lively, with green apple, citrus, and brioche. The standard for celebrations and French 75.", related: ["Veuve Clicquot Yellow Label", "Ruinart Blanc de Blancs", "Bollinger Special Cuvée"] },
    { name: "Ruinart Blanc de Blancs", description: "Champagne from Ruinart. 100% Chardonnay. Light, elegant, with citrus, white flowers, and brioche. The refined alternative to Moët for French 75.", related: ["Moët & Chandon Brut Impérial", "Veuve Clicquot Yellow Label", "Bollinger Special Cuvée"] },
    { name: "Veuve Clicquot Yellow Label", description: "Brut Champagne from Veuve Clicquot. Bright, balanced, with brioche, citrus, and red fruit. Reliable standard for toasts and French 75.", related: ["Moët & Chandon Brut Impérial", "Ruinart Blanc de Blancs", "Bollinger Special Cuvée"], image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Veuve_Clicquot_-_bottle.jpg" },
    { name: "Bollinger Special Cuvée", description: "Full-bodied Champagne from Bollinger. Rich, toasty, with brioche, red fruit, and nutty depth. A power choice for Champagne Cocktail.", related: ["Moët & Chandon Brut Impérial", "Veuve Clicquot Yellow Label", "Ruinart Blanc de Blancs"] }
  ]
},
  { name: "Champagne or sparkling wine", category: "Wines & Sparkling", description: "Either Champagne or a quality sparkling wine (Cava, Prosecco, Crémant).", brands: ["Moët & Chandon", "Veuve Clicquot", "Prosecco brands"], notes: "Use for top-ups in French 75, Champagne cocktails.",
  bottles: [
    { name: "Moët & Chandon Brut Impérial", description: "Iconic Champagne. Bright, lively, with green apple, citrus, and brioche.", related: ["Veuve Clicquot Yellow Label", "Ruinart Blanc de Blancs"] },
    { name: "Bollinger Special Cuvée", description: "Powerful, full-bodied Brut Champagne from Bollinger. Rich brioche, apple, and nutty notes with fine bubbles. 12% ABV.", related: ["Moët & Chandon Brut Impérial", "Veuve Clicquot Yellow Label"], image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Bollinger.jpg" },
    { name: "Veuve Clicquot Yellow Label", description: "Brut Champagne. Bright, balanced, with brioche and citrus.", related: ["Moët & Chandon Brut Impérial", "Ruinart Blanc de Blancs", "Bollinger Special Cuvée"] },
    { name: "Ruinart Blanc de Blancs", description: "Prestige cuvée from the oldest Champagne house (founded 1729). 100% Chardonnay from Grand Cru vineyards. Bright, ethereal, with citrus, white flowers, and mineral precision. A benchmark Blanc de Blancs for French 75.", related: ["Moët & Chandon Brut Impérial", "Veuve Clicquot Yellow Label", "Bollinger Special Cuvée"] },
    { name: "Taittinger Brut La Française", description: "Elegant Brut Champagne from Taittinger in Reims. Bright, refined, with green apple, brioche, and citrus notes. Fine, persistent mousse. 12% ABV. A versatile choice for Champagne cocktails and toasts.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Taittinger_Bottles_001.jpg", related: ["Moët & Chandon Brut Impérial", "Veuve Clicquot Yellow Label", "Bollinger Special Cuvée"] },
    { name: "Nicolas Feuillatte Brut Réserve", description: "Approachable Brut Champagne from Nicolas Feuillatte. Smooth, balanced, with white fruit, brioche, and subtle creaminess. A reliable everyday Champagne for French 75 and celebrations.", related: ["Moët & Chandon Brut Impérial", "Veuve Clicquot Yellow Label", "Ruinart Blanc de Blancs"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nicolas_Feuillatte_Champagne.jpg" }
  ]
},
  { name: "Prosecco", category: "Wines & Sparkling", description: "Italian sparkling wine from Veneto region. Light, fruity, Glera grape. 10.5–11.5% ABV.", brands: ["Nino Franco Rustico", "Bisol Jeio", "Santa Margherita", "Zonin", "La Marca"], notes: "Aperol Spritz, Bellini, Mimosa.",
  bottles: [
    { name: "La Marca Prosecco", description: "Italian Prosecco from Veneto. Light, fruity, Glera grape.", related: ["Nino Franco Rustico", "Bisol Jeio", "Santa Margherita"] },
    { name: "Santa Margherita Prosecco", description: "Crisp, clean Prosecco from Valdobbiadene.", related: ["La Marca", "Zonin Prosecco", "Bisol Jeio"] },
    { name: "Nino Franco Rustico Prosecco", description: "Premium Prosecco from Nino Franco. Bright, aromatic, with fine bubbles. The Rustico is their classic expression.", related: ["La Marca Prosecco", "Santa Margherita Prosecco", "Bisol Jeio"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/A_bottle_of_Prosecco.jpg" },
    { name: "Bisol Jeio Prosecco", description: "Fresh, vibrant Prosecco from Bisol. Light, fruity, with delicate floral notes.", related: ["La Marca Prosecco", "Santa Margherita Prosecco", "Nino Franco Rustico Prosecco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/A_bottle_of_Prosecco.jpg" },
    { name: "Valdo Prosecco di Valdobbiadene", description: "Prosecco from Valdobbiadene DOCG region. Crisp, mineral-driven, with fine persistent bubbles.", related: ["La Marca Prosecco", "Santa Margherita Prosecco", "Nino Franco Rustico Prosecco"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/A_bottle_of_Prosecco.jpg" }
  ]
},
  { name: "Dry white wine", category: "Wines & Sparkling", description: "Unfortified dry white wine. Sauvignon Blanc, Pinot Grigio, etc. Used in wine-based cocktails.", brands: ["House pour"], notes: "Wine Spritzer, Sangria, certain Coolers.",
  bottles: [
    { name: "Dry Sauvignon Blanc", description: "Crisp, dry white wine. Citrus, green apple, herbaceous.", related: ["Dry Pinot Grigio", "Dry Chardonnay"] },
    { name: "Dry Pinot Grigio", description: "Light, dry Italian white wine. Clean, citrus, mineral.", related: ["Dry Sauvignon Blanc", "Pinot Gris"] }
  ,
    { name: "Pinot Grigio", description: "Italian dry white wine from the Pinot Grigio grape. Light, crisp, with citrus and mineral notes. A classic mixer for wine spritzes and light cocktails.", related: ["Dry Sauvignon Blanc", "Dry Chardonnay"] }
  ,
    { name: "Dry Chardonnay", description: "Rich, dry white wine from the Chardonnay grape. Buttery, oaky, with tropical fruit notes. The premium choice for creamy wine cocktails and spritzes.", related: ["Dry Sauvignon Blanc", "Dry Pinot Grigio", "Pinot Grigio"] }
  ]
},

  // JUICES & MIXERS
  { name: "Cranberry juice", category: "Juices & Mixers", description: "Tart-sweet juice from cranberries. Mix with soda or use as a mixer. Often sweetened.", brands: ["Ocean Spray", "Lakewood", "R.W. Knudsen"], notes: "Cape Codder, Cosmopolitan, Woo Woo.",
  bottles: [
    { name: "Ocean Spray Cranberry Juice Cocktail", description: "Classic cranberry juice cocktail. Tart-sweet, widely available. The standard for Cape Codder and Cosmopolitan.", related: ["Lakewood Organic Cranberry", "R.W. Knudsen Cranberry"] }
  ,
    { name: "R.W. Knudsen Cranberry Juice", description: "Cranberry juice from R.W. Knudsen. Tart-sweet, natural. Premium option for Cosmopolitan.", related: ["Ocean Spray Cranberry Juice Cocktail", "Lakewood Organic Cranberry"] }
  ,
    { name: "Lakewood Organic Cranberry Juice", description: "Organic cranberry juice from Lakewood. Tart-sweet, made from concentrate-free whole cranberries. A natural alternative to Ocean Spray for Cape Codder and Cosmopolitan.", related: ["Ocean Spray Cranberry Juice Cocktail", "R.W. Knudsen Cranberry Juice"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/2021-04-20_19_06_46_A_bottle_of_Ocean_Spray_Cranberry_Juice_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg" }
  ,
    { name: "Ocean Spray Cranberry Juice", description: "Classic Ocean Spray cranberry juice. Tart-sweet, widely available. The standard for Cape Codder and Cosmopolitan when pre-bottled cocktail juice is needed.", related: ["Ocean Spray Cranberry Juice Cocktail", "Lakewood Organic Cranberry Juice"] }
  ] },
  { name: "Grapefruit juice", category: "Juices & Mixers", description: "Bitter-sweet juice from grapefruit. Can be white (blond) or ruby (red). Freshest when juiced.", brands: ["Fresh"], notes: "Greyhound, Paloma, Hemingway Daiquiri.",
  bottles: [
    { name: "Fresh Ruby Red Grapefruit Juice", description: "Fresh-squeezed ruby red grapefruit juice. Bitter-sweet, bright. Perfect for Greyhound and Paloma.", related: ["Fresh White Grapefruit Juice", "Bottled Grapefruit Juice"] }
  ,
    { name: "Bottled Grapefruit Juice", description: "Bottled grapefruit juice. Convenient for mixing when fresh isn't available.", related: ["Fresh Ruby Red Grapefruit Juice", "Fresh White Grapefruit Juice"] }
  ,
    { name: "Ocean Spray Grapefruit Juice", description: "Ruby red grapefruit juice from Ocean Spray. Tart-sweet, consistent flavor. A widely available option for Palomas and Greyhounds when fresh is impractical.", related: ["Fresh Ruby Red Grapefruit Juice", "Tropicana Pure Premium Grapefruit Juice"] }
  ,
    { name: "Tropicana Pure Premium Grapefruit Juice", description: "Pasteurized grapefruit juice from Tropicana. Sweet-tart, consistent quality. Widely available in grocery stores as a fresh-juice alternative.", related: ["Ocean Spray Grapefruit Juice", "Fresh Ruby Red Grapefruit Juice"] }
  ,
    { name: "Simply Beverages Grapefruit Juice", description: "Not-from-concentrate grapefruit juice from Simply Beverages. Bright, minimally processed. A mid-tier option between fresh-squeezed and standard bottled juice.", related: ["Ocean Spray Grapefruit Juice", "Tropicana Pure Premium Grapefruit Juice"] }
  ] },
  { name: "Fresh grapefruit juice", category: "Juices & Mixers", description: "Same as grapefruit juice — fresh-squeezed for better flavor and no added sugar.", brands: ["Fresh"], notes: "Deduplicated with Grapefruit juice; fresh preferred.",
  bottles: [
    { name: "Fresh Ruby Red Grapefruit Juice", description: "Fresh-squeezed ruby red grapefruit juice. Bitter-sweet, bright. No added sugar — the preferred version.", related: ["Fresh White Grapefruit Juice", "Bottled Grapefruit Juice"] }
  ,
    { name: "Bottled Grapefruit Juice", description: "Bottled grapefruit juice. Convenient but less bright than fresh-squeezed.", related: ["Fresh Ruby Red Grapefruit Juice", "Fresh White Grapefruit Juice"] }
  ,
    { name: "Florida's Natural Ruby Red Grapefruit Juice", description: "Ruby red grapefruit juice from Florida's Natural. Sweet-tart, bright flavor from Florida-grown ruby red grapefruit. Not from concentrate. A widely available premium carton option.", related: ["Fresh Ruby Red Grapefruit Juice", "Tropicana Pure Premium Grapefruit Juice", "Ocean Spray Grapefruit Juice"] }
  ,
    { name: "Tropicana Pure Premium Grapefruit Juice", description: "Premium grapefruit juice from Tropicana. Made from ruby red grapefruit. Sweet-tart, consistent quality. Not from concentrate. The premium carton choice for Palomas and Greyhounds.", related: ["Fresh Ruby Red Grapefruit Juice", "Florida's Natural Ruby Red Grapefruit Juice", "Ocean Spray Grapefruit Juice"] }
  ,
    { name: "Ocean Spray Ruby Red Grapefruit Juice", description: "Ruby red grapefruit juice from Ocean Spray. Tart-sweet, consistent flavor from a trusted juice brand. Widely available in cartons. A reliable backup for Palomas and Greyhounds.", related: ["Fresh Ruby Red Grapefruit Juice", "Tropicana Pure Premium Grapefruit Juice", "Florida's Natural Ruby Red Grapefruit Juice"] }
  ] },
  { name: "Lemon juice", category: "Juices & Mixers", description: "Fresh lemon juice is essential for cocktails. Bottled lacks brightness. Always use fresh.", brands: ["Fresh lemons"], notes: "Whiskey Sour, Tom Collins, Gimlet, 90% of sour cocktails.",
  bottles: [
    { name: "Fresh Lemon Juice", description: "Always use fresh-squeezed lemon juice for cocktails. Bottled lacks brightness and acidity.", related: ["Bottled Lemon Juice", "Lemon concentrate"] }
  ,
    { name: "Lemon Concentrate", description: "Frozen lemon juice concentrate. Tart, acidic. Emergency backup when fresh lemons aren't available.", related: ["Fresh Lemon Juice", "Bottled Lemon Juice"] }
  ,
    { name: "ReaLemon 100% Lemon Juice", description: "America's best-known bottled lemon juice brand. Made from concentrate with added citric acid for consistent tartness. 100% juice. The standard backup when fresh lemons aren't available for Whiskey Sour and Tom Collins.", related: ["Fresh Lemon Juice", "Bottled Lemon Juice", "Lemon Concentrate"] }
  ,
    { name: "Sicilian Lemon Juice", description: "Fresh-squeezed lemon juice from Italian Femminello di Siracusa lemons grown in Sicily. Brighter, more aromatic, with a distinctive floral sweetness compared to standard Eureka lemons. The premium choice for Italian-inspired cocktails.", related: ["Fresh Lemon Juice", "Lemon Concentrate", "Bottled Lemon Juice"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lemon_juice.jpg" }
  ] },
  { name: "Fresh lemon juice", category: "Juices & Mixers", description: "Same as lemon juice — specifying fresh-squeezed as the standard.", brands: ["Fresh lemons"], notes: "Deduplicated with Lemon juice.",
  bottles: [
    { name: "Fresh Lemon Juice", description: "Fresh-squeezed lemon juice. Essential for 90% of sour cocktails.", related: ["Bottled Lemon Juice", "Lemon concentrate"] }
  ,
    { name: "Bottled Lemon Juice", description: "Bottled lemon juice (not recommended). Use only as emergency backup when fresh is unavailable.", related: ["Fresh Lemon Juice", "Lemon concentrate"] }
  ,
    { name: "Santa Cruz Organic Lemon Juice", description: "Organic bottled lemon juice from Santa Cruz. Made from 100% organic lemons with no added sugar or preservatives. A cleaner alternative to ReaLemon.", related: ["Fresh Lemon Juice", "ReaLemon 100% Lemon Juice", "Sicilian Lemon Juice"] }
  ,
    { name: "ReaLemon 100% Lemon Juice", description: "America's most recognizable bottled lemon juice brand. Made from concentrated lemon juice with added water. Consistent acidity for cocktails when fresh is unavailable.", related: ["Fresh Lemon Juice", "Lemon Concentrate", "Sicilian Lemon Juice"] }
  ,
    { name: "Sicilian Lemon Juice", description: "Premium bottled lemon juice from Sicily's Femminello lemons. Bright, aromatic, and closer to fresh-squeezed flavor. Widely used in Italian cocktails and cooking.", related: ["Fresh Lemon Juice", "ReaLemon 100% Lemon Juice", "Santa Cruz Organic Lemon Juice"] }
  ] },
  { name: "Lime juice", category: "Juices & Mixers", description: "Persian lime juice, fresh-squeezed. Bright, sharp acidity. Key for Tiki and tropical drinks.", brands: ["Fresh limes"], notes: "Daiquiri, Mojito, Margarita, Gimlet (traditional).",
  bottles: [
    { name: "Fresh Persian Lime Juice", description: "Fresh-squeezed Persian lime juice. Bright, sharp acidity. Key for Daiquiri, Mojito, and Margarita.", related: ["Bottled Lime Juice", "Lime concentrate", "Key lime juice"] }
  ,
    { name: "Bottled Lime Juice", description: "Bottled lime juice. Convenient but less bright than fresh. Acceptable for high-volume mixing.", related: ["Fresh Persian Lime Juice", "Lime concentrate", "Key lime juice"] }
  ,
    { name: "Nellie & Joe's Key West Lime Juice", description: "Bottled lime juice from Nellie & Joe's. Made from key limes grown in Florida. Tart, bright, with authentic key lime flavor. The go-to bottled option for Key Lime Pie variations and tropical drinks.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Lime Juice Concentrate"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lime_juice.jpg" }
  ,
    { name: "Santa Cruz Organic Lime Juice", description: "Organic bottled lime juice from Santa Cruz. Made from 100% organic limes with no added sugar or preservatives. A cleaner alternative to standard bottled lime juice for Margaritas and Daiquiris.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Nellie & Joe's Key West Lime Juice"] }
  ,
    { name: "Lime Juice Concentrate", description: "Frozen lime juice concentrate. Tart, acidic, shelf-stable until opened. Emergency backup when fresh limes aren't available for Daiquiri and Margarita.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Nellie & Joe's Key West Lime Juice"] }
  ] },
  { name: "Fresh lime", category: "Juices & Mixers", description: "Whole fresh lime — juiced as needed.", brands: ["Fresh limes"], notes: "Same as Lime juice.",
  bottles: [
    { name: "Fresh Persian Limes", description: "Whole fresh limes, juiced as needed. Bright, sharp citrus.", related: ["Key limes", "Bottled lime juice"] }
  ,
    { name: "Key Limes", description: "Smaller, more acidic key limes. Intense citrus flavor. Traditional for Key Lime Pie variations.", related: ["Fresh Persian Limes", "Bottled lime juice"] }
  ,
    { name: "Santa Cruz Organic Lime Juice", description: "Organic bottled lime juice from Santa Cruz. Made from 100% organic limes with no added sugar or preservatives. A cleaner alternative to standard bottled lime juice for Margaritas and Daiquiris.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Nellie & Joe's Key West Lime Juice"] }
  ,
    { name: "Nellie & Joe's Key West Lime Juice", description: "Bottled lime juice from Nellie & Joe's. Made from key limes grown in Florida. Tart, bright, with authentic key lime flavor. The go-to bottled option for Key Lime Pie variations and tropical drinks.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Santa Cruz Organic Lime Juice"] }
  ,
    { name: "Lime Juice Concentrate", description: "Frozen lime juice concentrate. Tart, acidic, shelf-stable until opened. Emergency backup when fresh limes aren't available for Daiquiri and Margarita.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Nellie & Joe's Key West Lime Juice"] }
  ] },
  { name: "Fresh lime juice", category: "Juices & Mixers", description: "Freshly squeezed lime juice. The standard for all Tiki and tropical drinks.", brands: ["Fresh limes"], notes: "Deduplicated with Lime juice.",
  bottles: [
    { name: "Fresh Persian Lime Juice", description: "Freshly squeezed lime juice. The standard for Tiki and tropical drinks.", related: ["Key lime juice", "Bottled lime juice"] }
  ,
    { name: "Bottled Lime Juice", description: "Bottled lime juice. Use only when fresh is unavailable.", related: ["Fresh Persian Lime Juice", "Lime concentrate"] }
  ,
    { name: "Santa Cruz Organic Lime Juice", description: "Organic bottled lime juice from Santa Cruz. Tart and bright, made from organic Persian limes. A convenient, consistent alternative to hand-squeezing for Margarita and Daiquiri.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Lime Juice Concentrate"] }
  ,
    { name: "ReaLime Lime Juice", description: "Bottled lime juice from ReaLime. Made from real lime juice concentrate, consistent acidity for cocktails. A widely available backup for Margarita and Mojito when fresh limes are out of season.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "Santa Cruz Organic Lime Juice"] }
  ,
    { name: "Rose's Lime Juice", description: "Sweetened lime juice cordial from Rose's. A historic mixer from 1868, known for Gimlet and Daiquiri. Use in smaller quantities due to added sugar compared to plain lime juice.", related: ["Fresh Persian Lime Juice", "Bottled Lime Juice", "ReaLime Lime Juice"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rose%27s_Lime_Juice.JPG" }
  ] },
  { name: "Orange juice", category: "Juices & Mixers", description: "Fresh orange juice for cocktails. Sweet, fruity, bright.", brands: ["Fresh oranges"], notes: "Screwdriver, Mimosa, Brass Monkey.",
  bottles: [
    { name: "Fresh Orange Juice", description: "Fresh-squeezed orange juice. Sweet, fruity, bright. Far superior to carton for cocktails.", related: ["Bottled orange juice", "NFC orange juice"] }
  ,
    { name: "Minute Maid Orange Juice", description: "Popular pasteurized orange juice from The Coca-Cola Company. Consistent sweet-citrus flavor. Widely available in cartons. A reliable backup when fresh isn't practical.", related: ["Fresh Orange Juice", "Tropicana Pure Premium", "NFC orange juice"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Minute_Maid_Orange_juice.jpeg" }
  ,
    { name: "Tropicana Pure Premium", description: "Premium not-from-concentrate orange juice from Tropicana. Pure squeezed taste with no added sugar or preservatives. The leading premium carton OJ for Mimosa and Screwdriver.", related: ["Fresh Orange Juice", "Minute Maid Orange Juice", "NFC orange juice"] }
  ,
    { name: "Bottled Orange Juice", description: "Bottled orange juice. Convenient but less fresh-tasting than fresh-squeezed.", related: ["Fresh Orange Juice", "NFC orange juice"] }
  ] },
  { name: "Fresh orange juice", category: "Juices & Mixers", description: "Fresh-squeezed orange juice. Superior to carton for cocktails.", brands: ["Fresh oranges"], notes: "Deduplicated with Orange juice.",
  bottles: [
    { name: "Fresh Orange Juice", description: "Fresh-squeezed orange juice. The preferred version for Mimosa and Screwdriver.", related: ["Bottled orange juice", "NFC orange juice"] }
  ,
    { name: "NFC Orange Juice", description: "Not-from-concentrate orange juice. Fresher than reconstituted carton. Good for Mimosa.", related: ["Fresh Orange Juice", "Bottled orange juice"] }
  ,
    { name: "Simply Orange Juice", description: "Not-from-concentrate orange juice from Simply Beverages. Smooth, sweet, with no added sugar or preservatives. Widely available in distinctive clear bottles. A reliable alternative when fresh isn't possible.", related: ["Fresh Orange Juice", "NFC Orange Juice", "Tropicana Pure Premium Orange Juice"] }
  ,
    { name: "Tropicana Pure Premium Orange Juice", description: "Premium not-from-concentrate orange juice from Tropicana. Pure squeezed taste with no added sugar or preservatives. A staple for Mimosa and other brunch cocktails.", related: ["Fresh Orange Juice", "Simply Orange Juice", "NFC Orange Juice"] }
  ,
    { name: "Bottled Orange Juice", description: "Commercially bottled orange juice. Convenient for bars and home use but less vibrant than fresh-squeezed. Fine for high-volume cocktails where convenience matters.", related: ["Fresh Orange Juice", "NFC Orange Juice", "Simply Orange Juice"] }
  ] },
  { name: "Papaya juice", category: "Juices & Mixers", description: "Tropical juice from papaya. Sweet, mild, creamy texture. Rare in classic cocktails.", brands: ["Fresh or canned"], notes: "Tiki drinks, tropical variations.",
  bottles: [
    { name: "Fresh Papaya Juice", description: "Fresh papaya juice. Sweet, mild, creamy tropical flavor. Best fresh or frozen.", related: ["Canned papaya nectar", "Papaya puree"] }
  ,
    { name: "Canned Papaya Nectar", description: "Canned papaya nectar. Sweet, mild, creamy tropical. Convenient when fresh papaya isn't available.", related: ["Fresh Papaya Juice", "Papaya puree"] }
  ,
    { name: "Tropicana Papaya Nectar", description: "Papaya nectar from Tropicana. Sweet, mild, tropical flavor with a smooth, creamy texture. Available in cans — a convenient option for Tiki drinks and tropical cocktail variations.", related: ["Fresh Papaya Juice", "Canned Papaya Nectar"] }
  ,
    { name: "Dole Papaya Nectar", description: "Papaya nectar from Dole. Sweet, mild, tropical with smooth creamy texture. Convenient canned format for Tiki drinks and tropical cocktail variations.", related: ["Fresh Papaya Juice", "Canned Papaya Nectar", "Tropicana Papaya Nectar"] }
  ,
    { name: "Goya Papaya Nectar", description: "Papaya nectar from Goya. Sweet, mild, tropical papaya flavor. Widely available canned format for tropical cocktails and punches.", related: ["Fresh Papaya Juice", "Canned Papaya Nectar", "Dole Papaya Nectar"] }
  ,
    { name: "Jumex Papaya Nectar", description: "Mexican papaya nectar from Jumex. Sweet, mild, tropical papaya character in convenient single-serve cans. Good for Tiki variations and tropical highballs.", related: ["Fresh Papaya Juice", "Canned Papaya Nectar", "Goya Papaya Nectar"] }
  ] },
  { name: "Passion fruit juice", category: "Juices & Mixers", description: "Tart, aromatic juice from passion fruit pulp. Intensely tropical.", brands: ["Fresh or frozen puree"], notes: "Passion fruit Daiquiri, certain Tiki drinks.",
  bottles: [
    { name: "Fresh Passion Fruit Purée", description: "Fresh passion fruit pulp. Tart, aromatic, intensely tropical. Use frozen purée when fresh is unavailable.", related: ["Frozen passion fruit puree", "Passion fruit juice"] }
  ,
    { name: "Frozen Passion Fruit Puree", description: "Frozen passion fruit puree. Tart, aromatic, intensely tropical. Use when fresh pulp is unavailable.", related: ["Fresh Passion Fruit Purée", "Passion fruit juice"] }
  ,
    { name: "Passoã Passion Fruit Liqueur", description: "French passion fruit liqueur (15% ABV). Smooth, sweet-tart tropical fruit character with a clean finish. Essential in a Porn Star Martini or mixed with prosecco.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo%C3%A3_bottle.jpg", related: ["Fresh Passion Fruit Purée", "Frozen Passion Fruit Puree"] }
  ,
    { name: "Fresh Passion Fruit Juice", description: "Freshly pressed or cold-pressed passion fruit juice. Bright, tart, intensely aromatic. Use for premium Daiquiris and tropical Collins-style drinks.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Passion_Fruit_juice.jpg", related: ["Fresh Passion Fruit Purée", "Frozen Passion Fruit Puree"] }
  ,
    { name: "Passion Fruit Nectar", description: "Sweetened passion fruit nectar blend (often 30% juice). Milder and more consistent than pure juice; works well in punches and non-alcoholic tropical mixes.", related: ["Fresh Passion Fruit Purée", "Frozen Passion Fruit Puree"] }
  ] },
  { name: "Pineapple juice", category: "Juices & Mixers", description: "Sweet, tropical juice. Best when fresh, acceptable from can for mixing.", brands: ["Dole, fresh"], notes: "Piña Colada, Jungle Bird, Hawaii Five-O.",
  bottles: [
    { name: "Dole Pineapple Juice", description: "Classic canned pineapple juice. Sweet, tropical, widely available. Good for mixing.", related: ["Fresh pineapple juice", "Pineapple nectar"] }
  ,
    { name: "Fresh Pineapple Juice", description: "Fresh-squeezed pineapple juice. Bright, tropical, superior to canned for Piña Colada.", related: ["Dole Pineapple Juice", "Pineapple nectar"] }
  ,
    { name: "Looza Pineapple Juice", description: "Belgian canned pineapple juice from Looza. Sweet, tropical, with a distinctive can design. Widely available in Europe; a reliable mixing juice for Pi\u00f1a Colada and tropical cocktails.", related: ["Dole Pineapple Juice", "Fresh Pineapple Juice", "Pineapple nectar"] }
  ,
    { name: "Libby's Pineapple Juice", description: "American canned pineapple juice from Libby's. Sweet, consistent quality, widely available in North America. A reliable mixer for tropical cocktails and Pi\u00f1a Colada.", related: ["Dole Pineapple Juice", "Fresh Pineapple Juice", "Pineapple nectar"] }
  ,
    { name: "Tropicana Pineapple Juice", description: "Premium not-from-concentrate pineapple juice from Tropicana. Bright tropical flavor. A step up from standard canned juice for premium tropical drinks.", related: ["Dole Pineapple Juice", "Fresh Pineapple Juice", "Pineapple nectar"] }
  ] },
  { name: "Clamato juice", category: "Juices & Mixers", description: "Tomato juice + clam broth blend. Savory, briny. Used in savory cocktails.", brands: ["Clamato ( Mott's )"], notes: "Michelada, Caesar (Canadian Bloody Mary).",
  bottles: [
    { name: "Clamato Tomato Juice Cocktail", description: "Tomato juice blended with clam broth. Savory, briny. The essential base for Caesar and Michelada.", related: ["Mott's Clamato", "Tomato juice"] }
  ,
    { name: "Mott's Clamato", description: "Clamato from Mott's. Tomato juice blended with clam broth. Savory, briny. The essential base for Caesar.", related: ["Clamato Tomato Juice Cocktail", "Tomato juice"] }
  , { name: "Clamato Original", description: "The classic tomato juice + clam broth blend from Mott's. Savory, briny, with a hint of sea salt. The original Caesar mixer.", related: ["Mott's Clamato", "Clamato Tomato Juice Cocktail"] }
  , { name: "Clamato The Works", description: "Spicy Clamato variant with lime and hot sauce already blended. Savory, briny, with a kick. The all-in-one Caesar mixer.", related: ["Mott's Clamato", "Clamato Original"] }
  ] },
  { name: "Tomato juice", category: "Juices & Mixers", description: "Savory juice from tomatoes. Base for Bloody Mary and savory cocktails.", brands: ["Campbell's, fresh"], notes: "Bloody Mary, Bloody Caesar.",
  bottles: [
    { name: "Campbell's Tomato Juice", description: "Classic tomato juice. Savory, smooth. The standard base for Bloody Mary.", related: ["Fresh tomato juice", "Low-sodium tomato juice"] }
  ,
    { name: "V8 Vegetable Juice", description: "V8 vegetable juice. Tomato-based with other vegetables. Savory alternative for Bloody Mary.", related: ["Campbell's Tomato Juice", "Fresh tomato juice"] }
  ,
    { name: "Hunt's Tomato Juice", description: "Classic California tomato juice from Hunt's. Smooth, savory, with bright tomato flavor. A reliable Bloody Mary base widely available in the US.", related: ["Campbell's Tomato Juice", "V8 Vegetable Juice", "Fresh tomato juice"] }
  ,
    { name: "Muir Glen Tomato Juice", description: "Organic tomato juice from Muir Glen, grown in California. Clean, fresh tomato taste with no added sugar. A premium option for Bloody Mary and Virgin Mary.", related: ["Campbell's Tomato Juice", "Hunt's Tomato Juice", "Fresh tomato juice"] }
  ] },
  { name: "Cola", category: "Juices & Mixers", description: "Carbonated cola drink. Used as a mixer in highball-style cocktails.", brands: ["Coca-Cola", "Pepsi", "Mexican Coke (real sugar)"], notes: "Cuba Libre, Long Island Iced Tea.",
  bottles: [
    { name: "Mexican Coca-Cola", description: "Coca-Cola made with real sugar (sucrose). Richer, more complex than HFCS versions. Essential for authentic Cuba Libre.", related: ["Coca-Cola", "Pepsi", "Coca-Cola Zero Sugar"] },
    { name: "Coca-Cola", description: "The world's most popular cola. Classic caramel, vanilla, and spice notes.", related: ["Mexican Coca-Cola", "Pepsi", "Diet Coke"] },
    { name: "Pepsi", description: "Classic cola. Slightly sweeter than Coca-Cola. Fine for Long Island Iced Tea.", related: ["Coca-Cola", "Diet Pepsi"] },
    { name: "Coca-Cola Zero Sugar", description: "Zero-sugar cola from Coca-Cola. Same classic taste without calories. A popular mixer for Long Island Iced Tea and spirit-forward highballs.", related: ["Coca-Cola", "Diet Coke", "Pepsi"] },
    { name: "Diet Coke", description: "Sugar-free cola from Coca-Cola. Lighter, crisper profile than Coke Zero. A reliable mixer for highballs where fewer calories are desired.", related: ["Coca-Cola", "Coca-Cola Zero Sugar", "Pepsi"] },
    { name: "Diet Pepsi", description: "Sugar-free version of Pepsi. Slightly sweeter aftertaste than Diet Coke. Works well in Long Island Iced Tea and mixed drinks.", related: ["Pepsi", "Coca-Cola", "Diet Coke"] }
  ] },
  { name: "Soda water", category: "Juices & Mixers", description: "Carbonated water with no added flavor. Essential for highballs, Tom Collins, Tom Collins.", brands: ["Schweppes, Pellegrino, Topo Chico"], notes: "Tom Collins, Mojito top-up, Americano top-up, Rickey.",
  bottles: [
    { name: "Topo Chico Sparkling Water", description: "Mexican mineral water. Naturally sparkling, clean, crisp. Perfect for highballs and Palomas.", related: ["Perrier", "Pellegrino", "Schweppes Soda Water"] },
    { name: "Schweppes Soda Water", description: "Classic soda water. Carbonated, neutral. Essential for Tom Collins and Americano.", related: ["Topo Chico", "Pellegrino", "Club Soda"] }
  ,
    { name: "Perrier Sparkling Water", description: "French natural mineral sparkling water. Lightly carbonated with crisp mineral notes. A premium mixer for highballs and Tom Collins.", related: ["S.Pellegrino Sparkling Water", "Topo Chico Sparkling Water", "Club Soda"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/San_Pellegrino_bottle_for_sparkling_water_.jpg" }
  ,
    { name: "S.Pellegrino Sparkling Water", description: "Italian sparkling mineral water from San Pellegrino Terme. Bright, clean bubbles with balanced mineral content. Classic Italian mixer for Americano and Spritz.", related: ["Perrier Sparkling Water", "Topo Chico Sparkling Water", "Schweppes Soda Water"] }
  ,
    { name: "Club Soda", description: "Carbonated water with added sodium bicarbonate. Neutral, slightly alkaline. A reliable soda water for highballs and long drinks.", related: ["Schweppes Soda Water", "Perrier Sparkling Water", "S.Pellegrino Sparkling Water"] }
  ] },
  { name: "Sparkling water", category: "Juices & Mixers", description: "Same as soda water — may include mineral/sparkling waters like Topo Chico or Perrier.", brands: ["Topo Chico", "Perrier", "Pellegrino", "Schweppes"], notes: "Deduplicated with Soda water.",
  bottles: [
    { name: "Perrier Sparkling Water", description: "French natural mineral water. Lightly carbonated, crisp, with mineral notes.", related: ["Pellegrino", "Topo Chico", "LaCroix"] },
    { name: "Schweppes Soda Water", description: "Classic carbonated soda water. Neutral, slightly alkaline. The reliable workhorse for highballs and long drinks since 1783.", related: ["Perrier Sparkling Water", "Club Soda", "Topo Chico Sparkling Water"] },
    { name: "Topo Chico Sparkling Water", description: "Mexican mineral water. Strong bubbles, clean taste. Great for Palomas.", related: ["Perrier", "Pellegrino", "Schweppes"] }
  ] },
  { name: "Ginger beer", category: "Juices & Mixers", description: "Spicy, sweet ginger-flavored carbonated drink. Non-alcoholic (unlike ginger ale). Stronger ginger kick.", brands: ["Fever-Tree Ginger Beer", "Bundaberg", "Gosling's Stormy", "Q Tonic Ginger Beer"], notes: "Dark 'n' Stormy, Moscow Mule.",
  bottles: [
    { name: "Fever-Tree Ginger Beer", description: "Premium British ginger beer. Made from three types of ginger. Spicy, intense ginger kick. The standard for Moscow Mule.", related: ["Bundaberg Ginger Beer", "Gosling's Stormy Ginger Beer", "Q Tonic Ginger Beer"] },
    { name: "Bundaberg Ginger Beer", description: "Australian ginger beer brewed from real ginger. Spicy, sweet, strong ginger finish. Wikimedia image: https://upload.wikimedia.org/wikipedia/commons/5/5f/Bundaberg%2C_ginger_beer.jpg", related: ["Fever-Tree Ginger Beer", "Gosling's Stormy Ginger Beer", "Q Tonic Ginger Beer"] },
    { name: "Q Tonic Ginger Beer", description: "Dutch-made ginger beer from Q Tonic. Sharp, clean ginger spice with a dry finish. Used in craft cocktails and premium mixers.", related: ["Fever-Tree Ginger Beer", "Bundaberg Ginger Beer"] },
    { name: "Gosling's Stormy Ginger Beer", description: "Bermuda-made ginger beer from the Gosling's rum family. Bold, spicy ginger character. Essential for the Dark 'n' Stormy.", related: ["Fever-Tree Ginger Beer", "Bundaberg Ginger Beer"] }
    ,
    { name: "Barritt's Bermuda Ginger Beer", description: "Bermudan ginger beer from Barritt's. Bold, spicy, with a strong ginger kick. The authentic ginger beer for a Dark 'n' Stormy when you want the local pairing.", related: ["Gosling's Stormy Ginger Beer", "Fever-Tree Ginger Beer", "Bundaberg Ginger Beer"] }
    ,
    { name: "Reed's Extra Ginger Brew Ginger Beer", description: "American ginger beer from Reed's. Extra spicy ginger brew made with fresh ginger root. Intense ginger heat for Moscow Mules.", related: ["Fever-Tree Ginger Beer", "Bundaberg Ginger Beer", "Gosling's Stormy Ginger Beer"] }
  ] },
  { name: "Lemonade", category: "Juices & Mixers", description: "Sweetened lemon drink. Often used in British/Irish cocktails.", brands: ["Fresh or commercial"], notes: "Lemonade & Gin, certain Collins variations.",
  bottles: [
    { name: "Fresh Lemonade", description: "Fresh-squeezed lemonade. Sweet, bright, tart. Mix with gin or sparkling water.", related: ["Store-bought lemonade", "Frozen lemonade concentrate"] }
  ,
    { name: "Store-bought Lemonade", description: "Commercial lemonade. Sweetened, ready to drink. Convenient for Lemonade & Gin when fresh isn't available.", related: ["Fresh Lemonade", "Frozen lemonade concentrate"] }
  ,
    { name: "Frozen Lemonade Concentrate", description: "Concentrated frozen lemonade. Thaw and dilute for convenient, consistent lemonade. Common brands: Minute Maid, McCain.", related: ["Fresh Lemonade", "Store-bought lemonade"] }
  ,
    { name: "Pellegrino Limonata", description: "Italian sparkling lemon soda from Pellegrino. Bright, crisp lemon flavor with bubbles. Used in spritzes and Italian-inspired cocktails.", related: ["Store-bought Lemonade", "Schweppes Lemonade"] }
  ,
    { name: "Schweppes Lemonade", description: "British-style lemonade from Schweppes. Sweet, fizzy lemon drink. Classic mixer for Pimm's Cup and Collins variations.", related: ["Store-bought Lemonade", "Pellegrino Limonata"] }
  ] },
  { name: "Hot coffee", category: "Juices & Mixers", description: "Freshly brewed hot coffee. Used as a base or addition in coffee cocktails.", brands: ["Fresh brew"], notes: "Irish Coffee, Espresso Martini.",
  bottles: [
    { name: "Freshly Brewed Espresso", description: "Fresh espresso shot. Concentrated coffee flavor for Espresso Martini and Irish Coffee.", related: ["Cold brew concentrate", "Strong brewed coffee"] }
  ,
    { name: "Cold Brew Concentrate", description: "Cold-brewed coffee concentrate. Smooth, less acidic than hot brew. Great for Espresso Martini variations.", related: ["Freshly Brewed Espresso", "Strong brewed coffee"] }
  ,
    { name: "Lavazza Super Crema Espresso", description: "Italian medium-roast espresso from Lavazza. Balanced, smooth, with notes of hazelnut and brown sugar. A crowd-pleasing all-purpose espresso for Espresso Martini and Irish Coffee.", related: ["Freshly Brewed Espresso", "Cold Brew Concentrate"] }
  ,
    { name: "Starbucks Pike Place Roast", description: "American medium-roast coffee from Starbucks. Smooth, well-balanced, with subtle notes of cocoa and toasted nut. A reliable hot coffee base for Irish Coffee.", related: ["Freshly Brewed Espresso", "Cold Brew Concentrate"] }
  ,
    { name: "illy Classico Espresso", description: "Italian medium-roast espresso from illy. Arabica-only, balanced, with notes of chocolate and caramel. Premium choice for espresso-forward cocktails.", related: ["Freshly Brewed Espresso", "Lavazza Super Crema Espresso"] }
  ] },
  { name: "Hot sauce", category: "Juices & Mixers", description: "Spicy condiment sauce. Used in small quantities for heat in savory cocktails.", brands: ["Tabasco", "Cholula", "Sriracha", "Valentina"], notes: "Michelada, Bloody Maria, Bloody Caesar.",
  bottles: [
    { name: "Tabasco Original Red Sauce", description: "The classic Louisiana hot sauce. Vinegar-forward, spicy. 2–3 dashes for Bloody Mary.", related: ["Cholula", "Sriracha", "Valentina"] },
    { name: "Cholula Hot Sauce", description: "Mexican hot sauce with peppers and spices. Medium heat, rich flavor.", related: ["Tabasco", "Sriracha", "Valentina"] }
  ,
    { name: "Flying Goose Sriracha Hot Sauce", description: "Thai-style sriracha sauce with garlic and chili. Medium heat, smooth texture. The classic rooster-brand sriracha for Bloody Mary variations and Asian-inspired cocktails.", related: ["Tabasco Original Red Sauce", "Cholula Hot Sauce"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Flying_goose_sriracha_th.jpg" }
  ] },
  { name: "Worcestershire sauce", category: "Juices & Mixers", description: "Fermented savory condiment. Umami, vinegar, anchovy. Used in Bloody Mary-style drinks.", brands: ["Lea & Perrins"], notes: "Bloody Mary, Bloody Caesar — 2–3 dashes.",
  bottles: [
    { name: "Lea & Perrins Worcestershire Sauce", description: "The original Worcestershire sauce. Umami, vinegar, anchovy, tamarind. Essential for Bloody Mary — 2–3 dashes.", related: ["Wizard Worcestershire", "Annie's Naturals"] }
  ,
    { name: "Wizard Worcestershire Sauce", description: "Worcestershire sauce alternative from Wizard. Umami, vinegar, anchovy. Fine for Bloody Mary when Lea & Perrins is unavailable.", related: ["Lea & Perrins Worcestershire Sauce", "Annie's Naturals"] }
  ,
    { name: "Annie's Naturals Worcestershire Sauce", description: "Organic Worcestershire sauce from Annie's Naturals. Milder, less anchovy-forward than Lea & Perrins. Made with organic vinegar and spices. A gentler Bloody Mary option.", related: ["Lea & Perrins Worcestershire Sauce", "Wizard Worcestershire Sauce"] }
  ,
    { name: "Heinz Worcestershire Sauce", description: "American Worcestershire sauce from Heinz. Tangy, umami-rich, with vinegar, molasses, and anchovy. A widely available alternative for Bloody Mary.", related: ["Lea & Perrins Worcestershire Sauce", "Annie's Naturals Worcestershire Sauce"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lea_%26_Perrins_worcestershire_sauce_150ml.jpg" }
  ] },

  // SYRUPS & SWEETENERS
  { name: "Cinnamon syrup", category: "Syrups & Sweeteners", description: "Simple syrup infused with cinnamon sticks. Warm, spicy sweetener.", brands: ["Homemade (1:1 sugar:water + cinnamon sticks)"], notes: "Hot Toddies, certain Fall/Winter cocktails.",
  bottles: [
    { name: "Homemade Cinnamon Syrup", description: "Simple syrup infused with cinnamon sticks. Warm, spicy sweetener for Hot Toddies.", related: ["Monin Cinnamon Syrup", "Fee Brothers Cinnamon"] }
  ,
    { name: "Monin Cinnamon Syrup", description: "Premium cinnamon syrup from Monin. Warm, spicy sweetener for Hot Toddies and Fall cocktails.", related: ["Homemade Cinnamon Syrup", "Fee Brothers Cinnamon"] }
  , { name: "Fee Brothers Cinnamon Syrup", description: "American cinnamon syrup from Fee Brothers. Warm, spicy cinnamon sweetener. A classic alternative to Monin for Hot Toddies and Fall cocktails.", related: ["Homemade Cinnamon Syrup", "Monin Cinnamon Syrup"] }
  ,
    { name: "DaVinci Gourmet Cinnamon Syrup", description: "Cinnamon syrup from DaVinci Gourmet. Warm, spicy sweetener for Hot Toddies, lattes, and Fall cocktails. Widely used in coffee shops.", related: ["Monin Cinnamon Syrup", "Fee Brothers Cinnamon Syrup"] }
  ,
    { name: "Torani Cinnamon Syrup", description: "Cinnamon syrup from Torani. Warm, spicy sweetener for Hot Toddies, chai lattes, and seasonal cocktails. Popular in cafes.", related: ["Monin Cinnamon Syrup", "Fee Brothers Cinnamon Syrup"] }
  ,
    { name: "1883 Cinnamon Syrup", description: "Cinnamon syrup from 1883 (Maison Routin). Warm, spicy sweetener for Hot Toddies and Fall cocktails. French-made.", related: ["Monin Cinnamon Syrup", "Fee Brothers Cinnamon Syrup"] }
  ] },
  { name: "Honey syrup", category: "Syrups & Sweeteners", description: "Honey thinned with hot water (usually 2:1 honey:water) for pourability. Floral, rich sweetness.", brands: ["Homemade"], notes: "Bee's Knees, Gold Rush, Penicillin.",
  bottles: [
    { name: "Homemade Honey Syrup", description: "Honey thinned with hot water (usually 2:1 honey:water). Floral, rich sweetness for Bee's Knees and Penicillin.", related: ["Monin Honey Syrup", "Small Hand Foods Honey Syrup"] }
  ,
    { name: "Monin Honey Syrup", description: "Honey syrup from Monin. Ready-to-use floral sweetener for Bee's Knees and Gold Rush.", related: ["Homemade Honey Syrup", "Small Hand Foods Honey Syrup"] }
  ,
    { name: "Small Hand Foods Honey Syrup", description: "Craft honey syrup from Small Hand Foods. Floral sweetener for Bee's Knees and Gold Rush.", related: ["Homemade Honey Syrup", "Monin Honey Syrup"] }
  ,
    { name: "Fee Brothers Honey Syrup", description: "American honey syrup from Fee Brothers. Floral sweetener for cocktails.", related: ["Homemade Honey Syrup", "Monin Honey Syrup"] }
  ,
    { name: "Monin Organic Honey Syrup", description: "Organic honey syrup from Monin. Certified organic floral sweetener.", related: ["Homemade Honey Syrup", "Monin Honey Syrup"] }
  ] },
  { name: "Honey-ginger syrup", category: "Syrups & Sweeteners", description: "Honey syrup infused with fresh ginger. Spicy, warming sweetener.", brands: ["Homemade"], notes: "Penicillin, Dark 'n' Stormy variation.",
  bottles: [
    { name: "Homemade Honey-Ginger Syrup", description: "Honey syrup infused with fresh ginger. Spicy, warming sweetener for Penicillin.", related: ["Honey syrup", "Ginger syrup"] }
  ,
    { name: "Monin Honey-Ginger Syrup", description: "Honey syrup infused with ginger from Monin. Spicy, warming sweetener for Penicillin variations.", related: ["Homemade Honey-Ginger Syrup", "Ginger syrup"] }
  ,
    { name: "Liber Honey-Ginger Syrup", description: "Honey-ginger cocktail syrup from Liber. Sweet honey balanced with fresh ginger heat. Designed for Penicillin and ginger-forward cocktails.", related: ["Homemade Honey-Ginger Syrup", "Monin Honey-Ginger Syrup"] }
  ] },
  { name: "Orgeat syrup", category: "Syrups & Sweeteners", description: "Almond-orange blossom water syrup. Nutty, floral, essential in Tiki drinks.", brands: ["Monin Orgeat", "Fee Brothers", "Small Hand Foods"], notes: "Maï Taï, Scorpion, Saturn.",
  bottles: [
    { name: "Monin Orgeat Syrup", description: "Premium almond-orange blossom syrup. Nutty, floral. Essential for Mai Tai and Scorpion.", related: ["Fee Brothers Orgeat", "Small Hand Foods Orgeat"] },
    { name: "Small Hand Foods Orgeat", description: "Craft orgeat syrup. Made with California almonds and orange blossom water.", related: ["Monin Orgeat", "Fee Brothers"] }
  ,
    { name: "Fee Brothers Orgeat Syrup", description: "American orgeat syrup from Fee Brothers. Almond-orange blossom profile. Nutty, floral, reliable for Mai Tai and Tiki drinks.", related: ["Monin Orgeat Syrup", "Small Hand Foods Orgeat"] }
  ,
    { name: "St-Germain Orgeat Alternative", description: "Premium French orgeat-style syrup from St-Germain. Almond-forward with subtle orange blossom. A craft alternative for Mai Tai and Scorpion.", related: ["Monin Orgeat Syrup", "Small Hand Foods Orgeat"] }
  ] },
  { name: "Raspberry syrup", category: "Syrups & Sweeteners", description: "Syrup made from raspberries. Tart-sweet, deep pink-red.", brands: ["Monin", "Fee Brothers", "Homemade"], notes: "Raspberry Collins, certain Sours.",
  bottles: [
    { name: "Monin Raspberry Syrup", description: "French raspberry syrup. Tart-sweet, deep pink. Great for Raspberry Collins.", related: ["Fee Brothers Raspberry", "Homemade raspberry syrup"] }
  ,
    { name: "Fee Brothers Raspberry Syrup", description: "American raspberry syrup from Fee Brothers. Tart-sweet, deep pink. Great for Raspberry Collins.", related: ["Monin Raspberry Syrup", "Homemade raspberry syrup"] }
  ,
    { name: "Kittl Raspberry Syrup with Pulp", description: "Czech raspberry syrup with real fruit pulp from Kitl. Rich, tart-sweet, deep red color. Great for Collins and Sours.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kittl_Syrob_Malinovy_S_Duzninou.jpg", related: ["Monin Raspberry Syrup", "Fee Brothers Raspberry Syrup"] }
  ,
    { name: "Teisseire Raspberry Syrup", description: "French raspberry syrup from Teisseire. Natural fruit flavor, balanced sweet-tart profile. Mixes clear in cold drinks.", related: ["Monin Raspberry Syrup", "Fee Brothers Raspberry Syrup"] }
  ] },
  { name: "Simple syrup", category: "Syrups & Sweeteners", description: "Equal parts sugar and water, dissolved. The standard neutral sweetener for cocktails. 1:1 ratio.", brands: ["Homemade", "Monin Simple Syrup"], notes: "Almost every cocktail that needs sweetness. ¾ oz per sour cocktail.",
  bottles: [
    { name: "Monin Simple Syrup", description: "Neutral 1:1 sugar syrup. Standard sweetener for cocktails.", related: ["Homemade simple syrup", "Rich simple syrup"] },
    { name: "Fee Brothers Simple Syrup", description: "American 1:1 simple syrup from Fee Brothers. Neutral sugar syrup for cocktails. A reliable alternative to Monin for high-volume bars.", related: ["Monin Simple Syrup", "Homemade Simple Syrup"] },
    { name: "Monin Rich Simple Syrup", description: "Rich 2:1 sugar-to-water syrup from Monin. Sweeter, more viscous than standard simple syrup. Used in spirit-forward cocktails that need extra sweetness.", related: ["Monin Simple Syrup", "Homemade Simple Syrup", "Demerara Syrup"] },
  ] },
  { name: "Sugar", category: "Syrups & Sweeteners", description: "Granulated white sugar. Used for Old Fashioned muddling, sugar rims, or making simple syrup.", brands: ["Any white granulated sugar"], notes: "Old Fashioned (muddled with bitters), rimming glasses.",
  bottles: [
    { name: "White Granulated Sugar", description: "Standard white sugar. Used for Old Fashioned muddling and simple syrup.", related: ["Demerara sugar", "Raw sugar"] }
  ,
    { name: "Demerara Sugar", description: "Raw cane sugar with large amber crystals. Rich molasses flavor. Perfect for Old Fashioned muddling.", related: ["White Granulated Sugar", "Raw sugar"] }
  ,
    { name: "Turbinado Sugar", description: "Partially refined raw cane sugar with large golden crystals. Light caramel notes. Used for Old Fashioned muddling and specialty rims.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Turbinado_sugar.jpg", related: ["White Granulated Sugar", "Demerara Sugar"] }
  ,
    { name: "Brown Sugar", description: "Refined white sugar with added molasses. Soft, moist texture with caramel flavor. Used in shaken cocktails and syrups.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brown_sugar.jpg", related: ["White Granulated Sugar", "Demerara Sugar"] }
  ] },
  { name: "Sugar cube", category: "Syrups & Sweeteners", description: "Compressed sugar cubes. Traditional for Old Fashioned — muddled with bitters.", brands: ["Any sugar cube brand"], notes: "Old Fashioned — standard presentation.",
  bottles: [
    { name: "Classic Sugar Cubes", description: "Compressed white sugar cubes. Traditional for Old Fashioned — muddled with bitters.", related: ["Demerara sugar cubes", "Large sugar cubes"] }
  ,
    { name: "Demerara Sugar Cubes", description: "Large demerara sugar cubes. Rich molasses flavor. The premium choice for Old Fashioned.", related: ["Classic Sugar Cubes", "Large sugar cubes"] }
  ,
    { name: "Tate & Lyle Sugar Cubes", description: "Classic British sugar cubes from Tate & Lyle. White refined sugar, compressed into cubes. The original sugar cube brand, widely available in the UK and internationally.", related: ["Classic Sugar Cubes", "Demerara Sugar Cubes"] }
  ,
    { name: "Rohm Sugar Cubes", description: "German-produced sugar cubes from Rohm. Refined white sugar compressed into uniform cubes. A reliable, widely distributed option for Old Fashioned preparation.", related: ["Classic Sugar Cubes", "Demerara Sugar Cubes"] }
  ] },

  // FRESH & GARNISH
  { name: "Celery salt", category: "Fresh & Garnish", description: "Coarse salt blended with ground celery seeds. Savory, briny rim salt.", brands: ["McCormick", "Diamond Crystal"], notes: "Bloody Caesar rim, Bloody Mary rim.",
  bottles: [
    { name: "McCormick Celery Salt", description: "Coarse salt blended with ground celery seeds. Savory, briny. Perfect for Bloody Caesar rim.", related: ["Diamond Crystal Celery Salt", "Frontier Celery Salt"] }
  ,
    { name: "Frontier Celery Salt", description: "Celery salt from Frontier. Coarse salt with ground celery seeds. Organic option for Bloody Caesar rim.", related: ["McCormick Celery Salt", "Diamond Crystal Celery Salt"] }
  ,
    { name: "Diamond Crystal Celery Salt", description: "Celery salt from Diamond Crystal. Coarse salt with ground celery seeds. Classic choice for Bloody Caesar rim.", related: ["McCormick Celery Salt", "Frontier Celery Salt"] }
  ,
    { name: "Lawry's Celery Salt", description: "Celery salt from Lawry's. Coarse salt blended with ground celery seeds. A widely recognized seasoning blend for Bloody Caesar and Bloody Mary rims.", related: ["McCormick Celery Salt", "Diamond Crystal Celery Salt"] }
  ,
    { name: "Badia Celery Salt", description: "Celery salt from Badia. Coarse salt with ground celery seeds. Bold, affordable seasoning blend for Bloody Caesar rim and savory cocktails.", related: ["McCormick Celery Salt", "Diamond Crystal Celery Salt"] }
  ] },
  { name: "Cucumber slices", category: "Fresh & Garnish", description: "Fresh cucumber, thinly sliced. Cool, watery, mild flavor for garnish or muddling.", brands: ["Fresh"], notes: "Hendrick's garnish, Pimm's Cup garnish.",
  bottles: [
    { name: "Persian Cucumber", description: "Small, crisp Persian cucumber with thin skin and minimal seeds. Sweet, mild, and refreshing. A reliable garnish alternative when English cucumber is unavailable.", related: ["Fresh Cucumber", "English cucumber"] }
  ,
    { name: "Kirby Cucumber", description: "Small, firm American pickling cucumber. Crisp texture and mild flavor. Excellent for muddling in savory cocktails.", related: ["Fresh Cucumber", "English cucumber"] }
  ,
    { name: "Fresh Cucumber", description: "Fresh cucumber, thinly sliced. Cool, watery, mild. Classic Hendrick's and Pimm's garnish.", related: ["English cucumber", "Persian cucumber"] }
  ,
    { name: "English Cucumber", description: "English cucumber. Thin-skinned, seedless, mild. The premium choice for Hendrick's garnish.", related: ["Fresh Cucumber", "Persian cucumber"] }
  ,
    { name: "Japanese Cucumber", description: "Japanese cucumber (kyuri). Crisp, mild, thin-skinned. Popular in East Asian cuisine and cocktails. Refreshing garnish with minimal seeds.", related: ["English Cucumber", "Persian cucumber"] }
  ,
    { name: "Armenian Cucumber", description: "Armenian cucumber (yard-long cucumber). Crisp, sweet, burpless variety with thin skin. Excellent for muddling and garnish in refreshing cocktails.", related: ["English Cucumber", "Persian cucumber"] }
  ] },
  { name: "Egg white", category: "Fresh & Garnish", description: "Fresh egg white for foaming cocktails. Dry shake (no ice) to emulsify, then add ice and shake again.", brands: ["Fresh eggs"], notes: "Whiskey Sour, Gin Sour, Clover Club — ¾–1 egg white per cocktail.",
  bottles: [
    { name: "Fresh Egg White", description: "Fresh egg white for foaming cocktails. Dry shake (no ice) to emulsify, then add ice and shake again.", related: ["Aquafaba (vegan alternative)", "Pasteurized egg whites"] }
  ,
    { name: "Aquafaba", description: "Chickpea brine. Vegan alternative to egg white for foaming cocktails. 3 tbsp aquafaba ≈ 1 egg white.", related: ["Fresh Egg White", "Pasteurized egg whites"] }
  ,
    { name: "Pasteurized Egg Whites", description: "Pasteurized liquid egg whites. Safe for cocktails without salmonella risk. Available in cartons. Same foaming properties as fresh egg white.", related: ["Fresh Egg White", "Aquafaba"], image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pasteurized_egg_white.jpg" }
  ] },
  { name: "Fresh blackberries", category: "Fresh & Garnish", description: "Fresh blackberries for muddling, garnish, or as a flavor component.", brands: ["Fresh seasonal"], notes: "Bramble garnish, muddled in Berry Sours.",
  bottles: [
    { name: "Fresh Blackberries", description: "Fresh blackberries for muddling or garnish in Bramble and berry sours.", related: ["Frozen blackberries", "Blackberry puree"] }
  ,
    { name: "Frozen Blackberries", description: "Frozen blackberries. Available year-round. Good for muddling in Bramble when fresh are out of season.", related: ["Fresh Blackberries", "Blackberry puree"] }
  ,
    { name: "Blackberry Puree", description: "Smooth blackberry purée from Monin. Rich, sweet-tart blackberry flavor. The standard purée for Bramble and berry sours in cocktail bars.", related: ["Fresh Blackberries", "Frozen Blackberries"] }
  ,
    { name: "Dole Blackberry Juice", description: "Ready-to-drink blackberry juice from Dole. 100% blackberry juice, no added sugar. Used as a mixer for berry-forward cocktails.", related: ["Fresh Blackberries", "Frozen Blackberries", "Blackberry Puree"] }
  ,
    { name: "Knudsen Blackberry Juice", description: "Cold-pressed blackberry juice from Knudsen. Rich, concentrated blackberry flavor. Great for Bramble variations and berry sours.", related: ["Fresh Blackberries", "Frozen Blackberries", "Blackberry Puree"] }
  ] },
  { name: "Fresh espresso", category: "Fresh & Garnish", description: "Freshly brewed espresso shot. Concentrated coffee flavor for coffee cocktails.", brands: ["Fresh brew"], notes: "Espresso Martini.",
  bottles: [
    { name: "Freshly Brewed Espresso", description: "Fresh espresso shot. Concentrated coffee flavor for Espresso Martini.", related: ["Cold brew concentrate", "Strong coffee"] }
  ,
    { name: "Cold Brew Concentrate", description: "Cold-brewed coffee concentrate. Smooth, less acidic than hot brew. Fine for Espresso Martini.", related: ["Freshly Brewed Espresso", "Strong brewed coffee"] }
  ,
    { name: "Stumptown Cold Brew Espresso", description: "Cold-brewed espresso from Stumptown Coffee. Concentrated, smooth, with deep chocolate and caramel notes. Dilute to taste for Espresso Martini.", related: ["Freshly Brewed Espresso", "Cold Brew Concentrate"] }
  ,
    { name: "Blue Bottle Espresso", description: "Small-batch espresso from Blue Bottle Coffee. Bright, clean, with floral and citrus notes. Excellent for Espresso Martini.", related: ["Freshly Brewed Espresso", "Stumptown Cold Brew Espresso"] }
  ,
    { name: "La Colombe Draft Espresso", description: "Draft espresso from La Colombe. Silky, rich, with notes of dark chocolate and hazelnut. Convenient for espresso cocktails.", related: ["Freshly Brewed Espresso", "Blue Bottle Espresso"] }
  ] },
  { name: "Fresh mint", category: "Fresh & Garnish", description: "Fresh mint sprigs. Muddled gently for flavor or used as a garnish slap.", brands: ["Fresh spearmint"], notes: "Mojito, Mint Julep, Southside.",
  bottles: [
    { name: "Fresh Spearmint", description: "Fresh mint sprigs. Gently muddled for Mojito and Mint Julep, or slapped for garnish.", related: ["Peppermint", "Chocolate mint"] }
  ,
    { name: "Peppermint", description: "Peppermint sprigs. Stronger, more menthol than spearmint. Good for Stinger and after-dinner drinks.", related: ["Fresh Spearmint", "Chocolate mint"] }
  ,
    { name: "Chocolate mint", description: "Chocolate-flavored mint sprigs. Sweet, fragrant, with subtle cocoa notes. Decorative and aromatic for after-dinner cocktails.", related: ["Fresh Spearmint", "Peppermint"] }
  ,
    { name: "Apple mint", description: "Apple-scented mint sprigs. Softer, fruitier flavor than spearmint. Adds a gentle fruit note to Mint Julep variations.", related: ["Fresh Spearmint", "Peppermint"] }
  ,
    { name: "Pineapple mint", description: "Pineapple-scented mint variety. Tropical, fruity aroma with classic mint freshness. Fun twist for Mojito and Tiki-style drinks.", related: ["Fresh Spearmint", "Apple mint"] }
  ] },
  { name: "Fresh mint leaves", category: "Fresh & Garnish", description: "Same as Fresh mint — individual leaves for muddling or garnish.", brands: ["Fresh spearmint"], notes: "Deduplicated with Fresh mint.",
  bottles: [
    { name: "Fresh Spearmint Leaves", description: "Fresh mint leaves for muddling or garnish.", related: ["Fresh mint sprigs", "Peppermint leaves"] }
  ,
    { name: "Peppermint Leaves", description: "Peppermint leaves. Strong minty flavor. Alternative to spearmint for Mojito when available.", related: ["Fresh Spearmint Leaves", "Fresh mint sprigs"] }
  ,
    { name: "Corn Mint Leaves", description: "Corn mint (Mentha arvensis) leaves. High menthol content, bright and sharp. Common in Asian cuisine and herbal teas.", related: ["Fresh Spearmint Leaves", "Peppermint Leaves"] }
  ,
    { name: "Water Mint Leaves", description: "Water mint (Mentha aquatica) leaves. Grows near water sources. Mild, aromatic, slightly sweet. Excellent for cooling summer drinks.", related: ["Fresh Spearmint Leaves", "Peppermint Leaves"] }
  ,
    { name: "Chocolate Mint Leaves", description: "Chocolate mint (Mentha × piperita 'Chocolate') leaves. Mint with subtle cocoa undertones. Fragrant garnish for dessert cocktails.", related: ["Fresh Spearmint Leaves", "Peppermint Leaves"] }
  ] },
  { name: "Nutmeg", category: "Fresh & Garnish", description: "Freshly grated nutmeg. Warm, nutty, aromatic spice for garnish.", brands: ["Whole nutmeg + grater"], notes: "Brandy Alexander garnish, Eggnog, certain punches.",
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
  ] },
  { name: "Orange blossom water", category: "Fresh & Garnish", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", brands: ["Cortas", "Moussel", "Food-grade"], notes: "Bee's Knees, certain Ramos Fizz, Arabic cocktails.",
  bottles: [
    { name: "Cortas Orange Blossom Water", description: "Distilled water with orange blossom essence. Highly concentrated — use drops. Floral, perfumed.", related: ["Moussel Orange Blossom Water", "Food-grade orange blossom water"] }
  ,
    { name: "Moussel Orange Blossom Water", description: "Orange blossom water from Moussel. Distilled water with orange blossom essence. Floral, perfumed.", related: ["Cortas Orange Blossom Water", "Food-grade orange blossom water"] }
  ,
    { name: "Sadoff Orange Blossom Water", description: "Orange blossom water from Sadoff. Distilled water with orange blossom essence. Floral, perfumed. Used in Middle Eastern and Mediterranean cocktails.", related: ["Cortas Orange Blossom Water", "Moussel Orange Blossom Water"] }
  ,
    { name: "Odysea Orange Blossom Water", description: "Orange blossom water from Odysea. Distilled water with orange blossom essence. Floral, perfumed. Greek brand used in cocktails and pastries.", related: ["Cortas Orange Blossom Water", "Moussel Orange Blossom Water"] }
  ] },

  // DAIRY & CREAM
  { name: "Coconut cream", category: "Dairy & Cream", description: "Thick, rich cream from coconut meat. Not coconut milk — higher fat content. Separates when chilled.", brands: ["Chaokoh", "Aroy-D", "Savoy"], notes: "Piña Colada, Blue Hawaii.", bottles: [
    { name: "Chaokoh Coconut Cream", description: "Thai coconut cream. Thick, rich, high-fat. Not coconut milk — separates when chilled.", related: ["Aroy-D Coconut Cream", "Savoy Coconut Cream"] },
    { name: "Aroy-D Coconut Cream", description: "Thai coconut cream from Aroy-D. Thick, rich, high-fat. Widely available and reliable for Piña Colada and Tiki drinks.", related: ["Chaokoh Coconut Cream", "Savoy Coconut Cream"] },
    { name: "Savoy Coconut Cream", description: "Thai coconut cream from Savoy. Thick, rich, high-fat. Another widely available option for Piña Colada.", related: ["Chaokoh Coconut Cream", "Aroy-D Coconut Cream"] }
  ,
    { name: "Goya Coconut Cream", description: "Coconut cream from Goya. Thick, rich coconut cream suitable for tropical cocktails and desserts. Widely available in US grocery stores.", related: ["Chaokoh Coconut Cream", "Aroy-D Coconut Cream", "Savoy Coconut Cream"] }
  ,
    { name: "Coco Lopez Cream of Coconut", description: "The original cream of coconut, specifically formulated for Piña Colada. Sweetened coconut cream with pineapple essence. Essential for authentic Piña Colada.", related: ["Chaokoh Coconut Cream", "Aroy-D Coconut Cream", "Savoy Coconut Cream"] }
  ] },
  { name: "Heavy cream", category: "Dairy & Cream", description: "High-fat dairy cream (36–40% fat). Used for body and richness in shaken cocktails.", brands: ["Any heavy cream brand"], notes: "Brandy Alexander, White Russian, Ramos Gin Fizz.",
  bottles: [
    { name: "Heavy Cream (36-40% fat)", description: "High-fat dairy cream. Used for body in Brandy Alexander, White Russian, Ramos Gin Fizz.", related: ["Half-and-half", "Heavy whipping cream"] }
  ,
    { name: "Horizon Organic Heavy Cream", description: "Organic heavy cream (36% fat). Rich, creamy, widely available. The standard for Brandy Alexander and White Russian.", related: ["Dairy heavy cream", "Half-and-half"] }
  ,
    { name: "Land O'Lakes Heavy Cream", description: "Pasteurized heavy cream (36% fat). Rich, stable, and widely available across the US. The reliable everyday choice for shaken custard cocktails.", related: ["Heavy Cream (36-40% fat)", "Horizon Organic Heavy Cream"] }
  ,
    { name: "Organic Valley Heavy Cream", description: "Organic heavy cream (36% fat). From pasture-raised cows. Creamy and consistent; a common organic alternative in classic cream-based cocktails.", related: ["Horizon Organic Heavy Cream", "Heavy Cream (36-40% fat)"] }
  ,
    { name: "Darigold Heavy Cream", description: "Pacific Northwest heavy cream (36% fat). Rich mouthfeel and good whipping stability. Used interchangeably in bar recipes that call for heavy cream.", related: ["Heavy Cream (36-40% fat)", "Horizon Organic Heavy Cream"] }
  ]
},

  // OTHER SPIRITS & INGREDIENTS
  { name: "Falernum", category: "Other Spirits", description: "Caribbean syrup-spice liqueur. Almond, ginger, clove, allspice. Sweet, warm, 11% ABV.", brands: ["Fee Brothers Falernum", "Old Professor Falernum", "Romilly's"], notes: "Tiki Punch, Scorpion, certain Mai Tai recipes.", bottles: [
    { name: "Fee Brothers Falernum", description: "Caribbean falernum liqueur from Fee Brothers. Almond, ginger, clove, allspice. Sweet, warm, 11% ABV. The classic choice for Tiki drinks.", related: ["Old Professor Falernum", "Romilly's Falernum"] },
    { name: "Romilly's Falernum", description: "Jamaican falernum liqueur. Traditional recipe with almond, ginger, and spices. Sweet, warm.", related: ["Fee Brothers Falernum", "Old Professor Falernum"] },
    { name: "Old Professor Falernum", description: "California-made falernum liqueur with almond, ginger, clove, and allspice. Sweet, warm spiced profile. Popular Tiki ingredient.", related: ["Fee Brothers Falernum", "Romilly's Falernum"] },
    { name: "Blackheart Falernum", description: "Premium falernum liqueur with authentic Caribbean spiced profile. Almond-forward with ginger and allspice warmth. Craft cocktail staple.", related: ["Fee Brothers Falernum", "Romilly's Falernum"] },
    { name: "Martinique Spiced Falernum", description: "Martinique-produced falernum combining traditional Caribbean spices with rhum agricole notes. Almond, ginger, clove, allspice.", related: ["Fee Brothers Falernum", "Romilly's Falernum"] }
  ] },
  { name: "Applejack", category: "Other Spirits", description: "American apple brandy made from hard cider. Strong apple character, warm spirit.", brands: ["Laird's Applejack (100 proof or 80 proof)"], notes: "Jack Rose, Applejack Rabbit.",
  bottles: [
    { name: "Laird's Applejack", description: "America's oldest apple brandy (since 1780). Made from blended apple cider and neutral spirits. Apple-forward, warm. Essential for Jack Rose.", related: ["Laird's 100 Proof", "Clear Creek Apple Brandy"] }
  ,
    { name: "Laird's 100 Proof Applejack", description: "100-proof applejack from Laird's. Higher ABV version of America's oldest apple brandy. Bold apple character for Jack Rose.", related: ["Laird's Applejack", "Clear Creek Apple Brandy"] }
  ,
    { name: "Clear Creek Apple Brandy", description: "Oregon-made apple brandy from Clear Creek Distillery. Crafted from local Pacific Northwest apples. Clean, fruity, spirit-driven. A top-tier cocktail apple brandy.", related: ["Laird's Applejack", "Laird's 100 Proof Applejack"] }
  ,
    { name: "Laird's Applejack (80 Proof)", description: "Standard 80-proof applejack from Laird's. Milder than the 100-proof expression. Apple-forward, warm, and versatile for Jack Rose and Applejack Rabbit.", related: ["Laird's Applejack", "Laird's 100 Proof Applejack", "Clear Creek Apple Brandy"] }
  ,
    { name: "Etter Kirsch", description: "Swiss kirschwasser from Etter Distillery. Made from distilled sour cherries. Dry, clean, and aromatic. A premium eau-de-vie for White Lady and related cocktails.", related: ["Clear Creek Apple Brandy", "G.E. Massenez Kirsch", "Laird's Applejack"] }
  ] },
  { name: "Cachaça", category: "Other Spirits", description: "Brazilian spirit from fermented sugarcane juice. Funky, grassy, herbaceous. Unlike rum (molasses).", brands: ["Leblon", "Avuá", "Novo Fogo", "Ypióca"], notes: "Caipirinha, Caipiroska, Batida.",
  bottles: [
    { name: "Leblon Cachaça", description: "Premium Brazilian cachaça from Minas Gerais. Distilled from fresh sugarcane juice. Smooth, grassy. The standard for Caipirinha.", related: ["Avuá Cachaça", "Novo Fogo", "Ypióca"] }
  ,
    { name: "Avuá Cachaça", description: "Brazilian cachaça from Avuá. Artisanal, organic. Grassier, more complex than Leblon. Excellent for premium Caipirinha.", related: ["Leblon Cachaça", "Novo Fogo", "Ypióca"] }
  ,
    { name: "Novo Fogo Cachaça", description: "Brazilian cachaça from Espírito Santo. Made from organic sugarcane. Silky, tropical, with a smoky edge from eucalyptus wood-fired distillation. Premium choice for Caipirinha.", related: ["Leblon Cachaça", "Avuá Cachaça", "Ypióca"] }
  ,
    { name: "Ypióca Cachaça", description: "Classic Brazilian cachaça from Ceará. One of the oldest brands (founded 1846). Clean, bright sugarcane flavor. An everyday Caipirinha workhorse.", related: ["Leblon Cachaça", "Avuá Cachaça", "Novo Fogo"] }
  ,
    { name: "51 Cachaça", description: "Brazil's most popular cachaça brand. Clean, bright sugarcane spirit. The default choice for Caipirinha in Brazil — affordable and widely available.", related: ["Leblon Cachaça", "Avuá Cachaça", "Ypióca Cachaça"] }
  ,
    { name: "Sagatiba Cachaça", description: "Premium Brazilian cachaça with smooth, sweet sugarcane character. Well-suited for premium Caipirinha and batida cocktails.", related: ["Leblon Cachaça", "Novo Fogo Cachaça", "Ypióca Cachaça"] }
  ,
    { name: "Pitu Cachaça", description: "Classic Brazilian cachaça with a long history. Clean, slightly sweet sugarcane profile. A reliable mixer for Caipirinha and tropical drinks.", related: ["Leblon Cachaça", "51 Cachaça", "Ypióca Cachaça"] }
  ,
    { name: "Germana Cachaça", description: "Artisanal Brazilian cachaça from Minas Gerais. Made from fresh sugarcane juice with a smooth, grassy profile. Premium choice for craft Caipirinha.", related: ["Leblon Cachaça", "Avuá Cachaça", "Novo Fogo Cachaça"] }
  ,
    { name: "Velho Barreiro Cachaça", description: "Traditional Brazilian cachaça with a smooth, balanced sugarcane character. A popular everyday mixer for Caipirinha and batidas.", related: ["Leblon Cachaça", "51 Cachaça", "Ypióca Cachaça"] }
  ] },
  { name: "White peach purée", category: "Other Spirits", description: "Puréed white peach, strained. Sweet, floral, velvety.", brands: ["Bardezzo, Boiron, or fresh purée"], notes: "Bellini (with Prosecco), Peach Sour.",
  bottles: [
    { name: "Bardezzo White Peach Purée", description: "Smooth white peach purée. Sweet, floral, velvety. Ideal for Bellini and Peach Sour.", related: ["Boiron White Peach Puree", "Fresh white peach puree"] }
  ,
    { name: "Boiron White Peach Puree", description: "French white peach puree from Boiron. Smooth, floral, velvety. Professional-grade for Bellini.", related: ["Bardezzo White Peach Pur\u00e9e", "Fresh white peach puree"] }
  ,
    { name: "Fabbri White Peach Pur\u00e9e", description: "Italian white peach pur\u00e9e from Fabbri. Sweet, aromatic, with a smooth velvety texture. Bartender favorite for Bellini and peach cocktails.", related: ["Bardezzo White Peach Pur\u00e9e", "Boiron White Peach Puree", "Fresh white peach puree"] }
  ,
    { name: "Monin White Peach Puree", description: "French white peach puree from Monin. Consistent quality, bright peach flavor. Great for Bellini, Peach Sour, and mixed drinks.", related: ["Bardezzo White Peach Pur\u00e9e", "Boiron White Peach Puree", "Fabbri White Peach Pur\u00e9e"] }
  ,
    { name: "Borange White Peach Nectar", description: "White peach nectar from Borange. Sweet, fruity, with authentic peach flavor. Works as a Bellini base or peach cocktail modifier.", related: ["Bardezzo White Peach Pur\u00e9e", "Boiron White Peach Puree", "Fabbri White Peach Pur\u00e9e"] }
  ]
}];

export function getIngredientByName(name: string): Ingredient | undefined {
  return ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
}

export function getCategories(): string[] {
  return [...new Set(ingredients.map(i => i.category))];
}

export function getIngredientsByCategory(category: string): Ingredient[] {
  return ingredients.filter(i => i.category === category);
}
