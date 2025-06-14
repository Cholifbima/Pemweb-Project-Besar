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
    
    // Get current balance using raw SQL
    console.log('🔍 Getting current balance...')
    const balanceResult = await prisma.$queryRaw`
      SELECT balance, totalSpent FROM users WHERE id = ${user.id}
    ` as any[]
    
    const currentBalance = balanceResult[0]?.balance || 0
    const currentTotalSpent = balanceResult[0]?.totalSpent || 0
    
    console.log('✅ User found:', user.id, user.username, 'Balance:', currentBalance)
    
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
    if (currentBalance < amount) {
      console.log('❌ Insufficient balance:', currentBalance, '<', amount)
      return NextResponse.json(
        { error: `Saldo tidak mencukupi. Saldo Anda: ${formatCurrency(currentBalance)}` },
        { status: 400 }
      )
    }

    // Generate transaction ID
    const transactionId = `TRX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    console.log('🆔 Generated transaction ID:', transactionId)

    console.log('🔄 Creating transaction record...')
    // Create transaction record using raw SQL to handle potential table issues
    let transaction
    try {
      transaction = await prisma.transaction.create({
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
    } catch (createError: any) {
      console.log('⚠️ Prisma create failed, trying raw SQL:', createError.message)
      
      // Fallback to raw SQL if Prisma model fails
      await prisma.$executeRaw`
        INSERT INTO transactions (id, userId, type, gameId, itemId, serviceId, amount, userGameId, email, status, createdAt, updatedAt)
        VALUES (${transactionId}, ${user.id}, ${type}, ${gameId}, ${itemId || null}, ${serviceId || null}, ${amount}, ${userGameId}, ${email}, 'completed', GETDATE(), GETDATE())
      `
      
      // Create a mock transaction object for response
      transaction = {
        id: transactionId,
        userId: user.id,
        type: type,
        gameId: gameId,
        itemId: itemId || null,
        serviceId: serviceId || null,
        amount: amount,
        userGameId: userGameId,
        email: email,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    console.log('✅ Transaction created:', transaction.id)

    // Update user balance using raw SQL
    const newBalance = currentBalance - amount
    const newTotalSpent = currentTotalSpent + amount
    console.log('💰 Updating user balance:', currentBalance, '-', amount, '=', newBalance)
    
    await prisma.$executeRaw`
      UPDATE users 
      SET balance = ${newBalance}, totalSpent = ${newTotalSpent}
      WHERE id = ${user.id}
    `

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
        before: currentBalance,
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
    
    if (error.message?.includes('connect') || error.message?.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Tidak dapat terhubung ke database. Silakan coba lagi.' },
        { status: 503 }
      )
    }
    
    if (error.message?.includes('Invalid `prisma.transaction.create()` invocation') || 
        error.message?.includes('Unknown field') ||
        error.message?.includes('Cannot read properties of undefined')) {
      return NextResponse.json(
        { error: 'Tabel database belum siap. Silakan hubungi administrator.' },
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