"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#6C5CE7", "#A29BFE", "#00B894", "#FD79A8", "#F59E0B"];

/**
 * Lightweight canvas confetti — bursts once on mount,
 * then removes itself. Respects `prefers-reduced-motion`.
 */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const particles = Array.from({ length: 120 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 60 * dpr,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 14 * dpr,
      vy: -(Math.random() * 9 + 3) * dpr,
      size: (Math.random() * 6 + 3) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 0,
    }));

    let raf = 0;
    const gravity = 0.28 * dpr;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        p.life++;
        if (p.life > 130) continue;
        alive = true;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - p.life / 130);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
      else canvas.remove();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    />
  );
}
