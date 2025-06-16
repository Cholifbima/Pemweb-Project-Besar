import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Fetch all active admins with their online status
    const admins = await prisma.admin.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        username: true,
        role: true,
        isOnline: true,
        lastSeen: true,
        lastLogin: true
      },
      orderBy: [
        { isOnline: 'desc' }, // Online admins first
        { lastSeen: 'desc' },  // Then by last seen
        { username: 'asc' }    // Then alphabetically
      ]
    })

    // Format the response
    const formattedAdmins = admins.map(admin => ({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      isOnline: admin.isOnline,
      lastSeen: admin.lastSeen?.toISOString() || null
    }))

    return NextResponse.json({ 
      admins: formattedAdmins,
      total: formattedAdmins.length,
      online: formattedAdmins.filter(a => a.isOnline).length
    })

  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 