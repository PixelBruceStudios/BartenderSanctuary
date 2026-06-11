-- Bartender Sanctuary — content schema (empty, no seed data)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories (e.g. Spirits Foundation, Whiskey, Cocktail Chemistry)
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Techniques within a category (e.g. Acid & Balance, Dry Shake)
CREATE TABLE techniques (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

-- Lessons within a technique
CREATE TABLE lessons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration    TEXT NOT NULL DEFAULT '',
  difficulty  TEXT NOT NULL DEFAULT 'Beginner',
  content     TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (technique_id, slug)
);

-- Cocktails (standalone, linked to optional techniques/categories)
CREATE TABLE cocktails (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  glass_type  TEXT NOT NULL DEFAULT '',
  garnish     TEXT NOT NULL DEFAULT '',
  difficulty  TEXT NOT NULL DEFAULT 'Beginner',
  origin      TEXT NOT NULL DEFAULT '',
  tags        JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sources for lessons (bibliography / references)
CREATE TABLE sources (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id  UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  citation   TEXT NOT NULL,
  url        TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated-at triggers
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_updated ON categories;
CREATE TRIGGER categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS techniques_updated ON techniques;
CREATE TRIGGER techniques_updated BEFORE UPDATE ON techniques
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS lessons_updated ON lessons;
CREATE TRIGGER lessons_updated BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS cocktails_updated ON cocktails;
CREATE TRIGGER cocktails_updated BEFORE UPDATE ON cocktails
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_techniques_category ON techniques(category_id);
CREATE INDEX IF NOT EXISTS idx_lessons_technique ON lessons(technique_id);
CREATE INDEX IF NOT EXISTS idx_sources_lesson ON sources(lesson_id);
