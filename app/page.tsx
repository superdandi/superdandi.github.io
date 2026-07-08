"use client";

import { useEffect, useState } from "react";
import VisitorCounter from "@/app/components/VisitorCounter";
import HologramCard from "@/app/components/HologramCard";
import CineSection from "@/app/components/CineSection";

const ASCII_ART = `
  ███████╗██╗   ██╗██████╗ ███████╗██████╗ ██████╗  █████╗ ███╗   ██╗██████╗ ██╗
  ██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗██║
  ███████╗██║   ██║██████╔╝█████╗  ██████╔╝██║  ██║███████║██╔██╗ ██║██║  ██║██║
  ╚════██║██║   ██║██╔══██╗██╔══╝  ██╔══██╗██║  ██║██╔══██║██║╚██╗██║██║  ██║██║
  ███████║╚██████╔╝██║  ██║███████╗██║  ██║██████╔╝██║  ██║██║ ╚████║██████╔╝██║
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝
`;

const SOCIAL_LINKS = [
  { label: "github", href: "https://github.com/superdandi", color: "cyan" },
  { label: "linkedin", href: "https://linkedin.com/in/superdandi", color: "magenta" },
  { label: "email", href: "mailto:dandi@superdandi.dev", color: "yellow" },
] as const;

const PROJECTS = [
  { name: "warzine", desc: "beat 'em up / fanzine punk — 2P local, 3 niveles, jefes", lang: "JS", href: "https://superdandi.github.io/warzine/" },
  { name: "infocob", desc: "diseño & desarrollo digital — web, IA y productos digitales", lang: "WEB", href: "https://superdandi.github.io/infocob/" },
  { name: "sabios", desc: "pizzería artesanal Talca — pizza por pedazos y completos", lang: "WEB", href: "https://superdandi.github.io/sabios/" },
  { name: "vizcoso", desc: "abarrotes Talca — delivery y tienda online", lang: "WEB", href: "https://superdandi.github.io/vizcoso/" },
  { name: "pungafighters", desc: "2D fighting game engine & framework", lang: "TypeScript", href: "https://github.com/superdandi/pungafighters" },
  { name: "capture-button", desc: "audio capture & signal processing", lang: "C++", href: "https://github.com/superdandi/capture-button" },
  { name: "tapizate", desc: "web tapestry / UI experiments", lang: "CSS", href: "https://github.com/superdandi/tapizate" },
  { name: "super-ffmpeg-stream", desc: "ffmpeg streaming toolkit", lang: "Shell", href: "https://github.com/superdandi/super-ffmpeg-stream" },
  { name: "fxprimavera", desc: "audio DSP plugin suite", lang: "JavaScript", href: "https://github.com/superdandi/fxprimavera" },
  { name: "energy-awareness-skill", desc: "LLM energy estimation skill for OpenCode", lang: "Shell", href: "https://github.com/superdandi/energy-awareness-skill" },
];

const CAREER_LOG = [
  {
    year: "2006",
    boot: "Banco de Chile — Departamento de Desarrollo",
    sys: "COBOL (ANSI/ISO) · UNIX · Mainframe",
    log: "Diseño e implementación de lógica transaccional masiva para el core bancario. Procesamiento batch de alta eficiencia en entorno mainframe.",
  },
  {
    year: "2007",
    boot: "Migración a Sistemas Abiertos",
    sys: "Linux · Shell Scripting · Automatización",
    log: "Transición de procesos legacy a plataformas abiertas. Optimización de algoritmos de validación de datos financieros.",
  },
  {
    year: "PRESENT",
    boot: "Full-Stack Engineer · Modern Web",
    sys: "TypeScript · React · Next.js · Node.js · Cloud",
    log: "Puente entre el mundo del mainframe y la web moderna. Arquitectura de sistemas híbridos que conectan legado financiero con infraestructura cloud.",
  },
];

const SKILLS = {
  modern: [
    "TypeScript / React / Next.js",
    "Node.js / Tailwind CSS",
    "Git / GitHub Actions / CI/CD",
    "Linux / Docker / Cloud",
  ],
  legacy: [
    "COBOL (ANSI/ISO, GnuCOBOL)",
    "UNIX Shell Scripting (Bash)",
    "Batch Processing / Mainframe Logic",
    "Sistemas Transaccionales",
  ],
};

export default function Home() {
  const [showBoot, setShowBoot] = useState(true);
  const [bootLine, setBootLine] = useState(0);
  const [time, setTime] = useState("");
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);

  const bootMessages = [
    "> INITIALIZING KERNEL...",
    "> LOADING MEMORY MODULES...",
    "> MOUNTING FILESYSTEM...",
    "> CHECKING NETWORK INTERFACES...",
    "> ESTABLISHING SECURE CHANNEL...",
    "> AUTHENTICATED AS: superdandi",
    "> SYSTEM READY.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", { hour12: false })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bootLine < bootMessages.length) {
      const t = setTimeout(() => setBootLine((l) => l + 1), 180);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setShowBoot(false);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [bootLine, bootMessages.length]);

  useEffect(() => {
    if (showBoot) return;
    const timers: NodeJS.Timeout[] = [];
    CAREER_LOG.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, i]);
      }, 300 + i * 400);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [showBoot]);

  if (showBoot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="font-mono text-sm w-[420px] px-4">
          <div className="text-[var(--neon-green)] mb-2">[ BOOT SEQUENCE ]</div>
          <div className="border border-[var(--neon-green)]/30 p-4 rounded">
            {bootMessages.slice(0, bootLine).map((msg, i) => (
              <div
                key={i}
                className={`${
                  i === bootMessages.length - 1 && bootLine === bootMessages.length
                    ? "text-[var(--neon-green)]"
                    : "text-[var(--text-dim)]"
                }`}
              >
                {msg}
                {i === bootLine - 1 && i < bootMessages.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-[var(--neon-green)] ml-1 animate-pulse" />
                )}
              </div>
            ))}
            {bootLine >= bootMessages.length && (
              <div className="text-[var(--neon-green)] mt-2 animate-pulse">
                _ PRESS ANY KEY TO CONTINUE _
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-xs text-[var(--neon-cyan)] opacity-60">
        <div>superdandi@portfolio:~$</div>
        <div>{time} UTC</div>
      </div>

      <div className="w-full max-w-3xl space-y-14">
        {/* ── HEADER + BIO + HOLOGRAM ── */}
        <CineSection>
          <section className="text-center space-y-6">
            <pre className="text-[0.4rem] sm:text-[0.5rem] md:text-[0.55rem] leading-tight text-[var(--neon-cyan)] opacity-80 hidden sm:block select-none">
              {ASCII_ART}
            </pre>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-bold text-[var(--neon-cyan)] text-shadow-cyan typing inline-block">
                superdandi
              </h1>
              <div className="max-w-xl mx-auto space-y-1">
                <p className="text-sm sm:text-base text-[var(--text-dim)] font-mono leading-relaxed">
                  <span className="text-[var(--neon-green)]">full-stack developer</span>
                  {" bridging "}
                  <span className="text-[var(--neon-yellow)]">COBOL/UNIX</span>
                  {" with "}
                  <span className="text-[var(--neon-magenta)]">TypeScript/React</span>
                </p>
                <p className="text-xs text-[var(--text-dim)] font-mono opacity-70">
                  ex-Banco de Chile · 15+ years crafting resilient systems
                </p>
                <p className="text-xs text-[var(--neon-green)]/60 font-mono mt-2 animate-blink-led">
                  _ available for senior roles & contracting
                </p>
              </div>
            </div>

            {/* Hologram identity card */}
            <div className="flex justify-center mt-6">
              <HologramCard />
            </div>
          </section>
        </CineSection>

        {/* ── SOCIAL LINKS ── */}
        <CineSection delay={0.2}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                cat /etc/links.conf
              </span>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-5 py-2 border rounded text-sm font-mono transition-all duration-300 
                    hover:scale-105 link-underline
                    ${
                      link.color === "cyan"
                        ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
                        : link.color === "magenta"
                        ? "border-[var(--neon-magenta)] text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10"
                        : "border-[var(--neon-yellow)] text-[var(--neon-yellow)] hover:bg-[var(--neon-yellow)]/10"
                    }`}
                >
                  {`[ ${link.label} ]`}
                </a>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── CAREER LOG ── */}
        <CineSection delay={0.4}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                cat /var/log/career.log
              </span>
            </div>
            <div className="space-y-4">
              {CAREER_LOG.map((entry, i) => (
                <div
                  key={i}
                  className={`log-entry border border-[var(--text-dim)]/15 rounded p-4 
                    bg-[var(--dark-card)]/40 backdrop-blur
                    ${visibleLogs.includes(i) ? "opacity-100" : "opacity-0"}`}
                  style={{
                    borderLeftColor:
                      i === 2 ? "var(--neon-cyan)" : "var(--neon-green)",
                    borderLeftWidth: "3px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--neon-yellow)] font-mono text-xs font-bold">
                      [{entry.year}]
                    </span>
                    <span className="text-[var(--neon-cyan)] font-mono text-xs font-bold">
                      BOOT: {entry.boot}
                    </span>
                  </div>
                  <div className="text-[var(--neon-green)] text-[11px] font-mono mb-2">
                    SYS: {entry.sys}
                  </div>
                  <div className="text-[var(--text-dim)] text-xs font-mono leading-relaxed">
                    LOG: {entry.log}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── SKILLS MATRIX ── */}
        <CineSection delay={0.6}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                skills --matrix
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-[var(--neon-cyan)]/20 rounded p-4 bg-[var(--dark-card)]/40">
                <div className="text-[var(--neon-cyan)] font-mono text-xs font-bold mb-3 uppercase tracking-widest">
                  MODERN TIER
                </div>
                <div className="space-y-2">
                  {SKILLS.modern.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <span className="text-[var(--neon-cyan)] text-[10px]">├─</span>
                      <span className="text-[var(--text-primary)] font-mono text-xs">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-[var(--neon-green)]/20 rounded p-4 bg-[var(--dark-card)]/40">
                <div className="text-[var(--neon-green)] font-mono text-xs font-bold mb-3 uppercase tracking-widest">
                  LEGACY TIER
                </div>
                <div className="space-y-2">
                  {SKILLS.legacy.map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <span className="text-[var(--neon-green)] text-[10px]">├─</span>
                      <span className="text-[var(--text-primary)] font-mono text-xs">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </CineSection>

        {/* ── PROJECTS ── */}
        <CineSection delay={0.8}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                ls -la ~/projects/
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[var(--text-dim)]/20 rounded p-4 
                    transition-all duration-300 hover:glow-border-cyan hover:scale-[1.02] 
                    bg-[var(--dark-card)]/50 backdrop-blur block"
                >
                  <div className="text-[var(--neon-cyan)] font-mono text-sm font-bold mb-1 truncate">
                    {project.name}
                  </div>
                  <div className="text-[var(--text-dim)] text-xs mb-2 font-mono">
                    {project.desc}
                  </div>
                  <div className="text-[var(--neon-green)] text-[10px] font-mono">
                    [{project.lang}]
                  </div>
                </a>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── VISITOR COUNTER ── */}
        <CineSection delay={1.0}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                cat /sys/network/counter
              </span>
            </div>
            <div className="flex justify-center">
              <VisitorCounter />
            </div>
          </section>
        </CineSection>

        {/* ── CONTACT / CTA ── */}
        <CineSection delay={1.2}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                ./contact.sh --available
              </span>
            </div>
            <div className="border border-[var(--neon-cyan)]/20 rounded p-6 bg-[var(--dark-card)]/40
              animate-glow-pulse-green text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 border rounded text-xs font-mono transition-all duration-300 
                      hover:scale-105 link-underline
                      ${
                        link.color === "cyan"
                          ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
                          : link.color === "magenta"
                          ? "border-[var(--neon-magenta)] text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10"
                          : "border-[var(--neon-yellow)] text-[var(--neon-yellow)] hover:bg-[var(--neon-yellow)]/10"
                      }`}
                  >
                    {`[ ${link.label} ]`}
                  </a>
                ))}
              </div>
              <div className="text-[10px] font-mono text-[var(--neon-green)]/70 space-y-1">
                <div>STATUS: <span className="text-[var(--neon-green)] animate-pulse">OPEN FOR CONTRACTS</span></div>
                <div className="text-[var(--text-dim)] opacity-50">
                  CV: <span className="text-[var(--neon-cyan)] hover:underline cursor-pointer">coming soon</span>
                </div>
              </div>
            </div>
          </section>
        </CineSection>

        {/* ── FOOTER ── */}
        <CineSection delay={1.4}>
          <footer className="text-center pt-4 pb-4">
            <div className="text-[10px] font-mono text-[var(--text-dim)] opacity-50 space-y-1">
              <div className="animate-pulse">
                ⚡ [ CONNECTION SECURE ] ⚡
              </div>
              <div>&copy; {new Date().getFullYear()} superdandi</div>
            </div>
          </footer>
        </CineSection>
      </div>
    </main>
  );
}
