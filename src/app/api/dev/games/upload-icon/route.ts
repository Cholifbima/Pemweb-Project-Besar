import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prismaDev } from '@/lib/prisma-dev'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const gameId = formData.get('gameId') as string

    if (!file || !gameId) {
      return NextResponse.json(
        { error: 'File and game ID are required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Check if game exists
    const game = await prismaDev.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'games')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${gameId}-${timestamp}.${file.name.split('.').pop()}`
    const filePath = join(uploadsDir, fileName)
    const publicPath = `/uploads/games/${fileName}`

    // Write file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Update game icon in database
    const updatedGame = await prismaDev.game.update({
      where: { id: gameId },
      data: { 
        icon: publicPath,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      iconUrl: publicPath,
      game: updatedGame
    })

  } catch (error) {
    console.error('Error uploading icon:', error)
    return NextResponse.json(
      { error: 'Failed to upload icon' },
      { status: 500 }
    )
  }
} 