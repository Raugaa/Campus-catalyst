import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const department = searchParams.get('department') || undefined
  const year = searchParams.get('year') || undefined
  const status = searchParams.get('status') // all, placed, unplaced, active, inactive
  const take = Number(searchParams.get('take') || 20)
  const skip = Number(searchParams.get('skip') || 0)

  const where: any = {
    AND: [
      department ? { department } : {},
      year ? { year } : {},
      status === 'placed' ? { isPlaced: true } : {},
      status === 'unplaced' ? { isPlaced: false } : {},
      status === 'active' ? { user: { isActive: true } } : {},
      status === 'inactive' ? { user: { isActive: false } } : {},
      q ? {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { rollNumber: { contains: q, mode: 'insensitive' } },
          { user: { email: { contains: q, mode: 'insensitive' } } }
        ]
      } : {}
    ],
  }

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where, skip, take,
      select: {
        id: true, 
        firstName: true, 
        lastName: true, 
        rollNumber: true,
        department: true, 
        year: true, 
        semester: true,
        cgpa: true,
        isPlaced: true,
        phone: true,
        skills: true,
        user: { select: { email: true, isActive: true } },
        mentor: { select: { name: true } },
        applications: {
          select: { 
            status: true,
            opportunity: { 
              select: { 
                title: true, 
                company: { select: { name: true } } 
              } 
            }
          },
          take: 3,
          orderBy: { appliedAt: 'desc' }
        },
        placements: {
          select: { title: true, company: { select: { name: true } }, status: true },
          take: 1
        }
      },
      orderBy: { rollNumber: 'asc' }
    }),
    prisma.student.count({ where }),
  ])

  const students = items.map(s => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    rollNumber: s.rollNumber,
    email: s.user.email,
    department: s.department,
    year: s.year,
    semester: s.semester,
    cgpa: s.cgpa,
    phone: s.phone,
    skills: s.skills ? JSON.parse(s.skills) : [],
    isPlaced: s.isPlaced,
    mentor: s.mentor?.name || 'Not Assigned',
    status: s.user.isActive ? 'Active' : 'Inactive',
    recentApplications: s.applications.map(app => ({
      status: app.status,
      position: app.opportunity.title,
      company: app.opportunity.company.name
    })),
    placement: s.placements[0] ? {
      title: s.placements[0].title,
      company: s.placements[0].company.name,
      status: s.placements[0].status
    } : null
  }))

  return NextResponse.json({ students, total })
}
