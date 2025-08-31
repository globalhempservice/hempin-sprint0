// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { passwordMatchesEnv, setAdminCookie } from '../../../lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body as { password?: string }
  if (!password || !passwordMatchesEnv(password)) return res.status(401).json({ ok: false })
  setAdminCookie(res)
  return res.status(200).json({ ok: true })
}
