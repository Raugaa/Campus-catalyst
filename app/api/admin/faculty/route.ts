import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import bcrypt from 'bcrypt'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const department = searchParams.get('department') || undefined
  const take = Number(searchParams.get('take') || 20)
  const skip = Number(searchParams.get('skip') || 0)

  const where: any = {
    AND: [
      department ? { department } : {},
      q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
          { department: { contains: q, mode: 'insensitive' } }
        ]
      } : {}
    ]
  }

  const [items, total] = await Promise.all([
    prisma.faculty.findMany({
      where, skip, take, orderBy: { name: 'asc' },
      select: {
        id: true, 
        name: true, 
        department: true, 
        designation: true,
        phone: true,
        canMentor: true,
        user: { select: { email: true, isActive: true } },
        _count: { select: { students: true } },
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            year: true,
            applications: {
              select: { status: true },
              where: { status: { in: ['INTERVIEW_SCHEDULED', 'SELECTED', 'OFFER_ACCEPTED'] } }
            }
          },
          take: 5,
          orderBy: { rollNumber: 'asc' }
        }
      }
    }),
    prisma.faculty.count({ where })
  ])

  const faculty = items.map(f => ({
    id: f.id,
    name: f.name,
    email: f.user.email,
    department: f.department,
    designation: f.designation,
    phone: f.phone,
    canMentor: f.canMentor,
    status: f.user.isActive ? 'Active' : 'Inactive',
    assignedStudents: f._count.students,
    students: f.students.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      rollNumber: s.rollNumber,
      year: s.year,
      activeApplications: s.applications.length
    }))
  }))

  return NextResponse.json({ faculty, total })
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const { email, password, name, department, designation, phone, collegeId } = await req.json()
  
  if (!email || !password || !name || !department || !collegeId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
  
  const hashed = await bcrypt.hash(password, 12)
  
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashed,
      role: 'FACULTY',
      faculty: {
        create: { name, department, designation: designation || null, phone: phone || null, collegeId }
      }
    },
    select: { id: true }
  })
  
  return NextResponse.json({ id: user.id, message: 'Faculty created successfully' }, { status: 201 })
}
