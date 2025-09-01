export default function ProfileLayout({ header, badges, stats, modules, legacy, levelPct = 0 }) {
  // header fill grows with levelPct (0..1)
  const fill = Math.min(1, Math.max(0, levelPct));
  const headerStyle = {
    background: `linear-gradient(135deg,
      rgba(30,194,139,0.10) 0%,
      rgba(30,194,139,0.10) ${Math.round(fill * 100)}%,
      transparent ${Math.round(fill * 100)}%)`
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Top card with growth fill */}
        <section
          className="rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md shadow-lg border border-white/5 p-6 transition-[background] duration-700"
          style={headerStyle}
        >
          {header}
        </section>

        {/* Middle: badges + stats */}
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-white/5 p-4 md:col-span-2">
            {badges}
          </div>
          <div className="rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-white/5 p-4">
            {stats}
          </div>
        </section>

        {/* Modules */}
        <section className="mt-6 rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-white/5 p-4">
          {modules}
        </section>

        {legacy && (
          <section className="mt-6 rounded-2xl bg-[var(--surface-2)]/80 backdrop-blur-md border border-white/5 p-4">
            {legacy}
          </section>
        )}
      </div>
    </div>
  );
}