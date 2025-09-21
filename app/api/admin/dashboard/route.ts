import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { ApplicationStatus } from '@/lib/generated/prisma/index.js'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error

  try {
    // Extract year parameter from query
    const { searchParams } = new URL(req.url)
    const year = searchParams.get('year') || 'ly'

    // Validate year parameter
    const validYears = ['FY', 'SY', 'TY', 'LY']
    const yearFilter = validYears.includes(year) ? year : 'ly'

    // Use a single transaction to fetch all data at once for better performance
    const [
      totalStudents, 
      totalFaculty, 
      totalCompanies, 
      activeCompanies,
      totalOpportunities,
      activeApplications,
      studentsPlaced,
      pendingApprovals
    ] = await prisma.$transaction([
      prisma.student.count({ where: { year: yearFilter } }),
      prisma.faculty.count(),
      prisma.company.count(),
      prisma.company.count({ where: { isVerified: true, user: { isActive: true } } }),
      prisma.opportunity.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count({ where: { status: { notIn: [ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN, ApplicationStatus.COMPLETED] } } }),
      prisma.student.count({ where: { isPlaced: true, year: yearFilter } }),
      prisma.application.count({ where: { status: ApplicationStatus.PENDING } })
    ])

    // Fetch department stats with a single optimized query instead of fetching all students
    const departmentStatsRaw = await prisma.student.groupBy({
      by: ['department'],
      _count: {
        _all: true,
        isPlaced: true
      },
      where: {
        isPlaced: true,
        year: yearFilter
      }
    })

    // Get total count by department for percentage calculation
    const totalByDepartmentRaw = await prisma.student.groupBy({
      by: ['department'],
      _count: {
        _all: true
      },
      where: {
        year: yearFilter
      }
    })

    // Create a map for easier access
    const placedByDept = departmentStatsRaw.reduce((acc, item) => {
      acc[item.department] = item._count.isPlaced || 0
      return acc
    }, {} as Record<string, number>)

    const totalByDept = totalByDepartmentRaw.reduce((acc, item) => {
      acc[item.department] = item._count._all
      return acc
    }, {} as Record<string, number>)

    // Combine the data
    const departments = Object.keys(totalByDept).map(dept => {
      const total = totalByDept[dept] || 0
      const placed = placedByDept[dept] || 0
      return {
        name: dept,
        total,
        placed,
        percentage: total > 0 ? Math.round((placed / total) * 100) : 0
      }
    })

    // Get recent activities (applications) with optimized query
    const recentApplications = await prisma.application.findMany({
      take: 10,
      orderBy: { appliedAt: 'desc' },
      include: {
        student: { 
          select: { 
            firstName: true, 
            lastName: true 
          } 
        },
        opportunity: { 
          select: { 
            title: true, 
            company: { 
              select: { 
                name: true 
              } 
            } 
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
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}