import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')?.toUpperCase() as ('PENDING'|'ACTIVE'|'CLOSED'|'CANCELLED')|undefined
  const type = searchParams.get('type') as ('INTERNSHIP'|'FULL_TIME'|'BOTH')|undefined
  const q = searchParams.get('q')?.trim()
  const take = Number(searchParams.get('take') || 20)
  const skip = Number(searchParams.get('skip') || 0)

  const where: any = {}
  if (status) where.status = status
  if (type) where.type = type
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { company: { name: { contains: q, mode: 'insensitive' } } }
    ]
  }

  const [items, total] = await Promise.all([
    prisma.opportunity.findMany({
      where, skip, take, orderBy: { createdAt: 'desc' },
      select: {
        id: true, 
        title: true, 
        description: true, 
        location: true, 
        type: true, 
        duration: true,
        stipend: true,
        salary: true,
        requirements: true,
        skills: true,
        deadline: true, 
        status: true,
        createdAt: true,
        company: { 
          select: { 
            id: true,
            name: true, 
            industry: true,
            location: true
          } 
        }, 
        _count: { 
          select: { 
            applications: true 
          } 
        },
        applications: {
          select: {
            status: true,
            student: {
              select: {
                firstName: true,
                lastName: true,
                rollNumber: true,
                department: true
              }
            }
          },
          take: 5,
          orderBy: { appliedAt: 'desc' }
        }
      }
    }),
    prisma.opportunity.count({ where })
  ])

  const opportunities = items.map(opp => ({
    id: opp.id,
    title: opp.title,
    description: opp.description,
    company: {
      id: opp.company.id,
      name: opp.company.name,
      industry: opp.company.industry,
      location: opp.company.location
    },
    location: opp.location,
    type: opp.type,
    duration: opp.duration,
    stipend: opp.stipend,
    salary: opp.salary,
    requirements: opp.requirements,
    skills: opp.skills ? JSON.parse(opp.skills) : [],
    deadline: opp.deadline,
    status: opp.status,
    createdAt: opp.createdAt,
    totalApplications: opp._count.applications,
    recentApplications: opp.applications.map(app => ({
      status: app.status,
      student: {
        name: `${app.student.firstName} ${app.student.lastName}`,
        rollNumber: app.student.rollNumber,
        department: app.student.department
      }
    }))
  }))

  return NextResponse.json({ opportunities, total })
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const body = await req.json()
  const { 
    title, 
    description, 
    companyId, 
    location, 
    type, 
    deadline, 
    duration,
    stipend, 
    salary,
    requirements, 
    skills 
  } = body || {}
  
  if (!title || !description || !companyId || !location || !type || !deadline) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  const opp = await prisma.opportunity.create({
    data: {
      title, 
      description, 
      location, 
      type, 
      deadline: new Date(deadline),
      duration: duration || null,
      stipend: stipend || null, 
      salary: salary || null,
      requirements: requirements || null, 
      skills: skills ? JSON.stringify(skills) : null,
      status: 'PENDING', 
      companyId
    }
  })
  
  return NextResponse.json({ 
    id: opp.id, 
    message: 'Opportunity created successfully' 
  }, { status: 201 })
}
