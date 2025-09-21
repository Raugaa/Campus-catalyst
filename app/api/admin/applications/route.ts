import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as string | undefined
  const studentId = searchParams.get('studentId') || undefined
  const companyId = searchParams.get('companyId') || undefined
  const take = Number(searchParams.get('take') || 20)
  const skip = Number(searchParams.get('skip') || 0)

  const where: any = {}
  if (status) where.status = status
  if (studentId) where.studentId = studentId
  if (companyId) where.opportunity = { companyId }

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where, skip, take, orderBy: { appliedAt: 'desc' },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        updatedAt: true,
        mentorApproved: true,
        adminApproved: true,
        adminRemarks: true,
        mentorRemarks: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            cgpa: true,
            mentor: { select: { name: true } }
          }
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            type: true,
            location: true,
            company: {
              select: {
                id: true,
                name: true,
                industry: true
              }
            }
          }
        },
        interviews: {
          select: {
            id: true,
            type: true,
            scheduledAt: true,
            status: true,
            result: true
          },
          orderBy: { scheduledAt: 'asc' },
          take: 3
        },
        internship: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            status: true
          }
        },
        placement: {
          select: {
            id: true,
            title: true,
            salary: true,
            joiningDate: true,
            status: true
          }
        }
      }
    }),
    prisma.application.count({ where })
  ])

  const applications = items.map(app => ({
    id: app.id,
    status: app.status,
    appliedAt: app.appliedAt,
    updatedAt: app.updatedAt,
    mentorApproved: app.mentorApproved,
    adminApproved: app.adminApproved,
    adminRemarks: app.adminRemarks,
    mentorRemarks: app.mentorRemarks,
    student: {
      id: app.student.id,
      name: `${app.student.firstName} ${app.student.lastName}`,
      rollNumber: app.student.rollNumber,
      department: app.student.department,
      year: app.student.year,
      cgpa: app.student.cgpa,
      mentor: app.student.mentor?.name || 'Not Assigned'
    },
    opportunity: {
      id: app.opportunity.id,
      title: app.opportunity.title,
      type: app.opportunity.type,
      location: app.opportunity.location,
      company: app.opportunity.company
    },
    interviews: app.interviews,
    internship: app.internship,
    placement: app.placement
  }))

  return NextResponse.json({ applications, total })
}
