// components/home/Hero.tsx
import HeroOrion from '@/components/visuals/Orion';

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container center relative z-20">
        <p className="eyebrow tracking-[0.22em] mt-2">
          Innovative Natural Operating System (INOS)
        </p>

        <h1 id="hero-title">The operating system for the hemp industry</h1>

        <p className="lede mt-3">
          INOS powers DEWII &mdash; the first hemp super-app, live now across 8 universes. And it&apos;s just the beginning.
        </p>

        <div className="mt-6 flex gap-4 justify-center flex-wrap">
          <a
            href="https://investor.hempin.org"
            className="btn primary thruster"
            target="_blank"
            rel="noopener noreferrer"
          >
            Back the SAFE round
          </a>
          <a
            href="https://dewii.hempin.org"
            className="btn ghost thruster"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore DEWII
          </a>
        </div>
      </div>

      {/* Orion (background, fully centered & responsive) */}
      <HeroOrion />

      <div className="hero-glow" aria-hidden />
    </section>
  );
}
