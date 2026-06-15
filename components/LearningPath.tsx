import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChemistryBackground from "@/components/ChemistryBackground";

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

type LearningPathProps = {
  category: Category;
  completedLessons: Set<string>;
  onSelectLesson: (categorySlug: string, techniqueSlug: string, lessonId: string) => void;
  activeTechniqueSlug: string | null;
  onBack: () => void;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#4ade80",
  Intermediate: "#facc15",
  Advanced: "#f87171",
};

export default function LearningPath({
  category,
  completedLessons,
  onSelectLesson,
  activeTechniqueSlug,
  onBack,
}: LearningPathProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const allLessons = category.techniques.flatMap((t) =>
    t.lessons.map((l) => ({ ...l, techniqueSlug: t.slug, techniqueTitle: t.title }))
  );

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedLessons.has(l.id)).length;
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "600px",
        background: `
          radial-gradient(ellipse at top, rgba(143,188,143,0.1) 0%, transparent 55%),
          radial-gradient(ellipse at bottom right, rgba(200,168,76,0.08) 0%, transparent 55%),
          #0c0f0d
        `,
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <ChemistryBackground />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "1.75rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Learning Path
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span>{category.icon}</span>
            <span>{category.title}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            {category.description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Progress
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#c8a84c" }}>
              {completedCount}/{totalLessons}
            </div>
          </div>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.08)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="48" height="48" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#c8a84c"
                strokeWidth="3"
                strokeDasharray={`${progress * 1.256} 125.6`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#e2e8f0" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "0.5rem 0.9rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s",
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Technique clusters */}
      <div style={{ position: "relative", zIndex: 2, padding: "2rem" }}>
        {category.techniques.map((technique, techIdx) => {
          const isActive = activeTechniqueSlug === technique.slug;
          const techCompleted = technique.lessons.filter((l) => completedLessons.has(l.id)).length;
          const techTotal = technique.lessons.length;
          const techProgress = techTotal > 0 ? (techCompleted / techTotal) * 100 : 0;

          return (
            <div
              key={technique.slug}
              style={{
                marginBottom: "2.5rem",
              }}
            >
              {/* Technique header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                  cursor: "pointer",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: isActive ? "rgba(143,188,143,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(143,188,143,0.3)" : "rgba(255,255,255,0.04)"}`,
                  transition: "all 0.2s ease",
                }}
                onClick={() => {
                  // Toggle technique expansion by selecting first lesson
                  if (!isActive && technique.lessons.length > 0) {
                    onSelectLesson(category.slug, technique.slug, technique.lessons[0].id);
                  }
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isActive ? "linear-gradient(135deg, #8fbc8f, #a8c9a8)" : "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    flexShrink: 0,
                    boxShadow: isActive ? "0 0 20px rgba(143,188,143,0.35)" : "none",
                  }}
                >
                  {techIdx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "1rem", color: isActive ? "#fff" : "rgba(255,255,255,0.9)" }}>
                    {technique.title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "0.15rem" }}>
                    {technique.description}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
                  {techCompleted}/{techTotal}
                </div>
              </div>

              {/* Lesson nodes */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginLeft: "1.5rem",
                  paddingLeft: "1.5rem",
                  borderLeft: isActive ? "2px solid rgba(143,188,143,0.3)" : "2px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.3s",
                }}
              >
                {technique.lessons.map((lesson, lessonIdx) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isHovered = hoveredNode === lesson.id;
                  const isFirst = lessonIdx === 0;
                  const isLast = lessonIdx === technique.lessons.length - 1;

                  return (
                    <div
                      key={lesson.id}
                      onMouseEnter={() => setHoveredNode(lesson.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => onSelectLesson(category.slug, technique.slug, lesson.id)}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.65rem 1rem",
                        borderRadius: "10px",
                        background: isCompleted
                          ? "rgba(74, 222, 128, 0.08)"
                          : isHovered
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${
                          isCompleted
                            ? "rgba(74, 222, 128, 0.25)"
                            : isHovered
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.06)"
                        }`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        flex: "1 1 220px",
                        maxWidth: "320px",
                        minWidth: "200px",
                        boxShadow: isCompleted
                          ? "0 0 18px rgba(74, 222, 128, 0.12)"
                          : isHovered
                          ? "0 0 20px rgba(143,188,143,0.18)"
                          : "none",
                      }}
                    >
                      {/* Connection dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-1.55rem",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: isCompleted ? "#4ade80" : "rgba(255,255,255,0.25)",
                          border: "2px solid #07070f",
                          boxShadow: isCompleted ? "0 0 8px rgba(74, 222, 128, 0.5)" : "none",
                          transition: "all 0.2s",
                        }}
                      />

                      {/* Node indicator */}
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: isCompleted
                            ? "#4ade80"
                            : isHovered
                            ? "#c8a84c"
                            : "rgba(255,255,255,0.3)",
                          boxShadow: isCompleted
                            ? "0 0 6px rgba(74, 222, 128, 0.6)"
                            : isHovered
                            ? "0 0 6px rgba(200, 168, 76, 0.5)"
                            : "none",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                            color: isCompleted ? "#4ade80" : "rgba(255,255,255,0.9)",
                            marginBottom: "0.2rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          {isCompleted && (
                            <span style={{ fontSize: "0.7rem" }}>✓</span>
                          )}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {lesson.title}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.45)",
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.15rem 0.4rem",
                              borderRadius: "4px",
                              background: `${DIFFICULTY_COLORS[lesson.difficulty] || "rgba(255,255,255,0.1)"}20`,
                              color: DIFFICULTY_COLORS[lesson.difficulty] || "rgba(255,255,255,0.5)",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          >
                            {lesson.difficulty}
                          </span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>

                      {isCompleted && (
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "#4ade80",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.65rem",
                            color: "#000",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
