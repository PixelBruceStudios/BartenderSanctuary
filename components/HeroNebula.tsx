'use client';

import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  hue: number;
  twinkleSpeed: number;
  twinkleOffset: number;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  hue: number;
};

type NebulaBlob = {
  x: number;
  y: number;
  radius: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  driftX: number;
  driftY: number;
  pulseSpeed: number;
  pulseOffset: number;
};

export default function HeroNebula() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaRef = useRef<NebulaBlob[]>([]);
  const timeRef = useRef(0);

  // Initialize once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate stars
    const stars: Star[] = [];
    const STAR_COUNT = 300;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 3,
        size: 0.3 + Math.random() * 2,
        hue: 220 + Math.random() * 80, // blue to purple range
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;

    // Generate nebula blobs
    const nebula: NebulaBlob[] = [
      {
        x: -0.15,
        y: -0.2,
        radius: 280,
        hue: 240,
        saturation: 70,
        lightness: 60,
        alpha: 0.15,
        driftX: 0.3,
        driftY: 0.2,
        pulseSpeed: 0.4,
        pulseOffset: 0,
      },
      {
        x: 0.2,
        y: 0.15,
        radius: 320,
        hue: 270,
        saturation: 65,
        lightness: 55,
        alpha: 0.12,
        driftX: -0.25,
        driftY: 0.3,
        pulseSpeed: 0.35,
        pulseOffset: 2,
      },
      {
        x: 0,
        y: 0.1,
        radius: 250,
        hue: 190,
        saturation: 80,
        lightness: 50,
        alpha: 0.1,
        driftX: 0.2,
        driftY: -0.15,
        pulseSpeed: 0.45,
        pulseOffset: 4,
      },
      {
        x: -0.1,
        y: -0.1,
        radius: 200,
        hue: 300,
        saturation: 60,
        lightness: 65,
        alpha: 0.08,
        driftX: -0.15,
        driftY: -0.2,
        pulseSpeed: 0.5,
        pulseOffset: 1,
      },
    ];
    nebulaRef.current = nebula;

    // Shooting stars state
    const shootingStars: ShootingStar[] = [];

    let animId: number;
    let lastShoot = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth * window.devicePixelRatio;
      canvas.height = parent.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const spawnShootingStar = (time: number) => {
      if (shootingStars.length >= 2) return; // max 2 at once
      if (time - lastShoot < 3000 + Math.random() * 5000) return; // 3-8s cooldown
      
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      shootingStars.push({
        x: Math.random() * w * 0.8 + w * 0.1,
        y: Math.random() * h * 0.3,
        vx: 3 + Math.random() * 4,
        vy: 1 + Math.random() * 2,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        length: 30 + Math.random() * 40,
        hue: 200 + Math.random() * 60,
      });
      lastShoot = time;
    };

    const draw = (time: number) => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      timeRef.current = time;

      // Smooth mouse
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Draw nebula blobs (soft gradients)
      for (const blob of nebula) {
        const driftX = Math.sin(time * 0.0005 * blob.pulseSpeed + blob.pulseOffset) * 30 * blob.driftX;
        const driftY = Math.cos(time * 0.0005 * blob.pulseSpeed + blob.pulseOffset) * 20 * blob.driftY;
        const pulse = 1 + Math.sin(time * 0.001 * blob.pulseSpeed + blob.pulseOffset) * 0.15;
        
        const cx = w * 0.5 + blob.x * w + driftX + mx * 20;
        const cy = h * 0.5 + blob.y * h + driftY + my * 15;
        const r = blob.radius * pulse;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha})`);
        gradient.addColorStop(0.5, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      // Draw stars
      for (const star of starsRef.current) {
        const parallaxX = mx * 25 * star.z;
        const parallaxY = my * 20 * star.z;
        const x = w * 0.5 + star.x * w * 0.45 + parallaxX;
        const y = h * 0.5 + star.y * h * 0.4 + parallaxY;

        const depthFactor = (star.z + 1) / 4;
        const baseAlpha = 0.3 + depthFactor * 0.7;
        const twinkle = Math.sin(time * 0.002 * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = baseAlpha * twinkle;
        const size = star.size * (0.7 + depthFactor * 0.3);

        // Main star
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 50%, 75%, ${alpha})`;
        ctx.fill();

        // Glow for larger/brighter stars
        if (size > 1.2 && depthFactor > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${star.hue}, 60%, 70%, ${alpha * 0.12})`;
          ctx.fill();
        }

        // Tiny cross flare for brightest stars
        if (size > 1.6 && depthFactor > 0.7) {
          ctx.strokeStyle = `hsla(${star.hue}, 70%, 85%, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x - size * 2, y);
          ctx.lineTo(x + size * 2, y);
          ctx.moveTo(x, y - size * 2);
          ctx.lineTo(x, y + size * 2);
          ctx.stroke();
        }
      }

      // Spawn shooting stars
      spawnShootingStar(time);

      // Update & draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        if (s.life > s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const progress = s.life / s.maxLife;
        const fade = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const tailX = s.x - s.vx * s.length * 0.3;
        const tailY = s.y - s.vy * s.length * 0.3;

        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `hsla(${s.hue}, 80%, 80%, 0)`);
        gradient.addColorStop(1, `hsla(${s.hue}, 90%, 90%, ${0.8 * fade})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow at head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 95%, ${0.9 * fade})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Track mouse
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = el.getBoundingClientRect();
        mouse.current.targetX = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.targetY = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 10, 15, 0.7) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
