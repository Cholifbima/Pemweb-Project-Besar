import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if user is admin
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get transactions in date range
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'SUCCESS'
      },
      select: {
        amount: true,
        createdAt: true,
        type: true
      }
    })

    // Calculate overview stats
    const totalSales = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalTransactions = transactions.length
    const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0

    // Generate sales trend data
    const salesTrend = []
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayTransactions = transactions.filter(t => 
        t.createdAt >= dayStart && t.createdAt <= dayEnd && t.amount > 0
      )
      
      salesTrend.push({
        date: dayStart.toISOString().split('T')[0],
        amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
        transactions: dayTransactions.length
      })
    }

    // Mock top products data (since we don't have products table yet)
    const topProducts = [
      { name: 'Mobile Legends Diamonds', sales: 45, revenue: 2250000 },
      { name: 'Free Fire Diamonds', sales: 38, revenue: 1900000 },
      { name: 'PUBG UC', sales: 32, revenue: 1600000 },
      { name: 'Genshin Impact Genesis', sales: 28, revenue: 1400000 },
      { name: 'Valorant Points', sales: 22, revenue: 1100000 }
    ]

    // Generate user growth data
    const userGrowth = []
    for (let i = 3; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      const totalUsersAtTime = await prisma.user.count({
        where: {
          createdAt: {
            lte: monthEnd
          }
        }
      })
      
      userGrowth.push({
        month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        newUsers,
        totalUsers: totalUsersAtTime
      })
    }

    const analyticsData = {
      overview: {
        totalSales,
        totalUsers,
        totalTransactions,
        averageOrderValue
      },
      salesTrend,
      topProducts,
      userGrowth
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 