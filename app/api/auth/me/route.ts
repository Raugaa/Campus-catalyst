import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as {
      userId: string
      email: string
      role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'COMPANY'
    }

    const { userId, role } = decoded

    // Fetch minimal role-specific profile
    if (role === 'STUDENT') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          student: {
            select: {
              firstName: true,
              lastName: true,
              rollNumber: true,
              department: true,
              year: true,
            },
          },
        },
      })
      return NextResponse.json({ user })
    }

    if (role === 'FACULTY') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          faculty: {
            select: {
              name: true,
              department: true,
              designation: true,
            },
          },
        },
      })
      return NextResponse.json({ user })
    }

    if (role === 'ADMIN') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          admin: {
            select: {
              name: true,
              department: true,
              college: { select: { name: true, code: true } },
            },
          },
        },
      })
      return NextResponse.json({ user })
    }

    // COMPANY
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        company: {
          select: {
            name: true,
            isVerified: true,
            location: true,
          },
        },
      },
    })
    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}