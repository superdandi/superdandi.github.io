"use client";

import { useEffect, useState } from "react";

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
  { label: "email", href: "mailto:dandi@superdandi.dev", color: "magenta" },
] as const;

const PROJECTS = [
  { name: "WARZINE", desc: "beat 'em up de tinta negra / fanzine punk — 2P local, 3 niveles, jefes", lang: "JS", href: "https://superdandi.github.io/warzine/" },
  { name: "INFOCOB", desc: "diseño & desarrollo digital — web, IA y productos digitales", lang: "WEB", href: "https://superdandi.github.io/infocob/" },
  { name: "SABIOS", desc: "pizzería artesanal Talca — pizza por pedazos y completos", lang: "WEB", href: "https://superdandi.github.io/sabios/" },
  { name: "VIZCOSO", desc: "abarrotes Talca — delivery y tienda online", lang: "WEB", href: "https://superdandi.github.io/vizcoso/" },
  { name: "super-ffmpeg-stream", desc: "ffmpeg wrapper for streaming", lang: "C", href: "https://github.com/superdandi/super-ffmpeg-stream" },
  { name: "pungafighters", desc: "2D fighting game engine", lang: "Rust", href: "https://github.com/superdandi/pungafighters" },
  { name: "fxprimavera", desc: "audio DSP plugin suite", lang: "C++", href: "https://github.com/superdandi/fxprimavera" },
];

export default function Home() {
  const [showBoot, setShowBoot] = useState(true);
  const [bootLine, setBootLine] = useState(0);
  const [time, setTime] = useState("");

  const bootMessages = [
    "> INITIALIZING KERNEL...",
    "> LOADING MEMORY MODULES...",
    "> MOUNTING FILESYSTEM...",
    "> CHECKING NETWORK INTERFACES...",
    "> ESTABLISHING SECURE CHANNEL...",
    `> AUTHENTICATED AS: superdandi`,
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

      <div className="w-full max-w-3xl space-y-12">
        <section className="text-center space-y-6">
          <pre className="text-[0.4rem] sm:text-[0.5rem] md:text-[0.55rem] leading-tight text-[var(--neon-cyan)] opacity-80 hidden sm:block select-none">
            {ASCII_ART}
          </pre>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-[var(--neon-cyan)] text-shadow-cyan typing inline-block">
              superdandi
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-dim)] mt-4 max-w-lg mx-auto leading-relaxed">
              <span className="text-[var(--neon-green)]">software engineer</span>
              {" / "}
              <span className="text-[var(--neon-magenta)]">audio enthusiast</span>
              {" / "}
              <span className="text-[var(--neon-yellow)]">pixel artist</span>
            </p>
            <p className="text-xs text-[var(--text-dim)] mt-2 font-mono">
              crafting code at the intersection of sound and light
            </p>
          </div>
        </section>

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
                      : "border-[var(--neon-magenta)] text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10"
                  }`}
              >
                {`[ ${link.label} ]`}
              </a>
            ))}
          </div>
        </section>

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
                className="block border border-[var(--text-dim)]/20 rounded p-4 
                  transition-all duration-300 hover:glow-border-cyan hover:scale-[1.02] 
                  bg-[var(--dark-card)]/50 backdrop-blur"
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

        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
            <span className="text-[var(--neon-green)] text-xs font-mono">
              uptime
            </span>
          </div>
          <div className="border border-[var(--text-dim)]/20 rounded p-4 bg-[var(--dark-card)]/50">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
              <span>
                status:{" "}
                <span className="text-[var(--neon-green)]">online</span>
              </span>
              <span>
                location:{" "}
                <span className="text-[var(--neon-cyan)]">[REDACTED]</span>
              </span>
              <span>
                shell:{" "}
                <span className="text-[var(--neon-magenta)]">/bin/zsh</span>
              </span>
              <span>
                editor:{" "}
                <span className="text-[var(--neon-yellow)]">neovim</span>
              </span>
            </div>
          </div>
        </section>

        <footer className="text-center pt-8 pb-4">
          <div className="text-[10px] font-mono text-[var(--text-dim)] opacity-50 space-y-1">
            <div className="animate-pulse">
              ⚡ [ CONNECTION SECURE ] ⚡
            </div>
            <div>&copy; {new Date().getFullYear()} superdandi</div>
          </div>
        </footer>
      </div>
    </main>
  );
}
