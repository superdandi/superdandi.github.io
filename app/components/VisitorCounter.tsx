"use client";

import { useEffect, useState, useRef } from "react";

const COUNTER_URL =
  "https://raw.githubusercontent.com/superdandi/superdandi.github.io/main/counter.json";

const BADGE_URL =
  "https://visitor-badge.laobi.icu/badge?page_id=superdandi.github.io";

const SEGMENT_COORDS = [
  "M2,2 L18,2 L16,6 L4,6 Z",
  "M20,4 L36,4 L34,8 L22,8 Z",
  "M20,20 L36,20 L34,24 L22,24 Z",
  "M2,18 L18,18 L16,22 L4,22 Z",
  "M2,2 L6,4 L6,18 L2,16 Z",
  "M18,4 L22,6 L22,20 L18,18 Z",
  "M2,18 L6,20 L6,34 L2,32 Z",
  "M18,20 L22,22 L22,36 L18,34 Z",
];

const digitSegments: boolean[][] = [
  [true, true, true, true, true, true, false],  // 0
  [false, true, true, false, false, false, false], // 1
  [true, true, false, true, true, false, true],  // 2
  [true, true, true, true, false, false, true],  // 3
  [false, true, true, false, false, true, true], // 4
  [true, false, true, true, false, true, true],  // 5
  [true, false, true, true, true, true, true],   // 6
  [true, true, true, false, false, false, false], // 7
  [true, true, true, true, true, true, true],    // 8
  [true, true, true, true, false, true, true],   // 9
];

function SevenSegmentDigit({ digit, color }: { digit: number; color: string }) {
  const active = digitSegments[Math.min(Math.max(digit, 0), 9)] ?? digitSegments[0];
  const onColor = color;
  const offColor = "rgba(0,255,65,0.06)";

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="inline-block">
      {SEGMENT_COORDS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={active[i] ? onColor : offColor}
          style={{
            filter: active[i]
              ? `drop-shadow(0 0 2px ${onColor}) drop-shadow(0 0 4px ${onColor})`
              : "none",
            transition: "fill 0.15s ease",
          }}
        />
      ))}
    </svg>
  );
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animatedDigits, setAnimatedDigits] = useState<number[]>([8, 8, 8, 8, 8]);
  const animFrame = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch(COUNTER_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Animate digits when count changes
  useEffect(() => {
    if (count === null) return;
    const targetDigits = String(count).padStart(5, "0").slice(-5).split("").map(Number);

    let frame = 0;
    const totalFrames = 15;

    const animate = () => {
      frame++;
      setAnimatedDigits((prev) => {
        const next = [...prev];
        for (let i = 0; i < 5; i++) {
          const target = targetDigits[i];
          const current = prev[i];
          if (current !== target) {
            const diff = (target - current + 10) % 10;
            if (diff <= 5 && diff > 0) {
              next[i] = (current + 1) % 10;
            } else if (diff > 5) {
              next[i] = (current - 1 + 10) % 10;
            } else {
              next[i] = target;
            }
          }
        }
        return next;
      });
      if (frame < totalFrames) {
        animFrame.current = requestAnimationFrame(animate);
      } else {
        setAnimatedDigits(targetDigits);
      }
    };
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [count]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Retro counter display panel */}
      <div className="relative">
        <div
          className="bg-black border-2 border-[var(--neon-cyan)]/40 rounded p-2
            shadow-[0_0_10px_rgba(0,243,255,0.15),inset_0_0_10px_rgba(0,243,255,0.05)]"
        >
          <div
            className="bg-black/90 border border-[var(--neon-cyan)]/20 rounded p-3
              flex items-center gap-0.5 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,255,65,0.03) 0%, rgba(0,0,0,1) 100%)",
            }}
          >
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.03) 1px, rgba(0,255,65,0.03) 2px)",
              }}
            />
            {/* Digits */}
            {loading ? (
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <SevenSegmentDigit key={i} digit={8} color="#00ff41" />
                ))}
              </div>
            ) : error ? (
              <div className="text-[10px] font-mono text-[var(--neon-magenta)] px-4 py-2">
                ERR: CONNECTION LOST
              </div>
            ) : (
              <div className="flex gap-0.5">
                {animatedDigits.map((d, i) => (
                  <SevenSegmentDigit key={i} digit={d} color="#00ff41" />
                ))}
              </div>
            )}
            {/* Label */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <span className="text-[6px] font-mono text-[var(--neon-cyan)]/60 tracking-[0.2em]">
                VISITORS
              </span>
            </div>
          </div>
        </div>
        {/* Decorative screws */}
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#333] border border-[#555]" />
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#333] border border-[#555]" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#333] border border-[#555]" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#333] border border-[#555]" />
      </div>

      {/* Hidden img for actual counting (auto-increments visitor-badge) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BADGE_URL}
        alt=""
        aria-hidden="true"
        className="hidden"
      />

      {/* Status */}
      <div className="flex items-center gap-1.5 mt-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse shadow-[0_0_4px_var(--neon-green)]" />
        <span className="text-[8px] font-mono text-[var(--neon-cyan)]/40 tracking-widest uppercase">
          {loading ? "syncing..." : error ? "offline" : "online"}
        </span>
      </div>
    </div>
  );
}
