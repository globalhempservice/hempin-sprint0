import Link from 'next/link';

type Card = {
  title: string;
  description: string;
  href?: string;
  isActive?: boolean;
};

const cards: Card[] = [
  {
    title: 'FUND',
    description: 'Back the build and fuel the network — access campaigns, perks, and Leaf XP.',
    href: 'https://fund.hempin.org',
    isActive: true,
  },
  {
    title: 'MARKET',
    description: 'A global marketplace for hemp products and services, opening soon.',
    isActive: false,
  },
  {
    title: 'PLACES',
    description: 'Pop-ups, showrooms, and community hubs to connect in real life.',
    isActive: false,
  },
  {
    title: 'ORGANIZATIONS',
    description: 'Directories and profiles for growers, brands, and associations.',
    isActive: false,
  },
];

export default function RoleCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
      <div className="text-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">
          How can you participate?
        </h3>
        <p className="mt-2 text-sm opacity-75">
          Explore the universes we’re opening next.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="flex flex-col items-center justify-between rounded-2xl bg-white/5 p-5 backdrop-blur-sm"
          >
            <div className="text-base md:text-lg font-medium text-center">{c.title}</div>
            <p className="mt-2 text-sm opacity-75 text-center">{c.description}</p>

            <div className="mt-4">
              {c.isActive && c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-400"
                >
                  Visit
                </a>
              ) : (
                <button
                  disabled
                  className="rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/70 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}