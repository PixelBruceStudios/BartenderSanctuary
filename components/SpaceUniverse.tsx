import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

interface SpaceUniverseProps {
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
}: SpaceUniverseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    planets: Map<string, THREE.Group>;
    orbits: THREE.Line[];
    raf: number;
  } | null>(null);

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

  const categoryColors = useMemo(() => {
    const palette = [
      ["#6366f1", "#8b5cf6"],
      ["#3b82f6", "#06b6d4"],
      ["#f59e0b", "#ef4444"],
      ["#10b981", "#3b82f6"],
      ["#ec4899", "#f59e0b"],
    ];
    const idx = category.techniques.length % palette.length;
    return palette[idx];
  }, [category.techniques.length]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(600, Math.min(800, window.innerHeight * 0.7));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020208, 0.0008);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    camera.position.set(0, 30, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 30;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambient);

    const sunLight = new THREE.PointLight(0xffeedd, 2.5, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    rimLight.position.set(50, 20, -50);
    scene.add(rimLight);

    const sunGeo = new THREE.SphereGeometry(4, 64, 64);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xffaa44,
      emissive: 0xff8800,
      emissiveIntensity: 1.5,
      roughness: 0.3,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    const glowGeo = new THREE.SphereGeometry(6, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 300 + Math.random() * 400;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice > 0.9) {
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice > 0.8) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.7;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starsMat = new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.9 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    const planets = new Map<string, THREE.Group>();
    const orbits: THREE.Line[] = [];
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const techniqueCount = category.techniques.length;
    category.techniques.forEach((technique, idx) => {
      const angle = (idx / techniqueCount) * Math.PI * 2;
      const orbitRadius = 25 + idx * 14;
      const yOffset = (Math.random() - 0.5) * 16;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;

      const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.15, orbitRadius + 0.15, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x444466,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      orbit.position.y = yOffset;
      scene.add(orbit);
      orbits.push(orbit as unknown as THREE.Line);

      const planetRoot = new THREE.Group();
      planetRoot.position.set(x, yOffset, z);

      const radius = 2.5 + technique.lessons.length * 0.35;
      const planetGeo = new THREE.SphereGeometry(radius, 48, 48);
      const colorA = new THREE.Color(categoryColors[0]);
      const colorB = new THREE.Color(categoryColors[1]);
      const planetColor = colorA.clone().lerp(colorB, idx / techniqueCount);
      const planetMat = new THREE.MeshStandardMaterial({
        color: planetColor,
        roughness: 0.5,
        metalness: 0.2,
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetRoot.add(planetMesh);

      const atmoGeo = new THREE.SphereGeometry(radius * 1.15, 48, 48);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: planetColor,
        transparent: true,
        opacity: 0.12,
      });
      const atmo = new THREE.Mesh(atmoGeo, atmoMat);
      planetRoot.add(atmo);

      technique.lessons.forEach((lesson, lIdx) => {
        const moonGeo = new THREE.SphereGeometry(0.35, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({
          color: completedLessons.has(lesson.id) ? 0x4ade80 : 0x888899,
          roughness: 0.6,
          emissive: completedLessons.has(lesson.id) ? 0x22c55e : 0x000000,
          emissiveIntensity: completedLessons.has(lesson.id) ? 0.4 : 0,
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        const moonAngle = (lIdx / technique.lessons.length) * Math.PI * 2;
        const moonDist = radius + 1.8;
        moon.position.set(
          Math.cos(moonAngle) * moonDist,
          (Math.random() - 0.5) * 1.5,
          Math.sin(moonAngle) * moonDist
        );
        moon.userData = { lessonId: lesson.id, techniqueSlug: technique.slug, baseY: moon.position.y };
        planetRoot.add(moon);
      });

      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "bold 36px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(technique.title, 256, 70);
      const labelTex = new THREE.CanvasTexture(canvas);
      const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, opacity: 0.85 });
      const label = new THREE.Sprite(labelMat);
      label.scale.set(radius * 3.5, radius * 0.9, 1);
      label.position.y = radius + 2.5;
      planetRoot.add(label);

      planetRoot.userData = {
        techniqueSlug: technique.slug,
        techniqueTitle: technique.title,
        baseY: yOffset,
        orbitRadius,
        angle,
      };

      planetGroup.add(planetRoot);
      planets.set(technique.slug, planetRoot);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const planetMeshes: THREE.Mesh[] = [];
    planetGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry.type === "SphereGeometry" && child !== sun) {
        planetMeshes.push(child);
      }
    });

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const parent = hit.parent;
        if (parent && parent.userData.techniqueSlug) {
          const next =
            selectedPlanet === parent.userData.techniqueSlug
              ? null
              : parent.userData.techniqueSlug;
          setSelectedPlanet(next);
        }
      }
    };

    const handleHover = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const parent = hit.parent;
        if (parent && parent.userData.techniqueSlug) {
          setHoveredPlanet(parent.userData.techniqueSlug);
          container.style.cursor = "pointer";
          return;
        }
      }
      setHoveredPlanet(null);
      container.style.cursor = "grab";
    };

    renderer.domElement.addEventListener("click", handleClick);
    renderer.domElement.addEventListener("mousemove", handleHover);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      sun.rotation.y += 0.002;
      glow.scale.setScalar(1 + Math.sin(t * 0.8) * 0.1);

      planets.forEach((planetRoot) => {
        const ud = planetRoot.userData;
        const angle = ud.angle + t * 0.05;
        planetRoot.position.x = Math.cos(angle) * ud.orbitRadius;
        planetRoot.position.z = Math.sin(angle) * ud.orbitRadius;
        planetRoot.position.y = ud.baseY + Math.sin(t * 0.4 + ud.angle) * 1.2;

        planetRoot.rotation.y += 0.005;

        planetRoot.children.forEach((child) => {
          if (child.userData && child.userData.lessonId) {
            const baseY = child.userData.baseY || 0;
            child.position.y = baseY + Math.sin(t * 1.2 + planetRoot.position.x) * 0.4;
          }
        });
      });

      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;

      controls.update();
      renderer.render(scene, camera);
      if (sceneRef.current) {
        sceneRef.current.raf = requestAnimationFrame(animate);
      }
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = Math.max(600, Math.min(800, window.innerHeight * 0.7));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      planets,
      orbits,
      raf: 0,
    };

    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.raf);
      }
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("mousemove", handleHover);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, [category, completedLessons, onSelectLesson]);

  const selectedTechnique = category.techniques.find((t) => t.slug === selectedPlanet) || null;

  const universeHeight = isMobile ? Math.min(520, window.innerHeight * 0.55) : Math.max(600, Math.min(800, window.innerHeight * 0.7));

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
          background: "rgba(7,7,15,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Learning Universe
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
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#a5b4fc" }}>
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
                stroke="#a5b4fc"
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

      {/* 3D Canvas */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: universeHeight,
          position: "relative",
          background: "#020208",
          borderRadius: "0 0 16px 16px",
          overflow: "hidden",
        }}
      />

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
              background: "rgba(7,7,15,0.92)",
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
      {hoveredPlanet && !selectedPlanet && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "1rem" : "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(7,7,15,0.9)",
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
          {category.techniques.find((t) => t.slug === hoveredPlanet)?.title}
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
        Drag to rotate • Scroll to zoom • Click a planet to explore lessons
      </div>
    </div>
  );
}
