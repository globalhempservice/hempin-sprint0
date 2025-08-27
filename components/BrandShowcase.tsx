// components/BrandShowcase.tsx
export default function BrandShowcase() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        {/* Left: mock brand hero */}
        <div>
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent">
            <div className="aspect-[16/10] w-full flex items-end p-6"
                 style={{backgroundImage:'linear-gradient(180deg,rgba(0,0,0,0) 0%, rgba(0,0,0,.4) 60%), url(/brand-hero.jpg)',
                         backgroundSize:'cover', backgroundPosition:'center'}}>
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-300/90">Showcase</div>
                <h3 className="text-2xl font-semibold">Hemp Atelier</h3>
                <p className="text-sm text-zinc-300/90">Natural fabrics • Circular design</p>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {['Story','Products','Links'].map((k,i)=>(
              <div key={k} className="rounded-lg border border-zinc-800 p-3 text-center">
                <div className="text-xs text-zinc-400">{k}</div>
                <div className="text-lg font-semibold">{i===1 ? '5' : 'Ready'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: bullets */}
        <div>
          <h4 className="text-xl font-semibold">Your brand, beautifully presented.</h4>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li>• Elegant profile with hero image, mission, and materials.</li>
            <li>• Attach products with QR codes for the Bangkok pop-up.</li>
            <li>• SEO-friendly public page goes live on <b>Nov 1</b>.</li>
            <li>• Simple editing, fast moderation, secure checkout.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/account" className="rounded-xl bg-emerald-500 px-5 py-2.5 font-medium text-emerald-950 hover:bg-emerald-400">Claim your brand page</a>
            <a href="/shop" className="rounded-xl border border-zinc-700 px-5 py-2.5 font-medium hover:border-zinc-500">Explore kits</a>
          </div>
          <p className="mt-3 text-xs text-zinc-500">Tip: order a kit before <b>Oct 15</b> to secure the early price.</p>
        </div>
      </div>
    </div>
  )
}
