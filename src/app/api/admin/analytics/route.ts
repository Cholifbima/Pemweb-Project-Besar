import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'
import { subDays, startOfMonth, format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d' // 7d,30d,365d
    const days = range === '7d' ? 7 : range === '365d' ? 365 : 30

    // auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } })
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const since = subDays(new Date(), days)
    const previousSince = subDays(since, days)

    const [totalUsers, newUsers, totalOrders, totalRevenueAgg, liveChats, topProductsRaw, recentOrdersRaw, successfulTx] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.transaction.count({ where: { createdAt: { gte: since } } }),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.chatSession.count({ where: { status: 'active' } }),
      prisma.transaction.groupBy({
        by: ['gameId', 'description'],
        _count: { _all: true },
        _sum: { amount: true },
        where: { gameId: { not: null } },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5
      }),
      prisma.transaction.findMany({
        where: { gameId: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { username: true } } }
      }),
      prisma.transaction.count({ where: { status: { in: ['completed', 'SUCCESS'] } } })
    ])

    const [prevRevenueAgg, prevOrdersCnt, prevUsersCnt, prevSuccessfulTx] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: previousSince, lt: since } } }),
      prisma.transaction.count({ where: { createdAt: { gte: previousSince, lt: since } } }),
      prisma.user.count({ where: { createdAt: { gte: previousSince, lt: since } } }),
      prisma.transaction.count({ where: { createdAt: { gte: previousSince, lt: since }, status: { in:['completed','SUCCESS'] } } })
    ])

    const prevRevenue = Number(prevRevenueAgg._sum.amount || 0)
    const revenueChange = prevRevenue === 0 ? 0 : Number((((Number(totalRevenueAgg._sum.amount||0) - prevRevenue) / prevRevenue) *100).toFixed(1))

    const ordersChange = prevOrdersCnt === 0 ? 0 : Number((((totalOrders - prevOrdersCnt)/ prevOrdersCnt)*100).toFixed(1))
    const usersChange = prevUsersCnt === 0 ? 0 : Number((((newUsers - prevUsersCnt)/ prevUsersCnt)*100).toFixed(1))
    const prevConv = prevUsersCnt===0?0: (prevSuccessfulTx/ (totalUsers - newUsers + prevUsersCnt))*100
    const conversionChange = prevConv ===0?0: Number(((Number(successfulTx / totalUsers) * 100 - prevConv)/ prevConv*100).toFixed(1))

    // monthly revenue for last 6 months
    const now = new Date()
    const months: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subDays(now, i * 30))
      const nextMonth = startOfMonth(subDays(now, (i - 1) * 30))
      const agg = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: {
            gte: monthStart,
            lt: nextMonth
          }
        }
      })
      months.push({ label: format(monthStart, 'MMM'), value: Number(agg._sum.amount || 0) })
    }

    // format top products
    const topProducts = topProductsRaw.map(tp => ({
      id: tp.gameId,
      name: tp.description || tp.gameId,
      sales: tp._count._all,
      amount: Number(tp._sum.amount || 0)
    }))

    // format recent orders
    const recentOrders = recentOrdersRaw.map(ro => ({
      id: ro.id,
      user: ro.user?.username || 'Unknown',
      product: ro.description || ro.gameId,
      total: ro.amount,
      date: ro.createdAt
    }))

    const conversionRate = totalUsers === 0 ? 0 : Number(((successfulTx / totalUsers) * 100).toFixed(2))

    return NextResponse.json({
      totalUsers,
      newUsers,
      totalOrders,
      totalRevenue: Number(totalRevenueAgg._sum.amount || 0),
      liveChats,
      monthlyRevenue: months,
      topProducts,
      recentOrders,
      conversionRate,
      changes:{revenue:revenueChange,orders:ordersChange,users:usersChange,conversion:conversionChange}
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 