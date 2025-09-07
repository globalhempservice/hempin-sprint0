// src/app/profile/page.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

// Minimal universe model
type Uni = {
  key: string;
  label: string;
  hue: string;        // tailwind hue class
  ring: string;       // ring color
  pos: string;        // absolute positioning
};

const UNIVERSES: Uni[] = [
  { key: 'farm',     label: 'Farm',        hue: 'from-emerald-400 to-emerald-700', ring: 'ring-emerald-400/50', pos: 'top-[12%] left-[12%]' },
  { key: 'factory',  label: 'Factory',     hue: 'from-indigo-400 to-indigo-700',   ring: 'ring-indigo-400/50',  pos: 'top-[18%] right-[14%]' },
  { key: 'brand',    label: 'Brand',       hue: 'from-fuchsia-400 to-fuchsia-700', ring: 'ring-fuchsia-400/50', pos: 'bottom-[18%] left-[14%]' },
  { key: 'shop',     label: 'Shop',        hue: 'from-amber-400 to-amber-700',     ring: 'ring-amber-400/50',   pos: 'bottom-[14%] right-[12%]' },
  { key: 'learn',    label: 'Knowledge',   hue: 'from-cyan-400 to-cyan-700',       ring: 'ring-cyan-400/50',    pos: 'top-1/2 -translate-y-1/2 right-[6%]' },
  { key: 'plus21',   label: '+21 Cannabis',hue: 'from-rose-400 to-rose-700',       ring: 'ring-rose-400/50',    pos: 'top-[8%] left-1/2 -translate-x-1/2' },
];

export default function ProfilePage() {
  const sp = useSearchParams();
  const isGuest = useMemo(() => sp.get('guest') === 'true', [sp]);

  useEffect(() => {
    // Later: if logged-in, fetch profile & activated universes here.
  }, []);

  return (
    <main className="relative min-h-[95svh] overflow-hidden flex items-center justify-center">
      {/* Background gradient mist */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-3xl opacity-40"
        style={{
          background:
            'radial-gradient(45% 40% at 50% 40%, rgba(99,102,241,0.25), rgba(0,0,0,0))',
        }}
      />

      {/* Center avatar/orb placeholder */}
      <div className="relative z-10 grid place-items-center text-center gap-3">
        <div
          className="
            h-36 w-36 md:h-44 md:w-44 rounded-full
            bg-gradient-to-br from-emerald-300/30 to-indigo-400/30
            ring-1 ring-white/10 shadow-2xl
            animate-[pulse_6s_ease-in-out_infinite]
          "
        />
        <h1 className="text-xl md:text-2xl font-medium text-white/90">
          {isGuest ? 'Guest Profile' : 'Your Profile'}
        </h1>
        <p className="text-sm text-zinc-400 max-w-sm px-4">
          {isGuest
            ? 'Preview the Hempin nebula. Activate universes by logging in or creating an account.'
            : 'Welcome back. Your universes light up as you grow your profile.'}
        </p>

        {/* Action row */}
        <div className="mt-2 flex items-center gap-3">
          {isGuest ? (
            <>
              <Link
                href="/?login=1"
                className="rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 transition"
              >
                Login / Sign up
              </Link>
              <Link
                href="/profile?guest=true"
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition"
              >
                Continue as Guest
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition"
            >
              Home
            </Link>
          )}
        </div>
      </div>

      {/* Nebula of universes (locked for guest) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {UNIVERSES.map((u, i) => (
          <div
            key={u.key}
            className={[
              'absolute', u.pos,
              'transition-transform duration-700 ease-out',
              // gentle drift
              i % 2 === 0 ? 'animate-[floatY_10s_ease-in-out_infinite]' : 'animate-[floatX_12s_ease-in-out_infinite]',
            ].join(' ')}
            style={{ animationDelay: `${(i % 3) * 140}ms` }}
          >
            {/* clickable wrapper only if not guest (for now guest → send to login) */}
            {isGuest ? (
              <Link
                href="/?login=1"
                className="pointer-events-auto group block"
                prefetch={false}
              >
                <UniBubble u={u} locked />
              </Link>
            ) : (
              <button className="pointer-events-auto group" disabled>
                {/* later: route to real universe page */}
                <UniBubble u={u} locked={false} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Keyframes (scoped via global CSS classes in Tailwind) */}
      <style jsx global>{`
        @keyframes floatY {
          0%,100% { transform: translateY(-4px); }
          50% { transform: translateY(6px); }
        }
        @keyframes floatX {
          0%,100% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
        }
      `}</style>
    </main>
  );
}

function UniBubble({ u, locked }: { u: Uni; locked: boolean }) {
  return (
    <div
      className={[
        'relative grid place-items-center text-center',
        'h-20 w-20 md:h-24 md:w-24',
        'rounded-full ring-1 backdrop-blur-sm',
        locked
          ? 'opacity-60 ring-white/10'
          : `ring-2 ${u.ring} shadow-[0_0_28px_rgba(255,255,255,0.08)]`,
        'bg-gradient-to-br',
        locked ? 'from-white/5 to-white/0' : u.hue + ' from-20%',
        'transition-all duration-300',
        'group-hover:scale-[1.06] group-active:scale-[0.98]',
      ].join(' ')}
    >
      <span className="text-[11px] md:text-xs text-white/90 font-medium drop-shadow">
        {u.label}
      </span>

      {locked && (
        <span className="absolute -bottom-2 text-[10px] text-zinc-400">
          Locked
        </span>
      )}
    </div>
  );
}