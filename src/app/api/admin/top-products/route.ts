import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit') || '100') // default 100

    // auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } })
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const products = await prisma.transaction.groupBy({
      by: ['gameId', 'description'],
      _count: { _all: true },
      _sum: { amount: true },
      where: { gameId: { not: null } },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit
    })

    const formatted = products.map(p => ({
      id: p.gameId,
      name: p.description || p.gameId,
      sales: p._count._all,
      revenue: Number(p._sum.amount || 0)
    }))

    return NextResponse.json({ success: true, products: formatted })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 