import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
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
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = userResult.user
    const body = await request.json()
    const { amount } = body

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Jumlah saldo tidak valid' },
        { status: 400 }
      )
    }

    // Calculate new balance
    const newBalance = user.balance + amount

    // Update user balance in database
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        balance: newBalance
      }
    })

    console.log(`💰 Balance added for user ${user.id}: +${amount} = ${newBalance}`)

    return NextResponse.json({
      success: true,
      message: 'Saldo berhasil ditambah',
      newBalance: newBalance,
      addedAmount: amount
    })

  } catch (error: any) {
    console.error('Add balance error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah saldo' },
      { status: 500 }
    )
  }
} 