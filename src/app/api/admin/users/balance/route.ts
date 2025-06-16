import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Check if user is admin
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const { userId, amount, action } = await request.json()

    if (!userId || !amount || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 })
    }

    if (!['add', 'subtract'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get current user balance
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate new balance
    let newBalance: number
    if (action === 'add') {
      newBalance = user.balance + amount
    } else {
      newBalance = user.balance - amount
      if (newBalance < 0) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
      }
    }

    // Update user balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance }
    })

    // Create a transaction record for admin action
    const transactionId = `TRX${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    await prisma.transaction.create({
      data: {
        id: transactionId,
        userId: userId,
        amount: action === 'add' ? amount : -amount,
        type: action === 'add' ? 'DEPOSIT' : 'ADMIN_ADJUSTMENT',
        status: 'SUCCESS',
        description: `Admin ${action} balance by ${amount}`,
        adminId: admin.id
      }
    })

    return NextResponse.json({ 
      message: 'Balance updated successfully',
      newBalance: updatedUser.balance 
    })

  } catch (error) {
    console.error('Error updating balance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 