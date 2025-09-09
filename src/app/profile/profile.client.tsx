'use client';

import { useEffect, useMemo, useState } from 'react';
import LeafXP from '@/ui/atoms/LeafXP';
import UniverseBubble from '@/ui/molecules/UniverseBubble';

const UNIVERSes = [
  { key: 'farm',     label: 'Farm' },
  { key: 'factory',  label: 'Factory' },
  { key: 'brand',    label: 'Brand' },
  { key: 'research', label: 'Research' },
  { key: 'partner',  label: 'Partner' },
];

export default function ProfileClient() {
  // guest detection via query once (client only) – no SSR coupling:
  const [isGuest, setGuest] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      setGuest(url.searchParams.get('guest') === '1');
      const seen = localStorage.getItem('hempin:onboarded') === '1';
      setShowOnboarding(!seen);
    } catch {}
  }, []);

  const bubbles = useMemo(() => UNIVERSes, []);

  return (
    <main className="relative min-h-[88vh] px-6 py-10">
      {/* header bar */}
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LeafXP xp={isGuest ? 12 : 280} />
          <div>
            <div className="text-sm opacity-60">Profile strength</div>
            <div className="text-lg font-medium">{isGuest ? 'Seedling' : 'Sprout'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnboarding(true)}
            className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            What is this?
          </button>
          {!isGuest ? (
            <a
              href="/account"
              className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              Account
            </a>
          ) : (
            // NOTE: no “continue as guest” here anymore
            <a
              href="/"
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/10"
              title="Back to home"
            >
              Home
            </a>
          )}
        </div>
      </div>

      {/* nebula */}
      <section className="mx-auto mt-12 max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 place-items-center">
        {bubbles.map((b) => (
          <UniverseBubble
            key={b.key}
            label={b.label}
            locked={isGuest}
            href={isGuest ? undefined : `/u/${b.key}`}
          />
        ))}
      </section>

      {/* onboarding overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-zinc-950 p-5">
            <h3 className="text-xl font-semibold mb-2">Your Nebula</h3>
            <p className="text-zinc-400">
              Each bubble is a universe. Activate them by signing in and connecting your role
              (Farm, Factory, Brand, Research, Partner). Your leaf grows as you explore.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  localStorage.setItem('hempin:onboarded', '1');
                  setShowOnboarding(false);
                }}
                className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
              >
                Got it
              </button>
              {isGuest && (
                <a
                  href="/account"
                  className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
                >
                  Sign in to activate
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}