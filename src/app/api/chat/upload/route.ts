import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = 'chat-files'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Chat file upload request received')

    // Verify user authentication
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const sessionId = formData.get('sessionId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'No session ID provided' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip', 'application/x-rar-compressed'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed. Supported: Images, PDF, Word, Excel, ZIP, RAR' 
      }, { status: 400 })
    }

    console.log(`📁 File details: ${file.name} (${file.type}, ${file.size} bytes)`)

    // Verify chat session exists and user has access
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: parseInt(sessionId),
        userId: user.id,
        status: 'active'
      }
    })

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found or access denied' }, { status: 404 })
    }

    let fileUrl = ''

    if (connectionString) {
      try {
        // Azure Blob Storage upload
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
        const containerClient = blobServiceClient.getContainerClient(containerName)

        // Ensure container exists (without public access)
        await containerClient.createIfNotExists()

        // Generate unique filename
        const fileExtension = file.name.split('.').pop()
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const uniqueFileName = `${uuidv4()}-${sanitizedName}`
        const blobName = `chat/${chatSession.id}/${uniqueFileName}`

        const blockBlobClient = containerClient.getBlockBlobClient(blobName)

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Azure Blob Storage
        await blockBlobClient.upload(buffer, buffer.length, {
          blobHTTPHeaders: {
            blobContentType: file.type
          }
        })

        // Use our API route for serving files instead of direct Azure URL
        fileUrl = `/api/uploads/chat/${chatSession.id}/${uniqueFileName}`
        console.log(`☁️ File uploaded to Azure, accessible via: ${fileUrl}`)

      } catch (azureError) {
        console.error('Azure upload error:', azureError)
        // Fallback: save file locally (for development)
        const fs = require('fs')
        const path = require('path')
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat', sessionId)
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        // Sanitize filename to avoid URL encoding issues
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const fileName = `${Date.now()}-${sanitizedName}`
        const filePath = path.join(uploadDir, fileName)
        
        // Convert file to buffer and save locally
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFileSync(filePath, buffer)
        
        fileUrl = `/uploads/chat/${sessionId}/${fileName}`
        console.log(`💾 Azure failed, file saved locally: ${fileUrl}`)
      }
    } else {
      // Local storage fallback for development
      const fs = require('fs')
      const path = require('path')
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat', sessionId)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      // Sanitize filename to avoid URL encoding issues
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${Date.now()}-${sanitizedName}`
      const filePath = path.join(uploadDir, fileName)
      
      // Convert file to buffer and save locally
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(filePath, buffer)
      
      fileUrl = `/uploads/chat/${sessionId}/${fileName}`
      console.log(`💾 Using local storage (development): ${fileUrl}`)
    }

    // Determine message type based on file type
    let messageType: 'file' | 'image' = 'file'
    if (file.type.startsWith('image/')) {
      messageType = 'image'
    }

    // Save message to database
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: parseInt(sessionId),
        content: `📎 ${file.name}`,
        isFromUser: true,
        messageType: messageType,
        fileUrl: fileUrl,
        fileName: file.name, // Keep original filename for display
        fileSize: file.size
      },
      include: {
        admin: {
          select: {
            username: true
          }
        }
      }
    })

    console.log(`💾 Message saved to database: ${message.id}`)

    // In a real implementation, you would broadcast this via SignalR
    // For now, we'll just return the message
    const responseMessage = {
      id: message.id,
      content: message.content,
      isFromUser: message.isFromUser,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      createdAt: message.createdAt.toISOString(),
      admin: message.admin
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      fileUrl: fileUrl
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 