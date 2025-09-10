import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-6">
      <div className="rounded-2xl bg-white/[0.04] p-6 text-center backdrop-blur-sm">
        <h3 className="text-lg md:text-xl font-semibold">
          Ready to build the hemp economy?
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm opacity-80">
          Register your role to get early access, contribute data, and help shape the tools.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup?role=grower"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Grower
          </Link>
          <Link
            href="/signup?role=brand"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Brand / Org
          </Link>
          <Link
            href="/signup?role=citizen"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Citizen
          </Link>
          <Link
            href="/signup?role=researcher"
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Researcher
          </Link>
        </div>
      </div>
    </section>
  );
}