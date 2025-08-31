// pages/api/admin/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { clearAdminCookie } from '../../../lib/adminAuth'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  clearAdminCookie(res)
  res.status(200).json({ ok: true })
}
