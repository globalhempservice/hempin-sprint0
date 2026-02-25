// components/legal/LegalLayout.tsx
import Head from 'next/head';

export default function LegalLayout({
  title,
  children,
  lastUpdated,
}: {
  title: string;
  children: React.ReactNode;
  lastUpdated?: string;
}) {
  return (
    <>
      <Head>
        <title>{title} — Hemp’in</title>
        <meta name="robots" content="index,follow" />
      </Head>

      <main className="page app-shell min-h-screen">
        <section className="container" style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 36px' }}>
          <div className="hemp-panel" style={{ padding: 18 }}>
            <h1 className="display-title" style={{ textAlign: 'center' }}>{title}</h1>
            <div className="cta-scanline" aria-hidden />
            {lastUpdated && (
              <p className="tiny muted center" style={{ marginTop: 8 }}>Last updated: {lastUpdated}</p>
            )}
            <article className="prose" style={{ marginTop: 12, display: 'grid', gap: 12 }}>
              {children}
            </article>
          </div>

          <div className="center" style={{ marginTop: 12 }}>
            <a className="btn ghost" href="/trust">← Trust Center</a>
          </div>
        </section>
      </main>
    </>
  );
}