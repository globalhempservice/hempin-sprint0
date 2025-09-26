export default function CosmosSection() {
    return (
      <section id="cosmos" className="section">
        <div className="container">
          <h2>The Hempin Cosmos</h2>
          <p className="muted">
            Galaxies are big domains (Market, Fund, Knowledge, Place, Event, Directory).
            Each one contains planets — concrete nodes like brands, farms, products,
            campaigns, or research — with moons for reviews, mini-games, and APIs.
          </p>
          <div className="cards">
            <div className="card"><h3>Market</h3><p>Discover & buy hemp goods.</p></div>
            <div className="card"><h3>Fund</h3><p>Back campaigns & infrastructure.</p></div>
            <div className="card"><h3>Knowledge</h3><p>Learn from science & craft.</p></div>
            <div className="card"><h3>Place</h3><p>Maps of farms, labs, venues.</p></div>
            <div className="card"><h3>Event</h3><p>Festivals, expos, meetups.</p></div>
            <div className="card"><h3>Directory</h3><p>People, brands, and orgs.</p></div>
          </div>
        </div>
      </section>
    );
  }