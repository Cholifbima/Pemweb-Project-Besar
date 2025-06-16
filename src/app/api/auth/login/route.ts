import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login endpoint called');
    
    const body = await request.json();
    const { emailOrUsername, password } = body;
    
    console.log('📝 Login attempt for:', emailOrUsername);

    // Basic validation
    if (!emailOrUsername || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { error: 'Email/username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Test database connection first
    try {
      console.log('🔍 Testing database connection...');
      await prisma.$connect();
      console.log('✅ Database connection successful');
      
      // Test if users table exists
      const userCount = await prisma.user.count();
      console.log(`📊 Users table has ${userCount} records`);
      
    } catch (dbError: any) {
      console.error('❌ Database connection/table error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError.message,
          suggestion: 'Please check if database tables are created'
        },
        { status: 500 }
      );
    }

    // Login user
    console.log('🔐 Attempting login...');
    const result = await loginUser(emailOrUsername, password);
    
    console.log('🔐 Login result:', { success: result.success, error: result.error });

    if (!result.success || !result.token) {
      return NextResponse.json(
        { error: result.error || 'Login gagal' },
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

    console.log('✅ Login successful for:', emailOrUsername);
    return response;

  } catch (error: any) {
    console.error('❌ Login endpoint error:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan server',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 