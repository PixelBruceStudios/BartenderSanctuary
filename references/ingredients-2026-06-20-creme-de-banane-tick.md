# Crème de banane tick notes (2026-06-20)

## Summary
- Ingredient: Crème de banane
- Added: 2 bottles (Giffard Crème de Banane, RumChata Banana Liqueur)
- Images: 0 Wikimedia / omitted
- Type-check: OK
- Commit: 296ee81 (local only — push blocked by HTTPS 403 "Invalid username or token")

## Bottles added
1. **Giffard Crème de Banane** — French banana crème liqueur. Rich, creamy banana flavor with vanilla notes. 25% ABV. A premium choice for tropical cocktails and dessert drinks.
2. **RumChata Banana Liqueur** — Creamy banana liqueur. Sweet, smooth, with real banana and cream flavors. Lower ABV, perfect for dessert shooters and creamy cocktails.

## Image verification
- Wikimedia Commons HEAD-checks 404'd for candidate filenames (`Marie_Brizard_Crème_de_Banane_Bottle.jpg`, `Bols_Crème_de_Banane.jpg`, `DeKuyper_Banana_Liqueur.jpg`, `Giffard_Crème_de_Banane.jpg`).
- Wikimedia Commons API search returned rate-limit error ("You are making too many requests to the API").
- **Decision:** No verified Commons images found. Omitted `image` fields for both new bottles to maintain consistency with the existing banana liqueur entries.

## Patching
- Used Python exact-match replacement to avoid the `patch` tool comma-prefix indentation pitfalls.
- Post-patch verification: confirmed 5 total bottles, no duplicates, brace balance 0.

## Type-check
- `npm run type-check` passed (exit 0).

## Git
- Commit: 296ee81
- Push failed: remote URL stripped of embedded PAT → `git ls-remote` succeeded (read access), but push returned `remote: Invalid username or token. Password authentication is not supported for Git operations.`
- This indicates the stored credential helper credential lacks write scope or is malformed. The same HTTPS 403 Variant 5 pattern seen in prior cron runs.

## Processed-set advancement
- `Crème de banane` appended to `ingredients-cron-processed.txt`.

## Next candidates (still < 5 bottles)
3|Crème de cassis
3|Crème de mûre
3|Elderflower liqueur
3|Green crème de menthe
3|Orange curaçao
3|Peach schnapps
3|Triple sec or Cointreau
3|White crème de menthe
3|Green Chartreuse
...
