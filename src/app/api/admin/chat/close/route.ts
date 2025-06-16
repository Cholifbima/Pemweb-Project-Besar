import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if user is admin
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    // Check if session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Close the session
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        status: 'closed',
        updatedAt: new Date()
      }
    })

    // Add a system message
    await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        content: `Chat session closed by admin: ${admin.username}`,
        isFromUser: false,
        adminId: admin.id
      }
    })

    return NextResponse.json({ message: 'Session closed successfully' })

  } catch (error) {
    console.error('Error closing session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 