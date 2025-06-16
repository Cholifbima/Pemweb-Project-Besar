import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update admin status to online
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isOnline: true,
        lastSeen: new Date()
      }
    })

    console.log(`👤 Admin ${admin.username} logged in and set to online`)

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        username: admin.username, 
        role: admin.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    // Return admin data without password
    const { password: _, ...adminData } = admin

    return NextResponse.json({
      admin: {
        ...adminData,
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      token
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 