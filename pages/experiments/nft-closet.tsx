// pages/experiments/nft-closet.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'

type Item = { id: string; name: string; trait: string; minted: boolean; tokenId?: string }

const BASE: Item[] = [
  { id: 'tee',      name: 'Hemp Tee',        trait: 'Organic • 220gsm', minted: false },
  { id: 'hoodie',   name: 'Hemp Hoodie',     trait: 'Recycled blend',   minted: false },
  { id: 'denim',    name: 'Hemp Denim',      trait: '12oz raw',         minted: false },
  { id: 'tote',     name: 'Tote Bag',        trait: 'Undyed canvas',    minted: false },
]

export default function NFTCloset() {
  const [items, setItems] = useState<Item[]>(BASE)

  useEffect(() => {
    const raw = localStorage.getItem('lab.nft.items')
    if (raw) setItems(JSON.parse(raw))
  }, [])
  useEffect(() => {
    localStorage.setItem('lab.nft.items', JSON.stringify(items))
  }, [items])

  const mint = (id: string) => {
    setItems(list =>
      list.map(i => i.id === id ? { ...i, minted: true, tokenId: Math.random().toString(36).slice(2, 10) } : i)
    )
  }

  const reset = () => {
    setItems(BASE)
    localStorage.removeItem('lab.nft.items')
  }

  return (
    <>
      <Head><title>NFT Wardrobe Closet • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">👕 NFT Wardrobe Closet</h1>
            <p className="mt-2 text-zinc-400">Mint demo “phygital” pieces—token IDs stored locally. No blockchain used.</p>
          </div>
          <button onClick={reset} className="btn btn-outline">Reset</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(i => (
            <div key={i.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20" />
              <div className="mt-3 font-semibold">{i.name}</div>
              <div className="text-sm text-zinc-400">{i.trait}</div>

              {i.minted ? (
                <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  Minted • token #{i.tokenId}
                </div>
              ) : (
                <button className="btn btn-primary mt-3 w-full" onClick={() => mint(i.id)}>Mint (demo)</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}