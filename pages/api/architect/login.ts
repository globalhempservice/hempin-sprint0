import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const pass = process.env.ARCHITECT_PASS || ''
  const { password } = req.body || {}

  if (!password || password !== pass) {
    return res.status(401).json({ ok: false, error: 'Invalid password' })
  }

  // Build cookie string without external deps
  const parts = [
    'architect_session=1',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${60 * 60 * 8}`,                 // 8 hours
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))

  return res.status(200).json({ ok: true })
}