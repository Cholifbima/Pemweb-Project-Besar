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

    const { sessionId, content, messageType = 'text' } = await request.json()

    if (!sessionId || !content) {
      return NextResponse.json({ error: 'Session ID and content are required' }, { status: 400 })
    }

    // Check if session exists and belongs to user
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
        status: 'active'
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found or inactive' }, { status: 404 })
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        content: content.trim(),
        isFromUser: true,
        messageType: messageType
      }
    })

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    })

    // Format message for response
    const formattedMessage = {
      id: message.id,
      content: message.content,
      isFromUser: message.isFromUser,
      adminId: message.adminId,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      createdAt: message.createdAt.toISOString(),
      admin: null // No admin for user messages
    }

    return NextResponse.json({ 
      message: formattedMessage,
      status: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 