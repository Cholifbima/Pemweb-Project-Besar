import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Transaction API called')
    
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
    console.log('✅ User found:', user.id, user.username, 'Balance:', user.balance)
    
    const body = await request.json()
    const { type, gameId, itemId, serviceId, amount, userGameId, email } = body

    console.log('📝 Transaction data:', { type, gameId, itemId, serviceId, amount, userGameId, email })

    // Validate required fields
    if (!type || !gameId || !amount || !userGameId || !email) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Data transaksi tidak lengkap' },
        { status: 400 }
      )
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      console.log('❌ Insufficient balance:', user.balance, '<', amount)
      return NextResponse.json(
        { error: `Saldo tidak mencukupi. Saldo Anda: ${formatCurrency(user.balance)}` },
        { status: 400 }
      )
    }

    // Generate transaction ID
    const transactionId = `TRX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    console.log('🆔 Generated transaction ID:', transactionId)

    console.log('🔄 Creating transaction record...')
    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        userId: user.id,
        type: type, // 'topup' or 'boost'
        gameId: gameId,
        itemId: itemId || null,
        serviceId: serviceId || null,
        amount: amount,
        userGameId: userGameId,
        email: email,
        status: 'completed', // Demo: auto complete
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    console.log('✅ Transaction created:', transaction.id)

    // Update user balance
    const newBalance = user.balance - amount
    console.log('💰 Updating user balance:', user.balance, '-', amount, '=', newBalance)
    
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        balance: newBalance,
        totalSpent: (user.totalSpent || 0) + amount
      }
    })

    console.log('✅ User balance updated successfully')

    // Generate invoice data
    const invoice = {
      transactionId: transactionId,
      date: new Date().toISOString(),
      customer: {
        name: user.fullName || user.username,
        email: user.email,
        gameEmail: email,
        gameUserId: userGameId
      },
      transaction: {
        type: type,
        gameId: gameId,
        itemId: itemId,
        serviceId: serviceId,
        amount: amount,
        status: 'completed'
      },
      balance: {
        before: user.balance,
        after: newBalance,
        spent: amount
      }
    }

    console.log('📧 Invoice generated for:', email)

    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil!',
      transaction: {
        id: transactionId,
        type: type,
        amount: amount,
        newBalance: newBalance,
        status: 'completed'
      },
      invoice: invoice
    })

  } catch (error: any) {
    console.error('❌ Transaction error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    })
    
    // Return more specific error messages
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Terjadi konflik data saat memproses transaksi' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
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
      { error: 'Terjadi kesalahan saat memproses transaksi: ' + error.message },
      { status: 500 }
    )
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
} 