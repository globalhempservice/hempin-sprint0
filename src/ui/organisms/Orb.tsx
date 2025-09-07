'use client';

import { useEffect, useRef } from 'react';

type OrbProps = { className?: string };

/**
 * Orb — gradient blob with gentle float, cursor parallax,
 * and a visible CTA-synced boost (green accent ring).
 *
 * - Boost is controlled via group hover/focus-within on the parent (page.tsx).
 * - Pointer events are disabled (can't block clicks).
 * - Respects prefers-reduced-motion.
 */
export default function Orb({ className = '' }: OrbProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let rAF = 0;
    const max = 18; // max px sway

    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = ((e.clientX / w) - 0.5) * 2; // -1..1
      const y = ((e.clientY / h) - 0.5) * 2;
      const tx = Math.round(x * max);
      const ty = Math.round(y * max);
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={[
        'pointer-events-none absolute inset-0 flex items-center justify-center',
        className,
      ].join(' ')}
    >
    
      <div
        className="
          h-[42vh] w-[42vh] min-h-[320px] min-w-[320px] max-h-[68vh] max-w-[68vh]
          rounded-full opacity-55 blur-3xl
          mix-blend-screen will-change-transform
          transition-all duration-400 ease-out
          group-hover:opacity-80 group-hover:scale-[1.06]
          group-focus-within:opacity-80 group-focus-within:scale-[1.06]
          animate-[orbFloat_16s_ease-in-out_infinite]
        "
        style={{
          background:
            'radial-gradient(closest-side at 58% 42%, #2ef0ff 0%, #7056ff 33%, #0B0A0F 70%)',
        }}
      />

     
      <div
        className="
          absolute
          h-[30vh] w-[30vh] min-h-[240px] min-w-[240px] max-h-[52vh] max-w-[52vh]
          rounded-full opacity-60 blur-2xl mix-blend-screen
          transition-all duration-400 ease-out
          group-hover:opacity-75 group-focus-within:opacity-75
          animate-[orbPulse_10s_ease-in-out_infinite]
        "
        style={{
          background:
            'radial-gradient(closest-side at 46% 54%, rgba(100,255,200,.85) 0%, rgba(126,85,255,.55) 42%, rgba(10,8,20,0) 70%)',
        }}
      />

     
      <div
        className="
          absolute
          h-[46vh] w-[46vh] min-h-[330px] min-w-[330px] max-h-[72vh] max-w-[72vh]
          rounded-full blur-[80px]
          opacity-0
          transition-all duration-300 ease-out
          group-hover:opacity-35 group-focus-within:opacity-35
          group-hover:scale-[1.08] group-focus-within:scale-[1.08]
          mix-blend-screen
        "
        style={{
          background:
            'radial-gradient(closest-side, rgba(68,255,148,0.82), rgba(68,255,148,0.0) 60%)',
        }}
      />
    </div>
  );
}