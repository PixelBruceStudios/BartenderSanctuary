# Blog & Forum Content Guide

## How to Add Content

1. Create a new folder under `content/blog/` or `content/forum/`
2. Add an `index.md` file with YAML frontmatter
3. Run `npm run build:blog` to regenerate `data/blog.generated.ts`
4. Commit and deploy

## Blog Post Template

```markdown
---
title: "Post Title Here"
excerpt: "Short description for listing pages"
coverImage: "/photos/cover.jpg"
categorySlug: "techniques"
tags: ["tag1", "tag2"]
publishedAt: "2026-06-15T10:00:00Z"
authorName: "Author Name"
---

# Post Title

Your markdown content here.

- Bullet points work
- **Bold** and *italic*
- [Links](https://example.com)
```

## Forum Thread Template

```markdown
---
title: "Thread Title Here"
categorySlug: "general"
authorName: "Username"
createdAt: "2026-06-15T10:00:00Z"
---

# Thread Title

Thread content in markdown.
```

## Field Reference

### Blog Post Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `excerpt` | string | Yes | Short description for cards |
| `coverImage` | string | No | Path to cover image |
| `categorySlug` | string | Yes | Must match a slug in `content/categories.json` |
| `tags` | string[] | Yes | Searchable tags |
| `publishedAt` | string | Yes | ISO 8601 date |
| `authorName` | string | Yes | Display name |

### Forum Thread Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Thread title |
| `categorySlug` | string | Yes | Must match a slug in `content/categories.json` |
| `authorName` | string | Yes | Display name |
| `createdAt` | string | Yes | ISO 8601 date |

## Categories

Edit `content/categories.json` to add/remove blog or forum categories.

## Rules

- Slugs must be lowercase, hyphens only, unique within their type
- `categorySlug` must exist in categories
- `publishedAt` must be valid ISO 8601
- Body can be any valid markdown
- Do not edit `data/blog.generated.ts` directly — it is overwritten by the build script
