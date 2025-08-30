// pages/experiments/blackjack-carbon.tsx
import Head from 'next/head'
import { useMemo, useState } from 'react'

type Card = { v: number; label: string }
type Hand = Card[]

function newDeck(): Card[] {
  const ranks = [
    { v: 2, l: '2' }, { v: 3, l: '3' }, { v: 4, l: '4' }, { v: 5, l: '5' },
    { v: 6, l: '6' }, { v: 7, l: '7' }, { v: 8, l: '8' }, { v: 9, l: '9' },
    { v: 10, l: '10' }, { v: 10, l: 'J' }, { v: 10, l: 'Q' }, { v: 10, l: 'K' },
    { v: 11, l: 'A' },
  ]
  const deck: Card[] = []
  for (let s = 0; s < 4; s++) for (const r of ranks) deck.push({ v: r.v, label: r.l })
  return deck.sort(() => Math.random() - 0.5)
}

function score(hand: Hand): number {
  let total = hand.reduce((a, c) => a + c.v, 0)
  let aces = hand.filter(c => c.v === 11).length
  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }
  return total
}

export default function CarbonBlackjack() {
  const [deck, setDeck] = useState<Card[]>(() => newDeck())
  const [player, setPlayer] = useState<Hand>([])
  const [dealer, setDealer] = useState<Hand>([])
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')
  const [carbon, setCarbon] = useState(0)

  const start = () => {
    const d = newDeck()
    setDeck(d.slice(4))
    setPlayer([d[0], d[2]])
    setDealer([d[1], d[3]])
    setDone(false)
    setMessage('')
  }

  const hit = () => {
    if (done) return
    setDeck(d => {
      const [c, ...rest] = d
      setPlayer(h => {
        const next = [...h, c]
        if (score(next) > 21) {
          setDone(true)
          setMessage('Bust! +2 kg CO₂e 😬')
          setCarbon(x => x + 2)
        }
        return next
      })
      return rest
    })
  }

  const stand = () => {
    if (done) return
    // dealer draws to 17+
    setDeck(d => {
      let deckLeft = [...d]
      let hand = [...dealer]
      while (score(hand) < 17) {
        const [c, ...rest] = deckLeft
        hand = [...hand, c]
        deckLeft = rest
      }
      setDealer(hand)
      setDeck(deckLeft)

      const ps = score(player)
      const ds = score(hand)
      let msg = ''
      if (ds > 21 || ps > ds) { msg = 'You win! −2 kg CO₂e 🎉'; setCarbon(x => Math.max(0, x - 2)) }
      else if (ps === ds) { msg = 'Push. 0 kg CO₂e' }
      else { msg = 'Dealer wins. +1 kg CO₂e'; setCarbon(x => x + 1) }
      setMessage(msg)
      setDone(true)
      return deckLeft
    })
  }

  const HandUI = ({ label, cards }: { label: string; cards: Hand }) => (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {cards.map((c, i) => (
          <div key={i} className="grid h-10 w-8 place-items-center rounded bg-white/10 text-sm">
            {c.label}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm">Score: <strong>{score(cards)}</strong></div>
    </div>
  )

  return (
    <>
      <Head><title>Carbon Blackjack • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-2xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold">🃏 Carbon Blackjack</h1>
        <p className="mt-2 text-zinc-400">Win = carbon credit, Lose = carbon debt. Demo math, not real offsets.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm text-zinc-400">CO₂e Balance</div>
            <div className="mt-1 text-3xl font-semibold">{carbon} kg</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm text-zinc-400">Status</div>
            <div className="mt-1 text-lg">{message || 'Play a hand'}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <HandUI label="Dealer" cards={dealer} />
          <HandUI label="You" cards={player} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={start}>Deal</button>
          <button className="btn btn-outline" onClick={hit} disabled={done || player.length === 0}>Hit</button>
          <button className="btn btn-outline" onClick={stand} disabled={done || player.length === 0}>Stand</button>
        </div>

        <p className="mt-4 text-xs text-zinc-500">House rules: Aces count as 11 or 1. Dealer stands on 17+.</p>
      </div>
    </>
  )
}