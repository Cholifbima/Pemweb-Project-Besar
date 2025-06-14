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
    const { type, gameId, itemId, serviceId, amount, userGameId, email } = body

    // Validate required fields
    if (!type || !gameId || !amount || !userGameId || !email) {
      return NextResponse.json(
        { error: 'Data transaksi tidak lengkap' },
        { status: 400 }
      )
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return NextResponse.json(
        { error: `Saldo tidak mencukupi. Saldo Anda: ${formatCurrency(user.balance)}` },
        { status: 400 }
      )
    }

    // Generate transaction ID
    const transactionId = `TRX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

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

    // Update user balance
    const newBalance = user.balance - amount
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        balance: newBalance,
        totalSpent: (user.totalSpent || 0) + amount
      }
    })

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

    // In a real app, you would send email here
    // For demo, we'll just return the invoice data
    console.log('📧 Invoice would be sent to:', email)
    console.log('📄 Invoice data:', invoice)

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
    console.error('Transaction error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses transaksi' },
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