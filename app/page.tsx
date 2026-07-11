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
  { name: "vizcoso", desc: "Vizcoso Entertainment — estudio de grabación & productora", lang: "WEB", href: "https://superdandi.github.io/vizcoso/" },
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
    boot: "Akzio Consultores — Banco de Chile",
    sys: "COBOL · IBM Mainframe · UNIX",
    log: "Analista Programador. Desarrollo y mantención de sistemas bancarios corporativos. Procesamiento batch y lógica transaccional para el core financiero.",
  },
  {
    year: "2007",
    boot: "Escuela Panguilemo — Proyecto SEP",
    sys: "Redes · Linux · Web Institucional",
    log: "Técnico Informático. Administración del laboratorio de computación, redes e infraestructura. Desarrollo del sitio web institucional. Talleres de computación.",
  },
  {
    year: "2008",
    boot: "INFOCOB Computación — Cofundador",
    sys: "Web · Redes · Multimedia",
    log: "Cofundador de empresa de servicios tecnológicos. Desarrollo web, servicio técnico, redes, soluciones multimedia e imagen corporativa digital.",
  },
  {
    year: "2007+",
    boot: "Consultor TI Independiente",
    sys: "Full-Stack · IA · 47+ soluciones web · 100+ clientes",
    log: "18+ años de consultoría tecnológica autónoma. Desarrollo web, integración de APIs, automatización de procesos. Integración de IA para acelerar desarrollo.",
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

const ACHIEVEMENTS = [
  "18+ años de experiencia profesional",
  "47+ soluciones web desarrolladas",
  "100+ clientes atendidos",
  "Desarrollo corporativo para Banco de Chile",
  "Integración de IA en procesos de desarrollo",
];

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
                Daniel Cobos
              </h1>
              <div className="text-[11px] font-mono text-[var(--neon-cyan)]/50 tracking-widest -mt-1">
                aka superdandi
              </div>
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
                  className={`glass-card border rounded px-5 py-2 text-sm font-mono transition-all duration-300 
                    hover:scale-105 link-underline
                    ${
                      link.color === "cyan"
                        ? "border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)]"
                        : link.color === "magenta"
                        ? "border-[var(--neon-magenta)]/30 text-[var(--neon-magenta)]"
                        : "border-[var(--neon-yellow)]/30 text-[var(--neon-yellow)]"
                    }`}
                >
                  {`[ ${link.label} ]`}
                </a>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── ACHIEVEMENTS ── */}
        <CineSection delay={0.3}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                cat /var/log/achievements.log
              </span>
            </div>
            <div className="glass-card border border-[var(--neon-cyan)]/15 rounded p-4 space-y-2">
              {ACHIEVEMENTS.map((item, i) => (
                <div key={i} className="flex items-center gap-3 log-entry" style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
                  <span className="text-[var(--neon-green)] font-mono text-sm">[✓]</span>
                  <span className="text-[var(--text-primary)] font-mono text-xs sm:text-sm">
                    {item}
                  </span>
                </div>
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
                  className={`log-entry glass-card border rounded p-4 relative
                    ${visibleLogs.includes(i) ? "opacity-100" : "opacity-0"}`}
                  style={{
                    borderColor: "rgba(18, 18, 26, 0.6)",
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
              <div className="glass-card border border-[var(--neon-cyan)]/20 rounded p-4 relative">
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
              <div className="glass-card border border-[var(--neon-green)]/20 rounded p-4 relative">
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
                  className="glass-card border border-[var(--neon-cyan)]/15 rounded p-4 
                    transition-all duration-300 hover:scale-[1.02] relative block"
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
            <div className="glass-card border border-[var(--neon-cyan)]/20 rounded p-6 relative
              animate-glow-pulse-green text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-card border rounded px-4 py-2 text-xs font-mono transition-all duration-300 
                      hover:scale-105 link-underline
                      ${
                        link.color === "cyan"
                          ? "border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)]"
                          : link.color === "magenta"
                          ? "border-[var(--neon-magenta)]/30 text-[var(--neon-magenta)]"
                          : "border-[var(--neon-yellow)]/30 text-[var(--neon-yellow)]"
                      }`}
                  >
                    {`[ ${link.label} ]`}
                  </a>
                ))}
              </div>
              <div className="text-[10px] font-mono text-[var(--neon-green)]/70 space-y-2">
                <div>STATUS: <span className="text-[var(--neon-green)] animate-pulse">OPEN FOR CONTRACTS</span></div>
                <div>MODALITY: <span className="text-[var(--neon-cyan)]">REMOTE — LatAm / Worldwide</span></div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  <a
                    href="/cv"
                    className="glass-card border border-[var(--neon-cyan)]/30 rounded px-4 py-2 text-xs font-mono text-[var(--neon-cyan)] transition-all duration-300 hover:scale-105 link-underline no-print"
                  >
                    [ 📄 CV VISUAL ]
                  </a>
                  <a
                    href="/cv/superdandi-cv-ats.txt"
                    download
                    className="glass-card border border-[var(--neon-green)]/30 rounded px-4 py-2 text-xs font-mono text-[var(--neon-green)] transition-all duration-300 hover:scale-105 link-underline no-print"
                  >
                    [ 📝 CV ATS ]
                  </a>
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
