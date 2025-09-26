import { useState } from 'react';

export default function CTASection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="cta" className="section cta">
      <div className="container center">
        <h2>Get early access</h2>
        <p className="muted">Be first to explore LIFE and help us shape WORK.</p>

        {!sent ? (
          <form
            className="cta-form"
            onSubmit={(e) => { e.preventDefault(); setSent(true); /* wire to real endpoint later */ }}
          >
            <input type="email" required placeholder="you@planetmail.com" aria-label="Email" />
            <button className="btn primary" type="submit">Notify me</button>
          </form>
        ) : (
          <div className="pill success">Thanks — we’ll be in touch soon.</div>
        )}
      </div>
    </section>
  );
}