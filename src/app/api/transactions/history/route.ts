import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    // Get user from token
    const userResult = await getUserFromToken(token)
    if (!userResult.success) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = userResult.user

    // Get user's transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      transactions: transactions
    })

  } catch (error: any) {
    console.error('Transaction history error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil riwayat transaksi' },
      { status: 500 }
    )
  }
} 