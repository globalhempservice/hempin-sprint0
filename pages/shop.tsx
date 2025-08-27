// pages/shop.tsx
import Head from 'next/head'
import Countdown from '../components/Countdown'
import BuyButton from '../components/BuyButton'

export default function ShopPage() {
  const target = '2025-11-01T10:00:00+07:00'

  return (
    <>
      <Head>
        <title>Hemp’in Shop — Kits & Pages</title>
        <meta name="description" content="Join the Bangkok 2025 pop-up, claim your brand page, and add product slots." />
      </Head>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">Join <span className="text-emerald-400">Bangkok 2025</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Reserve your spot, build your brand page, and add product slots. Limited cohort. Clear deadlines.
          </p>
          <div className="mt-6 inline-block">
            <Countdown target={target} label="Opens in" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Offer emoji="🏷️" title="Brand Page" price="$50" body="A polished page for your brand." cta={<BuyButton productId="brand" />} features={['Custom profile','Images & story']} />
          <Offer emoji="🧪" title="Single Product Page" price="$20" body="One product slot linked to your brand." cta={<BuyButton productId="product" />} features={['1 product slot','QR code']} />
          <Offer emoji="🎁" title="Special Offer" price="$100" body="Bundle: brand page + 5 product pages." cta={<BuyButton productId="bundle_1brand_5products" />} features={['Brand page','5 products']} />
          <Offer emoji="🎪" title="Bangkok Pop-up Kit" price="$300–$500" body="Join the showcase in Bangkok with 5 products." cta={<BuyButton productId="popup_kit" label="Reserve a Kit" />} features={['5 exhibited products','Venue placement']} />
          <Offer emoji="➕" title="Pop-up Extra" price="$100" body="Add one more exhibited product + page." cta={<BuyButton productId="popup_extra" />} features={['+1 product','+1 page']} />
        </div>
      </section>
    </>
  )
}

function Offer({emoji,title,price,body,cta,features}:{emoji:string,title:string,price:string,body:string,cta:React.ReactNode,features:string[]}){
  return(
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <div className="text-emerald-400 font-medium">{price}</div>
      <p className="mt-2 text-sm text-zinc-400">{body}</p>
      <ul className="mt-3 space-y-1 text-sm text-zinc-300">
        {features.map((f) => <li key={f}>• {f}</li>)}
      </ul>
      <div className="mt-4">{cta}</div>
    </div>
  )
}
