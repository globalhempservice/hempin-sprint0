'use client';

import { useEffect, useState } from 'react';

/**
 * Burst — a one-shot expanding ring.
 * - Renders for ~800ms then unmounts itself.
 * - Honors reduced motion (does nothing in that case).
 */
export default function Burst() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      // Skip animation entirely
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(false), 820);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="
        pointer-events-none absolute inset-0 flex items-center justify-center z-0
      "
    >
      <div
        className="
          h-[40vh] w-[40vh] min-h-[260px] min-w-[260px] max-h-[70vh] max-w-[70vh]
          rounded-full
          bg-[radial-gradient(closest-side,rgba(68,255,148,0.65),rgba(68,255,148,0)_60%)]
          opacity-0
          animate-[burst_800ms_ease-out_forwards]
          mix-blend-screen blur-[48px]
        "
      />
    </div>
  );
}