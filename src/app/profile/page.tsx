// src/app/profile/page.tsx
import LeafXP from '@/ui/atoms/LeafXP';
import UniverseBubble from '@/ui/molecules/UniverseBubble';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const UNIS = [
  { key: 'farm',     label: 'Farm',        from: 'from-emerald-400', to: 'to-emerald-700', ring: 'ring-emerald-400/50', pos: 'top-[12%] left-[12%]', anim: 'animate-float-y' },
  { key: 'factory',  label: 'Factory',     from: 'from-indigo-400',  to: 'to-indigo-700',  ring: 'ring-indigo-400/50',  pos: 'top-[18%] right-[14%]', anim: 'animate-float-x' },
  { key: 'brand',    label: 'Brand',       from: 'from-fuchsia-400', to: 'to-fuchsia-700', ring: 'ring-fuchsia-400/50', pos: 'bottom-[18%] left-[14%]', anim: 'animate-float-x' },
  { key: 'shop',     label: 'Shop',        from: 'from-amber-400',   to: 'to-amber-700',   ring: 'ring-amber-400/50',   pos: 'bottom-[14%] right-[12%]', anim: 'animate-float-y' },
  { key: 'learn',    label: 'Knowledge',   from: 'from-cyan-400',    to: 'to-cyan-700',    ring: 'ring-cyan-400/50',    pos: 'top-1/2 -translate-y-1/2 right-[6%]', anim: 'animate-float-y' },
  { key: 'plus21',   label: '+21 Cannabis',from: 'from-rose-400',    to: 'to-rose-700',    ring: 'ring-rose-400/50',    pos: 'top-[8%] left-1/2 -translate-x-1/2', anim: 'animate-float-x' },
] as const;

export default function ProfilePage({ searchParams }: PageProps) {
  const isGuest = searchParams?.guest === 'true';

  return (
    <main className="relative min-h-[95svh] overflow-hidden flex items-center justify-center">
      {/* Background mist */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-3xl opacity-40"
        style={{
          background:
            'radial-gradient(45% 40% at 50% 40%, rgba(99,102,241,0.25), rgba(0,0,0,0))',
        }}
      />

      {/* Center avatar orb + leaf */}
      <div className="relative z-10 grid place-items-center text-center gap-3">
        <div
          className="
            h-36 w-36 md:h-44 md:w-44 rounded-full
            bg-gradient-to-br from-emerald-300/30 to-indigo-400/30
            ring-1 ring-white/10 shadow-2xl animate-pulse-soft
          "
        />
        <h1 className="text-xl md:text-2xl font-medium text-white/90">
          {isGuest ? 'Guest Profile' : 'Your Profile'}
        </h1>
        <LeafXP level={isGuest ? 5 : 20} className="justify-center" />
        <p className="text-sm text-zinc-400 max-w-sm px-4">
          {isGuest
            ? 'Preview the Hempin nebula. Unlock universes by creating your profile.'
            : 'Welcome back. Your universes light up as you grow your profile.'}
        </p>

        <div className="mt-2 flex items-center gap-3">
          {isGuest ? (
            <>
              <a
                href="/?login=1"
                className="rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 transition"
              >
                Login / Sign up
              </a>
              <a
                href="/profile?guest=true"
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition"
              >
                Continue as Guest
              </a>
            </>
          ) : (
            <a
              href="/"
              className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition"
            >
              Home
            </a>
          )}
        </div>
      </div>

      {/* Nebula orbits */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {UNIS.map((u, i) => (
          <div
            key={u.key}
            className={`absolute ${u.pos} ${u.anim}`}
            style={{ animationDelay: `${(i % 3) * 140}ms` }}
          >
            <UniverseBubble
              label={u.label}
              locked={isGuest || u.key === 'plus21'}
              hueFrom={u.from}
              hueTo={u.to}
              ring={u.ring}
              hrefWhenUnlocked={`/${u.key}`}
              hrefWhenLocked="/?login=1"
            />
          </div>
        ))}
      </div>
    </main>
  );
}