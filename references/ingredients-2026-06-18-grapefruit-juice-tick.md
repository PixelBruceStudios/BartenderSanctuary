# Grapefruit juice tick notes (2026-06-18)

## Summary
- Ingredient: Grapefruit juice
- Added: 3 bottles (Ocean Spray Grapefruit Juice, Tropicana Pure Premium Grapefruit Juice, Simply Beverages Grapefruit Juice)
- Images: 0 Wikimedia / 0 omitted
- Type-check: OK
- Commit: 80e6048 (local only — push blocked by HTTPS 403 auth)

## Parser fix
The custom Python parser was failing because ingredient entries in this file use **3-space indentation** (not 2-space as the skill docs assume). The bracket-walking parser produced 0 ingredients until corrected. Root cause: `export const ingredients: Ingredient[] = [` is at 1-space indent, and each ingredient header starts at 3-space indent within the array. Fixed detection logic to use `indent == 3` for ingredient headers and `indent >= 4` for bottle entries.

## Patch method
Used `patch` tool's `replace` mode. Indentation was preserved correctly; no comma-prefix pitfall encountered (the existing entries used `,\n` style rather than `,\n  {`).

## Image research
Searched Wikimedia Commons API for Ocean Spray and Tropicana grapefruit juice images — no relevant product images found in Commons. Omitting `image` field per rules (do not invent placeholder images).

## Git auth blocker (HTTPS 403)
`git push origin main` returned:
```
remote: Permission to PixelBruceStudios/BartenderSanctuary.git denied to SkicMi.
fatal: unable to access 'https://github.com/PixelBruceStudios/BartenderSanctuary.git/': The requested URL returned error: 403
```

Diagnosed:
- Remote has embedded PAT: `https://PixelBruce:ghp_9V...Gefk@github.com/...`
- `git ls-remote origin HEAD` **succeeds** (read access works)
- Push fails with HTTP 403 (write scope missing or username mismatch)

This is Variant 5 from `references/ingredients-cron-git-auth-blocker-2026-06-18.md`. The embedded PAT lacks write scope for this repo or the token's account (`PixelBruce`) doesn't match the repo owner for write permissions.

## Processed set
Appended `6|Grapefruit juice` to `ingredients-cron-processed.txt`. Next tick should pick from the remaining 2-bottle candidates (Grapefruit juice category is now at 5 bottles).
