import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { getUserFromToken } = await import('@/lib/auth');

    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Tidak ada token autentikasi' },
        { status: 401 }
      );
    }

    // Get user from token
    const result = await getUserFromToken(token);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { user: result.user },
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