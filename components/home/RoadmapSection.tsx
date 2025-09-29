export default function RoadmapSection() {
  const items: { when: string; title: string; detail: string }[] = [
    { when: 'Now',  title: 'LIFE teaser & Launch Fund', detail: 'Seed the journey, open the hangar doors.' },
    { when: 'Next', title: 'MVPs: Market • Fund • Knowledge', detail: 'Open lanes for discovery, backing, and learning.' },
    { when: 'Then', title: 'WORK modules • app.hempin.org • Bridges • Sensors', detail: 'Operate brands & farms; connect chat apps; stream real-world data.' },
    { when: 'Long-term', title: 'Living atlas & regenerative engine', detail: 'A continuously updated map of the bioeconomy.' },
  ];

  return (
    <section id="roadmap" className="section roadmap-section">
      <div className="container">
        {/* background stars + center lane */}
        <div className="roadmap-space" aria-hidden>
          <div className="stars parallax-a" />
          <div className="stars parallax-b" />
          <div className="star-lane" />
        </div>

        {/* H2 uses same scale as other sections */}
        <h2 className="display-title center hemp-underline-aurora">Road ahead</h2>

        {/* 3D crawl */}
        <div className="roadmap-wrap" role="list">
          <div className="roadmap-track">
            {items.map((it, i) => (
              <article
                key={it.when}
                role="listitem"
                className="milestone"
                style={{ ['--depth' as any]: i }}
              >
                <header className="milestone-head">
                  <span className="chip">{it.when}</span>
                  <strong className="milestone-title">{it.title}</strong>
                </header>
                <p className="muted">{it.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}