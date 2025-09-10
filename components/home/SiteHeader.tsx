'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Fixed, always at top on desktop & mobile */}
      <header
        className={[
          'fixed inset-x-0 top-0 z-50',
          'transition-all duration-300',
          scrolled
            ? 'backdrop-blur-md bg-black/30 shadow-[0_2px_12px_rgba(0,0,0,.25)]'
            : 'bg-transparent backdrop-blur-0 shadow-none',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2" aria-label="Hempin – home">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-white text-base md:text-lg font-semibold tracking-tight">
              Hempin
            </span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://fund.hempin.org"
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs md:text-sm font-semibold text-white
                         bg-pink-500 hover:bg-pink-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-pink-500 blur-xl opacity-40 animate-pulse"
              />
              Support the build
            </a>
          </div>
        </div>
      </header>

      {/* Spacer to offset the fixed header height */}
      <div aria-hidden className="h-[48px] md:h-[52px]" />
    </>
  );
}