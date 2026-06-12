import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "@/lib/contexts";
import SEO from "@/components/SEO";
import SpaceUniverse from "@/components/SpaceUniverse";

type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  content: string;
  sort_order: number;
  sources: any[];
};

type Technique = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  lessons: Lesson[];
};

type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  techniques: Technique[];
};

function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        marginBottom: "2rem",
        padding: "0.4rem",
        background: "var(--color-surface)",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat)}
          style={{
            background:
              active.slug === cat.slug
                ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))"
                : "transparent",
            border: "none",
            color: active.slug === cat.slug ? "#fff" : "var(--color-text-secondary)",
            fontSize: "0.95rem",
            padding: "0.65rem 1.2rem",
            cursor: "pointer",
            borderRadius: "8px",
            fontWeight: active.slug === cat.slug ? 600 : 500,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow:
              active.slug === cat.slug
                ? "0 2px 8px rgba(0,0,0,0.15)"
                : "none",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
          <span>{cat.title}</span>
        </button>
      ))}
    </div>
  );
}

function TechniqueGrid({
  techniques,
  activeTechnique,
  onSelect,
}: {
  techniques: Technique[];
  activeTechnique: Technique | null;
  onSelect: (t: Technique) => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {techniques.map((tech) => (
        <div
          key={tech.slug}
          onClick={() => onSelect(tech)}
          style={{
            padding: "1.25rem",
            borderRadius: "10px",
            background:
              activeTechnique?.slug === tech.slug
                ? "var(--color-surface-hover)"
                : "var(--color-surface)",
            border:
              activeTechnique?.slug === tech.slug
                ? "1px solid var(--color-accent)"
                : "1px solid var(--color-border)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <h3 style={{ marginBottom: "0.3rem" }}>{tech.title}</h3>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            {tech.description}
          </p>
          <div
            style={{
              marginTop: "0.8rem",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
            }}
          >
            {tech.lessons.length}{" "}
            {tech.lessons.length === 1 ? t("lessonCount") : t("lessonsCount")}
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonList({
  technique,
  lessons,
  completedSet,
  onToggle,
  categorySlug,
  techniqueSlug,
}: {
  technique: Technique;
  lessons: Lesson[];
  completedSet: Set<string>;
  onToggle: (id: string) => void;
  categorySlug: string;
  techniqueSlug: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "0.3rem" }}>{technique.title}</h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {technique.description}
          </p>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-accent)",
            background: "rgba(99, 102, 241, 0.1)",
            padding: "0.25rem 0.6rem",
            borderRadius: "6px",
          }}
        >
          {technique.lessons.length}{" "}
          {technique.lessons.length === 1 ? t("lessonCount") : t("lessonsCount")}
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.6rem" }}>
        {lessons.map((lesson, idx) => {
          const done = completedSet.has(lesson.id);
          return (
            <div
              key={lesson.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                opacity: done ? 0.7 : 1,
              }}
            >
              <Link
                href={`/school/lesson/${categorySlug}/${techniqueSlug}/${lesson.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  flex: 1,
                  minWidth: 0,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle(lesson.id);
                  }}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: done ? "none" : "1px solid var(--color-border)",
                    background: done ? "var(--color-accent)" : "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}
                  aria-label={done ? t("markIncomplete") : t("markComplete")}
                >
                  {done ? "✓" : ""}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                    <span
                      style={{
                        color: "var(--color-text-muted)",
                        marginRight: "0.4rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      {idx + 1}.
                    </span>
                    {lesson.title}
                  </div>
                  <div
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.85rem",
                      marginTop: "0.15rem",
                    }}
                  >
                    {lesson.description}
                  </div>
                </div>
              </Link>

              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {lesson.duration}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SchoolPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [session, setSession] = useState<{
    user?: { id: string; email: string; name?: string | null; emailVerified: boolean };
  } | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/school/full")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load school data");
        return r.json();
      })
      .then((data: Category[]) => {
        if (cancelled) return;
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("[session] failed", err);
      } finally {
        setSessionLoading(false);
      }
    };
    fetchSession();
  }, []);

  const toggleLesson = (id: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading || sessionLoading) {
    return (
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <p style={{ color: "var(--color-text-muted)" }}>Loading school…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <p style={{ color: "#fca5a5" }}>Error: {error}</p>
      </div>
    );
  }

  const active = activeCategory || categories[0];
  const user = session?.user;
  const isVerified = Boolean(user?.emailVerified);

  return (
    <>
      <SEO
        title={`Bartender School — ${t("heroTitlePrefix")} ${t("heroTitleAccent")}`}
        description={t("schoolDescription")}
        path="/school"
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "0.5rem" }}>{t("schoolTitle")}</h1>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              {t("schoolDescription")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {!user ? (
              <Link
                href="/auth/signin"
                style={{
                  padding: "0.65rem 1.1rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            ) : (
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.35rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: isVerified
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(250, 204, 21, 0.12)",
                  color: isVerified ? "#4ade80" : "#facc15",
                }}
              >
                {isVerified ? "Verified" : "Unverified"}
              </span>
            )}
            {user && (
              <Link
                href="/profile"
                style={{
                  padding: "0.65rem 1.1rem",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #f59e0b, #ef4444)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Profile
              </Link>
            )}
          </div>
        </header>

        <CategoryTabs
          categories={categories}
          active={active}
          onChange={(c) => {
            setActiveCategory(c);
            setActiveTechnique(null);
          }}
        />

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <SpaceUniverse
            category={active}
            completedLessons={completedLessons}
            onSelectLesson={(categorySlug, techniqueSlug, lessonId) => {
              const next = active.techniques.find((t: Technique) => t.slug === techniqueSlug) || null;
              setActiveTechnique(next ? { ...next } : null);
              window.location.href = `/school/lesson/${categorySlug}/${techniqueSlug}/${lessonId}`;
            }}
            activeTechniqueSlug={activeTechnique?.slug || null}
            onBack={() => setActiveTechnique(null)}
          />
        </div>
      </div>
    </>
  );
}
