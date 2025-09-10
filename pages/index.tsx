// pages/index.tsx
import SiteHeader from '@/components/home/SiteHeader';
import Hero from '@/components/home/Hero';
import SectionHeading from '@/components/home/SectionHeading';
import PillarCards from '@/components/home/PillarCards';
import ConstellationTeaser from '@/components/home/ConstellationTeaser';
import RoleCards from '@/components/home/RoleCards';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import TaxonSection from '@/components/layout/TaxonSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] text-zinc-200 overflow-x-hidden">
      {/* Global header */}
      <SiteHeader />

      {/* ───────── Upper (emerald) — Hero ───────── */}
      <TaxonSection color="emerald" bottomDivider>
        <Hero />
      </TaxonSection>

      {/* ───────── Middle One (pink) — FUND + Roadmap ───────── */}
      <TaxonSection color="pink" bottomDivider>
      <PillarCards />
      
        <SectionHeading
          eyebrow="FUND"
          title="Help us launch the Hempin network"
          blurb="Back the campaign, unlock early-access perks, and collect Leaf XP across the ecosystem. Your support accelerates funding tools, marketplaces, and open research."
        />
        
      </TaxonSection>

      {/* ───────── Middle Two (sky) — Architect teaser ───────── */}
      <TaxonSection color="sky" bottomDivider>
        <ConstellationTeaser />
      </TaxonSection>

      {/* ───────── Lower (emerald) — Participation / universes links ───────── */}
      <TaxonSection color="emerald">
        <RoleCards />
      </TaxonSection>

      {/* Site-wide CTA (kept) */}
      <CTASection />

      <Footer />
    </main>
  );
}

/* Local divider — subtle line only, no background glow */
function SectionDivider({ color }: { color: 'emerald' | 'pink' | 'sky' | 'zinc' }) {
  const palette: Record<string, string> = {
    emerald:
      'linear-gradient(to right, rgba(52,211,153,0), rgba(52,211,153,0.18), rgba(52,211,153,0))',
    pink:
      'linear-gradient(to right, rgba(236,72,153,0), rgba(236,72,153,0.18), rgba(236,72,153,0))',
    sky:
      'linear-gradient(to right, rgba(56,189,248,0), rgba(56,189,248,0.18), rgba(56,189,248,0))',
    zinc:
      'linear-gradient(to right, rgba(244,244,245,0), rgba(244,244,245,0.12), rgba(244,244,245,0))',
  };
  return (
    <div className="relative my-6 md:my-8">
      <div className="mx-auto h-px max-w-6xl opacity-60" style={{ background: palette[color] }} />
    </div>
  );
}