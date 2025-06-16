import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test if tables exist and get counts
    const results = {
      connection: 'success',
      timestamp: new Date().toISOString(),
      tables: {}
    }
    
    try {
      // Test each table
      const userCount = await prisma.user.count()
      results.tables.users = { count: userCount, status: 'exists' }
      console.log(`✅ Users table: ${userCount} records`)
    } catch (error) {
      results.tables.users = { error: error.message, status: 'error' }
      console.log('❌ Users table error:', error.message)
    }
    
    try {
      const adminCount = await prisma.admin.count()
      results.tables.admins = { count: adminCount, status: 'exists' }
      console.log(`✅ Admins table: ${adminCount} records`)
    } catch (error) {
      results.tables.admins = { error: error.message, status: 'error' }
      console.log('❌ Admins table error:', error.message)
    }
    
    try {
      const gameCount = await prisma.game.count()
      results.tables.games = { count: gameCount, status: 'exists' }
      console.log(`✅ Games table: ${gameCount} records`)
    } catch (error) {
      results.tables.games = { error: error.message, status: 'error' }
      console.log('❌ Games table error:', error.message)
    }
    
    // Test a simple query
    try {
      const firstUser = await prisma.user.findFirst({
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      })
      results.sampleUser = firstUser
      console.log('✅ Sample user query successful')
    } catch (error) {
      results.sampleUserError = error.message
      console.log('❌ Sample user query error:', error.message)
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Database test completed',
      data: results
    })
    
  } catch (error: any) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 