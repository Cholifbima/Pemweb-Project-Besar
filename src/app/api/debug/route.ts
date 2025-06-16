import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const debug = {
      nodeEnv: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      databaseUrlStart: process.env.DATABASE_URL?.substring(0, 20) + '...',
      timestamp: new Date().toISOString(),
      platform: 'Azure App Service'
    }

    return NextResponse.json({
      status: 'success',
      message: 'Debug endpoint working!',
      debug
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 