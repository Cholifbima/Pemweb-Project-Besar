import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'
import { parseISO, startOfDay, endOfDay } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const dateParam = searchParams.get('date') // optional YYYY-MM-DD to filter by specific day

    const limit = limitParam ? Number(limitParam) : 100 // default 100

    // auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } })
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const whereClause: any = {}
    if (dateParam) {
      const date = parseISO(dateParam)
      whereClause.createdAt = {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    }

    const txs = await prisma.transaction.findMany({
      where: {
        ...whereClause,
        gameId: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { username: true } } }
    })

    const formatted = txs.map(o => ({
      id: o.id,
      user: o.user?.username || 'Unknown',
      product: o.description || o.gameId,
      total: o.amount,
      status: o.status,
      date: o.createdAt
    }))

    return NextResponse.json({ success: true, orders: formatted })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 