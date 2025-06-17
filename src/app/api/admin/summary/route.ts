import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded: any = jwt.verify(token, JWT_SECRET)
    // simple check admin exists
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } })
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 403 })
    }

    const [totalUsers, totalRevenue, liveChats] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.chatSession.count({ where: { status: 'active' } })
    ])

    return NextResponse.json({
      totalUsers,
      revenue: totalRevenue._sum.amount || 0,
      liveChats
    })
  } catch (error) {
    console.error('Summary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 