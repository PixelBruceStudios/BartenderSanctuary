import { Cocktail } from '@/data/cocktails';

export function matchCocktails(
  cocktails: Cocktail[],
  selectedBases: string[],
  selectedMods: string[]
) {
  if (selectedBases.length === 0 && selectedMods.length === 0) return [];

  return cocktails
    .map((c) => {
      let score = 0;
      c.base.forEach((b) => { if (selectedBases.includes(b)) score += 2; });
      c.modifiers.forEach((m) => { if (selectedMods.includes(m)) score += 1; });
      const maxPossible = c.base.length * 2 + c.modifiers.length;
      const pantryScore = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
      return { ...c, score, pantryScore };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || b.pantryScore - a.pantryScore);
}

export function getMissingIngredients(
  cocktail: Cocktail,
  selectedBases: string[],
  selectedMods: string[]
) {
  return [...cocktail.base, ...cocktail.modifiers].filter(
    (i) => !selectedBases.includes(i) && !selectedMods.includes(i)
  );
}
