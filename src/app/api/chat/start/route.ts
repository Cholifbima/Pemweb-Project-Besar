import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify user token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
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
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            admin: {
              select: { username: true }
            }
          }
        },
        admin: {
          select: { username: true, isOnline: true }
        }
      }
    })

    // If no existing session, create a new one
    if (!existingSession) {
      existingSession = await prisma.chatSession.create({
        data: {
          userId: user.id,
          assignedTo: adminId,
          status: 'active'
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              admin: {
                select: { username: true }
              }
            }
          },
          admin: {
            select: { username: true, isOnline: true }
          }
        }
      })

      // Create initial welcome message
      const welcomeMessage = await prisma.chatMessage.create({
        data: {
          sessionId: existingSession.id,
          content: admin.isOnline 
            ? `Halo ${user.username}! 👋 Saya ${admin.username}, siap membantu Anda. Ada yang bisa saya bantu hari ini?`
            : `Halo ${user.username}! Terima kasih telah menghubungi kami. Admin ${admin.username} sedang offline, tetapi pesan Anda sudah kami terima dan akan segera dibalas ketika admin online. Mohon ditunggu! 🙏`,
          isFromUser: false,
          adminId: adminId,
          messageType: 'text'
        },
        include: {
          admin: {
            select: { username: true }
          }
        }
      })

      // Add welcome message to session
      existingSession.messages = [welcomeMessage]
    }

    // Format messages for response
    const formattedMessages = existingSession.messages.map(message => ({
      id: message.id,
      content: message.content,
      isFromUser: message.isFromUser,
      adminId: message.adminId,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      createdAt: message.createdAt.toISOString(),
      admin: message.admin
    }))

    const formattedSession = {
      id: existingSession.id,
      adminId: existingSession.assignedTo,
      status: existingSession.status,
      messages: formattedMessages,
      admin: existingSession.admin
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