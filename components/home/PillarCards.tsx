// components/home/PillarCards.tsx
export default function PillarCards() {
  const items = [
    {
      title: 'Tools',
      subtitle: 'Your instruments to create, transact, and coordinate from your account.',
      components: ['Wallet', 'Architect', 'Comms'],
    },
    {
      title: 'Universes',
      subtitle: 'The activity layers where real work happens, each with its own flows.',
      components: ['Fund', 'Market', 'Places', 'Organizations'],
    },
    {
      title: 'Fields',
      subtitle: 'Cross-cutting forces that connect and align everything across the network.',
      components: ['Events', 'Research', 'Governance'],
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="text-center mb-8">
        <div className="mx-auto mb-2 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide border border-white/15 bg-white/5">
          ROADMAP
        </div>
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">What we’re building</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm opacity-70">
          Our roadmap brings together tools, universes, and fields — gradually unlocking the hemp
          economy’s full potential step by step.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex flex-col rounded-2xl bg-white/5 p-6 backdrop-blur-sm"
          >
            <h4 className="text-center text-base md:text-lg font-medium">{it.title}</h4>
            <p className="mt-2 text-sm opacity-75 text-center">{it.subtitle}</p>
            <ul className="mt-4 space-y-1 text-sm opacity-80">
              {it.components.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}