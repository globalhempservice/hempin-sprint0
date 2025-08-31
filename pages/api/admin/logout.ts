// pages/api/admin/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { clearAdminSession } from '../../../lib/adminAuth'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  clearAdminSession(res)
  res.status(200).json({ ok: true })
}
