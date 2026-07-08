"use client";

import { useEffect, useRef, useCallback } from "react";

export default function VHSGlitch() {
  const glitchRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);

  const triggerGlitch = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const el = glitchRef.current;
    if (!el) return;

    const type = Math.random();
    const duration = 100 + Math.random() * 300;

    if (type < 0.3) {
      // Horizontal scan line glitch
      const h = 2 + Math.random() * 6;
      const top = Math.random() * 100;
      el.style.display = "block";
      el.style.top = `${top}%`;
      el.style.height = `${h}px`;
      el.style.background = `rgba(255, 255, 255, ${0.03 + Math.random() * 0.06})`;
      el.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
    } else if (type < 0.6) {
      // Color shift bar
      const h = 4 + Math.random() * 15;
      const top = Math.random() * 100;
      el.style.display = "block";
      el.style.top = `${top}%`;
      el.style.height = `${h}px`;
      el.style.background = Math.random() > 0.5
        ? `rgba(0, 243, 255, 0.03)`
        : `rgba(255, 0, 255, 0.03)`;
      el.style.transform = `translateX(${(Math.random() - 0.5) * 6}px)`;
    } else {
      // Full screen flicker
      el.style.display = "block";
      el.style.top = "0";
      el.style.height = "100%";
      el.style.background = `rgba(255, 255, 255, ${0.01 + Math.random() * 0.02})`;
      el.style.transform = "none";
    }

    setTimeout(() => {
      if (el) el.style.display = "none";
      activeRef.current = false;
    }, duration);
  }, []);

  useEffect(() => {
    // Random glitch interval
    let timeout: NodeJS.Timeout;

    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 15000; // Every 3-18 seconds
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
