import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId)
    
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }

    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Verify that the session exists
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    })

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }

    // Fetch all messages for this session
    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: sessionId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Get admin usernames for admin messages
    const adminIds = messages
      .filter(msg => msg.adminId)
      .map(msg => msg.adminId!)
      .filter((id, index, self) => self.indexOf(id) === index) // unique only

    const admins = await prisma.admin.findMany({
      where: {
        id: { in: adminIds }
      },
      select: {
        id: true,
        username: true
      }
    })

    // Map admin data to messages
    const messagesWithAdmin = messages.map(message => ({
      ...message,
      admin: message.adminId ? admins.find(a => a.id === message.adminId) : null
    }))

    return NextResponse.json({ 
      success: true,
      messages: messagesWithAdmin
    })

  } catch (error) {
    console.error('Error fetching admin messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 