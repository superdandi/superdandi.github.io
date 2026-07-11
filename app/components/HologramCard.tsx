"use client";

import { useEffect, useRef, useState } from "react";

// Matrix katakana + Latin + digits
const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Grid — finer than before for better face definition
const GRID_COLS = 55;
const GRID_ROWS = 22;

// Image crop: take left 88% of DC.jpg (more context/air around person)
const IMG_CROP = 0.92;
// Luminance threshold: values above this = background (no character)
const BRIGHT_THRESHOLD = 0.40;
const IMG_URL = "/images/DC.jpg";
const NUM_RAIN = 12;

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface Cell {
  lum: number; // stretched luminance 0-1 (after contrast stretching)
  char: string; // current displayed character
  nextChange: number; // timestamp (seconds) when to shimmer to a new char
}

interface RainDrop {
  col: number;
  y: number; // float row position
  speed: number; // rows per second
  trailLen: number;
}

export default function HologramCard() {
  const [glitch, setGlitch] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glitchRef = useRef(false);
  const animRef = useRef(0);
  const cellsRef = useRef<(Cell | null)[]>(
    new Array(GRID_COLS * GRID_ROWS).fill(null)
  );
  const rainRef = useRef<RainDrop[]>([]);

  // ── Load image and pre-compute ASCII brightness grid ──
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = GRID_COLS;
      off.height = GRID_ROWS;
      const octx = off.getContext("2d");
      if (!octx) return;

      // Crop: left IMG_CROP fraction of image (person's area)
      const cropW = img.width * IMG_CROP;
      octx.drawImage(
        img,
        0,
        0,
        cropW,
        img.height,
        0,
        0,
        GRID_COLS,
        GRID_ROWS
      );

      const data = octx.getImageData(0, 0, GRID_COLS, GRID_ROWS).data;
      const cells: (Cell | null)[] = new Array(GRID_COLS * GRID_ROWS);

      for (let i = 0; i < GRID_COLS * GRID_ROWS; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        if (lum >= BRIGHT_THRESHOLD) {
          // Bright background → no character
          cells[i] = null;
        } else {
          // Contrast-stretch luminance from [0, THRESHOLD] to [0, 1]
          const stretched = Math.min(1, lum / BRIGHT_THRESHOLD);
          cells[i] = {
            lum: stretched,
            char: randomChar(),
            nextChange: Math.random() * 5, // stagger initial shimmer
          };
        }
      }

      cellsRef.current = cells;

      // Initialize rain drops
      rainRef.current = Array.from({ length: NUM_RAIN }, () => ({
        col: Math.floor(Math.random() * GRID_COLS),
        y: -Math.random() * GRID_ROWS,
        speed: 2 + Math.random() * 4,
        trailLen: 2 + Math.floor(Math.random() * 3),
      }));

      setImgReady(true);
    };

    img.onerror = () => {
      // Fallback: empty grid (just rain)
      rainRef.current = Array.from({ length: NUM_RAIN }, () => ({
        col: Math.floor(Math.random() * GRID_COLS),
        y: -Math.random() * GRID_ROWS,
        speed: 2 + Math.random() * 4,
        trailLen: 2 + Math.floor(Math.random() * 3),
      }));
      setImgReady(true);
    };

    img.src = IMG_URL;
  }, []);

  // ── Glitch + scan intervals ──
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

    return () => {
      clearInterval(glitchTimer);
    };
  }, []);

  // ── Canvas render: static ASCII grid + rain overlay ──
  useEffect(() => {
    if (!imgReady) return;
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

    let prevTime = 0;

    const draw = (now: number) => {
      if (prevTime === 0) prevTime = now;
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;
      const t = now / 1000;
      const isGlitching = glitchRef.current;
      const cells = cellsRef.current;
      const rain = rainRef.current;

      // ── Clear ──
      ctx.clearRect(0, 0, w, h);

      const cellW = w / GRID_COLS;
      const cellH = h / GRID_ROWS;
      const fontSize = Math.max(4, Math.floor(Math.min(cellW * 1.4, cellH * 0.82)));

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      const gx = isGlitching ? (Math.random() - 0.5) * 4 : 0;

      // ═══════════════════════════════════════════════
      //  LAYER 1: Static ASCII art portrait
      // ═══════════════════════════════════════════════
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const idx = r * GRID_COLS + c;
          const cell = cells[idx];
          if (!cell) continue; // background — skip

          // Shimmer: change to a new random char every 3-7 seconds
          if (t > cell.nextChange) {
            cell.char = randomChar();
            cell.nextChange = t + 3 + Math.random() * 4;
          }

          // Alpha: smooth gradient from luminance
          // Dark areas (hair) = dim, bright areas (skin/highlights) = bright
          let alpha = 0.12 + 0.78 * cell.lum;
          let colorRGB = "0, 255, 65";
          let blur = 0;

          // Bright areas: shift to cyan with subtle glow
          if (cell.lum > 0.65) {
            colorRGB = "0, 243, 255";
            blur = isGlitching ? 4 : 2;
            alpha = Math.min(0.95, alpha + 0.1);
          }

          // Subtle per-character flicker (breathing effect)
          const flicker = 0.88 + 0.12 * Math.sin(t * 4 + c * 0.7 + r * 1.1);
          alpha *= flicker;

          // Glitch: random color shift on some characters
          if (isGlitching && Math.random() < 0.08) {
            colorRGB = Math.random() > 0.5 ? "0, 243, 255" : "255, 0, 255";
            alpha *= 0.6;
          }

          const cx = c * cellW + cellW / 2 + gx;
          const cy = r * cellH;

          ctx.shadowColor = blur ? `rgb(${colorRGB})` : "transparent";
          ctx.shadowBlur = blur;
          ctx.fillStyle = `rgba(${colorRGB}, ${Math.max(0, Math.min(1, alpha))})`;
          ctx.fillText(cell.char, cx, cy);
        }
      }

      // ═══════════════════════════════════════════════
      //  LAYER 2: Rain overlay (falls over ASCII art)
      // ═══════════════════════════════════════════════
      ctx.shadowBlur = 0;
      for (const drop of rain) {
        drop.y += drop.speed * dt;

        if (drop.y > GRID_ROWS + drop.trailLen) {
          drop.col = Math.floor(Math.random() * GRID_COLS);
          drop.y = -drop.trailLen;
          drop.speed = 2 + Math.random() * 4;
          drop.trailLen = 2 + Math.floor(Math.random() * 3);
        }

        for (let i = 0; i <= drop.trailLen; i++) {
          const ry = Math.floor(drop.y) - i;
          if (ry < 0 || ry >= GRID_ROWS) continue;

          let alpha: number;
          let colorRGB: string;
          let blur: number;

          if (i === 0) {
            // Head: bright white-green
            alpha = 0.85;
            colorRGB = "180, 255, 200";
            blur = 3;
          } else {
            // Trail: dim green, fading
            alpha = 0.35 * (1 - i / (drop.trailLen + 1));
            colorRGB = "0, 255, 65";
            blur = 0;
          }

          const charIdx = Math.abs(
            Math.floor((drop.col * 7 + t * 8 + i * 13) % CHARS.length)
          );
          const char = CHARS[charIdx];

          const cx = drop.col * cellW + cellW / 2;
          const cy = ry * cellH;

          ctx.shadowColor = blur ? `rgb(${colorRGB})` : "transparent";
          ctx.shadowBlur = blur;
          ctx.fillStyle = `rgba(${colorRGB}, ${alpha})`;
          ctx.fillText(char, cx, cy);
        }
      }

      // ═══════════════════════════════════════════════
      //  LAYER 3: Glitch bar
      // ═══════════════════════════════════════════════
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

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [imgReady]);

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