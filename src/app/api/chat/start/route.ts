import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify user token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { adminId } = await request.json()

    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 })
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: adminId, isActive: true }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Check if there's already an active session with this admin
    let existingSession = await prisma.chatSession.findFirst({
      where: {
        userId: user.id,
        assignedTo: adminId,
        status: 'active'
      }
    })

    // If no existing session, create a new one
    if (!existingSession) {
      existingSession = await prisma.chatSession.create({
        data: {
          userId: user.id,
          assignedTo: adminId,
          status: 'active'
        }
      })

      // Create initial welcome message
      await prisma.chatMessage.create({
        data: {
          sessionId: existingSession.id,
          content: admin.isOnline 
            ? `Halo ${user.username}! 👋 Saya ${admin.username}, siap membantu Anda. Ada yang bisa saya bantu hari ini?`
            : `Halo ${user.username}! Terima kasih telah menghubungi kami. Admin ${admin.username} sedang offline, tetapi pesan Anda sudah kami terima dan akan segera dibalas ketika admin online. Mohon ditunggu! 🙏`,
          isFromUser: false,
          adminId: adminId,
          messageType: 'text'
        }
      })
    }

    // Get all messages for this session
    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: existingSession.id
      },
      orderBy: { createdAt: 'asc' }
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

    // Format messages for response
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      isFromUser: message.isFromUser,
      adminId: message.adminId,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      createdAt: message.createdAt.toISOString(),
      admin: message.adminId ? admins.find(a => a.id === message.adminId) : null
    }))

    const formattedSession = {
      id: existingSession.id,
      adminId: existingSession.assignedTo,
      status: existingSession.status,
      messages: formattedMessages,
      admin: {
        username: admin.username,
        isOnline: admin.isOnline
      }
    }

    return NextResponse.json({ 
      session: formattedSession,
      message: existingSession ? 'Chat session resumed' : 'New chat session created'
    })

  } catch (error) {
    console.error('Error starting chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 