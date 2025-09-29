// components/home/CTASection.tsx
import * as React from 'react';
import EmailCTA from '@/components/EmailCTA';

export default function CTASection() {
  return (
    <section id="cta" className="section horizon-cta">
      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">Get early access</h2>
        <p className="muted" style={{ maxWidth: 720, margin: '6px auto 16px' }}>
          Be the first to explore LIFE and help us shape WORK.
        </p>

        <div className="cta-form stack">
          <EmailCTA role="LIFE" source="hempin.org#cta" />
        </div>
      </div>
    </section>
  );
}