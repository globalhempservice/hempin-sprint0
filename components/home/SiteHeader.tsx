export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container row">
        <div className="brand">
          Hemp’in
          <span className="dot" aria-hidden="true" />
        </div>
        <nav className="nav">
          <a href="#cta" className="btn primary">
            Join the launch list
          </a>
        </nav>
      </div>
    </header>
  );
}