// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { passwordMatchesEnv, setAdminCookie } from '../../../lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  }

  const { password } = req.body as { password?: string }
  if (!password || !passwordMatchesEnv(password)) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' })
  }

  setAdminCookie(res)
  return res.status(200).json({ ok: true })
}
