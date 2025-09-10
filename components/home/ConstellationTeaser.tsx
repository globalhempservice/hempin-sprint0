// components/home/ConstellationTeaser.tsx
import Link from 'next/link';

export default function ConstellationTeaser() {
  return (
    // No local glow — TaxonSection handles the ambiance
    <section className="relative mx-auto max-w-6xl px-4 py-10 md:py-16">
      {/* Eyebrow pill */}
      <div className="mb-6 text-center">
        <div className="mx-auto inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide border border-white/15 bg-white/5">
          ARCHITECT
        </div>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Preview card */}
        <div className="order-2 md:order-1">
          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-blue-500/15">
            {/* minimalist “mini-orbit” sketch */}
            <svg viewBox="0 0 400 400" className="absolute inset-0">
              <circle cx="200" cy="200" r="70"  fill="none" stroke="rgba(255,255,255,.25)" strokeDasharray="3 6" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,.18)" strokeDasharray="3 6" />
              <circle cx="200" cy="200" r="165" fill="none" stroke="rgba(255,255,255,.14)" strokeDasharray="3 6" />
              <circle cx="200" cy="200" r="22" fill="url(#core)" />
              <defs>
                <radialGradient id="core" cx="38%" cy="38%">
                  <stop offset="0%"   stopColor="white"   stopOpacity=".9" />
                  <stop offset="70%"  stopColor="#bde9ff" stopOpacity=".4" />
                  <stop offset="100%" stopColor="#bde9ff" stopOpacity=".1" />
                </radialGradient>
              </defs>
              <circle cx="280" cy="200" r="8" fill="#60a5fa" />
              <circle cx="240" cy="200" r="7" fill="#93c5fd" />
              <circle cx="200" cy="280" r="7" fill="#a78bfa" />
            </svg>

            {/* CTA inside the preview card */}
            {/* CTA inside the preview card */}
<div className="absolute inset-0 grid place-items-center">
  <Link href="/architect" passHref legacyBehavior>
    <a
      target="_blank"
      rel="noreferrer"
      className="relative inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-black
                 bg-sky-400/90 hover:bg-sky-300 transition focus:outline-none focus:ring-2 focus:ring-sky-300"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-sky-400 blur-xl opacity-40 animate-pulse"
      />
      Open Nebula
    </a>
  </Link>
</div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 md:order-2 text-center md:text-left">
          <p className="text-sm md:text-base opacity-85">
            <span className="font-medium">Nebula</span> is the live visualization of the Hempin ecosystem—planets,
            orbits, and flows you can explore. <span className="font-medium">Architect</span> is a space inside Nebula
            where we experiment with customization tools and new modules.
          </p>
        </div>
      </div>
    </section>
  );
}