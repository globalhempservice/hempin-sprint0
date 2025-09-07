// src/app/page.tsx
export default function Home() {
  return (
    <main className="relative flex min-h-[90vh] flex-col items-center justify-center text-center px-6">
      <section className="space-y-5">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Enter Hempin</h1>
        <p className="text-zinc-400 max-w-xl">
          One profile to explore the hemp universe.
        </p>
        <a
          href="/account"
          className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
        >
          Login / Sign up
        </a>
        <p className="text-xs text-zinc-500 pt-6">HEMPIN — 2025</p>
      </section>
    </main>
  );
}