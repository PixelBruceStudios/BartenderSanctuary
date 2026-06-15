# Research Database — Agent Guide

## How to Use This Database

1. Read `index.json` first — it is the master registry.
2. Add new people, topics, brands, or sources as structured markdown with frontmatter.
3. Keep every claim tied to a `sourceId` from `sources/`.
4. Update `lastVerified` and `status` when you touch a file.
5. When writing a blog post, pull from `research/drafts/` and cite `sourceId`s.

## File Naming

- People: `people/<slug>.md`
- Topics: `topics/<slug>.md`
- Brands: `brands/<slug>.md`
- Regions: `regions/<slug>.md`
- Sources: `sources/<source-id>.md`
- Drafts: `drafts/blog-<slug>.md`

## Frontmatter Schema (required keys)

```yaml
---
type: person | topic | brand | region | source | draft
title: string
tags: string[]
sources: string[]        # sourceId values
lastVerified: YYYY-MM-DD
status: draft | verified | needs-update
---
```

## Relationship Fields (optional but encouraged)

```yaml
relatedPeople: string[]
relatedTopics: string[]
relatedBrands: string[]
relatedRegions: string[]
```

## Body Rules

- Use markdown headings, bullet lists, and short paragraphs.
- Put uncited claims in `[ ]` brackets for later review.
- Link to other research notes with wikilinks: `[[people/julie-reiner]]`
- Keep quotes short and attributed.

## Agent Workflows

### Adding a New Influencer
1. Create `people/<slug>.md` with full frontmatter.
2. Add `sourceId`s from `sources/`.
3. Update `index.json` `people` array.
4. Run `npm run build:blog` to regenerate typed data if needed.

### Writing a Blog Post
1. Read `index.json` to find relevant people/topics.
2. Pull source files from `sources/`.
3. Draft in `drafts/blog-<slug>.md`.
4. When published, move content to `content/blog/<slug>/index.md`.
5. Update `index.json` `posts` array.

### Updating Stale Research
1. Find files with `status: needs-update` or old `lastVerified`.
2. Re-check source URLs.
3. Update frontmatter and body.
4. Change `status` back to `verified`.

## Source Trust Levels

- `primary` — official bar/ brand site, direct interview
- `secondary` — reputable trade press (Difford, Liquor.com, Punch)
- `tertiary` — social media, Wikipedia, user-generated

Always prefer primary > secondary > tertiary.
