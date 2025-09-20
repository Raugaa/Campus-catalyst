import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // All, Active, Pending, Inactive
  const q = searchParams.get('q')?.trim()
  const take = Number(searchParams.get('take') || 20)
  const skip = Number(searchParams.get('skip') || 0)

  const where: any = {}
  if (status === 'Active') where.isVerified = true, where.user = { isActive: true }
  if (status === 'Pending') where.isVerified = false
  if (status === 'Inactive') where.user = { isActive: false }
  if (q) where.name = { contains: q, mode: 'insensitive' }

  const [items, total] = await Promise.all([
    prisma.company.findMany({
      where, skip, take, orderBy: { name: 'asc' },
      select: {
        id: true, 
        name: true, 
        website: true, 
        location: true, 
        industry: true, 
        size: true, 
        description: true, 
        isVerified: true,
        user: { select: { email: true, isActive: true, createdAt: true } },
        _count: { 
          select: { 
            opportunities: true,
            internships: true,
            placements: true
          } 
        },
        opportunities: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            _count: { select: { applications: true } }
          },
          where: { status: 'ACTIVE' },
          take: 3
        }
      }
    }),
    prisma.company.count({ where })
  ])

  // Get application stats for each company
  const companyIds = items.map(c => c.id)
  const applicationStats = await prisma.$queryRaw<{
    companyId: string;
    totalApplications: number;
    selectedStudents: number;
  }[]>`
    SELECT 
      c.id as "companyId",
      COALESCE(COUNT(a.id), 0)::int as "totalApplications",
      COALESCE(COUNT(CASE WHEN a.status IN ('SELECTED', 'OFFER_ACCEPTED') THEN 1 END), 0)::int as "selectedStudents"
    FROM "companies" c
    LEFT JOIN "opportunities" o ON o."companyId" = c.id
    LEFT JOIN "applications" a ON a."opportunityId" = o.id
    WHERE c.id = ANY(${companyIds})
    GROUP BY c.id
  `

  const statsMap = new Map(applicationStats.map(s => [s.companyId, s]))

  const companies = items.map(c => {
    const stats = statsMap.get(c.id) || { totalApplications: 0, selectedStudents: 0 }
    return {
      id: c.id,
      name: c.name,
      email: c.user.email,
      website: c.website,
      location: c.location,
      industry: c.industry,
      size: c.size,
      description: c.description,
      status: c.user.isActive ? (c.isVerified ? 'Active' : 'Pending') : 'Inactive',
      isVerified: c.isVerified,
      joinedDate: c.user.createdAt,
      activeJobs: c._count.opportunities,
      totalInternships: c._count.internships,
      totalPlacements: c._count.placements,
      totalApplications: stats.totalApplications,
      selectedStudents: stats.selectedStudents,
      recentOpportunities: c.opportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        type: opp.type,
        status: opp.status,
        applications: opp._count.applications
      }))
    }
  })

  return NextResponse.json({ companies, total })
}
