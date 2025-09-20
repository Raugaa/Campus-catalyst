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
  if (companyId) where.companyId = companyId

  const [items, total] = await Promise.all([
    prisma.interview.findMany({
      where, skip, take, orderBy: { scheduledAt: 'desc' },
      select: {
        id: true,
        type: true,
        mode: true,
        scheduledAt: true,
        duration: true,
        status: true,
        result: true,
        round: true,
        interviewerName: true,
        interviewerEmail: true,
        meetingLink: true,
        location: true,
        feedback: true,
        notes: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            industry: true
          }
        },
        application: {
          select: {
            id: true,
            opportunity: {
              select: {
                title: true,
                type: true
              }
            }
          }
        }
      }
    }),
    prisma.interview.count({ where })
  ])

  const interviews = items.map(interview => ({
    id: interview.id,
    type: interview.type,
    mode: interview.mode,
    scheduledAt: interview.scheduledAt,
    duration: interview.duration,
    status: interview.status,
    result: interview.result,
    round: interview.round,
    interviewer: {
      name: interview.interviewerName,
      email: interview.interviewerEmail
    },
    meetingDetails: {
      link: interview.meetingLink,
      location: interview.location
    },
    feedback: interview.feedback,
    notes: interview.notes,
    student: {
      id: interview.student.id,
      name: `${interview.student.firstName} ${interview.student.lastName}`,
      rollNumber: interview.student.rollNumber,
      department: interview.student.department,
      year: interview.student.year
    },
    company: interview.company,
    opportunity: {
      title: interview.application.opportunity.title,
      type: interview.application.opportunity.type
    }
  }))

  return NextResponse.json({ interviews, total })
}
