// pages/experiments/web5-identity.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'

type Keys = { publicJwk: JsonWebKey; privateJwk: JsonWebKey }

async function genKeys(): Promise<Keys> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  )
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)
  return { publicJwk, privateJwk }
}

async function sign(privateJwk: JsonWebKey, data: string) {
  const key = await crypto.subtle.importKey('jwk', privateJwk, { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign'])
  const enc = new TextEncoder().encode(data)
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc)
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

async function verify(publicJwk: JsonWebKey, data: string, b64: string) {
  const key = await crypto.subtle.importKey('jwk', publicJwk, { name: 'ECDSA', namedCurve: 'P-256' }, true, ['verify'])
  const enc = new TextEncoder().encode(data)
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  return crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, bytes, enc)
}

export default function Web5Identity() {
  const [keys, setKeys] = useState<Keys | null>(null)
  const [did, setDid] = useState<string>('')
  const [claim, setClaim] = useState('I love hemp and soil health.')
  const [sig, setSig] = useState<string>('')

  useEffect(() => {
    const raw = localStorage.getItem('lab.did.keys')
    if (raw) {
      const k: Keys = JSON.parse(raw)
      setKeys(k)
      setDid(`did:demo:${(k.publicJwk.x || 'xx').slice(0, 8)}`)
    }
  }, [])

  const create = async () => {
    const k = await genKeys()
    setKeys(k)
    const d = `did:demo:${(k.publicJwk.x || 'xx').slice(0, 8)}`
    setDid(d)
    localStorage.setItem('lab.did.keys', JSON.stringify(k))
  }

  const makeSig = async () => {
    if (!keys) return
    const s = await sign(keys.privateJwk, claim)
    setSig(s)
  }

  const doVerify = async () => {
    if (!keys || !sig) return
    const ok = await verify(keys.publicJwk, claim, sig)
    alert(ok ? '✅ Signature valid' : '❌ Invalid')
  }

  const reset = () => {
    setKeys(null); setDid(''); setSig('')
    localStorage.removeItem('lab.did.keys')
  }

  return (
    <>
      <Head><title>Web5 Identity Capsule • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-2xl px-4 py-10 lg:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🔐 Web5 Identity Capsule</h1>
          <button onClick={reset} className="btn btn-outline">Reset</button>
        </div>
        <p className="mt-2 text-zinc-400">Generate a DID (demo), sign a claim, and verify—all locally.</p>

        <div className="mt-6 rounded-2xl border border-white/10 p-5">
          <div className="text-sm text-zinc-400">Your DID</div>
          <div className="mt-1 text-lg font-mono">{did || '— not created —'}</div>
          <button className="btn btn-primary mt-3" onClick={create}>Generate DID</button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 p-5">
          <div className="text-sm text-zinc-400">Claim</div>
          <textarea
            className="mt-2 w-full rounded-md bg-white/5 p-3"
            rows={3}
            value={claim}
            onChange={e => setClaim(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button className="btn btn-primary" onClick={makeSig} disabled={!keys}>Sign</button>
            <button className="btn btn-outline" onClick={doVerify} disabled={!sig || !keys}>Verify</button>
          </div>
          <div className="mt-3 break-all rounded-md bg-black/50 p-3 text-xs text-zinc-400">
            {sig ? `signature: ${sig}` : 'signature: —'}
          </div>
        </div>
      </div>
    </>
  )
}