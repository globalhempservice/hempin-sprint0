// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { createSessionToken, adminCookieHeader } from '../../../lib/adminAuth'

function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = (req.body || {}) as { password?: string }
  if (!password) return res.status(400).json({ ok: false, error: 'Missing password' })

  const targetHash = process.env.ADMIN_PASSWORD_SHA256 || ''
  if (!targetHash) return res.status(500).json({ ok: false, error: 'Server not configured' })

  const givenHash = sha256Hex(password)
  const a = Buffer.from(givenHash, 'hex')
  const b = Buffer.from(targetHash, 'hex')

  const ok = a.length === b.length && crypto.timingSafeEqual(a, b)
  if (!ok) return res.status(401).json({ ok: false, error: 'Invalid password' })

  const ua = req.headers['user-agent'] || ''
  const token = createSessionToken(Array.isArray(ua) ? ua[0] : ua)
  res.setHeader('Set-Cookie', adminCookieHeader(token))
  return res.status(200).json({ ok: true })
}
