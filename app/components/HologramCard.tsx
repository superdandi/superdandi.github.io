"use client";

import { useEffect, useRef, useState } from "react";

// Matrix katakana + Latin + digits
const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function HologramCard() {
  const [glitch, setGlitch] = useState(false);
  const [scanOffset, setScanOffset] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glitchRef = useRef(false);
  const timeRef = useRef(0);
  const animRef = useRef(0);

  // Face silhouette (normalized 0-1)
  function isFace(x: number, y: number): boolean {
    // Head oval: centered at (0.5, 0.38), rx=0.28, ry=0.36
    const hx = (x - 0.5) / 0.28;
    const hy = (y - 0.38) / 0.36;
    if (hx * hx + hy * hy <= 1) return true;

    // Neck
    if (y > 0.72 && y < 0.88 && x > 0.43 && x < 0.57) return true;

    // Shoulders
    if (y > 0.82 && y < 0.96) {
      const sw = 0.24 + (y - 0.82) * 0.6;
      if (x > 0.5 - sw && x < 0.5 + sw) return true;
    }
    return false;
  }

  function isBright(x: number, y: number): boolean {
    // Left eye
    const lex = (x - 0.38) / 0.035;
    const ley = (y - 0.34) / 0.02;
    if (lex * lex + ley * ley <= 1) return true;
    // Right eye
    const rex = (x - 0.62) / 0.035;
    const rey = (y - 0.34) / 0.02;
    if (rex * rex + rey * rey <= 1) return true;
    // Mouth
    const mx = (x - 0.5) / 0.055;
    const my = (y - 0.52) / 0.018;
    if (mx * mx + my * my <= 1) return true;
    return false;
  }

  // Glitch + scan intervals
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      if (Math.random() < 0.15) {
        glitchRef.current = true;
        setGlitch(true);
        setTimeout(() => {
          glitchRef.current = false;
          setGlitch(false);
        }, 100 + Math.random() * 200);
      }
    }, 2000);

    let frame = 0;
    const scanTimer = setInterval(() => {
      frame++;
      setScanOffset((frame * 3) % 200);
    }, 50);

    return () => {
      clearInterval(glitchTimer);
      clearInterval(scanTimer);
    };
  }, []);

  // Canvas Matrix animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = 240;
    let h = 140;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // One drop per column, tracks vertical scroll offset
    const cols = Math.floor(w / 10);
    const drops = Array.from({ length: cols }, () => ({
      y: Math.random() * h,
      speed: 0.3 + Math.random() * 0.5,
    }));

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const isGlitching = glitchRef.current;

      ctx.clearRect(0, 0, w, h);

      // Glitch offset
      const gx = isGlitching ? (Math.random() - 0.5) * 6 : 0;

      const cellW = w / drops.length;
      const rows = Math.floor(h / 11);

      ctx.font = "7px monospace";
      ctx.textBaseline = "top";

      for (let c = 0; c < drops.length; c++) {
        const drop = drops[c];
        drop.y += drop.speed;
        if (drop.y > h + 11) drop.y = -11;

        for (let r = 0; r < rows; r++) {
          const cy = ((drop.y + r * 11) % (h + 11)) - 5;
          if (cy < 0 || cy > h) continue;

          const cx = c * cellW + cellW / 2 + gx;
          const nx = cx / w;
          const ny = cy / h;

          if (nx < 0 || nx > 1 || ny < 0 || ny > 1) continue;

          const inFace = isFace(nx, ny);
          const bright = isBright(nx, ny);

          // Character cycles over time for waterfall effect
          const charIdx = Math.floor(
            (c * 7 + r * 13 + t * 2.5) % CHARS.length
          );
          const char = CHARS[charIdx];

          let alpha: number;
          let colorRGB = "0, 255, 65";
          let blur = 0;

          if (bright) {
            // Eyes / mouth — bright green with glow
            alpha = 0.7 + 0.3 * Math.sin(t * 2 + c * 0.5 + r * 0.7);
            blur = isGlitching ? 4 : 3;
          } else if (inFace) {
            // Face silhouette — fade from center outward
            const edgeX = Math.min(nx / 0.35, (1 - nx) / 0.35);
            const edgeY = Math.min(ny / 0.35, (1 - ny) / 0.35);
            const fade = Math.min(1, Math.min(edgeX, edgeY) * 1.8);
            alpha = 0.15 + 0.35 * fade;
            if (isGlitching && Math.random() < 0.3) {
              colorRGB = Math.random() > 0.5 ? "0, 243, 255" : "255, 0, 255";
              alpha *= 0.6;
            }
          } else {
            // Outside — barely visible
            alpha = 0.02 + 0.03 * Math.sin(c * 0.7 + r * 1.1 + t);
          }

          ctx.shadowColor = blur ? `rgb(${colorRGB})` : "transparent";
          ctx.shadowBlur = blur;
          ctx.fillStyle = `rgba(${colorRGB}, ${Math.max(0, Math.min(1, alpha))})`;
          ctx.fillText(char, cx, cy);
        }
      }

      // If glitching, add an occasional random color bar across the canvas
      if (isGlitching && Math.random() < 0.2) {
        const barY = Math.random() * h;
        const barH = 2 + Math.random() * 4;
        ctx.shadowBlur = 0;
        ctx.fillStyle =
          Math.random() > 0.5
            ? "rgba(0, 243, 255, 0.06)"
            : "rgba(255, 0, 255, 0.05)";
        ctx.fillRect(0, barY, w, barH);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
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
          boxShadow:
            "0 0 20px rgba(0, 243, 255, 0.1), inset 0 0 20px rgba(0, 243, 255, 0.05)",
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
              background:
                "linear-gradient(90deg, transparent, rgba(0,243,255,0.3), transparent)",
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
          {/* Matrix Portrait Canvas */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="w-[220px] sm:w-[240px] h-[130px] sm:h-[140px] rounded"
              style={{
                display: "block",
                filter: glitch ? "hue-rotate(15deg)" : "none",
                transition: "filter 0.1s",
              }}
            />
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
              Daniel Cobos
            </div>
            <div className="text-[10px] font-mono text-[var(--neon-cyan)]/70 space-x-2">
              <span>ID: LEGACY_ARCHITECT</span>
              <span className="text-[var(--neon-green)]/50">{"/"}{"/"}</span>
              <span className="text-[var(--neon-cyan)]/50">superdandi</span>
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
