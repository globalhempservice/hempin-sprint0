'use client';

import { useEffect, useRef } from 'react';

type OrbProps = { className?: string };

/**
 * Orb — soft gradient blob with:
 *  - gentle float + cursor sway
 *  - idle variance (random micro “breaths” via CSS var)
 *  - reduced-motion awareness
 *  - pointer-events: none (never blocks clicks)
 */
export default function Orb({ className = '' }: OrbProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Cursor sway (subtle parallax)
    let rAF = 0;
    const max = 18;
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = ((e.clientX / w) - 0.5) * 2;
      const y = ((e.clientY / h) - 0.5) * 2;
      const tx = Math.round(x * max);
      const ty = Math.round(y * max);
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Idle variance: randomly modulate a CSS variable that layers read
    let tick = 0;
    const idle = setInterval(() => {
      // random target between 0.9 and 1.15, eased slowly by CSS
      const v = 0.9 + Math.random() * 0.25;
      el.style.setProperty('--orb-breathe', v.toFixed(3));
      // every ~2.5–4.5s
      const next = 2500 + Math.random() * 2000;
      clearInterval(idle);
      setTimeout(() => {
        // restart interval chain
        (wrapRef.current as HTMLDivElement)?.dispatchEvent(new Event('idle-tick'));
      }, next);
    }, 3200);

    const restart = () => {
      // kick a new interval chain (simple approach)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = setInterval(() => {}, 0);
    };
    el.addEventListener('idle-tick', restart as any);

    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('mousemove', onMove);
      clearInterval(idle);
      el.removeEventListener('idle-tick', restart as any);
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
      // default var (gets randomly modulated)
      style={{ ['--orb-breathe' as any]: 1 }}
    >
      {/* Outer glow */}
      <div
        className="
          h-[42vh] w-[42vh] min-h-[320px] min-w-[320px] max-h-[68vh] max-w-[68vh]
          rounded-full opacity-50
          blur-3xl mix-blend-screen will-change-transform animate-orb
          [transform:scale(var(--orb-breathe))]
        "
        style={{
          background:
            'radial-gradient(closest-side at 58% 42%, #2ef0ff 0%, #7056ff 33%, #0b0a10 70%)',
        }}
      />
      {/* Inner pulse core */}
      <div
        className="
          absolute h-[32vh] w-[32vh] min-h-[240px] min-w-[240px] max-h-[52vh] max-w-[52vh]
          rounded-full opacity-65
          blur-2xl mix-blend-screen animate-orb-slow
          [transform:scale(calc(0.96*var(--orb-breathe)))]
        "
        style={{
          background:
            'radial-gradient(closest-side at 46% 54%, rgba(64,255,180,.85) 0%, rgba(126,85,255,.6) 42%, rgba(10,8,20,0) 70%)',
        }}
      />
    </div>
  );
}