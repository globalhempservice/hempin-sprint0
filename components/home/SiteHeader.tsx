'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // mount flag for portals (avoids SSR mismatch)
  useEffect(() => setMounted(true), []);

  // Close on ESC (global when open)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Body scroll lock + initial focus when opening; restore focus when closing
  useEffect(() => {
    const body = document.body;
    if (open) {
      prevFocusRef.current = (document.activeElement as HTMLElement) || null;
      body.style.overflow = 'hidden';

      // focus first focusable in the drawer
      const el = asideRef.current;
      if (el) {
        const focusables = getFocusable(el);
        (focusables[0] as HTMLElement | undefined)?.focus();
      }
    } else {
      body.style.overflow = '';
      // return focus to the trigger if it still exists
      const fallback = triggerRef.current || prevFocusRef.current;
      fallback?.focus?.();
    }
    // cleanup on unmount (defensive)
    return () => {
      body.style.overflow = '';
    };
  }, [open]);

  // Focus trap inside the drawer
  useEffect(() => {
    if (!open) return;
    const el = asideRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = getFocusable(el);
      if (focusables.length === 0) return;

      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab on first → wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab on last → wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener('keydown', onKeyDown as any);
    return () => el.removeEventListener('keydown', onKeyDown as any);
  }, [open]);

  const close = () => setOpen(false);

  const Drawer = (
    <>
      <button
        className="nav-backdrop"
        aria-label="Close navigation"
        onClick={close}
      />
      <aside
        ref={asideRef}
        id="hempin-nav-left"
        className={`nav-left ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hempin-nav-title"
      >
        <div className="nav-head">
          <span id="hempin-nav-title" className="nav-title">Navigation</span>
          <button className="nav-x" onClick={close} aria-label="Close">×</button>
        </div>

        {/* Clicking any link closes the drawer (kept) */}
        <nav className="nav-list" onClick={close}>
          <a href="#cosmos">The Hemp'in Cosmos</a>
          <a href="#dimensions">DEWII — 8 universes</a>
          <a href="#database">The Hemp Database</a>
          <a href="#tools">Navigation Tools</a>
          <a href="#roadmap">Road Ahead</a>
          <a href="#cta">Back the SAFE Round</a>
        </nav>

        <div className="nav-footer">
          <a
            className="nav-list"
            href="https://www.hempin.org/trust"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trust Center ↗
          </a>
          <a
            className="nav-admin"
            href="https://investor.hempin.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Investor Center ↗
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

        </div>
      </div>

      {/* Portal renders outside header so it can overlay the whole page */}
      {mounted && open ? createPortal(Drawer, document.body) : null}
    </header>
  );
}

/* ---------- helpers ---------- */

function getFocusable(root: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  return Array.from(root.querySelectorAll<HTMLElement>(selectors))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}