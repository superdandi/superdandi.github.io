"use client";

import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  wind: number;
}

interface Trail {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

export default function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const dropsRef = useRef<Drop[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const flashRef = useRef(0);
  const lightningTimerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // On mobile, reduce density
    const isMobile = w < 768;
    const dropCount = prefersReduced ? 30 : isMobile ? 80 : 180;

    // Initialize drops
    dropsRef.current = Array.from({ length: dropCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 4 + Math.random() * 8,
      length: 10 + Math.random() * 20,
      opacity: 0.15 + Math.random() * 0.25,
      wind: -0.3 + Math.random() * 0.6,
    }));

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Flash from lightning
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(180, 220, 255, ${flashRef.current * 0.06})`;
        ctx.fillRect(0, 0, w, h);
        flashRef.current -= 0.02;
      }

      // Draw trails (water streaks on glass)
      ctx.strokeStyle = "rgba(150, 200, 255, 0.04)";
      ctx.lineWidth = 1.5;
      for (const trail of trailsRef.current) {
        const alpha = (trail.life / trail.maxLife) * 0.06;
        ctx.strokeStyle = `rgba(150, 200, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(trail.x, trail.y);
        ctx.lineTo(trail.x - 2, trail.y + 20);
        ctx.stroke();
        trail.life--;
        trail.y += 0.3;
      }
      trailsRef.current = trailsRef.current.filter((t) => t.life > 0);

      // Spawn new trails occasionally
      if (Math.random() < 0.03 && trailsRef.current.length < 30) {
        trailsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.5,
          life: 60 + Math.random() * 120,
          maxLife: 180,
        });
      }

      // Draw rain
      for (const drop of dropsRef.current) {
        ctx.strokeStyle = `rgba(150, 200, 255, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.wind * 3, drop.y + drop.length);
        ctx.stroke();

        drop.x += drop.wind;
        drop.y += drop.speed;

        // Wrap around
        if (drop.y > h + 20) {
          drop.y = -20;
          drop.x = Math.random() * w;
        }
        if (drop.x > w + 10) drop.x = -10;
        if (drop.x < -10) drop.x = w + 10;
      }

      // Lightning
      lightningTimerRef.current--;
      if (lightningTimerRef.current <= 0 && Math.random() < 0.005) {
        flashRef.current = 0.6 + Math.random() * 0.4;
        lightningTimerRef.current = 200 + Math.random() * 400;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (!prefersReduced) {
      draw();
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
}
