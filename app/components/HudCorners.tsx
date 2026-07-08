export default function HudCorners() {
  return (
    <>
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-[var(--neon-cyan)]/40 pointer-events-none z-10" />
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-[var(--neon-cyan)]/40 pointer-events-none z-10" />
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-[var(--neon-cyan)]/40 pointer-events-none z-10" />
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-[var(--neon-cyan)]/40 pointer-events-none z-10" />
    </>
  );
}
