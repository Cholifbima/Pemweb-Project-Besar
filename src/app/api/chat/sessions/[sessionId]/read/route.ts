import { NextRequest, NextResponse } from 'next/server'
import { getUserFromTokenLegacy } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    // Get user from token
    const userResult = await getUserFromTokenLegacy(token)
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const userId = userResult.user.id
    const sessionId = parseInt(params.sessionId)

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'Session ID tidak valid' },
        { status: 400 }
      )
    }

    // Verify the session belongs to the user
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: userId
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session tidak ditemukan' },
        { status: 404 }
      )
    }

    // Mark all unread messages from admin as read
    const updateResult = await prisma.chatMessage.updateMany({
      where: {
        sessionId: sessionId,
        isFromUser: false,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    console.log(`✅ Marked ${updateResult.count} messages as read for session ${sessionId}`)

    return NextResponse.json({
      success: true,
      markedAsRead: updateResult.count
    })

  } catch (error: any) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Gagal menandai pesan sebagai dibaca' },
      { status: 500 }
    )
  }
} 