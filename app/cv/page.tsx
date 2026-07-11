"use client";

import { useEffect, useState } from "react";
import CineSection from "@/app/components/CineSection";
import Link from "next/link";

const PROFILE = `Desarrollador de Software y Técnico de Nivel Superior en Sistemas Informáticos con más de 18 años de experiencia diseñando e implementando soluciones tecnológicas para empresas, instituciones educacionales y clientes particulares.

Durante mi trayectoria he desarrollado más de 47 soluciones web y prestado servicios tecnológicos a más de 100 clientes, evolucionando junto con la industria desde los primeros desarrollos web en HTML hasta la integración actual de inteligencia artificial para acelerar el desarrollo, automatizar procesos y construir soluciones adaptadas a cada necesidad.

Mi experiencia combina desarrollo de software, desarrollo web, consultoría TI, infraestructura tecnológica, integración de APIs, automatización y soporte técnico. Estoy acostumbrado a trabajar de forma autónoma, colaborar con equipos remotos y desenvolverme en entornos multiplataforma (macOS, Linux y Windows).`;

const ACHIEVEMENTS = [
  "18+ años de experiencia profesional",
  "47+ soluciones web desarrolladas",
  "100+ clientes atendidos",
  "Experiencia en desarrollo corporativo para Banco de Chile",
  "Integración de IA en procesos de desarrollo",
];

const SKILL_GROUPS = [
  {
    title: "Desarrollo Web",
    color: "var(--neon-cyan)",
    skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "APIs REST", "JSON", "WordPress", "PrestaShop"],
  },
  {
    title: "Desarrollo de Software",
    color: "var(--neon-green)",
    skills: ["Python", "COBOL", "SQL"],
  },
  {
    title: "Inteligencia Artificial",
    color: "var(--neon-magenta)",
    skills: ["OpenAI API", "Prompt Engineering", "Automatización", "Integración de IA"],
  },
  {
    title: "Infraestructura TI",
    color: "var(--neon-yellow)",
    skills: ["Windows", "Linux", "macOS", "Redes", "Hosting", "Dominios", "Soporte TI"],
  },
  {
    title: "Herramientas",
    color: "var(--neon-cyan)",
    skills: ["Git", "GitHub", "VS Code", "Chrome DevTools", "GitHub Pages", "Figma", "Premiere Pro", "Photoshop"],
  },
];

const EXPERIENCE = [
  {
    period: "2006",
    role: "Analista Programador",
    org: "Akzio Consultores — Banco de Chile",
    highlights: [
      "Desarrollo COBOL para sistemas bancarios corporativos",
      "IBM Mainframe y UNIX",
      "Mantención de lógica transaccional del core financiero",
    ],
  },
  {
    period: "2007 — Present",
    role: "Consultor TI Independiente",
    org: "Freelance · Chile",
    highlights: [
      "Desarrollo web full-stack para 100+ clientes",
      "Integración de APIs y automatización de procesos",
      "Desarrollo asistido por Inteligencia Artificial",
      "Cofundador de INFOCOB Computación (2008)",
    ],
  },
  {
    period: "2014 — 2015",
    role: "Técnico Informático",
    org: "Escuela Panguilemo — Proyecto SEP",
    highlights: [
      "Administración del laboratorio de computación",
      "Mantención de infraestructura y redes",
      "Desarrollo del sitio web institucional",
      "Talleres de computación",
    ],
  },
  {
    period: "2015",
    role: "Asistente Informático",
    org: "Proyecto PISA Chile",
    highlights: [
      "Configuración y preparación de equipos computacionales",
      "Soporte técnico durante la aplicación del estudio internacional",
      "Resolución de incidencias en terreno",
      "Procesamiento de microdatos",
      "Cumplimiento de protocolos internacionales",
    ],
  },
];

export default function CVPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().split("T")[1].split(".")[0]);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      {/* Terminal prompt */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-xs text-[var(--neon-cyan)] opacity-60">
        <div>superdandi@cv:~$</div>
        <div>{time} UTC</div>
      </div>

      {/* Print button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 no-print">
        <button
          onClick={() => window.print()}
          className="glass-card border border-[var(--neon-cyan)]/30 rounded px-4 py-2 text-xs font-mono text-[var(--neon-cyan)] hover:scale-105 transition-transform duration-300"
        >
          [ 🖨️ DOWNLOAD PDF ]
        </button>
      </div>

      <div className="w-full max-w-3xl space-y-12">
        {/* ── HEADER ── */}
        <CineSection>
          <section className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">
                cat cv.md --formatted
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[var(--neon-cyan)] text-shadow-cyan font-mono">
              Daniel Alberto Cobos Mansilla
            </h1>
            <p className="text-sm sm:text-base text-[var(--neon-magenta)] font-mono">
              Software Engineer · Technical Solutions Consultant · Web Developer
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-dim)] font-mono">
              📍 Talca, Chile · 🌎 Disponible remoto — LatAm / Worldwide
            </p>
          </section>
        </CineSection>

        {/* ── PERFIL ── */}
        <CineSection delay={0.15}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">head -n 20 perfil.md</span>
            </div>
            <div className="glass-card border border-[var(--neon-cyan)]/15 rounded p-4 sm:p-6">
              {PROFILE.split("\n\n").map((p, i) => (
                <p key={i} className="text-xs sm:text-sm text-[var(--text-primary)] font-mono leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── LOGROS ── */}
        <CineSection delay={0.3}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">cat /var/log/achievements.log</span>
            </div>
            <div className="glass-card border border-[var(--neon-cyan)]/15 rounded p-4 sm:p-6 space-y-2">
              {ACHIEVEMENTS.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[var(--neon-green)] font-mono text-sm shrink-0">[✓]</span>
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] font-mono">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── SKILLS ── */}
        <CineSection delay={0.45}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">skills --matrix --all</span>
            </div>
            <div className="space-y-3">
              {SKILL_GROUPS.map((group, i) => (
                <div
                  key={i}
                  className="glass-card border rounded p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-2"
                  style={{ borderColor: `${group.color}20` }}
                >
                  <div
                    className="text-xs font-mono font-bold uppercase tracking-widest shrink-0 sm:w-40 mb-1 sm:mb-0"
                    style={{ color: group.color }}
                  >
                    {group.title}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, j) => (
                      <span
                        key={j}
                        className="text-[10px] sm:text-xs font-mono px-2 py-1 rounded border"
                        style={{
                          color: group.color,
                          borderColor: `${group.color}25`,
                          background: `${group.color}08`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── EXPERIENCIA ── */}
        <CineSection delay={0.6}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">cat /var/log/career.log --full</span>
            </div>
            <div className="space-y-4">
              {EXPERIENCE.map((exp, i) => (
                <div
                  key={i}
                  className="glass-card border rounded p-4 sm:p-5 relative"
                  style={{ borderLeftColor: "var(--neon-cyan)", borderLeftWidth: "3px" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <span className="text-[var(--neon-yellow)] font-mono text-xs font-bold">
                      [{exp.period}]
                    </span>
                    <span className="text-[var(--text-dim)] font-mono text-[10px] sm:text-xs">
                      {exp.org}
                    </span>
                  </div>
                  <div className="text-[var(--neon-cyan)] font-mono text-sm font-bold mb-3">
                    {exp.role}
                  </div>
                  <ul className="space-y-1.5">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text-dim)] font-mono">
                        <span className="text-[var(--neon-green)] text-[10px] shrink-0">├─</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </CineSection>

        {/* ── FORMACIÓN ── */}
        <CineSection delay={0.75}>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">cat formacion.txt</span>
            </div>
            <div className="glass-card border border-[var(--neon-green)]/20 rounded p-4 sm:p-5">
              <div className="text-[var(--neon-green)] font-mono text-sm font-bold mb-1">
                Técnico de Nivel Superior en Sistemas Informáticos
              </div>
              <div className="text-[var(--text-dim)] font-mono text-xs">
                Instituto Profesional Santo Tomás
              </div>
            </div>
          </section>
        </CineSection>

        {/* ── DOWNLOADS ── */}
        <CineSection delay={0.9} className="no-print">
          <section className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[var(--neon-cyan)] text-sm font-mono">$</span>
              <span className="text-[var(--neon-green)] text-xs font-mono">./download.sh --format=ALL</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <button
                onClick={() => window.print()}
                className="glass-card border border-[var(--neon-cyan)]/30 rounded px-6 py-3 text-sm font-mono text-[var(--neon-cyan)] transition-all duration-300 hover:scale-105 link-underline"
              >
                [ 📄 DOWNLOAD PDF ]
              </button>
              <a
                href="/cv/superdandi-cv-ats.txt"
                download
                className="glass-card border border-[var(--neon-green)]/30 rounded px-6 py-3 text-sm font-mono text-[var(--neon-green)] transition-all duration-300 hover:scale-105 link-underline"
              >
                [ 📝 CV ATS .TXT ]
              </a>
              <Link
                href="/"
                className="glass-card border border-[var(--neon-magenta)]/30 rounded px-6 py-3 text-sm font-mono text-[var(--neon-magenta)] transition-all duration-300 hover:scale-105 link-underline"
              >
                [ ← BACK ]
              </Link>
            </div>
          </section>
        </CineSection>

        {/* ── FOOTER ── */}
        <CineSection delay={1.0}>
          <footer className="text-center pt-2 pb-4">
            <div className="text-[10px] font-mono text-[var(--text-dim)] opacity-50 space-y-1">
              <div>github.com/superdandi · linkedin.com/in/superdandi · dandi@superdandi.dev</div>
              <div>&copy; {new Date().getFullYear()} Daniel Cobos — superdandi</div>
            </div>
          </footer>
        </CineSection>
      </div>
    </main>
  );
}