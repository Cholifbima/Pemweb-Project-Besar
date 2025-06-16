import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { getUserFromTokenLegacy } = await import('@/lib/auth');
    const { prisma } = await import('@/lib/db');

    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Tidak ada token autentikasi' },
        { status: 401 }
      );
    }

    // Get user from token
    const result = await getUserFromTokenLegacy(token);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'User tidak ditemukan' },
        { status: 401 }
      );
    }

    // Get balance and totalSpent using raw SQL
    let balance = 1000000; // Default balance
    let totalSpent = 0;
    
    try {
      const balanceResult = await prisma.$queryRaw`
        SELECT balance, totalSpent FROM users WHERE id = ${result.user.id}
      ` as any[];
      
      if (balanceResult && balanceResult.length > 0) {
        balance = balanceResult[0].balance || 1000000;
        totalSpent = balanceResult[0].totalSpent || 0;
      }
    } catch (dbError) {
      console.log('Using default balance values due to DB error:', dbError);
    }

    // Return user with balance
    const userWithBalance = {
      ...result.user,
      balance: balance,
      totalSpent: totalSpent
    };

    return NextResponse.json(
      { user: userWithBalance },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 