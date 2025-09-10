// components/home/Hero.tsx
import Link from 'next/link';
import { useState } from 'react';

export default function Hero() {
  const pct = 1; // progress %
  const [email, setEmail] = useState('');

  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Hempin — The Universes of Hemp
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base opacity-80">
          Our mission is to grow a fair, transparent hemp economy. We connect growers, brands, researchers,
          and citizens to finance, trade, learn, and act together for real-world impact.
        </p>

        {/* Primary CTAs (uniform outline style) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup?role=grower"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Join as Grower
          </Link>
          <Link
            href="/signup?role=brand"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Join as Brand / Org
          </Link>
          <Link
            href="/signup?role=citizen"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Join as Citizen
          </Link>
          <Link
            href="/signup?role=researcher"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Join as Researcher
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-10 w-full max-w-md text-left">
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide opacity-70">
            <span>Project progress</span>
            <span>{pct}%</span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
            {/* leaf indicator */}
            <div
              className="absolute -top-2 h-6 w-6 -translate-x-1/2 select-none"
              style={{ left: `calc(${pct}% + 0px)` }}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="opacity-90">
                <path
                  d="M12 2c4 3 7 6 7 10a7 7 0 1 1-14 0C5 8 8 5 12 2Z"
                  fill="currentColor"
                  className="text-emerald-300"
                />
              </svg>
            </div>
          </div>

          <p className="mt-2 text-xs opacity-60">
            Day 1 energy — ~1% visible. We’re shipping in the open; new universes unlock as the network grows.
          </p>
        </div>

        {/* Email capture — stacked; solid green button */}
        <form
          className="mx-auto mt-4 flex w-full max-w-md flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Thanks! We’ll keep you posted at: ${email || 'your email'}`);
            setEmail('');
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email to get updates"
            className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder-white/50 focus:border-white/25"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-emerald-400/90 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-300"
          >
            Notify me
          </button>
        </form>
      </div>
    </section>
  );
}