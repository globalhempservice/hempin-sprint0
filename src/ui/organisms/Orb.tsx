'use client';

import { useEffect, useRef } from 'react';

type OrbProps = { className?: string };

/**
 * Orb (restored feel)
 * - Same gradients + pulse as your last version
 * - Gentle cursor sway
 * - Idle breathing via CSS var (smoothly lerped)
 * - Reduced-motion aware
 * - Adds a tiny "boost" channel (CSS var) that can be pinged by CTA
 *   window.dispatchEvent(new CustomEvent('hempin:boost', { detail: { intensity: 0..1.5 } }))
 */
export default function Orb({ className = '' }: OrbProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    // ---------- Cursor sway ----------
    if (!reduce) {
      const max = 18;
      const onMove = (e: MouseEvent) => {
        const { innerWidth: w, innerHeight: h } = window;
        const x = ((e.clientX / w) - 0.5) * 2;
        const y = ((e.clientY / h) - 0.5) * 2;
        const tx = Math.round(x * max);
        const ty = Math.round(y * max);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        });
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      // cleanup cursor sway
      const cleanupMove = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove);
      };

      // ---------- Idle breathing (smooth lerp) ----------
      let breathe = 1;        // current
      let target = 1;         // target
      let lastT = performance.now();
      const setTarget = () => {
        target = 0.92 + Math.random() * 0.22; // 0.92..1.14
      };
      setTarget();
      const interval = setInterval(setTarget, 3200 + Math.random() * 1600);

      const loop = (t: number) => {
        const dt = Math.max(0.001, (t - lastT) / 16.67); // ~frame factor
        lastT = t;

        // ease toward target (small, smooth step)
        breathe += (target - breathe) * 0.06 * dt;
        el.style.setProperty('--orb-breathe', breathe.toFixed(4));

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      // ---------- Boost listener (from CTA) ----------
      let boost = 0; // 0..~1.5
      let boostRaf = 0;

      const decay = (start: number, init: number) => (now: number) => {
        const p = Math.min(1, (now - start) / 450); // 450ms ease-out
        const eased = 1 - (1 - p) * (1 - p);
        boost = init * (1 - eased);
        el.style.setProperty('--orb-boost', boost.toFixed(3));
        if (p < 1) boostRaf = requestAnimationFrame(decay(start, init));
      };

      const onBoost = (e: Event) => {
        const ce = e as CustomEvent<{ intensity?: number }>;
        const i = Math.max(0, Math.min(1.5, ce.detail?.intensity ?? 0)); // clamp
        boost = i;
        el.style.setProperty('--orb-boost', boost.toFixed(3));
        cancelAnimationFrame(boostRaf);
        boostRaf = requestAnimationFrame(decay(performance.now(), i));
      };

      window.addEventListener('hempin:boost', onBoost as EventListener);

      // cleanup everything
      return () => {
        cleanupMove();
        clearInterval(interval);
        window.removeEventListener('hempin:boost', onBoost as EventListener);
        cancelAnimationFrame(boostRaf);
      };
    }

    // reduced-motion: just leave it centered and static
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={[
        'pointer-events-none absolute inset-0 flex items-center justify-center',
        className,
      ].join(' ')}
      // CSS vars (breathe anim + occasional boost)
      style={{
        ['--orb-breathe' as any]: 1,
        ['--orb-boost' as any]: 0,
      }}
    >
      {/* Outer glow (unchanged look) */}
      <div
        className="
          h-[42vh] w-[42vh] min-h-[320px] min-w-[320px] max-h-[68vh] max-w-[68vh]
          rounded-full opacity-50
          blur-3xl mix-blend-screen will-change-transform animate-orb
          [transform:scale(calc(var(--orb-breathe)))]
          [filter:brightness(calc(1 + var(--orb-boost)*0.35))]
        "
        style={{
          background:
            'radial-gradient(closest-side at 58% 42%, #2ef0ff 0%, #7056ff 33%, #0b0a10 70%)',
        }}
      />
      {/* Inner pulse core (unchanged look) */}
      <div
        className="
          absolute h-[32vh] w-[32vh] min-h-[240px] min-w-[240px] max-h-[52vh] max-w-[52vh]
          rounded-full opacity-65
          blur-2xl mix-blend-screen animate-orb-slow
          [transform:scale(calc(0.96*var(--orb-breathe)))]
          [filter:brightness(calc(1 + var(--orb-boost)*0.25))]
        "
        style={{
          background:
            'radial-gradient(closest-side at 46% 54%, rgba(64,255,180,.85) 0%, rgba(126,85,255,.6) 42%, rgba(10,8,20,0) 70%)',
        }}
      />
    </div>
  );
}