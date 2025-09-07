import { Suspense } from 'react';
import LoginModal from '@/ui/molecules/LoginModal';
// import Profile content etc.

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ProfilePage({ searchParams }: PageProps) {
  const open = searchParams?.login === '1' || searchParams?.modal === 'login';

  return (
    <div className="min-h-screen">
      {/* … your profile layout … */}

      <Suspense fallback={null}>
        <LoginModal defaultOpen={!!open} />
      </Suspense>
    </div>
  );
}