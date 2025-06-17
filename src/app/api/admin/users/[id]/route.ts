import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JWT_SECRET } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const userId = Number(id)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 })
    }

    // auth admin
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } })
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // delete user (cascade takes care of relations)
    await prisma.user.delete({ where: { id: userId } })

    return NextResponse.json({ success: true, message: 'User deleted' })
  } catch (err) {
    console.error('Delete user error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 