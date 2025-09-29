// components/home/CTASection.tsx
import * as React from 'react';
import EmailCTA from '@/components/EmailCTA';

export default function CTASection() {
  return (
    <section id="cta" className="section aurora-cta">
      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">Get early access</h2>
        <div className="cta-scanline" aria-hidden />
        <p className="muted" style={{ maxWidth: 720, margin: '8px auto 18px' }}>
          Be the first to explore LIFE and help us shape WORK.
        </p>

        <div className="cta-card">
          <div className="cta-form stack">
            <EmailCTA role="LIFE" source="hempin.org#cta" />
          </div>
        </div>
      </div>
    </section>
  );
}