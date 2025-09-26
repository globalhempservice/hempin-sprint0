import * as React from 'react';

export default function EmailCTA() {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<'LIFE' | 'WORK'>('LIFE');
  const [status, setStatus] = React.useState<null | 'ok' | 'error' | 'loading'>(null);
  const [msg, setMsg] = React.useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, role, source: 'hempin.org', company: '' }), // honeypot empty
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus('error');
        setMsg(json?.error || 'Failed to submit');
        return;
      }
      setStatus('ok');
      setMsg('Thanks — we’ll be in touch soon!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err?.message || 'Network error');
    }
  };

  return (
    <form onSubmit={submit} className="cta-form">
      <label className="sr-only" htmlFor="cta-email">Email</label>
      <input
        id="cta-email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="LIFE">I’m curious</option>
        <option value="WORK">I’m building</option>
      </select>
      {/* Honeypot (hidden) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-10000px', height: 0, width: 0 }}
        aria-hidden="true"
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Join the journey'}
      </button>
      {status && <p className={status === 'error' ? 'text-red-400' : 'text-emerald-400'}>{msg}</p>}
    </form>
  );
}