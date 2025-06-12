import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrUsername, password } = body;

    // Basic validation
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: 'Email/username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Login user
    const result = await loginUser(emailOrUsername, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Set token in HTTP-only cookie for security
    const response = NextResponse.json(
      { 
        message: 'Login berhasil!',
        user: result.user 
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 