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

        <main>
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

    </>
  );
}