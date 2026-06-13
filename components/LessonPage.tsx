import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "@/lib/contexts";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  content: string;
  sort_order: number;
  sources: { citation: string; url: string }[];
  techniqueSlug?: string;
  techniqueTitle?: string;
  categorySlug?: string;
  categoryTitle?: string;
}

interface LessonProps {
  categorySlug: string;
  techniqueSlug: string;
  lessonId: string;
}

type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  techniques: {
    id: string;
    slug: string;
    title: string;
    description: string;
    sort_order: number;
    lessons: Lesson[];
  }[];
};

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1 + 0.3,
      opacity: Math.random() * 0.4 + 0.2,
      speed: Math.random() * 0.0004 + 0.0002,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = (t: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const alpha = s.opacity + Math.sin(t * s.speed + s.phase) * 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, Math.min(0.6, alpha))})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.6,
      }}
    />
  );
}

/* ── Inline test widget ──────────────────────────────────────────── */
function LessonTest({ lessonId }: { lessonId: string }) {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`/api/tests?scope=lesson&lesson_id=${lessonId}`)
      .then((r) => r.json())
      .then((rows: any[]) => {
        if (rows.length) setTest(rows[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const handleSubmit = useCallback(async () => {
    if (!test || !test.questions) return;
    const answers = test.questions.map((q: any, i: number) => ({
      question_index: i,
      selected: selected[i] ?? -1,
      correct: q.correct_index,
    }));
    const correctCount = answers.filter((a: any) => a.selected === a.correct).length;
    const pct = Math.round((correctCount / test.questions.length) * 100);
    const passed = pct >= (test.passing_score ?? 70);

    await fetch(`/api/tests/${test.id}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: pct, passed, answers, session_id: sessionId }),
    });

    setScore(pct);
    setSubmitted(true);
    if (passed) {
      window.dispatchEvent(new CustomEvent("test-passed", { detail: { testId: test.id } }));
    }
  }, [test, selected, sessionId]);

  if (loading) {
    return (
      <div style={{ marginTop: "2rem", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.5)" }}>
        Loading test…
      </div>
    );
  }

  if (!test) {
    return (
      <div style={{ marginTop: "2rem", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.5)" }}>
        No test has been added for this lesson yet.
      </div>
    );
  }

  const questions = test.questions ?? [];
  const allAnswered = questions.every((_: any, i: number) => selected[i] !== undefined);
  const passThreshold = test.passing_score ?? 70;
  const passed = submitted && score !== null && score >= passThreshold;

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        borderRadius: "12px",
        border: passed
          ? "1px solid rgba(74,222,128,0.4)"
          : "1px solid rgba(255,255,255,0.1)",
        background: passed ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.03)",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "0.4rem",
          color: passed ? "#4ade80" : "#fff",
        }}
      >
        {test.title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem" }}>
        {test.description} · Pass: {passThreshold}% · {questions.length} questions
      </p>

      {questions.map((q: any, i: number) => {
        const userAnswer = selected[i];
        const isCorrect = submitted && userAnswer === q.correct_index;
        const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correct_index;
        return (
          <div
            key={i}
            style={{
              marginBottom: "1.25rem",
              padding: "1rem",
              borderRadius: "10px",
              border: submitted
                ? isCorrect
                  ? "1px solid rgba(74,222,128,0.35)"
                  : isWrong
                  ? "1px solid rgba(248,113,113,0.4)"
                  : "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.15)",
            }}
          >
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.9)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
              {i + 1}. {q.question_text}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(q.options as string[]).map((opt: string, oi: number) => {
                const isChosen = userAnswer === oi;
                const isRightOpt = oi === q.correct_index;
                let optStyle: Record<string, string> = {
                  padding: "0.55rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: submitted ? "default" : "pointer",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.8)",
                  transition: "all 0.15s ease",
                };
                if (!submitted && isChosen) {
                  optStyle = { ...optStyle, borderColor: "rgba(99,102,241,0.6)", background: "rgba(99,102,241,0.12)" };
                }
                if (submitted && isRightOpt) {
                  optStyle = { ...optStyle, borderColor: "rgba(74,222,128,0.5)", background: "rgba(74,222,128,0.1)", color: "#4ade80" };
                }
                if (submitted && isWrong && isChosen) {
                  optStyle = { ...optStyle, borderColor: "rgba(248,113,113,0.4)", background: "rgba(248,113,113,0.08)", color: "#f87171" };
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => !submitted && setSelected((prev) => ({ ...prev, [i]: oi }))}
                    style={optStyle}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && q.explanation && (
              <p
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.5)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                {isCorrect ? "✓" : isWrong ? "✗" : ""} {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: "10px",
            border: allAnswered ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
            background: allAnswered ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
            color: allAnswered ? "#a5b4fc" : "rgba(255,255,255,0.4)",
            cursor: allAnswered ? "pointer" : "not-allowed",
            fontSize: "0.9rem",
            fontWeight: 600,
            marginTop: "0.5rem",
          }}
        >
          Submit answers
        </button>
      ) : (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            background: passed ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
            border: passed ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(248,113,113,0.3)",
            fontSize: "0.9rem",
            color: passed ? "#4ade80" : "#f87171",
            fontWeight: 600,
          }}
        >
          {passed ? "✓ Passed" : "✗ Not passed"} — you scored {score}% (need {passThreshold}%)
          {!passed && (
            <button
              type="button"
              onClick={() => { setSubmitted(false); setSelected({}); setScore(null); }}
              style={{
                marginLeft: "1rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "0.4rem 0.8rem",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Lesson page shell ──────────────────────────────────────────── */
function LessonContent({ categorySlug, techniqueSlug, lessonId }: LessonProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [schoolData, setSchoolData] = useState<Category[]>([]);
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setReadProgress(0);
    setCompleted(false);
    setTestPassed(false);
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Lesson not found");
        return r.json();
      })
      .then((data: Lesson) => {
        if (cancelled) return;
        setLesson(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true };
  }, [lessonId]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/school/full")
      .then((r) => r.json())
      .then((data: Category[]) => {
        if (cancelled) return;
        setSchoolData(data);
      })
      .catch(() => {});
    return () => { cancelled = true };
  }, []);

  // Listen for test-passed custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.testId) setTestPassed(true);
    };
    window.addEventListener("test-passed", handler as EventListener);
    return () => window.removeEventListener("test-passed", handler as EventListener);
  }, []);

  const flatLessons = useMemo(() => {
    const out: { categorySlug: string; techniqueSlug: string; lesson: Lesson }[] = [];
    schoolData.forEach((cat: Category) => {
      cat.techniques.forEach((tech: Category["techniques"][number]) => {
        tech.lessons.forEach((l: Lesson) => {
          out.push({ categorySlug: cat.slug, techniqueSlug: tech.slug, lesson: l });
        });
      });
    });
    return out;
  }, [schoolData]);

  const currentIndex = flatLessons.findIndex(
    (item) =>
      item.categorySlug === categorySlug &&
      item.techniqueSlug === techniqueSlug &&
      item.lesson.id === lessonId
  );

  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;
  const lessonProgress =
    flatLessons.length > 0 ? Math.round(((currentIndex + 1) / flatLessons.length) * 100) : 0;

  // Completion gating: can only mark complete if test is passed
  const canComplete = testPassed || !lesson; // if no test exists yet, allow manual complete

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
      const progressVal = Math.min(100, Math.max(0, (visible / total) * 100));
      setReadProgress(progressVal);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lesson]);

  if (loading) {
    return (
      <div
        style={{
          position: "relative",
          minHeight: "400px",
          background: "#07070f",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <StarField />
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", position: "relative", zIndex: 2 }}>
          Loading lesson…
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div
        style={{
          position: "relative",
          minHeight: "400px",
          background: "#07070f",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#fca5a5", padding: "3rem 0", position: "relative", zIndex: 2 }}>
          {error || "Lesson not found"}
        </div>
      </div>
    );
  }

  const difficultyColor: Record<string, string> = {
    Beginner: "#4ade80",
    Intermediate: "#facc15",
    Advanced: "#f87171",
  };

  return (
    <div
      style={{
        position: "relative",
        background: `
          radial-gradient(ellipse at top left, rgba(99,102,241,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(168,85,247,0.08) 0%, transparent 50%),
          #07070f
        `,
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <StarField />

      {/* Reading progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "2px",
          width: `${readProgress}%`,
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          zIndex: 10,
          transition: "width 0.1s linear",
          boxShadow: "0 0 10px rgba(99,102,241,0.6)",
        }}
      />

      {/* Breadcrumb */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.5)",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/school" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>School</Link>
        <span>/</span>
        {lesson.categoryTitle && <span>{lesson.categoryTitle}</span>}
        {lesson.categoryTitle && <span>/</span>}
        {lesson.techniqueTitle && <span>{lesson.techniqueTitle}</span>}
        {lesson.techniqueTitle && <span>/</span>}
        <span style={{ color: "rgba(255,255,255,0.9)" }}>Lesson</span>
      </div>

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "2.5rem 2rem 1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Lesson
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                fontWeight: 700,
                lineHeight: 1.25,
                color: "#fff",
                marginBottom: "0.75rem",
                textShadow: "0 0 40px rgba(99,102,241,0.3)",
              }}
            >
              {lesson.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "600px" }}>
              {lesson.description}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" }}>
            <div
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>⏱</span>
              <span>{lesson.duration}</span>
            </div>
            <div
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: `1px solid ${difficultyColor[lesson.difficulty] || "rgba(255,255,255,0.1)"}40`,
                background: `${difficultyColor[lesson.difficulty] || "rgba(255,255,255,0.1)"}15`,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: difficultyColor[lesson.difficulty] || "rgba(255,255,255,0.7)",
              }}
            >
              {lesson.difficulty}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: "1.5rem",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.5)",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span>{lesson.techniqueTitle}</span>
          {lesson.categoryTitle && <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>}
          {lesson.categoryTitle && <span>{lesson.categoryTitle}</span>}
          <span style={{ marginLeft: "auto" }}>{lessonProgress}% complete</span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 2,
          padding: "1.5rem 2rem 3rem",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            padding: "2rem",
            lineHeight: 1.9,
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {lesson.content.split("\n\n").map((paragraph, i) => (
            <p key={i} style={{ marginBottom: "1.1rem" }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* ── Inline lesson test ── */}
        <LessonTest lessonId={lessonId} />

        {lesson.sources && lesson.sources.length > 0 && (
          <div
            style={{
              marginTop: "2.5rem",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "0.8rem",
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Sources & Further Reading
            </h3>
            <ul style={{ paddingLeft: "1.2rem", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.9 }}>
              {lesson.sources.map((source, i) => (
                <li key={i}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#a5b4fc", textDecoration: "none" }}
                    >
                      {source.citation} →
                    </a>
                  ) : (
                    source.citation
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            href="/school"
            style={{
              color: "#a5b4fc",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            ← Back to school
          </Link>
        </div>
      </div>

      {/* Completion + nav */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "1.25rem 2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setCompleted((prev) => !prev)}
          disabled={!canComplete}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1rem",
            borderRadius: "12px",
            border: completed
              ? "1px solid rgba(74,222,128,0.4)"
              : testPassed
              ? "1px solid rgba(99,102,241,0.5)"
              : "1px solid rgba(255,255,255,0.12)",
            background: completed ? "rgba(74,222,128,0.1)" : testPassed ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
            color: completed ? "#4ade80" : testPassed ? "#a5b4fc" : "#fff",
            cursor: canComplete ? "pointer" : "not-allowed",
            fontSize: "0.9rem",
            fontWeight: 600,
            opacity: canComplete ? 1 : 0.5,
          }}
        >
          <span>{completed ? "✓" : "○"}</span>
          <span>{completed ? "Completed" : "Mark as complete"}</span>
        </button>

        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
          {prevLesson ? (
            <Link
              href={`/school/lesson/${prevLesson.categorySlug}/${prevLesson.techniqueSlug}/${prevLesson.lesson.id}`}
              style={{ color: "#a5b4fc", textDecoration: "none" }}
            >
              ← {prevLesson.lesson.title}
            </Link>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <Link
              href={`/school/lesson/${nextLesson.categorySlug}/${nextLesson.techniqueSlug}/${nextLesson.lesson.id}`}
              style={{ color: "#a5b4fc", textDecoration: "none" }}
            >
              {nextLesson.lesson.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}

export default function LessonPage({ categorySlug, techniqueSlug, lessonId }: LessonProps) {
  return (
    <>
      <Head>
        <title>Lesson — Bartender Sanctuary</title>
      </Head>
      <LessonContent categorySlug={categorySlug} techniqueSlug={techniqueSlug} lessonId={lessonId} />
    </>
  );
}
