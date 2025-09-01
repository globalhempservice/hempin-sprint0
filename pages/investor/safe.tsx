// pages/investor/safe.tsx
import Head from 'next/head'
import { useMemo, useState } from 'react'

export default function InvestorSafe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [valuationCap, setValuationCap] = useState<number | ''>('') // optional
  const [discount, setDiscount] = useState<number | ''>('')          // optional %
  const [notes, setNotes] = useState('')

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('HEMPIN — SAFE proposal / Friends & Family')
    const body = encodeURIComponent([
      `Hi Paul,`,
      ``,
      `I’d like to participate in the friends & family round via a SAFE.`,
      ``,
      `Name: ${name || '—'}`,
      `Email: ${email || '—'}`,
      `Amount (USD): ${amount || '—'}`,
      `Valuation cap (USD): ${valuationCap || '—'}`,
      `Discount (%): ${discount || '—'}`,
      ``,
      `Notes:`,
      `${notes || '—'}`,
      ``,
      `Please reply with next steps and a countersignable document.`,
      ``,
      `—`,
    ].join('\n'))
    return `mailto:paul@globalhempservice.com?subject=${subject}&body=${body}`
  }, [name, email, amount, valuationCap, discount, notes])

  return (
    <>
      <Head>
        <title>Investor / SAFE • HEMPIN</title>
      </Head>
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">Investor • SAFE</h1>
          <p className="mt-2 text-zinc-300 max-w-2xl">
            A lightweight page for friends & family to review our direction and propose SAFE terms.
            This is not an offer of securities; all commitments are non-binding until countersigned.
          </p>
        </header>

        {/* Roadmap / ambition */}
        <section className="card mb-10">
          <h2 className="text-xl font-semibold">Roadmap & Ambition</h2>
          <ul className="mt-3 space-y-2 text-zinc-300 list-disc pl-6">
            <li><strong>Supermarket (B2C):</strong> launch tee/wardrobe pilot, curated kits, climate rewards.</li>
            <li><strong>Trade (B2B):</strong> supplier discovery, deal intake (RFP/RFQ), escrow later.</li>
            <li><strong>Events:</strong> pop-up showroom (Bangkok pilot), global calendar.</li>
            <li><strong>Research:</strong> open knowledge hub (LCA, studies, market data).</li>
            <li><strong>Platform:</strong> unified profile, badges, green-leaf points, wallets later.</li>
          </ul>
        </section>

        {/* SAFE proposal form */}
        <section className="card">
          <h2 className="text-xl font-semibold">SAFE proposal (friends & family)</h2>
          <p className="mt-2 text-zinc-300">
            Fill the fields below. Clicking <em>Send proposal</em> will open your email client with a prefilled draft to
            <strong> paul@globalhempservice.com</strong>. We’ll reply with next steps and a countersignable doc.
          </p>

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = mailtoHref
            }}
          >
            <label className="block">
              <span className="text-sm opacity-75">Full name</span>
              <input
                className="input mt-1 w-full"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Doe"
              />
            </label>

            <label className="block">
              <span className="text-sm opacity-75">Email</span>
              <input
                className="input mt-1 w-full"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm opacity-75">Amount (USD)</span>
              <input
                className="input mt-1 w-full"
                type="number"
                min={25}
                step="25"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="1000"
              />
            </label>

            <label className="block">
              <span className="text-sm opacity-75">Valuation cap (USD)</span>
              <input
                className="input mt-1 w-full"
                type="number"
                min={0}
                step="50000"
                value={valuationCap}
                onChange={(e) => setValuationCap(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Optional (e.g., 3,000,000)"
              />
            </label>

            <label className="block">
              <span className="text-sm opacity-75">Discount (%)</span>
              <input
                className="input mt-1 w-full"
                type="number"
                min={0}
                max={50}
                step="1"
                value={discount}
                onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Optional (e.g., 20)"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm opacity-75">Notes</span>
              <textarea
                className="input mt-1 w-full min-h-[120px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything you want us to know (jurisdiction, timing, wiring preferences, etc.)"
              />
            </label>

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn btn-primary">
                Send proposal
              </button>
              <a href={mailtoHref} className="btn btn-outline">
                Open email draft
              </a>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}