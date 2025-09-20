import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  
  const faculty = await prisma.faculty.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, department: true, designation: true, phone: true,
      user: { select: { email: true } },
      students: { 
        select: { id: true, firstName: true, lastName: true, rollNumber: true, year: true, cgpa: true }, 
        take: 50 
      }
    }
  })
  
  if (!faculty) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ faculty })
}
