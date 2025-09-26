import Head from 'next/head';
import SiteHeader from '@/components/home/SiteHeader';
import Hero from '@/components/home/Hero';
import CosmosSection from '@/components/home/CosmosSection';
import DimensionsSection from '@/components/home/DimensionsSection';
import DatabaseSection from '@/components/home/DatabaseSection';
import ToolsSection from '@/components/home/ToolsSection';
import RoadmapSection from '@/components/home/RoadmapSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hempin — an operating system for a living world</title>
        <meta name="description" content="Hempin is the navigator of the hemp universe — WORK & LIFE, powered by science, design, and regenerative economics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page">
        <SiteHeader />
        <main>
          <Hero />
          <CosmosSection />
          <DimensionsSection />
          <DatabaseSection />
          <ToolsSection />
          <RoadmapSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}