"use client";

import { useEffect, useState } from "react";

const ASCII_FACE = [
  "      ▄▄████████▄▄      ",
  "    ▄██▀▀    ▀▀██▄    ",
  "   ██    ▄▄▄▄    ██   ",
  "  ██   ████████   ██  ",
  "  ██   ▀▀██▀▀   ██  ",
  "  ██    ▀██▀    ██  ",
  "   ██          ██   ",
  "    ▀██▄    ▄██▀    ",
  "      ▀██████▀      ",
];

export default function HologramCard() {
  const [glitch, setGlitch] = useState(false);
  const [scanOffset, setScanOffset] = useState(0);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 200);
      }
    }, 2000);

    // Scanning line animation
    let frame = 0;
    const scanInterval = setInterval(() => {
      frame++;
      setScanOffset((frame * 3) % 200);
    }, 50);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* Card frame */}
      <div
        className={`
          border rounded p-4 sm:p-6 bg-[var(--dark-card)]/60 backdrop-blur-sm
          transition-all duration-100
          ${glitch ? "translate-x-1 translate-y-0.5 skew-x-[0.5deg]" : "translate-x-0"}
        `}
        style={{
          borderColor: "rgba(0, 243, 255, 0.3)",
          boxShadow: "0 0 20px rgba(0, 243, 255, 0.1), inset 0 0 20px rgba(0, 243, 255, 0.05)",
          minWidth: "240px",
        }}
      >
        {/* Scanning line overlay */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded"
          style={{ mixBlendMode: "screen" }}
        >
          <div
            className="absolute left-0 right-0 h-0.5"
            style={{
              top: `${scanOffset}%`,
              background: "linear-gradient(90deg, transparent, rgba(0,243,255,0.3), transparent)",
              boxShadow: "0 0 8px rgba(0,243,255,0.2)",
            }}
          />
        </div>

        {/* Holographic flicker */}
        <div
          className="absolute inset-0 pointer-events-none rounded"
          style={{
            background: glitch
              ? "linear-gradient(180deg, transparent 30%, rgba(0,243,255,0.08) 50%, transparent 70%)"
              : "none",
          }}
        />

        {/* Content */}
        <div className="relative space-y-3 text-center">
          {/* ASCII portrait */}
          <div
            className={`
              font-mono text-[8px] sm:text-[10px] leading-tight text-[var(--neon-cyan)]
              ${glitch ? "opacity-90 blur-[0.5px]" : "opacity-80"}
              transition-all duration-75 select-none
            `}
            style={{
              textShadow: glitch
                ? "2px 0 rgba(255,0,255,0.3), -2px 0 rgba(0,243,255,0.3)"
                : "0 0 8px rgba(0,243,255,0.3)",
            }}
          >
            {ASCII_FACE.map((line, i) => (
              <div key={i} style={{ transform: glitch && i === 3 ? "translateX(2px)" : "none" }}>
                {line}
              </div>
            ))}
          </div>

          {/* ID text */}
          <div className="space-y-1">
            <div
              className="text-sm sm:text-base font-bold font-mono text-[var(--neon-cyan)]"
              style={{
                textShadow: "0 0 10px rgba(0,243,255,0.5)",
                filter: glitch ? "blur(0.3px)" : "none",
                transition: "all 0.05s",
              }}
            >
              superdandi
            </div>
            <div className="text-[10px] font-mono text-[var(--neon-cyan)]/70">
              ID: LEGACY_ARCHITECT
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
              <span className="text-[9px] font-mono text-[var(--neon-green)] tracking-widest">
                STATUS: ACTIVE
              </span>
            </div>
          </div>

          {/* HUD corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--neon-cyan)]/40" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[var(--neon-cyan)]/40" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[var(--neon-cyan)]/40" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[var(--neon-cyan)]/40" />

          {/* Glitch artifact text */}
          {glitch && (
            <div
              className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-[var(--neon-magenta)] opacity-40 pointer-events-none"
              style={{ transform: "translateX(-3px)" }}
            >
              01100111 01101100 01101001 01110100 01100011 01101000
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
