'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Comet — small glowing dot that eases toward the cursor with inertia.
 * - Hidden on coarse pointers (mobile) and when reduced-motion is set.
 */
export default function Comet() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;
    setEnabled(true);

    const el = ref.current!;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      // ease toward target
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="
        pointer-events-none fixed top-0 left-0 z-0
        -translate-x-1/2 -translate-y-1/2
      "
    >
      <div
        className="
          h-3 w-3 rounded-full
          bg-[radial-gradient(circle,rgba(120,255,190,.95),rgba(120,255,190,0))]
          blur-[2px] opacity-70
          after:content-[''] after:block after:h-5 after:w-5 after:-mt-4 after:-ml-1
          after:rounded-full after:blur-[10px]
          after:bg-[radial-gradient(circle,rgba(120,255,190,.25),rgba(120,255,190,0))]
        "
      />
    </div>
  );
}