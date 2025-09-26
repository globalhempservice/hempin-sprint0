// components/EmailCTA.tsx
import * as React from 'react';

type Role = 'WORK' | 'LIFE';

export default function EmailCTA({ role = 'LIFE' }: { role?: Role }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState<null | { ok: boolean; dedupe?: boolean }>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDone(null);

    const source =
      typeof window !== 'undefined'
        ? `${window.location.host || 'hempin.org'}`
        : 'hempin.org';

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role, source }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setDone({ ok: true, dedupe: !!json.dedupe });
      setEmail('');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
      setDone({ ok: false });
    } finally {
      setLoading(false);
    }
  }

  // simple honeypot
  const [company, setCompany] = React.useState('');
  const honeyField = (
    <input
      type="text"
      name="company"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      className="hidden"
      tabIndex={-1}
      autoComplete="off"
    />
  );

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      {honeyField}
      <label htmlFor="email" className="sr-only">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-500/90 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? 'Sending…' : role === 'WORK' ? 'Join WORK' : 'Join LIFE'}
      </button>

      {done?.ok && (
        <p className="text-xs text-emerald-300">
          Thanks — we’ll be in touch{done.dedupe ? ' (you were already on the list)' : ''}.
        </p>
      )}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}