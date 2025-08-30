// pages/experiments/meme-forge.tsx
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

export default function MemeForge() {
  const [top, setTop] = useState('HEMP FOREVER')
  const [bottom, setBottom] = useState('SOIL IS THE GOAT')
  const [bg, setBg] = useState<string>('/og-image.png') // fallback if exists, else gradient
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => draw(), [top, bottom, bg])

  const draw = () => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const W = c.width, H = c.height

    const paint = () => {
      // background
      if (bg && bg.startsWith('data:')) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, W, H)
          text()
        }
        img.src = bg
      } else {
        // gradient fallback
        const g = ctx.createLinearGradient(0, 0, W, H)
        g.addColorStop(0, '#064e3b')
        g.addColorStop(1, '#111827')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        text()
      }
    }

    const text = () => {
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 8
      ctx.font = 'bold 48px Inter, system-ui, sans-serif'
      ctx.strokeText(top, W / 2, 70)
      ctx.fillText(top, W / 2, 70)
      ctx.strokeText(bottom, W / 2, H - 30)
      ctx.fillText(bottom, W / 2, H - 30)
    }

    paint()
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBg(String(reader.result))
    reader.readAsDataURL(file)
  }

  const download = () => {
    const c = canvasRef.current
    if (!c) return
    const a = document.createElement('a')
    a.href = c.toDataURL('image/png')
    a.download = 'hempin-meme.png'
    a.click()
  }

  return (
    <>
      <Head><title>Hemp Meme Forge • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold">😂 Hemp Meme Forge</h1>
        <p className="mt-2 text-zinc-400">Drop a background, type your lines, download. Fast.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr,320px]">
          <div className="rounded-2xl border border-white/10 p-4">
            <canvas ref={canvasRef} width={800} height={600} className="w-full rounded-lg bg-black/40" />
            <div className="mt-3 text-right">
              <button className="btn btn-primary" onClick={download}>Download</button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-zinc-400">Top text</div>
              <input className="mt-1 w-full rounded-md bg-white/5 px-3 py-2" value={top} onChange={e => setTop(e.target.value.toUpperCase())}/>
            </div>
            <div>
              <div className="text-sm text-zinc-400">Bottom text</div>
              <input className="mt-1 w-full rounded-md bg-white/5 px-3 py-2" value={bottom} onChange={e => setBottom(e.target.value.toUpperCase())}/>
            </div>
            <div>
              <div className="text-sm text-zinc-400">Background image</div>
              <input type="file" accept="image/*" className="mt-1 w-full rounded-md bg-white/5 px-3 py-2" onChange={handleUpload}/>
              <p className="mt-1 text-xs text-zinc-500">If none selected, a green→charcoal gradient is used.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}