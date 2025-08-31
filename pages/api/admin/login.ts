// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { setAdminSession } from '../../../lib/adminAuth'

const sha256hex = (s: string) => crypto.createHash('sha256').update(s).digest('hex')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  const password = body?.password ?? ''

  const expected = process.env.ADMIN_PASSWORD_SHA256 || ''
  if (!expected) return res.status(500).json({ ok: false, error: 'ADMIN_PASSWORD_SHA256 not set' })

  if (sha256hex(password) !== expected) {
    return res.status(401).json({ ok: false, error: 'Invalid password' })
  }

  setAdminSession(res)
  return res.status(200).json({ ok: true })
}
