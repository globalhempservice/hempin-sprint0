// pages/api/admin/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { clearAdminCookieHeader } from '../../../lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', clearAdminCookieHeader())
  res.status(200).json({ ok: true })
}
