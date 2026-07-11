"use client";

import { useEffect, useRef, useState } from "react";

// Matrix katakana + Latin + digits
const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Grid dimensions — match the brightness sampling grid
const GRID_COLS = 34;
const GRID_ROWS = 13;
const IMG_CROP = 0.62; // crop left 62% of image (where the person is)
const IMG_URL = "/images/DC.jpg";

export default function HologramCard() {
  const [glitch, setGlitch] = useState(false);
  const [scanOffset, setScanOffset] = useState(0);
  const [imgReady, setImgReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glitchRef = useRef(false);
  const timeRef = useRef(0);
  const animRef = useRef(0);
  const brightnessRef = useRef<number[]>(
    new Array(GRID_COLS * GRID_ROWS).fill(0)
  );
  const dropsRef = useRef<
    { y: number; speed: number; burst: number }[]
  >([]);

  // ── Load image and pre-compute brightness grid ──
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = GRID_COLS;
      off.height = GRID_ROWS;
      const octx = off.getContext("2d");
      if (!octx) return;

      // Crop: focus on the left portion where the person is
      const cropW = img.width * IMG_CROP;
      const cropH = img.height;

      octx.drawImage(
        img,
        0,
        0,
        cropW,
        cropH,
        0,
        0,
        GRID_COLS,
        GRID_ROWS
      );

      const data = octx.getImageData(0, 0, GRID_COLS, GRID_ROWS).data;
      const grid = brightnessRef.current;
      for (let i = 0; i < GRID_COLS * GRID_ROWS; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        // Luminance (standard formula)
        grid[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }

      // Initialize rain drops
      dropsRef.current = Array.from({ length: GRID_COLS }, (_, c) => ({
        y: Math.random() * GRID_ROWS,
        speed: 0.04 + Math.random() * 0.08,
        burst: 0,
      }));

      setImgReady(true);
    };
    img.onerror = () => {
      // Fallback: mark as ready with empty grid (just shows rain)
      dropsRef.current = Array.from({ length: GRID_COLS }, () => ({
        y: Math.random() * GRID_ROWS,
        speed: 0.04 + Math.random() * 0.08,
        burst: 0,
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

  // ── Canvas Matrix animation (brightness-modulated rain) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgReady) return;
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

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const isGlitching = glitchRef.current;
      const brightness = brightnessRef.current;
      const drops = dropsRef.current;

      ctx.clearRect(0, 0, w, h);

      // Glitch offset
      const gx = isGlitching ? (Math.random() - 0.5) * 6 : 0;

      const cellW = w / GRID_COLS;
      const cellH = h / GRID_ROWS;
      const fontSize = Math.floor(cellH * 0.82);

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      for (let c = 0; c < GRID_COLS; c++) {
        const drop = drops[c];
        drop.y += drop.speed;
        if (drop.y > GRID_ROWS + 4) drop.y = -4;

        // Occasional burst: a random column temporarily becomes very active
        if (Math.random() < 0.002) drop.burst = 8;
        if (drop.burst > 0) drop.burst -= 0.05;

        for (let r = 0; r < GRID_ROWS; r++) {
          const idx = r * GRID_COLS + c;
          const b = brightness[idx];

          // Threshold: skip very dark areas (background / void)
          if (b < 0.06) continue;

          // Character cycling (Matrix code effect)
          const cycleOffset = isGlitching ? Math.random() * 100 : 0;
          const charIdx = Math.abs(
            Math.floor(
              (c * 7 + r * 13 + t * 3.5 + cycleOffset) % CHARS.length
            )
          );
          const char = CHARS[charIdx];

          // Base alpha from brightness
          let alpha = b * 0.72;
          let colorRGB = "0, 255, 65";
          let blur = 0;

          // Brighter areas: cyan with glow
          if (b > 0.5) {
            colorRGB = "0, 243, 255";
            blur = isGlitching ? 4 : 2;
            alpha = Math.min(1, alpha + 0.12);
          }

          // Rain drop head: very bright when passing through
          const trailDist = Math.abs(drop.y - r);
          if (trailDist < 2.5) {
            const headBoost = (1 - trailDist / 2.5) * 0.45;
            alpha = Math.min(1, alpha + headBoost);
            if (trailDist < 0.8) {
              colorRGB = "180, 255, 200"; // near-white head
              blur = 4;
            }
          }

          // Burst: boost entire column temporarily
          if (drop.burst > 5) {
            alpha = Math.min(1, alpha + 0.3);
          }

          // Character flicker: occasional dimming
          const flicker = 0.85 + 0.15 * Math.sin(t * 5 + c * 0.8 + r * 1.2);
          alpha *= flicker;

          // Glitch effect: random color shift
          if (isGlitching && Math.random() < 0.12) {
            colorRGB = Math.random() > 0.5 ? "0, 243, 255" : "255, 0, 255";
            alpha *= 0.6;
          }

          const cx = c * cellW + cellW / 2 + gx;
          const cy = r * cellH;

          ctx.shadowColor = blur ? `rgb(${colorRGB})` : "transparent";
          ctx.shadowBlur = blur;
          ctx.fillStyle = `rgba(${colorRGB}, ${Math.max(0, Math.min(1, alpha))})`;
          ctx.fillText(char, cx, cy);
        }
      }

      // Glitch bar across the canvas
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