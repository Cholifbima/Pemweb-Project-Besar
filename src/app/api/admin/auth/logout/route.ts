import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get admin ID from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Update admin status to offline
    await prisma.admin.update({
      where: { id: decoded.adminId },
      data: {
        isOnline: false,
        lastSeen: new Date()
      }
    })

    console.log(`👤 Admin ${decoded.username} logged out and set to offline`)

    // In a real implementation, you would broadcast this status change via SignalR
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })

  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 