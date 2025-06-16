import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const blobPath = params.path.join('/')
    console.log('📁 Attempting to fetch file:', blobPath)
    
    // First, try local file system
    const fs = require('fs')
    const path = require('path')
    const localPath = path.join(process.cwd(), 'public', 'uploads', ...params.path)
    
    if (fs.existsSync(localPath)) {
      console.log('📁 Serving file from local storage:', localPath)
      
      const buffer = fs.readFileSync(localPath)
      const filename = params.path[params.path.length - 1]
      
      // Determine content type
      let contentType = 'application/octet-stream'
      if (filename.match(/\.(jpg|jpeg)$/i)) contentType = 'image/jpeg'
      else if (filename.match(/\.png$/i)) contentType = 'image/png'
      else if (filename.match(/\.gif$/i)) contentType = 'image/gif'
      else if (filename.match(/\.webp$/i)) contentType = 'image/webp'
      else if (filename.match(/\.pdf$/i)) contentType = 'application/pdf'
      
      const headers = new Headers()
      headers.set('Content-Type', contentType)
      headers.set('Content-Length', buffer.length.toString())
      headers.set('Cache-Control', 'public, max-age=31536000')
      
      if (request.nextUrl.searchParams.get('download') === 'true') {
        headers.set('Content-Disposition', `attachment; filename="${filename}"`)
      }
      
      console.log('✅ Local file served successfully:', localPath)
      return new NextResponse(buffer, { headers })
    }
    
    // If not found locally, try Azure Blob Storage
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING!
      )
      
      const containerClient = blobServiceClient.getContainerClient('chat-files')
      
      console.log('📁 Fetching file from Azure:', blobPath)
      
      const blobClient = containerClient.getBlobClient(blobPath)
      
      // Check if blob exists
      const exists = await blobClient.exists()
      if (!exists) {
        console.log('❌ File not found in Azure:', blobPath)
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
      
      // Get blob properties for content type
      const properties = await blobClient.getProperties()
      
      // Download blob
      const downloadResponse = await blobClient.download()
      
      if (!downloadResponse.readableStreamBody) {
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
      }
      
      // Convert Node.js stream to buffer
      const chunks: Buffer[] = []
      const stream = downloadResponse.readableStreamBody
      
      // Handle Node.js readable stream
      for await (const chunk of stream) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
      }
      
      const buffer = Buffer.concat(chunks)
      
      // Set appropriate headers
      const headers = new Headers()
      headers.set('Content-Type', properties.contentType || 'application/octet-stream')
      headers.set('Content-Length', buffer.length.toString())
      headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
      
      // Extract filename from path for download
      const filename = params.path[params.path.length - 1]
      if (request.nextUrl.searchParams.get('download') === 'true') {
        headers.set('Content-Disposition', `attachment; filename="${filename}"`)
      }
      
      console.log('✅ Azure file served successfully:', blobPath)
      
      return new NextResponse(buffer, { headers })
    }
    
    // File not found anywhere
    console.log('❌ File not found in local or Azure storage:', blobPath)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
    
  } catch (error) {
    console.error('❌ Error serving file:', error)
    return NextResponse.json(
      { error: 'Failed to serve file' }, 
      { status: 500 }
    )
  }
} 