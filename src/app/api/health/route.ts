import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // During build time or static generation, skip database check
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.startsWith('sqlserver://')) {
      return NextResponse.json({
        status: 'healthy',
        database: 'skipped_during_build',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        note: 'Database check skipped during build/static generation'
      })
    }

    // Only import and use prisma during runtime with proper database URL
    const { prisma } = await import('@/lib/db')
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1 as test`
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
} 