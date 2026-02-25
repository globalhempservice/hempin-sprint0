// components/home/CTASection.tsx
import * as React from 'react';

export default function CTASection() {
  return (
    <section id="cta" className="section cta-section">
      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">Back the build</h2>
        <p className="muted" style={{ maxWidth: 720, margin: '10px auto 18px' }}>
          We&apos;re raising via SAFE (Simple Agreement for Future Equity). Review the deck, explore the terms, and invest in the infrastructure of the global hemp industry.
        </p>

        <div className="cta-card">
          <div className="flex gap-4 justify-center flex-wrap" style={{ padding: '8px 0 4px' }}>
            <a
              href="https://investor.hempin.org"
              className="btn primary thruster"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '1rem', padding: '12px 28px' }}
            >
              Visit Investor Center
            </a>
            <a
              href="https://dewii.hempin.org"
              className="btn ghost thruster"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try DEWII
            </a>
          </div>

          <div className="cta-foot">
            <span className="chip">SAFE round</span>
            <span className="chip">Hemp infrastructure</span>
            <span className="chip">INOS + DEWII</span>
          </div>
        </div>
      </div>
    </section>
  );
}
