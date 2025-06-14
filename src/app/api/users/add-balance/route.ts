import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Add balance API called')
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      console.log('❌ No auth token found')
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    console.log('🔍 Getting user from token...')
    // Get user from token
    const userResult = await getUserFromToken(token)
    if (!userResult.success || !userResult.user) {
      console.log('❌ Invalid token or user not found')
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = userResult.user
    console.log('✅ User found:', user.id, user.username)
    
    const body = await request.json()
    const { amount } = body

    // Validate amount
    if (!amount || amount <= 0) {
      console.log('❌ Invalid amount:', amount)
      return NextResponse.json(
        { error: 'Jumlah saldo tidak valid' },
        { status: 400 }
      )
    }

    // Get current balance using raw SQL (since balance field might not be in Prisma client yet)
    console.log('🔍 Getting current balance...')
    const currentBalanceResult = await prisma.$queryRaw`
      SELECT balance FROM users WHERE id = ${user.id}
    ` as any[]
    
    const currentBalance = currentBalanceResult[0]?.balance || 0
    const newBalance = currentBalance + amount
    console.log('💰 Updating balance:', currentBalance, '+', amount, '=', newBalance)

    // Update user balance using raw SQL
    console.log('🔄 Updating user balance in database...')
    await prisma.$executeRaw`
      UPDATE users 
      SET balance = ${newBalance}
      WHERE id = ${user.id}
    `

    console.log(`✅ Balance updated successfully for user ${user.id}: +${amount} = ${newBalance}`)

    return NextResponse.json({
      success: true,
      message: 'Saldo berhasil ditambah',
      newBalance: newBalance,
      addedAmount: amount
    })

  } catch (error: any) {
    console.error('❌ Add balance error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    })
    
    // Return more specific error messages
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Terjadi konflik data saat menambah saldo' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }
    
    if (error.message?.includes('connect')) {
      return NextResponse.json(
        { error: 'Tidak dapat terhubung ke database' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah saldo: ' + error.message },
      { status: 500 }
    )
  }
} 
      { error: 'Terjadi kesalahan saat menambah saldo: ' + error.message },
      { status: 500 }
    )
  }
} 