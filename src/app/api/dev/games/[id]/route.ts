import { NextRequest, NextResponse } from 'next/server'
import { prismaDev } from '@/lib/prisma-dev'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prismaDev.game.findUnique({
      where: { id: params.id }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields for response
    const gameWithParsedData = {
      ...game,
      topUpItems: game.topUpItems ? JSON.parse(game.topUpItems) : [],
      boostServices: game.boostServices ? JSON.parse(game.boostServices) : []
    }

    return NextResponse.json(gameWithParsedData)
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      description,
      publisher,
      rating,
      isPopular,
      hasTopUp,
      hasBoost,
      topUpItems,
      boostServices,
      icon,
      banner
    } = body

    const game = await prismaDev.game.update({
      where: { id: params.id },
      data: {
        name,
        category,
        description,
        publisher,
        rating: parseFloat(rating) || 4.5,
        isPopular: Boolean(isPopular),
        hasTopUp: Boolean(hasTopUp),
        hasBoost: Boolean(hasBoost),
        topUpItems: topUpItems ? JSON.stringify(topUpItems) : null,
        boostServices: boostServices ? JSON.stringify(boostServices) : null,
        icon,
        banner
      }
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prismaDev.game.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Game deleted successfully' })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    )
  }
} 