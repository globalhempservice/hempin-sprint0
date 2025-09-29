// components/home/Hero.tsx
import HeroOrion from '@/components/visuals/Orion';
import HeroSignup from '@/components/home/HeroSignup';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container center" style={{ position: 'relative', zIndex: 2, paddingTop: 8 }}>
        <p className="eyebrow" style={{ letterSpacing: '0.22em' }}>Innovative Natural Operating System (inOS)</p>

        <h1>connecting the worlds of Hemp</h1>

       

        <p className="lede" style={{ marginTop: 12 }}>
          Hemp’in connects all hemp sciences, markets, places, and cultures.
        </p>

        {/* Mini dashboard → signup (captures role + source via EmailCTA) */}
        <div style={{ marginTop: 18 }}>
          <HeroSignup />
        </div>
      </div>

      {/* Orion (background, fully centered & responsive) */}
      <HeroOrion />

      <div className="hero-glow" aria-hidden />
    </section>
  );
}