import { NextRequest, NextResponse } from 'next/server'
import { getUserFromTokenLegacy } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { adminId: string } }
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
    const adminId = parseInt(params.adminId)

    if (isNaN(adminId)) {
      return NextResponse.json(
        { error: 'Admin ID tidak valid' },
        { status: 400 }
      )
    }

    // Find the most recent chat session with this admin
    const recentSession = await prisma.chatSession.findFirst({
      where: {
        userId: userId,
        assignedTo: adminId
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })

    let recentMessage = null
    let unreadCount = 0

    if (recentSession) {
      // Get the most recent message
      if (recentSession.messages.length > 0) {
        recentMessage = recentSession.messages[0]
      }

      // Count unread messages (messages from admin that user hasn't read)
      try {
        unreadCount = await prisma.chatMessage.count({
          where: {
            sessionId: recentSession.id,
            isFromUser: false,
            isRead: false
          }
        })
      } catch (countError) {
        console.error('Error counting unread messages:', countError)
        unreadCount = 0
      }
    }

    return NextResponse.json({
      success: true,
      recentMessage,
      unreadCount,
      sessionId: recentSession?.id || null
    })

  } catch (error: any) {
    console.error('Error fetching recent messages:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil pesan terbaru' },
      { status: 500 }
    )
  }
} 