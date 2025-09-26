export default function SiteHeader() {
    return (
      <header className="site-header">
        <div className="container row">
          <div className="brand">hempin</div>
          <nav className="nav">
            <a href="#cosmos">Cosmos</a>
            <a href="#dimensions">Work/Life</a>
            <a href="#database">Database</a>
            <a href="#tools">Tools</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#cta" className="btn">Get updates</a>
          </nav>
        </div>
      </header>
    );
  }