import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { role: string }
    if (payload.role !== 'ADMIN') {
      return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
    }
    return { ok: true }
  } catch {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
}
