import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error

  // Get basic counts for dashboard cards
  const [
    totalStudents, 
    totalFaculty, 
    totalCompanies, 
    activeCompanies,
    totalOpportunities,
    activeApplications,
    studentsPlaced,
    pendingApprovals
  ] = await Promise.all([
    prisma.student.count(),
    prisma.faculty.count(),
    prisma.company.count(),
    prisma.company.count({ where: { isVerified: true, user: { isActive: true } } }),
    prisma.opportunity.count({ where: { status: 'ACTIVE' } }),
    prisma.application.count({ where: { status: { notIn: ['REJECTED', 'WITHDRAWN', 'COMPLETED'] } } }),
    prisma.student.count({ where: { isPlaced: true } }),
    prisma.application.count({ where: { status: 'PENDING' } })
  ])

  // Get placement stats by department
  const students = await prisma.student.findMany({
    select: { department: true, isPlaced: true }
  })

  const departmentStats = students.reduce((acc, student) => {
    const dept = student.department
    if (!acc[dept]) acc[dept] = { total: 0, placed: 0 }
    acc[dept].total += 1
    if (student.isPlaced) acc[dept].placed += 1
    return acc
  }, {} as Record<string, { total: number; placed: number }>)

  const departments = Object.entries(departmentStats).map(([name, stats]) => ({
    name,
    total: stats.total,
    placed: stats.placed,
    percentage: stats.total > 0 ? Math.round((stats.placed / stats.total) * 100) : 0
  }))

  // Get recent activities (applications)
  const recentApplications = await prisma.application.findMany({
    take: 10,
    orderBy: { appliedAt: 'desc' },
    include: {
      student: { select: { firstName: true, lastName: true } },
      opportunity: { 
        select: { 
          title: true, 
          company: { select: { name: true } } 
        } 
      }
    }
  })

  const activities = recentApplications.map(app => ({
    id: app.id,
    studentName: `${app.student.firstName} ${app.student.lastName}`,
    company: app.opportunity.company.name,
    position: app.opportunity.title,
    status: app.status,
    appliedAt: app.appliedAt
  }))

  return NextResponse.json({
    // Main dashboard cards
    metrics: {
      totalStudents,
      totalFaculty,
      totalCompanies,
      activeCompanies,
      totalOpportunities,
      activeApplications,
      studentsPlaced,
      pendingApprovals
    },
    // Department wise placement stats
    departments,
    // Recent activities
    activities
  })
}
