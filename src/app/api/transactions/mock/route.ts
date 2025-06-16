import { NextRequest, NextResponse } from 'next/server'
import { getUserFromTokenLegacy } from '@/lib/auth'
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
    const userResult = await getUserFromTokenLegacy(token)
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

    // Get current balance using raw SQL (mock check)
    let mockBalance = 1000000 // Default 1M for demo
    try {
      const balanceResult = await prisma.$queryRaw`
        SELECT balance FROM users WHERE id = ${user.id}
      ` as any[]
      mockBalance = balanceResult[0]?.balance || 1000000
    } catch (error) {
      console.log('Using default balance for mock transaction')
    }
    
    if (mockBalance < amount) {
      return NextResponse.json(
        { error: `Saldo tidak mencukupi. Saldo Anda: ${formatCurrency(mockBalance)}` },
        { status: 400 }
      )
    }

    // Generate transaction ID
    const transactionId = `TRX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Mock transaction processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Calculate new balance
    const newBalance = mockBalance - amount

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
        before: mockBalance,
        after: newBalance,
        spent: amount
      }
    }

    // Log for demo purposes
    console.log('📧 Mock Invoice generated for:', email)
    console.log('📄 Mock Invoice data:', invoice)

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
    console.error('Mock Transaction error:', error)
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