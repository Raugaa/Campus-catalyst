import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma'

type DBUserRow = {
  id: string
  email: string
  password: string
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'COMPANY'
  isActive: boolean
  isVerified: boolean | null
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    // Single round-trip: user + company.isVerified (if any)
    const rows = await prisma.$queryRaw<DBUserRow[]>`
      SELECT u.id, u.email, u.password, u.role, u."isActive", c."isVerified"
      FROM "users" u
      LEFT JOIN "companies" c ON c."userId" = u.id
      WHERE u.email = ${normalizedEmail}
      LIMIT 1
    `
    const user = rows[0]
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Block unverified companies
    if (user.role === 'COMPANY' && user.isVerified !== true) {
      return NextResponse.json(
        { error: 'Your company account is pending verification by the placement cell.' },
        { status: 403 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    )

    const res = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
    })

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    // Prevent caching
    res.headers.set('Cache-Control', 'no-store')

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}