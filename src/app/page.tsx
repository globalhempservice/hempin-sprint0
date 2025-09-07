// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Orb from '@/ui/organisms/Orb';
import LoginModal from '@/ui/molecules/LoginModal';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const sp = useSearchParams();

  useEffect(() => {
    if (sp.get('login') === '1') setShowLogin(true);
  }, [sp]);

  return (
    <main className="relative min-h-[80vh] flex items-center justify-center">
      <Orb />
      <section className="relative z-10 text-center space-y-6 px-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Enter Hempin</h1>
        <p className="opacity-70">One profile to explore the hemp universe.</p>
        <button
          onClick={() => setShowLogin(true)}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 transition"
        >
          Login / Sign up
        </button>
        <p className="text-xs opacity-50 pt-6">HEMPIN — 2025</p>
      </section>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </main>
  );
}