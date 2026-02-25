import LegalLayout from '@/components/legal/LegalLayout';

export default function TrustCenterPage() {
  return (
    <LegalLayout title="Trust Center">
      <p className="muted">
        Welcome to the Hemp’in Trust Center — your source for who we are, how we handle data,
        the terms that govern use, and how payments & refunds work.
      </p>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '12px 0 0',
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {[
          { href: '/about',    title: 'About Hemp’in',  desc: 'Who we are and why we exist.' },
          { href: '/privacy',  title: 'Privacy Policy', desc: 'Data we collect and your rights.' },
          { href: '/terms',    title: 'Terms of Service', desc: 'Rules for using Hemp’in.' },
          { href: '/payments', title: 'Payments & Refunds', desc: 'PayPal processing, refunds, receipts.' },
        ].map((card) => (
          <li key={card.href} className="hemp-panel" style={{ padding: 14, display:'grid', gap:6 }}>
            <a className="planet-title" href={card.href}>{card.title}</a>
            <div className="muted">{card.desc}</div>
          </li>
        ))}
      </ul>

      <div className="muted" style={{ marginTop: 12 }}>
        Questions? Email <a href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>.
      </div>
    </LegalLayout>
  );
}