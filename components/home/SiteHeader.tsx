'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // mount flag for portals (avoids SSR mismatch)
  useEffect(() => setMounted(true), []);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setOpen(false);

  // Drawer + backdrop (rendered into <body> via portal)
  const Drawer = (
    <>
      <button
        className="nav-backdrop"
        aria-label="Close navigation"
        onClick={close}
      />
      <aside
        id="hempin-nav-left"
        className={`nav-left ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="nav-head">
          <span className="nav-title">Navigation</span>
          <button className="nav-x" onClick={close} aria-label="Close">×</button>
        </div>

        <nav className="nav-list" onClick={close}>
          <a href="#cosmos">Cosmos</a>
          <a href="#dimensions">Dimensions</a>
          <a href="#database">Database</a>
          <a href="#tools">Navigation tools</a>
          <a href="#roadmap">Road ahead</a>
          <a href="#cta">Early access</a>
        </nav>

        <div className="nav-footer">
          <a
            className="nav-admin"
            href="https://admin.hempin.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Admin Console ↗
          </a>
        </div>
      </aside>
    </>
  );

  return (
    <header className="site-header arc">
      <div className="container">
        <div className="header-rail">
          {/* Left: hamburger */}
          <button
            ref={triggerRef}
            className="hamburger"
            aria-label="Open navigation"
            aria-controls="hempin-nav-left"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Center: brand pod with pulsating orb */}
          <a href="#top" className="header-pod" aria-label="Hemp’in — top">
            <span className="header-orb" aria-hidden="true" />
            <span className="brand-name">Hemp’in</span>
          </a>

          {/* Right column intentionally empty to keep center aligned */}
        </div>
      </div>

      {/* Portal renders outside header so it can overlay the whole page */}
      {mounted && open ? createPortal(Drawer, document.body) : null}
    </header>
  );
}