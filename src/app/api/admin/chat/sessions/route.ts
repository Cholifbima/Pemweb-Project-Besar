import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Fetch all chat sessions with messages
    const sessions = await prisma.chatSession.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          select: {
            id: true,
            content: true,
            isFromUser: true,
            isRead: true,
            messageType: true,
            fileUrl: true,
            fileName: true,
            fileSize: true,
            createdAt: true,
            adminId: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Format the response
    const formattedSessions = sessions.map(session => {
      // Count unread messages from customer
      const unreadCount = session.messages.filter(msg => msg.isFromUser && !msg.isRead).length
      
      return {
        id: session.id,
        userId: session.userId,
        user: {
          ...session.user,
          isOnline: false // Default for now, can be updated with real status
        },
        status: session.status,
        assignedTo: session.assignedTo,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        unreadCount: unreadCount,
        messages: session.messages.map(message => ({
          id: message.id,
          content: message.content,
          isFromUser: message.isFromUser,
          messageType: message.messageType || 'text',
          fileUrl: message.fileUrl,
          fileName: message.fileName,
          fileSize: message.fileSize,
          createdAt: message.createdAt.toISOString(),
          adminId: message.adminId,
          isRead: message.isRead
        }))
      }
    })

    return NextResponse.json({ sessions: formattedSessions })

  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 