// components/home/RoadmapSection.tsx
import * as React from 'react';

type Phase = 'done' | 'now' | 'next' | 'then' | 'long';

type Item = {
  when: string;
  title: string;
  detail: string;
  phase: Phase;
};

export default function RoadmapSection() {
  const items: Item[] = [
    {
      when: 'Live',
      title: 'DEWII launched',
      detail: 'dewii.hempin.org \u2014 8 mini-apps, NADA economy, WETAS scoring. First users onboarding.',
      phase: 'done',
    },
    {
      when: 'Now',
      title: 'SAFE round + hemp association partnerships',
      detail: 'Raise capital via SAFE. Onboard industry associations to bring their members into INOS.',
      phase: 'now',
    },
    {
      when: 'Next',
      title: 'MVPs: Market \u2022 Fund \u2022 Knowledge',
      detail: 'Open lanes for discovery, backing, and learning.',
      phase: 'next',
    },
    {
      when: 'Then',
      title: 'WORK modules \u2022 Bridges \u2022 Sensors',
      detail: 'Operate brands & farms; connect chat apps; stream real data.',
      phase: 'then',
    },
    {
      when: 'Long-term',
      title: 'Living atlas & regenerative engine',
      detail: 'A continuously updated map of the bioeconomy.',
      phase: 'long',
    },
  ];

  return (
    <section id="roadmap" className="section roadmap-section">
      <div className="container">
        <h2 className="display-title hemp-underline-aurora center">Road ahead</h2>

        <div className="rm-wrap" role="list" aria-label="Product roadmap">
          <div className="rm-track rm-autocrawl">
            {items.map((it, i) => (
              <article
                key={it.when}
                role="listitem"
                className={`rm-card phase-${it.phase}`}
                style={{ ['--i' as any]: i }}
              >
                <header className="rm-head">
                  <span className="rm-chip">{it.when}</span>
                  <strong className="rm-title">{it.title}</strong>
                </header>
                <p className="muted rm-detail">{it.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
