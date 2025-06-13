import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const where = userId ? { userId: parseInt(userId) } : {}

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      gameId, 
      gameName, 
      serviceType, 
      packageName, 
      price 
    } = await request.json()

    const order = await prisma.order.create({
      data: {
        userId,
        gameId,
        gameName,
        serviceType,
        packageName,
        price,
        status: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 