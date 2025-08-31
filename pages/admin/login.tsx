// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { setAdminSession } from '../../../lib/adminAuth'

const sha256hex = (s: string) => crypto.createHash('sha256').update(s).digest('hex')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body || {}
  if (!password) return res.status(400).json({ ok: false, error: 'Missing password' })

  const expectedHex = process.env.ADMIN_PASSWORD_SHA256 || ''
  if (sha256hex(password) !== expectedHex) {
    return res.status(401).json({ ok: false, error: 'Invalid password' })
  }

  setAdminSession(res)
  res.status(200).json({ ok: true })
}
