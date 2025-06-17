import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/lib/auth'

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = 'chat-files'

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const adminId = decoded.id

    const formData = await request.formData()
    const file = formData.get('file') as File
    const sessionIdStr = formData.get('sessionId') as string

    if (!file || !sessionIdStr) {
      return NextResponse.json({ error: 'File and sessionId required' }, { status: 400 })
    }

    const sessionId = parseInt(sessionIdStr)
    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check that admin is assigned or any admin can send

    // Upload to blob
    let fileUrl = ''
    if (connectionString) {
      try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
        const containerClient = blobServiceClient.getContainerClient(containerName)
        await containerClient.createIfNotExists({ access: 'blob' })

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const blobName = `chat/${sessionId}/${uuidv4()}-${sanitizedName}`
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        const buffer = Buffer.from(await file.arrayBuffer())
        await blockBlobClient.uploadData(buffer, { blobHTTPHeaders: { blobContentType: file.type } })
        fileUrl = `/api/uploads/chat/${sessionId}/${blobName.split('/').pop()}`
      } catch (err) {
        console.error('Azure upload error:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
      }
    }

    // Determine message type
    const messageType = file.type.startsWith('image/') ? 'image' : 'file'

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        content: `📎 ${file.name}`,
        isFromUser: false,
        adminId,
        messageType,
        fileUrl,
        fileName: file.name,
        fileSize: file.size
      }
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Admin upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 