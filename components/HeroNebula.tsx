'use client';

import { useEffect, useRef } from 'react';

type Molecule = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
};

type Bond = {
  from: number;
  to: number;
};

type ReagentDrop = {
  x: number;
  y: number;
  r: number;
  hue: number;
  phase: number;
  speed: number;
};

export default function HeroNebula() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const moleculesRef = useRef<Molecule[]>([]);
  const bondsRef = useRef<Bond[]>([]);
  const dropsRef = useRef<ReagentDrop[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight || Math.max(600, window.innerHeight * 0.75);
    };
    resize();
    window.addEventListener('resize', resize);

    const MOLE_COUNT = 90;
    const DROP_COUNT = 18;
    const BOND_MAX_DIST = 140;

    const palette = [143, 168, 143, 200, 168, 76, 91, 164, 160];

    const molecules: Molecule[] = [];
    for (let i = 0; i < MOLE_COUNT; i++) {
      molecules.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        r: 1.6 + Math.random() * 2.2,
        hue: palette[Math.floor(Math.random() * palette.length)],
      });
    }
    moleculesRef.current = molecules;

    const drops: ReagentDrop[] = [];
    for (let i = 0; i < DROP_COUNT; i++) {
      drops.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        r: 1.8 + Math.random() * 3.6,
        hue: palette[Math.floor(Math.random() * palette.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.6,
      });
    }
    dropsRef.current = drops;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.016;
      const t = timeRef.current;

      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.04;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      // base tint
      ctx.fillStyle = 'rgba(11, 18, 16, 0.12)';
      ctx.fillRect(0, 0, w, h);

      // update molecules
      molecules.forEach((m) => {
        m.x += m.vx + mouse.current.x * 0.00008;
        m.y += m.vy + mouse.current.y * 0.00008;
        if (m.x < -1.1) m.x = 1.1;
        if (m.x > 1.1) m.x = -1.1;
        if (m.y < -1.1) m.y = 1.1;
        if (m.y > 1.1) m.y = -1.1;
      });

      // build bonds
      const bonds: Bond[] = [];
      for (let i = 0; i < molecules.length; i++) {
        for (let j = i + 1; j < molecules.length; j++) {
          const dx = molecules[i].x - molecules[j].x;
          const dy = molecules[i].y - molecules[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < BOND_MAX_DIST / (w || 1)) {
            bonds.push({ from: i, to: j });
          }
        }
      }
      bondsRef.current = bonds;

      // draw bonds
      bonds.forEach((bond) => {
        const a = molecules[bond.from];
        const b = molecules[bond.to];
        ctx.beginPath();
        ctx.moveTo((a.x * 0.5 + 0.5) * w, (a.y * 0.5 + 0.5) * h);
        ctx.lineTo((b.x * 0.5 + 0.5) * w, (b.y * 0.5 + 0.5) * h);
        ctx.strokeStyle = 'rgba(143, 188, 143, 0.12)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // draw molecules
      molecules.forEach((m) => {
        const x = (m.x * 0.5 + 0.5) * w;
        const y = (m.y * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${m.hue}, 35%, 65%, 0.55)`;
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 169, 75, 0.25)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // draw reagent drops
      drops.forEach((d) => {
        d.phase += d.speed * 0.016;
        const x = (d.x * 0.5 + 0.5) * w + Math.sin(d.phase) * 14;
        const y = (d.y * 0.5 + 0.5) * h + Math.cos(d.phase * 1.3) * 10;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 45%, 60%, 0.12)`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${d.hue}, 50%, 65%, 0.35)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // subtle grid
      ctx.strokeStyle = 'rgba(143, 188, 143, 0.06)';
      ctx.lineWidth = 0.5;
      const step = 48;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
