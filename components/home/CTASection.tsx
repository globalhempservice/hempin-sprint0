// components/home/CTASection.tsx
import * as React from 'react';
import EmailCTA from '@/components/EmailCTA';

export default function CTASection() {
  return (
    <section id="cta" className="section cta py-12 bg-black/50">
      <div className="container mx-auto max-w-screen-md text-center">
        <h2 className="text-2xl font-bold mb-2">Get early access</h2>
        <p className="text-white/70 mb-6">
          Be the first to explore LIFE and help us shape WORK.
        </p>

        <EmailCTA role="LIFE" source="hempin.org#cta" />
      </div>
    </section>
  );
}