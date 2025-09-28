import Galaxy from '@/components/home/Galaxy';

export default function CosmosSection() {
  return (
    <section id="cosmos" className="section cosmos-section">
      {/* Background galaxy layer */}
      <div className="galaxy-layer">
        <Galaxy
          size={820}
          stars={1500}
          arms={4}
          speed={0.08}
          opacity={0.52}
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
          {[
            { title: 'Market',    text: 'Discover hemp products and materials across industries.' },
            { title: 'Fund',      text: 'Back regenerative projects, campaigns, and infrastructure.' },
            { title: 'Knowledge', text: 'Access science, craft, and shared cultural intelligence.' },
            { title: 'Place',     text: 'Explore maps of farms, showrooms, labs, and venues.' },
            { title: 'Event',     text: 'Join expos, festivals, and gatherings worldwide.' },
            { title: 'Directory', text: 'Find the actors: brands, innovators, farmers, researchers.' },
          ].map(({title, text}) => (
            <details key={title} className="card planet">
              <summary>
                <h3>{title}</h3>
              </summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}