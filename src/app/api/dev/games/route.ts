import { NextRequest, NextResponse } from 'next/server'
import { prismaDev } from '@/lib/prisma-dev'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const whereClause = {
      isActive: true,
      ...(category && { 
        OR: [
          { category: category },
          { category: 'both' }
        ]
      })
    }
    
    const games = await prismaDev.game.findMany({
      where: whereClause,
      orderBy: [
        { isPopular: 'desc' },
        { name: 'asc' }
      ]
    })

    // Parse JSON fields for response
    const gamesWithParsedData = games.map(game => ({
      ...game,
      topUpItems: game.topUpItems ? JSON.parse(game.topUpItems) : [],
      boostServices: game.boostServices ? JSON.parse(game.boostServices) : []
    }))

    return NextResponse.json(gamesWithParsedData)
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
    const body = await request.json()
    const {
      id,
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

    const game = await prismaDev.game.create({
      data: {
        id,
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
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
} 