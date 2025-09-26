import * as React from 'react';
type Role = 'WORK' | 'LIFE';

export default function EmailCTA({ role = 'LIFE' as Role }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [msg, setMsg] = React.useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading'); setMsg('');

    const payload = { email: email.trim().toLowerCase(), role, source: 'hempin.org:cta-footer' };
    console.log('[EmailCTA] POST /api/lead payload =', payload);

    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        credentials: 'same-origin'
      });
      const j = await r.json();
      console.log('[EmailCTA] response', r.status, j);

      if (!r.ok || !j.ok) {
        setStatus('error'); setMsg(j?.error || 'Error. Try again.');
        return;
      }
      setStatus('ok'); setMsg('Thanks — we’ll be in touch.'); setEmail('');
    } catch (err: any) {
      console.error('[EmailCTA] network err', err);
      setStatus('error'); setMsg(err?.message || 'Network error.');
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email" required value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="you@example.com" autoComplete="email"
      />
      <button
        type="submit" disabled={status==='loading'}
        className="shrink-0 rounded-md px-4 py-2 ring-1 ring-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/25"
      >
        {status==='loading' ? 'Sending…' : 'Join'}
      </button>
      {msg && <div className={`ml-2 text-sm ${status==='error'?'text-red-300':'text-emerald-300'}`}>{msg}</div>}
    </form>
  );
}