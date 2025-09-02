// pages/api/admin/_utils.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { hasValidAdminCookie } from '../../../lib/adminAuth'

export function requireAdmin(req: NextApiRequest, res: NextApiResponse): boolean {
  if (!hasValidAdminCookie(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}