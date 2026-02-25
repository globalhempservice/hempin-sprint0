import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[echo] method:', req.method);
  console.log('[echo] headers content-type:', req.headers['content-type']);
  console.log('[echo] body:', req.body);
  return res.status(200).json({
    ok: true,
    method: req.method,
    headers: { 'content-type': req.headers['content-type'] || null },
    body: req.body ?? null,
  });
}