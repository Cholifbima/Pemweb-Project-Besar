import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Validate token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded: any = jwt.verify(token, JWT_SECRET)

    // Ensure admin exists
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } })
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const sessionId = parseInt(params.sessionId)
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }

    // Verify session exists
    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
    if (!session) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }

    // Mark unread customer messages as read
    const updateResult = await prisma.chatMessage.updateMany({
      where: {
        sessionId: sessionId,
        isFromUser: true,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    console.log(`✅ Admin ${admin.username} marked ${updateResult.count} messages as read for session ${sessionId}`)

    return NextResponse.json({ success: true, markedAsRead: updateResult.count })

  } catch (error: any) {
    console.error('Error marking messages as read (admin):', error)
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 })
  }
} 