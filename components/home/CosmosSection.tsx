import { useMemo, useState } from 'react';
import Galaxy from '@/components/home/Galaxy';
import GalaxyControls, { GalaxyState } from '@/components/home/GalaxyControls';

const DEFAULTS: GalaxyState = {
  arms: 4,
  stars: 1500,
  speed: 0.08,
  opacity: 0.52,
  seed: 20241024,
  tiltDeg: 22,
  ellipticity: 0.68,
  meteors: true,
};

export default function CosmosSection() {
  const [open, setOpen] = useState(false);
  const [gs, setGs] = useState<GalaxyState>(() => {
    // restore last user settings if present
    try {
      const raw = localStorage.getItem('hempin.galaxy');
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });

  const setState = (next: Partial<GalaxyState>) => {
    setGs(prev => {
      const v = { ...prev, ...next };
      try { localStorage.setItem('hempin.galaxy', JSON.stringify(v)); } catch {}
      return v;
    });
  };

  const randomize = () => {
    const randSeed = Math.floor(Math.random() * 1e9);
    setState({ seed: randSeed });
  };

  const reset = () => setState(DEFAULTS);

  // Keep heavy rebuilds tidy: when stars or seed change, Galaxy will recompute buffers,
  // but the other props are super cheap and animate instantly.
  const galaxyProps = useMemo(() => ({
    size: 820,
    arms: gs.arms,
    stars: gs.stars,
    speed: gs.speed,
    opacity: gs.opacity,
    seed: gs.seed,
    tiltDeg: gs.tiltDeg,
    ellipticity: gs.ellipticity,
    // expose meteors as a prop your Galaxy already respects (if not, ignore)
    meteors: gs.meteors,
  }), [gs]);

  return (
    <section id="cosmos" className="section cosmos-section">
      {/* Satellite FAB (only visible while section is in view) */}
      <button
        className="hud-fab"
        aria-label="Tweak galaxy"
        onClick={() => setOpen(true)}
      >
        <span className="satellite" />
      </button>

      {/* Background galaxy layer */}
      <div className="galaxy-layer">
        <Galaxy {...galaxyProps} />
      </div>

      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">The Hemp’in Cosmos</h2>

        <p className="muted max-w-2xl mx-auto mt-4">
          Like the night sky, the hemp universe is vast — but Hemp’in gives it shape.
          Galaxies emerge as living spheres of activity: places to trade, fund, learn,
          gather, and grow. Within them orbit planets — brands, farms, products, research —
          each with their own moons of reviews, games, and tools. Together, they form a
          navigable cosmos, alive with possibility.
        </p>

        <div className="cards mt-10 cosmos-cards">
          {[
            { title: 'Market',    text: 'Discover hemp products and materials across industries.' },
            { title: 'Fund',      text: 'Back regenerative projects, campaigns, and infrastructure.' },
            { title: 'Knowledge', text: 'Access science, craft, and shared cultural intelligence.' },
            { title: 'Place',     text: 'Explore maps of farms, showrooms, labs, and venues.' },
            { title: 'Event',     text: 'Join expos, festivals, and gatherings worldwide.' },
            { title: 'Directory', text: 'Find the actors: brands, innovators, farmers, researchers.' },
          ].map(({title, text}) => (
            <details key={title} className="card planet">
              <summary><h3>{title}</h3><span className="caret" aria-hidden /></summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </div>

      <GalaxyControls
        open={open}
        onClose={() => setOpen(false)}
        state={gs}
        setState={setState}
        onRandomize={randomize}
        onReset={reset}
      />
    </section>
  );
}