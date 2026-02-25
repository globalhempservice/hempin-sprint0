import Head from 'next/head';
import SiteHeader from '@/components/home/SiteHeader';
import Hero from '@/components/home/Hero';
import CosmosSection from '@/components/home/CosmosSection';
import DimensionSection from '@/components/home/DimensionSection';
import DatabaseSection from '@/components/home/DatabaseSection';
import ToolsSection from '@/components/home/ToolsSection';
import RoadmapSection from '@/components/home/RoadmapSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import EmailCTA from '@/components/EmailCTA';
import NebulaDivider from '@/components/dividers/NebulaDivider';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hempin — an operating system for a living world</title>
        <meta
          name="description"
          content="Hempin is the navigator of the hemp universe — WORK & LIFE, powered by science, design, and regenerative economics."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* app-shell ensures content renders above starfield/aurora background */}
      <div className="page app-shell">
        <SiteHeader />

        {/* pad bottom so sticky CTA doesn't overlap content on mobile */}
        <main className="pb-24 md:pb-0">
          <Hero />

          <NebulaDivider label="cosmos" />
          <CosmosSection />

          <NebulaDivider label="dimensions" />
          <DimensionSection />

          <NebulaDivider label="database" />
          <DatabaseSection />

          <NebulaDivider label="tools" />
          <ToolsSection />

          <NebulaDivider label="roadmap" />
          <RoadmapSection />

          <CTASection />
        </main>

        <Footer />
      </div>

      {/* Sticky bottom CTA (mobile only) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur md:hidden">
        <div className="mx-auto max-w-screen-sm px-4 py-3">
          <EmailCTA role="LIFE" />
        </div>
      </div>
    </>
  );
}