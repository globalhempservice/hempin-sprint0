import { useState, useEffect, useCallback } from 'react';
import Galaxy from '@/components/home/Galaxy';

type Card = { title: string; text: string };

const CARDS: Card[] = [
  { title: 'Market',    text: 'Discover hemp products and materials across industries.' },
  { title: 'Fund',      text: 'Back regenerative projects, campaigns, and infrastructure.' },
  { title: 'Knowledge', text: 'Access science, craft, and shared cultural intelligence.' },
  { title: 'Place',     text: 'Explore maps of farms, showrooms, labs, and venues.' },
  { title: 'Event',     text: 'Join expos, festivals, and gatherings worldwide.' },
  { title: 'Directory', text: 'Find the actors: brands, innovators, farmers, researchers.' },
];

export default function CosmosSection() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback((idx: number) => {
    setOpen(prev => (prev === idx ? null : idx));
  }, []);

  // Close with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="cosmos" className="section cosmos-section">
      {/* Galaxy backdrop */}
      <div className="galaxy-layer">
        <Galaxy
          size={820}
          stars={1500}
          arms={4}
          speed={0.08}
          opacity={0.48}
          seed={20241024}
          tiltDeg={22}
          ellipticity={0.68}
        />
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
          {CARDS.map((c, i) => {
            const isOpen = open === i;
            return (
              <div
                key={c.title}
                className={`card planet ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="planet-summary"
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                >
                  <span className="planet-title">{c.title}</span>
                  <svg
                    className="chevron"
                    width="18" height="18" viewBox="0 0 24 24" aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>

                <div className="planet-content" aria-hidden={!isOpen}>
                  <p>{c.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}