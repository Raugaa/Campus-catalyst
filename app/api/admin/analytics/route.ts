import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error

  // Get analytics data for charts and insights
  const { searchParams } = new URL(req.url)
  const timeframe = searchParams.get('timeframe') || '6months' // 6months, 1year

  // Placement trends over time
  const placementTrends = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', p."createdAt") as month,
      COUNT(*)::int as placements
    FROM "placements" p
    WHERE p."createdAt" >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', p."createdAt")
    ORDER BY month
  `

  // Application trends
  const applicationTrends = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', a."appliedAt") as month,
      COUNT(*)::int as applications,
      COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END)::int as selected
    FROM "applications" a
    WHERE a."appliedAt" >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', a."appliedAt")
    ORDER BY month
  `

  // Company wise hiring stats
  const companyStats = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          opportunities: true,
          placements: true,
          internships: true
        }
      }
    },
    where: { isVerified: true },
    orderBy: { placements: { _count: 'desc' } },
    take: 10
  })

  // Department wise placement rates
  const departmentStats = await prisma.$queryRaw`
    SELECT 
      s.department,
      COUNT(s.id)::int as total_students,
      COUNT(CASE WHEN s."isPlaced" = true THEN 1 END)::int as placed_students,
      ROUND(
        (COUNT(CASE WHEN s."isPlaced" = true THEN 1 END)::float / COUNT(s.id)::float) * 100, 
        2
      ) as placement_rate
    FROM "students" s
    GROUP BY s.department
    ORDER BY placement_rate DESC
  `

  // Interview success rates
  const interviewStats = await prisma.$queryRaw`
    SELECT 
      i.type,
      COUNT(*)::int as total_interviews,
      COUNT(CASE WHEN i.result = 'SELECTED' THEN 1 END)::int as successful,
      ROUND(
        (COUNT(CASE WHEN i.result = 'SELECTED' THEN 1 END)::float / COUNT(*)::float) * 100,
        2
      ) as success_rate
    FROM "interviews" i
    WHERE i.status = 'COMPLETED'
    GROUP BY i.type
  `

  return NextResponse.json({
    placementTrends,
    applicationTrends,
    companyStats,
    departmentStats,
    interviewStats
  })
}
