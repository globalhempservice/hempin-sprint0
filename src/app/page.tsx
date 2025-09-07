'use client';

import { useState } from 'react';
import Orb from '@/ui/organisms/Orb';
import Burst from '@/ui/particles/Burst';
import Comet from '@/ui/particles/Comet';
import Ripples from '@/ui/particles/Ripples';

export default function Home() {
  const [burstKey, setBurstKey] = useState(0);
  const [hover, setHover] = useState(false);

  function triggerBurst() {
    setBurstKey((k) => k + 1);
  }

  return (
    <main className="group relative flex min-h-[90vh] flex-col items-center justify-center text-center px-6">
      {/* Background layers */}
      <Orb />
      <Burst key={burstKey} />
      <Comet />
      <Ripples active={hover} />

      {/* Hero content */}
      <section className="relative z-10 space-y-6">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/95">
          Enter Hempin
        </h1>

        <p className="text-zinc-300/85 max-w-xl">
          One profile to explore the hemp universe.
        </p>

        <a
          href="/account"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onClick={() => triggerBurst()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') triggerBurst();
          }}
          className="
            inline-flex items-center justify-center
            rounded-md border border-white/15
            bg-white/10 px-5 py-2.5 text-sm font-medium text-white
            shadow-sm transition
            hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
          "
        >
          Login / Sign up
        </a>

        <p className="text-xs text-zinc-500 pt-6">HEMPIN — 2025</p>
      </section>
    </main>
  );
}