// components/home/SectionHeading.tsx
export default function SectionHeading({
  eyebrow,
  title,
  blurb,
  tight,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  tight?: boolean;
}) {
  const isFund = eyebrow?.toUpperCase() === 'FUND';

  return (
    <section
      className={`relative mx-auto max-w-5xl px-4 ${
        tight ? 'py-10 md:py-14' : 'py-14 md:py-20'
      }`}
    >
      <div className="text-center">
        {eyebrow && (
          <div
            className={`mx-auto mb-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide ${
              isFund
                ? 'border border-pink-300/40 bg-pink-500/10 text-pink-200'
                : 'text-emerald-300/80'
            }`}
          >
            {eyebrow.toUpperCase()}
          </div>
        )}

        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>

        {blurb && (
          <p className="mx-auto mt-3 max-w-3xl text-sm opacity-75">{blurb}</p>
        )}

        {isFund && (
          <div className="mt-6">
            <a
              href="https://fund.hempin.org"
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white
                         bg-pink-500 hover:bg-pink-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-pink-500 blur-xl opacity-40 animate-pulse"
              />
              Support the build
            </a>
          </div>
        )}
      </div>
    </section>
  );
}