'use client';

import { useEffect, useRef, useState, useMemo } from "react";

type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  content: string;
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

interface ChemistryLabProps {
  category: Category;
  completedLessons: Set<string>;
  onSelectLesson: (categorySlug: string, techniqueSlug: string, lessonId: string) => void;
  activeTechniqueSlug: string | null;
  onBack: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#4ade80",
  Intermediate: "#facc15",
  Advanced: "#f87171",
};

export default function SpaceUniverse({
  category,
  completedLessons,
  onSelectLesson,
  activeTechniqueSlug,
  onBack,
}: ChemistryLabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const nodesRef = useRef<Map<string, { x: number; y: number; r: number; color: string; techniqueSlug: string }>>(new Map());

  const allLessons = useMemo(
    () =>
      category.techniques.flatMap((t) =>
        t.lessons.map((l) => ({
          ...l,
          techniqueSlug: t.slug,
          techniqueTitle: t.title,
        }))
      ),
    [category]
  );

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedLessons.has(l.id)).length;
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const palette = useMemo(() => {
    const colors = [
      ["#8fbc8f", "#a8c9a8"],
      ["#5ba4a0", "#7da87a"],
      ["#f59e0b", "#b08d2e"],
      ["#10b981", "#5ba4a0"],
      ["#d4a94b", "#f59e0b"],
    ];
    return colors[category.techniques.length % colors.length];
  }, [category.techniques.length]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(520, Math.min(780, window.innerHeight * 0.7));
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = new Map<string, { x: number; y: number; r: number; color: string; techniqueSlug: string }>();
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const techniques = category.techniques;
    const count = techniques.length;

    techniques.forEach((tech, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const radius = Math.min(w, h) * 0.32;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.7;
      const [colorA, colorB] = palette;
      const color = idx % 2 === 0 ? colorA : colorB;
      nodes.set(tech.slug, { x, y, r: 28 + tech.lessons.length * 4, color, techniqueSlug: tech.slug });
    });

    nodesRef.current = nodes;

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(143, 188, 143, 0.06)";
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawMolecule = (x: number, y: number, r: number, color: string, label: string, hovered: boolean, done: boolean) => {
      // outer shell
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = hovered ? "rgba(143, 188, 143, 0.18)" : "rgba(18, 24, 21, 0.7)";
      ctx.fill();
      ctx.strokeStyle = done ? "#4ade80" : color;
      ctx.lineWidth = hovered ? 3 : 2;
      ctx.stroke();

      // inner bond rings
      ctx.beginPath();
      ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
      ctx.strokeStyle = hovered ? "rgba(200, 168, 76, 0.6)" : "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = hovered ? "rgba(200, 168, 76, 0.35)" : "rgba(255,255,255,0.04)";
      ctx.fill();

      // label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const words = label.split(" ");
      if (words.length <= 2) {
        ctx.fillText(label, x, y);
      } else {
        ctx.fillText(words.slice(0, 2).join(" "), x, y - 8);
        ctx.fillText(words.slice(2).join(" "), x, y + 10);
      }
    };

    const drawBond = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "rgba(143, 188, 143, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // bond nodes
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 168, 76, 0.6)";
      ctx.fill();
    };

    const drawCentralFlask = () => {
      const flaskX = cx;
      const flaskY = cy;
      const flaskR = 22;

      // flask body
      ctx.beginPath();
      ctx.arc(flaskX, flaskY + 6, flaskR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 168, 76, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 168, 76, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // flask neck
      ctx.beginPath();
      ctx.moveTo(flaskX - 8, flaskY - 2);
      ctx.lineTo(flaskX - 6, flaskY - 16);
      ctx.lineTo(flaskX + 6, flaskY - 16);
      ctx.lineTo(flaskX + 8, flaskY - 2);
      ctx.stroke();

      // liquid
      ctx.beginPath();
      ctx.arc(flaskX, flaskY + 8, flaskR * 0.7, 0, Math.PI, false);
      ctx.fillStyle = "rgba(91, 164, 160, 0.45)";
      ctx.fill();

      // bubbles
      [flaskX - 6, flaskX + 4, flaskX - 2].forEach((bx, i) => {
        ctx.beginPath();
        ctx.arc(bx, flaskY + 4 + i * 5, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();
      });
    };

    const drawReagentDots = () => {
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + Math.random() * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(143, 188, 143, ${0.15 + Math.random() * 0.35})`;
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // background
      ctx.fillStyle = "#0b1210";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawReagentDots();

      // bonds from central flask to each technique node
      nodes.forEach((node) => drawBond({ x: cx, y: cy }, node));

      drawCentralFlask();

      // technique nodes
      nodes.forEach((node) => {
        const tech = techniques.find((t) => t.slug === node.techniqueSlug);
        const done = tech ? tech.lessons.some((l) => completedLessons.has(l.id)) : false;
        const hovered = hoveredNode === node.techniqueSlug;
        drawMolecule(node.x, node.y, node.r, node.color, tech?.title || "", hovered, done);
      });

      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      nodes.forEach((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.r + 6) {
          setSelectedNode((prev) => (prev === node.techniqueSlug ? null : node.techniqueSlug));
        }
      });
    };

    const handleMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let found: string | null = null;
      nodes.forEach((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.r + 6) {
          found = node.techniqueSlug;
        }
      });
      setHoveredNode(found);
      container.style.cursor = found ? "pointer" : "default";
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, [category, completedLessons, palette]);

  const selectedTechnique = category.techniques.find((t) => t.slug === selectedNode) || null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "1rem" : "1.5rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          background: "rgba(12, 15, 13, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Chemistry Lab
          </div>
          <div style={{ fontSize: isMobile ? "1.25rem" : "1.6rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.6rem", color: "#fff" }}>
            <span>{category.icon}</span>
            <span>{category.title}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: isMobile ? "0.8rem" : "0.9rem", marginTop: "0.25rem" }}>
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
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.08)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={isMobile ? "40" : "48"} height={isMobile ? "40" : "48"} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#c8a84c"
                strokeWidth="3"
                strokeDasharray={`${progress * 1.005} 100.5`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#e2e8f0" }}>
              {Math.round(progress)}%
            </span>
          </div>
          {activeTechniqueSlug && (
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
          )}
        </div>
      </div>

      {/* 2D Chemistry canvas */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          position: "relative",
          background: "#0b1210",
          borderRadius: "0 0 16px 16px",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Technique panel */}
      {selectedTechnique && !activeTechniqueSlug && (() => {
        const technique = selectedTechnique;
        return (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: isMobile ? "1rem" : "2rem",
              transform: "translateX(-50%)",
              width: "min(920px, calc(100% - 1.5rem))",
              background: "rgba(12, 15, 13, 0.92)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
              padding: isMobile ? "1rem" : "1.25rem 1.5rem",
              zIndex: 50,
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Technique
                </div>
                <div style={{ fontSize: isMobile ? "1rem" : "1.1rem", fontWeight: 700, marginTop: "0.2rem" }}>{technique.title}</div>
                <div style={{ fontSize: isMobile ? "0.8rem" : "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: "0.2rem", maxWidth: "560px" }}>
                  {technique.description}
                </div>
              </div>
              <div
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {technique.lessons.length} lessons
              </div>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {technique.lessons.map((lesson, idx) => {
                const done = completedLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(category.slug, technique.slug, lesson.id)}
                    style={{
                      textAlign: "left",
                      padding: "0.9rem 1rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: done ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.03)",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "transform 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.2rem" }}>
                      {idx + 1}. {done ? "✓ Completed" : "Not started"}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{lesson.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem" }}>
                      {lesson.duration} · {lesson.difficulty}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Legend / hover tooltip */}
      {hoveredNode && !selectedNode && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "1rem" : "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(12, 15, 13, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "0.75rem 1.25rem",
            color: "#fff",
            fontSize: "0.9rem",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          {category.techniques.find((t) => t.slug === hoveredNode)?.title}
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Hover a molecule • Click to explore lessons
      </div>
    </div>
  );
}
