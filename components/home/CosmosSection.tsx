import { useEffect, useMemo, useState } from 'react';
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
};

type PlanetItem = {
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  link: string;
};

const PLANETS: PlanetItem[] = [
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
  },
  {
    title: 'Fund',
    subtitle: 'Back what matters',
    bullets: [
      'Discover campaigns: cultivation, processing lines, R&D, community builds.',
      'Transparent use: milestones, on-chain receipts, WETAS credit flows.',
      'Perks & returns: product drops, yield shares, impact certificates.',
    ],
    cta: 'Browse Campaigns',
    link: 'https://fund.hempin.org/',
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
  },
] as const;

export default function CosmosSection() {
  // desktop gate for the galaxy + control panel
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  const enableGalaxy = isDesktop; // <- no galaxy on mobile

  // galaxy sizing
  const [galaxySize, setGalaxySize] = useState(820);
  useEffect(() => {
    const calc = () => {
      const s = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      setGalaxySize(Math.round(Math.max(560, Math.min(s, 1100))));
    };
    calc();
    window.addEventListener('resize', calc, { passive: true });
    return () => window.removeEventListener('resize', calc);
  }, []);

  // galaxy state (persist in localStorage)
  const [openPanel, setOpenPanel] = useState(false);
  const [gs, setGs] = useState<GalaxyState>(() => {
    try {
      const raw = localStorage.getItem('hempin.galaxy');
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const setState = (next: Partial<GalaxyState>) =>
    setGs((prev) => {
      const v = { ...prev, ...next };
      try {
        localStorage.setItem('hempin.galaxy', JSON.stringify(v));
      } catch {}
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
    }),
    [galaxySize, gs],
  );

  // accordion
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="cosmos" className="section cosmos-section">
      {/* galaxy background (desktop only) */}
      <div className="galaxy-layer" aria-hidden="true">
        {enableGalaxy ? <Galaxy {...galaxyProps} /> : null}
      </div>

      {/* Easter egg FAB (desktop) */}
      {enableGalaxy && (
        <button
          className="hud-fab hud-fab--cosmos"
          aria-label="Tweak galaxy"
          onClick={() => setOpenPanel(true)}
        >
          <span className="satellite" />
        </button>
      )}

      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">The Hemp’in Cosmos</h2>

        <p className="muted max-w-2xl mx-auto mt-4">
          Like the night sky, the hemp universe is vast — but Hemp’in gives it shape. Galaxies
          emerge as living spheres of activity: places to trade, fund, learn, gather, and grow.
          Within them orbit planets — brands, farms, products, research — each with their own
          moons of reviews, games, and tools. Together, they form a navigable cosmos, alive with
          possibility.
        </p>

        {/* Compact-left accordion (always visible) */}
        <div className="cosmos-accordion">
          {PLANETS.map(({ title, subtitle, bullets, cta, link }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={title} className={`card planet ${isOpen ? 'is-open' : ''}`} aria-expanded={isOpen}>
                <button className="planet-summary" onClick={() => toggle(i)}>
                  <span className="planet-title" aria-hidden={false}>
                    {title}
                  </span>
                  <span className="planet-subtitle muted">{subtitle}</span>
                  <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M12 15.5l-6-6h12l-6 6z" />
                  </svg>
                </button>

                <div className="planet-content">
                  <ul className="planet-bullets">
                    {bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="planet-cta-row">
                    <a href={link} className="mini-btn" target="_blank" rel="noopener noreferrer">
                      {cta}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls drawer (desktop only) */}
      {enableGalaxy && (
        <GalaxyControls
          open={openPanel}
          onClose={() => setOpenPanel(false)}
          state={gs}
          setState={setState}
          onRandomize={() => setState({ seed: Math.floor(Math.random() * 1e9) })}
          onReset={() => setState(DEFAULTS)}
        />
      )}

      {/* stacking fixes so background never blocks content */}
      <style jsx>{`
        .cosmos-section {
          position: relative;
        }
        .galaxy-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cosmos-section :global(.container),
        .cosmos-section :global(.display-title),
        .cosmos-section :global(.muted),
        .cosmos-section :global(.cosmos-accordion),
        .cosmos-section :global(.hud-fab) {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  );
}