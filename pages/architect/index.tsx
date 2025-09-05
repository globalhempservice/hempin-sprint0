import { useState } from 'react'
import Head from 'next/head'

export default function ArchitectGate() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/architect/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed')

      const qp = new URLSearchParams(window.location.search)
      const next = qp.get('next') || '/architect/dashboard'
      window.location.href = next
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Architect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="gate-root">
        {/* Moving background like /play4 */}
        <div className="bg-anim" aria-hidden />
        {/* Center orb like /play5 */}
        <div className="orb" aria-hidden />

        <main className="content">
          <h1 className="title">Welcome, Architect.</h1>
          <p className="subtitle">This is where you do your magic</p>

          <form onSubmit={onSubmit} className="form">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
              required
            />
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Entering…' : 'Enter world'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>

          <p className="footer">HEMPIN — 2025</p>
        </main>
      </div>

      <style jsx>{`
        .gate-root {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;       /* non-scrollable */
          display: grid;
          place-items: center;
          background: transparent;
          isolation: isolate;
        }
        .bg-anim {
          position: fixed;
          inset: 0;
          z-index: -3;
          background:
            radial-gradient(60% 60% at 20% 20%, rgba(107,92,246,0.25), transparent 60%),
            radial-gradient(60% 60% at 80% 30%, rgba(56,226,181,0.25), transparent 60%),
            radial-gradient(70% 70% at 50% 80%, rgba(255,255,255,0.05), transparent 60%),
            #0e0e12;
          filter: saturate(110%);
          animation: drift 30s linear infinite;
          background-size: 200% 200%;
          will-change: background-position, transform;
        }
        @keyframes drift {
          0% { transform: translate3d(0,0,0); background-position: 0% 0%;}
          50% { transform: translate3d(0,0,0); background-position: 100% 50%;}
          100% { transform: translate3d(0,0,0); background-position: 0% 0%;}
        }
        .orb {
          position: fixed;
          width: min(60vmin, 520px);
          height: min(60vmin, 520px);
          z-index: -2;
          border-radius: 50%;
          background:
            radial-gradient(closest-side, rgba(107,92,246,0.65), rgba(107,92,246,0.15) 55%, transparent 70%),
            radial-gradient(closest-side at 70% 30%, rgba(56,226,181,0.5), transparent 60%);
          box-shadow:
            0 0 120px 40px rgba(107,92,246,0.25),
            inset 0 0 120px 40px rgba(56,226,181,0.15);
          animation: float 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.01); }
        }
        .content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 20px;
          max-width: 560px;
          color: #eaeaf2;
        }
        .title {
          font-weight: 700;
          letter-spacing: 0.4px;
          margin: 0 0 8px 0;
          font-size: clamp(28px, 5vw, 48px);
        }
        .subtitle {
          opacity: 0.85;
          margin: 0 0 32px 0;
          font-size: clamp(14px, 2.5vw, 18px);
        }
        .form {
          display: grid;
          gap: 12px;
          margin: 0 auto 20px;
          grid-template-columns: 1fr;
        }
        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(21,21,28,0.7);
          color: #fff;
          outline: none;
          backdrop-filter: blur(8px);
        }
        .input::placeholder { color: rgba(234,234,242,0.55); }
        .button {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 0;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.3px;
          background: linear-gradient(90deg, #6B5CF6, #38E2B5);
          color: #0e0e12;
        }
        .button:disabled { opacity: 0.7; cursor: progress; }
        .error {
          margin-top: 6px;
          color: #ff8686;
          font-size: 13px;
        }
        .footer {
          margin-top: 28px;
          font-size: 12px;
          opacity: 0.6;
          letter-spacing: 0.2px;
        }
      `}</style>
    </>
  )
}