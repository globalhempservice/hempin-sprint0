export default function Footer() {
    return (
      <footer className="site-footer">
        <div className="container row">
          <div className="brand">hempin</div>
          <div className="tiny muted">© {new Date().getFullYear()} Hempin. All rights reserved.</div>
        </div>
      </footer>
    );
  }