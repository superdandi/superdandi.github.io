"use client";

import { useEffect, useRef } from "react";

interface NeonGlow {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  phase: number;
}

const COLORS = [
  "rgba(0, 243, 255, 0.15)",   // cyan
  "rgba(255, 0, 255, 0.12)",   // magenta
  "rgba(255, 180, 50, 0.10)",  // amber
  "rgba(0, 255, 65, 0.09)",    // green
  "rgba(255, 50, 100, 0.08)",  // hot pink
  "rgba(120, 50, 255, 0.10)",  // purple
];

export default function Cityscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowsRef = useRef<NeonGlow[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Initialize neon glows — MAXIMALIST: triple count, larger, brighter
    glowsRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: h * 0.2 + Math.random() * h * 0.6,
      radius: 60 + Math.random() * 200,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      timeRef.current += 0.01;
      ctx.clearRect(0, 0, w, h);

      // Dark gradient base
      const grad = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, h);
      grad.addColorStop(0, "rgba(5, 5, 20, 0.3)");
      grad.addColorStop(0.5, "rgba(2, 2, 10, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw animated neon glows
      for (const glow of glowsRef.current) {
        const pulse = 0.6 + 0.4 * Math.sin(timeRef.current * glow.speed + glow.phase);
        const r = glow.radius * pulse;

        const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, r);
        gradient.addColorStop(0, glow.color.replace("0.0", String(Math.min(0.15, pulse * 0.12))));
        gradient.addColorStop(0.5, glow.color.replace("0.0", String(Math.min(0.06, pulse * 0.04))));
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Slow drift
        glow.x += Math.sin(timeRef.current * 0.2 + glow.phase) * 0.15;
        glow.y += Math.cos(timeRef.current * 0.15 + glow.phase) * 0.05;

        // Keep in bounds
        if (glow.x < -100) glow.x = w + 100;
        if (glow.x > w + 100) glow.x = -100;
        if (glow.y < 0) glow.y = 0;
        if (glow.y > h) glow.y = h * 0.8;
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
}
