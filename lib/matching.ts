import { Cocktail } from '@/data/cocktails';

export interface MatchResult extends Cocktail {
  score: number;
  pantryScore: number;
}

export function categorizeIngredient(item: string): 'base' | 'mod' | 'ingredient' {
  const normalized = item.toLowerCase();
  if (
    normalized.includes('whiskey') ||
    normalized.includes('bourbon') ||
    normalized.includes('rye') ||
    normalized.includes('scotch') ||
    normalized.includes('vodka') ||
    normalized.includes('gin') ||
    normalized.includes('rum') ||
    normalized.includes('tequila') ||
    normalized.includes('brandy') ||
    normalized.includes('cognac') ||
    normalized.includes('mezcal') ||
    normalized.includes('absinthe') ||
    normalized.includes('liqueur') ||
    normalized.includes('bitters')
  ) {
    return 'base';
  }

  if (
    normalized.includes('syrup') ||
    normalized.includes('juice') ||
    normalized.includes('soda') ||
    normalized.includes('water') ||
    normalized.includes('milk') ||
    normalized.includes('cream') ||
    normalized.includes('egg') ||
    normalized.includes('honey') ||
    normalized.includes('sugar') ||
    normalized.includes('salt') ||
    normalized.includes('peel') ||
    normalized.includes('twist') ||
    normalized.includes('wheel') ||
    normalized.includes('leaf') ||
    normalized.includes('herb') ||
    normalized.includes('fruit') ||
    normalized.includes('berry') ||
    normalized.includes('citrus') ||
    normalized.includes('orange') ||
    normalized.includes('lemon') ||
    normalized.includes('lime') ||
    normalized.includes('grapefruit')
  ) {
    return 'mod';
  }

  return 'ingredient';
}

export function matchCocktails(
  cocktails: Cocktail[],
  selectedBases: string[],
  selectedMods: string[],
  selectedCustom: string[] = []
): MatchResult[] {
  if (selectedBases.length === 0 && selectedMods.length === 0 && selectedCustom.length === 0) return [];

  const baseSet = new Set(selectedBases.map((s) => s.toLowerCase()));
  const modSet = new Set(selectedMods.map((s) => s.toLowerCase()));
  const customSet = new Set(selectedCustom.map((s) => s.toLowerCase()));

  return cocktails
    .map((c) => {
      let score = 0;
      const allCocktailItems = [
        ...c.base,
        ...c.modifiers,
        ...c.ingredients.map((i) => i.item),
      ];
      const uniqueCocktailItems = [...new Set(allCocktailItems.map((i) => i.toLowerCase()))];

      uniqueCocktailItems.forEach((item) => {
        if (baseSet.has(item)) score += 2;
        else if (modSet.has(item)) score += 1;
        else if (customSet.has(item)) score += 1;
      });

      const maxPossible = c.base.length * 2 + c.modifiers.length + c.ingredients.length;
      const pantryScore = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
      return { ...c, score, pantryScore };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || b.pantryScore - a.pantryScore);
}

export function getMissingIngredients(
  cocktail: Cocktail,
  selectedBases: string[],
  selectedMods: string[],
  selectedCustom: string[] = []
) {
  const baseSet = new Set(selectedBases.map((s) => s.toLowerCase()));
  const modSet = new Set(selectedMods.map((s) => s.toLowerCase()));
  const customSet = new Set(selectedCustom.map((s) => s.toLowerCase()));

  const matchesPantry = (item: string) => {
    const lower = item.toLowerCase();
    const isBase = [...baseSet].some((v) => lower.includes(v));
    const isMod = [...modSet].some((v) => lower.includes(v));
    const isCustom = [...customSet].some((v) => lower.includes(v));
    return isBase || isMod || isCustom;
  };

  const allCocktailItems = [
    ...cocktail.base,
    ...cocktail.modifiers,
    ...cocktail.ingredients.map((i) => i.item),
  ];
  return [...new Set(allCocktailItems)].filter((i) => !matchesPantry(i));
}

export interface IngredientGroup {
  label: string;
  missing: string[];
}

export function getMissingIngredientGroups(
  cocktail: Cocktail,
  selectedBases: string[],
  selectedMods: string[],
  selectedCustom: string[] = []
): IngredientGroup[] {
  const baseSet = new Set(selectedBases.map((s) => s.toLowerCase()));
  const modSet = new Set(selectedMods.map((s) => s.toLowerCase()));
  const customSet = new Set(selectedCustom.map((s) => s.toLowerCase()));

  const missingBase = (cocktail.base || []).filter((item) => !baseSet.has(item.toLowerCase()));
  const missingMods = (cocktail.modifiers || []).filter((item) => !modSet.has(item.toLowerCase()));
  const missingCustom = (cocktail.base || [])
    .concat(cocktail.modifiers || [])
    .filter((item) => !baseSet.has(item.toLowerCase()) && !modSet.has(item.toLowerCase()) && customSet.has(item.toLowerCase()));

  const missingIngredients = (cocktail.ingredients || [])
    .filter((ing) => {
      const item = (ing.item || '').toLowerCase();
      if (!item) return false;
      const matchesBase = (cocktail.base || []).some((b) => item.includes(b.toLowerCase()) || b.toLowerCase().includes(item));
      const matchesMod = (cocktail.modifiers || []).some((m) => item.includes(m.toLowerCase()) || m.toLowerCase().includes(item));
      const matchesCustom = selectedCustom.some((s) => item.includes(s.toLowerCase()) || s.toLowerCase().includes(item));
      return !matchesBase && !matchesMod && !matchesCustom;
    })
    .map((ing) => ing.item);

  const groups: IngredientGroup[] = [];
  if (missingBase.length) groups.push({ label: 'Base', missing: missingBase });
  if (missingMods.length) groups.push({ label: 'Modifier', missing: missingMods });
  if (missingIngredients.length) groups.push({ label: 'Ingredient', missing: missingIngredients });
  if (missingCustom.length) groups.push({ label: 'In your custom list', missing: missingCustom });
  return groups;
}
