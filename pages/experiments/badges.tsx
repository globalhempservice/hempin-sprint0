// pages/experiments/badges.tsx
import Head from 'next/head'
import Link from 'next/link'

export default function BadgesRules() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Head><title>Badges & Points • HEMPIN</title></Head>
      <h1 className="text-3xl font-bold">Badges & Points (beta)</h1>
      <p className="mt-2 opacity-80">
        Here’s how you’ll earn leaves (points) and unlock badges as we roll out features.
      </p>

      <div className="mt-8 space-y-6">
        <section className="card">
          <h2 className="text-xl font-semibold">Leaves (points)</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90">
            <li>+1 leaf for creating an account.</li>
            <li>+1 leaf per day you come back (streaks multiply).</li>
            <li>+5 leaves for completing onboarding.</li>
            <li>+10–50 leaves for verified purchases or eco-actions (coming soon).</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Badges (examples)</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 opacity-90">
            <li><strong>Seedling</strong>: 10 leaves — you sprouted 🌱</li>
            <li><strong>Sapling</strong>: 50 leaves — steady growth 🌿</li>
            <li><strong>Grove</strong>: 200 leaves — community builder 🌳</li>
            <li><strong>Forest</strong>: 500 leaves — climate champion 🌲</li>
            <li><strong>Investor</strong>: contribute on <Link href="/invest" className="link">/invest</Link> 💚</li>
          </ul>
          <p className="mt-3 text-sm opacity-70">
            These are illustrative; we’ll finalize with you, the community.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Privacy</h2>
          <p className="mt-2 opacity-90">
            We track points server-side with your account ID. You control what is public on your profile.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/experiments" className="btn btn-outline">← Back to Experiments</Link>
      </div>
    </div>
  )
}