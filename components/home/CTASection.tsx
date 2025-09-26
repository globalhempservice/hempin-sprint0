import EmailCTA from '@/components/EmailCTA';

export default function CTASection() {
  return (
    <section id="cta" className="section cta">
      <div className="container center">
        <h2>Get early access</h2>
        <p className="muted">Be first to explore LIFE and help us shape WORK.</p>

        {/* Wire to real endpoint via the shared component */}
        <EmailCTA defaultRole="LIFE" source="hempin.org#cta" />
      </div>
    </section>
  );
}