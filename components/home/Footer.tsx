export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        {/* Brand lockup with glowing orb */}
        <div className="footer-brand">
          <a href="#top" className="brand-link" aria-label="Hemp’in — back to top">
            <span className="header-orb" aria-hidden />
            <span className="brand-text">Hemp’in</span>
          </a>
          <p className="tiny muted tagline">
            A Global Hemp Service LLC initiative.
          </p>
        </div>

        {/* Links / contact */}
        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer links">
            <a href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>
            
          </nav>

          <div className="tiny muted">
            © {year} Hemp’in. All rights reserved.
          </div>

          <div className="nice-line" aria-hidden>
            <span>Stay curious</span>
            <span>Be kind</span>
            <span>Grow hemp</span>
            <span>Made with LOVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}