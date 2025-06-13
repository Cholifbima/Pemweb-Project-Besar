import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, name, category, icon } = await request.json()

    const game = await prisma.game.create({
      data: {
        id,
        name,
        category,
        icon,
        isActive: true
      }
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
} 