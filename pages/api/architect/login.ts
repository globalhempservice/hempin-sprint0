import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const pass = process.env.ARCHITECT_PASS || ''
  const { password } = req.body || {}

  if (!password || password !== pass) {
    return res.status(401).json({ ok: false, error: 'Invalid password' })
  }

  res.setHeader('Set-Cookie', cookie.serialize('architect_session', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  }))

  return res.status(200).json({ ok: true })
}