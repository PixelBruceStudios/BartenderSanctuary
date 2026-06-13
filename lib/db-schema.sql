-- Bartender Sanctuary — content schema (empty, no seed data)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password_hash TEXT NOT NULL DEFAULT '',
  email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- Categories (e.g. Spirits Foundation, Whiskey, Cocktail Chemistry)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Techniques within a category (e.g. Acid & Balance, Dry Shake)
CREATE TABLE techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

-- Lessons within a technique
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technique_id UUID NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (technique_id, slug)
);

-- Cocktails (standalone, linked to optional techniques/categories)
CREATE TABLE cocktails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  glass_type TEXT NOT NULL DEFAULT '',
  garnish TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  origin TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]',
  story TEXT NOT NULL DEFAULT '',
  recipe JSONB NOT NULL DEFAULT '[]',
  technique TEXT NOT NULL DEFAULT 'Shaken',
  base TEXT[] NOT NULL DEFAULT '{}',
  modifiers TEXT[] NOT NULL DEFAULT '{}',
  icon_type TEXT NOT NULL DEFAULT 'martini',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sources for lessons (bibliography / references)
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  citation TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
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

DROP TRIGGER IF EXISTS users_updated ON users;
CREATE TRIGGER users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

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
CREATE INDEX IF NOT EXISTS idx_cocktails_slug ON cocktails(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- ── Test tables ──────────────────────────────────────────────────────────────

-- One test row per scope unit (sublesson block, whole lesson, combined technique)
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope TEXT NOT NULL CHECK (scope IN ('sublesson','lesson','combined')),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  technique_id UUID REFERENCES techniques(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  passing_score INTEGER NOT NULL DEFAULT 70,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tests_scope_target_chk CHECK (
    (scope = 'sublesson' AND lesson_id IS NOT NULL) OR
    (scope = 'lesson'   AND lesson_id IS NOT NULL) OR
    (scope = 'combined' AND technique_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tests_scope_lesson
  ON tests(scope, lesson_id) WHERE scope IN ('sublesson','lesson');
CREATE UNIQUE INDEX IF NOT EXISTS idx_tests_scope_technique
  ON tests(scope, technique_id) WHERE scope = 'combined';

-- Individual questions belonging to a test
CREATE TABLE IF NOT EXISTS test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id);

-- Per-user attempt log — used to gate completion
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_session
  ON test_attempts(test_id, session_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user
  ON test_attempts(user_id);

-- Per-user lesson progress (tracks sublesson + lesson completion state)
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  sublesson_tests_passed INTEGER NOT NULL DEFAULT 0,
  sublesson_tests_total INTEGER NOT NULL DEFAULT 0,
  lesson_test_passed BOOLEAN NOT NULL DEFAULT false,
  lesson_test_score INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user
  ON user_lesson_progress(user_id);

-- Authenticated per-user best-score / pass tracking (parallel to test_attempts for anonymous)
CREATE TABLE IF NOT EXISTS user_test_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  passed BOOLEAN NOT NULL DEFAULT false,
  best_score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, test_id)
);
CREATE INDEX IF NOT EXISTS idx_user_test_progress_user
  ON user_test_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_test_progress_test
  ON user_test_progress(test_id);

DROP TRIGGER IF EXISTS tests_updated ON tests;
CREATE TRIGGER tests_updated BEFORE UPDATE ON tests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
