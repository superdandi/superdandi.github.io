"use client";

import { useEffect, useRef, useCallback } from "react";

export default function VHSGlitch() {
  const glitchRef = useRef<HTMLDivElement>(null);

  const triggerGlitch = useCallback(() => {
    // Allow overlapping glitches for MAXIMALIST chaos
    const el = glitchRef.current;
    if (!el) return;

    const type = Math.random();
    const duration = 150 + Math.random() * 400;

    if (type < 0.25) {
      // Horizontal scan line glitch
      const h = 3 + Math.random() * 10;
      const top = Math.random() * 100;
      el.style.display = "block";
      el.style.top = `${top}%`;
      el.style.height = `${h}px`;
      el.style.background = `rgba(255, 255, 255, ${0.06 + Math.random() * 0.12})`;
      el.style.transform = `translateX(${(Math.random() - 0.5) * 12}px)`;
    } else if (type < 0.5) {
      // Color shift bar — INTENSE
      const h = 5 + Math.random() * 20;
      const top = Math.random() * 100;
      el.style.display = "block";
      el.style.top = `${top}%`;
      el.style.height = `${h}px`;
      const colors = [
        `rgba(0, 243, 255, 0.08)`,
        `rgba(255, 0, 255, 0.07)`,
        `rgba(255, 180, 50, 0.06)`,
        `rgba(0, 255, 65, 0.06)`,
      ];
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.transform = `translateX(${(Math.random() - 0.5) * 15}px)`;
    } else if (type < 0.75) {
      // Chromatic aberration offset — TWO overlapping bars
      const h = 4 + Math.random() * 18;
      const top = Math.random() * 100;
      el.style.display = "block";
      el.style.top = `${top}%`;
      el.style.height = `${h}px`;
      // Simulate color split via box-shadow
      el.style.background = "rgba(0,243,255,0.05)";
      el.style.boxShadow = `4px 0 0 rgba(255,0,255,0.05), -4px 0 0 rgba(255,180,50,0.04)`;
      el.style.transform = "none";
    } else {
      // Full screen flicker
      el.style.display = "block";
      el.style.top = "0";
      el.style.height = "100%";
      el.style.background = `rgba(255, 255, 255, ${0.03 + Math.random() * 0.04})`;
      el.style.transform = "none";
    }

    setTimeout(() => {
      if (el) {
        el.style.display = "none";
        el.style.boxShadow = "none";
      }
    }, duration);
  }, []);

  useEffect(() => {
    // Random glitch interval
    let timeout: NodeJS.Timeout;

    const scheduleGlitch = () => {
      const delay = 1000 + Math.random() * 6000; // Every 1-7 seconds (MAXIMALIST)
      timeout = setTimeout(() => {
        triggerGlitch();
        scheduleGlitch();
      }, delay);
    };

    scheduleGlitch();

    return () => clearTimeout(timeout);
  }, [triggerGlitch]);

  return (
    <div
      ref={glitchRef}
      aria-hidden="true"
      className="fixed left-0 right-0 pointer-events-none"
      style={{
        display: "none",
        zIndex: 6,
        mixBlendMode: "screen",
      }}
    />
  );
}
