import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req); if ('error' in auth) return auth.error
  const facultyId = params.id
  const body = await req.json().catch(() => ({})) as { studentIds?: string[]; action?: 'assign' | 'unassign' }
  const { studentIds = [], action = 'assign' } = body

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return NextResponse.json({ error: 'studentIds required' }, { status: 400 })
  }

  try {
    const updates = await Promise.all(studentIds.map(async (sid) => {
      if (action === 'assign') {
        return prisma.student.updateMany({ where: { id: sid }, data: { mentorId: facultyId } })
      } else {
        // unassign only if mentorId matches
        return prisma.student.updateMany({ where: { id: sid, mentorId: facultyId }, data: { mentorId: null } })
      }
    }))

    const totalUpdated = updates.reduce((acc, u) => acc + (u.count ?? 0), 0)
    return NextResponse.json({ updated: totalUpdated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update assignments' }, { status: 500 })
  }
}
