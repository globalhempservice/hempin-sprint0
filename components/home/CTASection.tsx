import * as React from 'react';
import EmailCTA from '@/components/EmailCTA';

export default function CTASection() {
  return (
    <section id="cta" className="section cta-planet">
      {/* Starfield is visible above; planet horizon lives in ::before */}
      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">Get early access</h2>
        <p className="muted" style={{ maxWidth: 720, margin: '8px auto 18px' }}>
          Be the first to explore LIFE and help us shape WORK.
        </p>

        {/* We don’t touch the EmailCTA internals (Supabase-safe). 
            The wrapper just stacks its form controls nicely. */}
        <div className="cta-stack">
          <EmailCTA role="LIFE" source="hempin.org#cta" />
        </div>
      </div>
    </section>
  );
}