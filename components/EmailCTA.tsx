'use client';
import * as React from 'react';

type Props = { role: 'WORK' | 'LIFE'; className?: string };

export default function EmailCTA({ role, className }: Props) {
  const [email, setEmail] = React.useState('');
  const [busy, setBusy]   = React.useState(false);
  const [done, setDone]   = React.useState<null | { ok:boolean; msg:string }>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setDone(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, role, source: 'hempin.org/home' , company: '' /* honeypot */ }),
      });
      const json = await res.json();
      if (json.ok) {
        setDone({ ok:true, msg: role === 'WORK'
          ? "Thanks! We'll reach out with WORK access as we onboard partners."
          : "Thanks! You’re on the LIFE list — we’ll ping you when it opens." });
        setEmail('');
      } else {
        setDone({ ok:false, msg: json.error || 'Something went wrong.' });
      }
    } catch {
      setDone({ ok:false, msg:'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={className}>
      {/* Honeypot */}
      <input
        type="text" name="company" tabIndex={-1} autoComplete="off"
        className="hidden" aria-hidden="true"
        onChange={() => { /* bots only */ }}
      />
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder={role === 'WORK' ? 'work@email.com' : 'you@email.com'}
          className="w-full rounded-md bg-white/10 px-4 py-3 text-white placeholder-white/40 ring-1 ring-white/15 outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 rounded-md bg-emerald-500/90 px-5 py-3 font-medium text-black hover:bg-emerald-400 disabled:opacity-50"
        >
          {busy ? 'Sending…' : (role === 'WORK' ? 'Request access' : 'Get updates')}
        </button>
      </div>
      {done && (
        <p className={`mt-2 text-sm ${done.ok ? 'text-emerald-300' : 'text-red-300'}`}>{done.msg}</p>
      )}
      <p className="mt-2 text-xs text-white/50">
        By submitting, you agree to receive occasional emails from Hempin. Unsubscribe anytime.
      </p>
    </form>
  );
}