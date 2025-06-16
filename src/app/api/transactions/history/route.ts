import { NextRequest, NextResponse } from 'next/server'
import { getUserFromTokenLegacy } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Transaction history API called')
    
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
    const userResult = await getUserFromTokenLegacy(token)
    if (!userResult.success || !userResult.user) {
      console.log('❌ Invalid token or user not found')
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = userResult.user
    console.log('✅ User found:', user.id, user.username)

    // Get user's transactions with fallback to raw SQL
    let transactions = []
    try {
      transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (findError: any) {
      console.log('⚠️ Prisma findMany failed, trying raw SQL:', findError.message)
      
      // Fallback to raw SQL if Prisma model fails
      try {
        const rawTransactions = await prisma.$queryRaw`
          SELECT id, userId, type, gameId, itemId, serviceId, amount, userGameId, email, status, createdAt, updatedAt
          FROM transactions 
          WHERE userId = ${user.id}
          ORDER BY createdAt DESC
        ` as any[]
        
        transactions = rawTransactions || []
      } catch (rawError: any) {
        console.log('⚠️ Raw SQL also failed, returning empty array:', rawError.message)
        transactions = []
      }
    }

    console.log('📊 Returning transactions:', transactions.length)
    return NextResponse.json({
      success: true,
      transactions: transactions
    })

  } catch (error: any) {
    console.error('❌ Get transactions error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    })
    
    // Return more specific error messages
    if (error.message?.includes('connect') || error.message?.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Tidak dapat terhubung ke database. Silakan coba lagi.' },
        { status: 503 }
      )
    }
    
    if (error.message?.includes('Invalid `prisma.transaction.findMany()` invocation') || 
        error.message?.includes('Unknown field') ||
        error.message?.includes('Cannot read properties of undefined')) {
      return NextResponse.json(
        { error: 'Tabel database belum siap. Silakan hubungi administrator.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil riwayat transaksi: ' + error.message },
      { status: 500 }
    )
  }
} 