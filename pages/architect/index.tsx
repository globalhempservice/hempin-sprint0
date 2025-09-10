// pages/architect/index.tsx
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import Nebula from '@/components/particles/Nebula';
import SolarSystem from '@/components/organisms/SolarSystem';
import ControlDock from '@/components/organisms/ControlDock';
import { useArchitect } from '@/stores/architect';

export default function ArchitectPage() {
  const { nodes, config, setConfig } = useArchitect();
  const [hovered, setHovered] = useState<string | null>(null);

  // Collapsed by default
  const [dockOpen, setDockOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Canvas size calculator
  const calcCanvas = useMemo(() => {
    const DOCK_W = 320;
    const PADDING = 32;
    return (vpW: number, vpH: number, subtractDock: boolean) => {
      const availableW = vpW - (subtractDock ? DOCK_W : 0) - PADDING * 2;
      const target = Math.min(920, Math.max(560, Math.min(availableW, vpH - PADDING * 2)));
      return Math.max(360, target);
    };
  }, []);

  // Sync breakpoint + canvas size
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      setIsDesktop(desktop);

      // On desktop, subtract dock width when it's open. On mobile, the dock overlays, so don't subtract.
      const next = Math.round(calcCanvas(w, h, dockOpen && desktop));
      if (next !== config.size) setConfig({ size: next });
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dockOpen, calcCanvas]);

  return (
    <>
      <Head><title>Hempin — Architect</title></Head>

      <main className="min-h-screen bg-[#0b0b0d] text-zinc-200 flex relative overflow-hidden">

        {/* Dock (slides over content) */}
        <aside
          id="architect-dock"
          className={`
            fixed top-0 left-0 h-full z-30
            border-r border-white/10
            bg-black/70 md:bg-black/50 backdrop-blur-sm
            transition-transform duration-300 will-change-transform
            ${dockOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{ width: 320 }}
          aria-hidden={!dockOpen}
        >
          <ControlDock />
        </aside>

        {/* Scrim for mobile only */}
        {dockOpen && !isDesktop && (
          <button
            aria-label="Close panel"
            onClick={() => setDockOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px]"
          />
        )}

        {/* Toggle button (always clickable) */}
        <button
          onClick={() => setDockOpen(v => !v)}
          aria-controls="architect-dock"
          aria-expanded={dockOpen}
          className="
            fixed md:absolute z-40
            left-3 bottom-3 md:left-3 md:top-3 md:bottom-auto
            rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs
            hover:bg-white/15 transition
          "
        >
          {dockOpen ? 'Hide panel' : 'Show panel'}
        </button>

        {/* Canvas + Hero */}
        <section className="relative flex-1 grid place-items-center overflow-hidden">

          {/* Hero text (floating at top center; doesn’t affect centering of canvas) */}
          <header
            className="
              pointer-events-none absolute z-10
              top-4 left-1/2 -translate-x-1/2
              w-[min(92vw,980px)] text-center
            "
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Hempin — The Universes Map
            </h1>
            <p className="mt-2 text-xs md:text-sm opacity-75">
              Hover planets to learn more. Your account is the nucleus. Tools orbit close.
              Universes live in the middle ring. Cross-cutting fields flow on the outer ring.
            </p>
            <p className="mt-1 text-[11px] md:text-xs opacity-60">
              This Architect view is a living visualization tool of the Hempin ecosystem and will
              evolve over time as we add features, data, and interactions.
            </p>
          </header>

          {config.show.nebula && <Nebula size={config.size} />}

          <div className="relative" style={{ width: config.size, height: config.size }}>
            <SolarSystem
              nodes={nodes}
              config={config}
              hoveredId={hovered}
              onHover={setHovered}
            />
          </div>

          <p className="absolute bottom-4 text-xs opacity-50">ARCHITECT — experimental</p>
        </section>
      </main>
    </>
  );
}