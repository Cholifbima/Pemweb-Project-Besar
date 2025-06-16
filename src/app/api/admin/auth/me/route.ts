import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Get admin data
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        isOnline: true,
        lastLogin: true,
        lastSeen: true,
        createdAt: true
      }
    })

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Admin not found or inactive' }, { status: 404 })
    }

    // Update lastSeen to maintain online status
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        lastSeen: new Date(),
        isOnline: true // Ensure admin stays online while active
      }
    })

    // Return updated admin data
    const adminData = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      isActive: admin.isActive,
      isOnline: true,
      lastLogin: admin.lastLogin,
      lastSeen: new Date(),
      createdAt: admin.createdAt,
    }

    return NextResponse.json({ admin: adminData })

  } catch (error) {
    console.error('Admin me error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
} 