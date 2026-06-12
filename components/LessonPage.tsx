import { useState, useEffect, useRef } from "react";
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

function LessonContent({ categorySlug, techniqueSlug, lessonId }: LessonProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setReadProgress(0);
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
    return () => { cancelled = true; };
  }, [lessonId]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
      const progress = Math.min(100, Math.max(0, (visible / total) * 100));
      setReadProgress(progress);
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
          }}
        >
          <span>{lesson.techniqueTitle}</span>
          {lesson.categoryTitle && <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>}
          {lesson.categoryTitle && <span>{lesson.categoryTitle}</span>}
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

        {/* Back */}
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
    </div>
  );
}

export default function LessonPage({ categorySlug, techniqueSlug, lessonId }: LessonProps) {
  return (
    <>
      <Head>
        <title>Lesson | Bartender School</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <LessonContent categorySlug={categorySlug} techniqueSlug={techniqueSlug} lessonId={lessonId} />
      </div>
    </>
  );
}
