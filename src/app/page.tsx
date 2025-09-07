import { Suspense } from 'react';
import Orb from '@/ui/organisms/Orb';
import LoginModal from '@/ui/molecules/LoginModal';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Home({ searchParams }: PageProps) {
  const open = searchParams?.login === '1' || searchParams?.modal === 'login';

  return (
    <main className="relative min-h-[80vh] flex items-center justify-center">
      <Orb />

      <section className="relative z-10 text-center space-y-6 px-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Enter Hempin</h1>
        <p className="opacity-70">One profile to explore the hemp universe.</p>

        {/* Button+Modal */}
        <Suspense fallback={null}>
          <LoginModal defaultOpen={!!open} />
        </Suspense>

        <p className="text-xs opacity-50 pt-6">HEMPIN — 2025</p>
      </section>
    </main>
  );
}