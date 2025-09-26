import * as React from 'react';

type Role = 'WORK' | 'LIFE';

export default function EmailCTA({ role = 'LIFE' as Role }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [message, setMessage] = React.useState<string>('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const payload = {
      email: email.trim().toLowerCase(),
      role,
      source: 'hempin.org:cta-footer'
    };

    console.log('[EmailCTA] submitting', payload); // <-- watch Network/Console

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus('error');
        setMessage(json?.error || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('ok');
      setMessage('Thanks — we’ll be in touch.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Network error.');
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      {/* DO NOT include any hidden honeypot field in the JSON */}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-emerald-400"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 rounded-md px-4 py-2 ring-1 ring-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/25"
      >
        {status === 'loading' ? 'Sending…' : 'Join'}
      </button>
      {message && (
        <div className={`ml-2 text-sm ${status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>
          {message}
        </div>
      )}
    </form>
  );
}