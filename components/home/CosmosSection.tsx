// components/home/CosmosSection.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import Galaxy from '@/components/home/Galaxy';
import GalaxyControls, { GalaxyState } from '@/components/home/GalaxyControls';

const DEFAULTS: GalaxyState = {
  arms: 4,
  stars: 1500,
  speed: 0.08,
  opacity: 0.42,
  seed: 20241024,
  tiltDeg: 22,
  ellipticity: 0.68,
  meteors: true,
  hue: 0,
  coreGlow: 1.0,
  nebulaIntensity: 1.0,
  reverseDir: false,
  trails: false,
  blackHole: false,
  pulse: false,
  colorDrift: false,
  novaRate: 0,
};

type PlanetItem = {
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  link: string;
  disabled?: boolean;
};

const PLANETS: readonly PlanetItem[] = [
  {
    title: 'Fund',
    subtitle: 'Back the build',
    bullets: [
      'Review our SAFE round \u2014 meet the team and explore the terms.',
      'Invest in the infrastructure of the global hemp industry.',
      'Back the build \u2014 capital powers INOS, DEWII, and the full ecosystem.',
    ],
    cta: 'Visit Investor Center',
    link: 'https://investor.hempin.org',
  },
  {
    title: 'Market',
    subtitle: 'Find the good stuff',
    bullets: [
      'Browse & compare: fibers, hurd, bioplastics, textiles, food, wellness.',
      'See provenance: farm, process, certifications, regenerative score.',
      'Buy or sample: request quotes, MOQ info, and supplier contacts.',
    ],
    cta: 'Explore the Market',
    link: 'https://market.hempin.org/',
    disabled: true,
  },
  {
    title: 'Knowledge',
    subtitle: 'Trust the science',
    bullets: [
      'Read & remix: papers, protocols, BOMs, case studies.',
      'Learn by doing: short modules, quizzes, lab notebooks, data exports.',
      'Cite the source: versioned docs with peer & practitioner reviews.',
    ],
    cta: 'Open the Library',
    link: 'https://knowledge.hempin.org/',
    disabled: true,
  },
  {
    title: 'Place',
    subtitle: 'Maps with meaning',
    bullets: [
      'See activity: sowing/harvest windows, processing capacity, inventory.',
      'Plan visits: tours, residencies, demo days, onboarding routes.',
      'APIs for ops: sensor feeds, weather, soil, logistics overlays.',
    ],
    cta: 'Explore the Map',
    link: 'https://place.hempin.org/',
    disabled: true,
  },
  {
    title: 'Event',
    subtitle: 'Gather & launch',
    bullets: [
      'Attend or host: call for speakers, vendor tables, maker sessions.',
      'Hybrid-ready: live streams, replays, interactive labs.',
      'Earn NADA: quests, quizzes, and contribution bounties on site.',
    ],
    cta: 'See Upcoming Events',
    link: 'https://event.hempin.org/',
    disabled: true,
  },
  {
    title: 'Directory',
    subtitle: 'People who build',
    bullets: [
      'Find partners: filter by skill, region, capacity, certifications.',
      'Signal reputation: verified credentials, contributions, WETAS impact.',
      'Connect securely: wallet-based intros, privacy-respecting profiles.',
    ],
    cta: 'Meet the Network',
    link: 'https://directory.hempin.org/',
    disabled: true,
  },
] as const;

export default function CosmosSection() {
  const supernovaRef = useRef<(() => void) | null>(null);
  const warpRef = useRef<(() => void) | null>(null);

  // Desktop gate
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 820px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  const enableGalaxy = isDesktop;

  // Panel / play-mode state — must be declared before the sizing effect
  const [openPanel, setOpenPanel] = useState(false);

  // Galaxy sizing — single formula for both normal and play mode.
  // CSS handles play-mode scaling so the canvas is never reinitialised on panel open.
  const [galaxySize, setGalaxySize] = useState(820);
  useEffect(() => {
    if (!enableGalaxy) return;
    let raf: number | null = null;
    const calc = () => {
      const W = window.innerWidth, H = window.innerHeight;
      // Height-based: canvas slightly taller than viewport → small bleed into dividers
      setGalaxySize(Math.round(Math.min(H * 1.04, W * 0.93, 1300)));
    };
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enableGalaxy]); // openPanel removed — no reinit when panel opens

  const [gs, setGs] = useState<GalaxyState>(() => {
    try {
      if (typeof window === 'undefined') return DEFAULTS;
      const raw = localStorage.getItem('hempin.galaxy');
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const setState = (next: Partial<GalaxyState>) =>
    setGs(prev => {
      const v = { ...prev, ...next };
      try { localStorage.setItem('hempin.galaxy', JSON.stringify(v)); } catch {}
      return v;
    });

  const galaxyProps = useMemo(
    () => ({
      size: galaxySize,
      arms: gs.arms,
      stars: gs.stars,
      speed: gs.speed,
      opacity: gs.opacity,
      seed: gs.seed,
      tiltDeg: gs.tiltDeg,
      ellipticity: gs.ellipticity,
      meteors: gs.meteors,
      hue: gs.hue,
      coreGlow: gs.coreGlow,
      nebulaIntensity: gs.nebulaIntensity,
      reverseDir: gs.reverseDir,
      trails: gs.trails,
      blackHole: gs.blackHole,
      pulse: gs.pulse,
      colorDrift: gs.colorDrift,
      novaRate: gs.novaRate,
      supernovaRef,
      warpRef,
    }),
    [galaxySize, gs],
  );

  // Accordion
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const accordionToggle = (i: number) =>
    setOpenIndex(prev => (prev === i ? null : i));

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      const count = PLANETS.length;
      if (!count) return;
      const cur = openIndex ?? 0;
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); setOpenIndex((cur + 1) % count); break;
        case 'ArrowUp':   e.preventDefault(); setOpenIndex((cur - 1 + count) % count); break;
        case 'Home':      e.preventDefault(); setOpenIndex(0); break;
        case 'End':       e.preventDefault(); setOpenIndex(count - 1); break;
        default: break;
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [openIndex]);

  return (
    <section
      id="cosmos"
      className={`section cosmos-section${openPanel ? ' is-playing' : ''}`}
      aria-labelledby="cosmos-title"
    >
      {/* Galaxy layer — becomes position:fixed fullscreen when is-playing */}
      <div className="galaxy-layer" aria-hidden="true">
        {enableGalaxy ? <Galaxy {...galaxyProps} /> : null}
      </div>

      {/* Right-edge tab — pulls out the galaxy controls panel */}
      {enableGalaxy && !openPanel && (
        <button
          className="cosmos-fab-tab"
          aria-label="Open galaxy playground"
          onClick={() => setOpenPanel(true)}
        >
          <span className="satellite" />
          <span className="cosmos-fab-tab-label">Galaxy</span>
        </button>
      )}

      {/* Content that fades out when playing */}
      <div className="container center cosmos-content">
        <h2 id="cosmos-title" className="display-title hemp-underline-aurora">
          The Hemp&apos;in Cosmos
        </h2>

        <p className="muted max-w-2xl mx-auto mt-4">
          Like the night sky, the hemp universe is vast &mdash; but Hemp&apos;in gives it shape. Galaxies
          emerge as living spheres of activity: places to trade, fund, learn, gather, and grow.
          Within them orbit planets &mdash; brands, farms, products, research &mdash; each with their own
          moons of reviews, games, and tools. Together, they form a navigable cosmos, alive with
          possibility.
        </p>

        <div
          ref={listRef}
          className="cosmos-accordion"
          role="list"
          aria-label="Cosmos destinations"
          tabIndex={0}
        >
          {PLANETS.map(({ title, subtitle, bullets, cta, link, disabled }, i) => {
            const isOpen = openIndex === i;
            const contentId = `planet-panel-${i}`;
            const btnId = `planet-summary-${i}`;
            return (
              <div
                key={title}
                className={`card planet ${isOpen ? 'is-open' : ''}`}
                role="listitem"
              >
                <button
                  id={btnId}
                  className="planet-summary"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => accordionToggle(i)}
                >
                  <span className="planet-title">{title}</span>
                  <span className="planet-subtitle muted">{subtitle}</span>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M12 15.5l-6-6h12l-6 6z" />
                  </svg>
                </button>
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={btnId}
                  className="planet-content"
                >
                  <ul className="planet-bullets">
                    {bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="planet-cta-row">
                    {disabled ? (
                      <span className="mini-btn--disabled">Coming soon</span>
                    ) : (
                      <a href={link} className="mini-btn" target="_blank" rel="noopener noreferrer">
                        {cta}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls panel */}
      {enableGalaxy && (
        <GalaxyControls
          open={openPanel}
          onClose={() => setOpenPanel(false)}
          state={gs}
          setState={setState}
          onRandomize={() => setState({ seed: Math.floor(Math.random() * 1e9) })}
          onReset={() => setState(DEFAULTS)}
          onSupernova={() => supernovaRef.current?.()}
          onWarp={() => warpRef.current?.()}
        />
      )}
    </section>
  );
}
