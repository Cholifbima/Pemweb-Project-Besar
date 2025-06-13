import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, fullName, phoneNumber } = body;

    // Basic validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Username validation
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      );
    }

    // Register user
    const result = await registerUser({
      email,
      username,
      password,
      fullName,
      phoneNumber,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Generate JWT token for auto-login
    const token = generateToken({
      id: result.user!.id,
      email: result.user!.email,
      username: result.user!.username,
    });

    // Create response with user data
    const response = NextResponse.json(
      { 
        message: 'Registrasi berhasil! Saldo demo Rp 1.000.000 telah ditambahkan ke akun Anda.',
        user: result.user 
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for authentication
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
} 