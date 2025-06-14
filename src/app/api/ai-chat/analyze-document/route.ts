import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { analyzeDocument, uploadChatFile } from '@/lib/azure-ai'

export async function POST(request: NextRequest) {
  try {
    console.log('📄 Document Analysis API called')
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      console.log('❌ No auth token found')
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    // Get user from token
    const userResult = await getUserFromToken(token)
    if (!userResult.success || !userResult.user) {
      console.log('❌ Invalid token or user not found')
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = userResult.user
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Gunakan JPG, PNG, atau PDF.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 10MB.' },
        { status: 400 }
      )
    }

    console.log(`📤 Processing file: ${file.name} (${file.type}, ${file.size} bytes)`)

    // Upload file to Azure Blob Storage
    const uploadResult = await uploadChatFile(file, user.id.toString())
    
    if (!uploadResult.success) {
      console.error('❌ File upload failed:', uploadResult.error)
      return NextResponse.json(
        { error: 'Gagal mengupload file' },
        { status: 500 }
      )
    }

    // Analyze document with Azure Document Intelligence
    const fileBuffer = await file.arrayBuffer()
    const analysisResult = await analyzeDocument(fileBuffer, file.name)

    if (!analysisResult.success) {
      console.error('❌ Document analysis failed:', analysisResult.error)
      return NextResponse.json(
        { 
          error: 'Gagal menganalisis dokumen',
          message: analysisResult.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Document analyzed successfully')

    return NextResponse.json({
      success: true,
      fileUrl: uploadResult.url,
      analysis: {
        extractedText: analysisResult.extractedText,
        aiResponse: analysisResult.analysis,
        fileName: file.name
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Document Analysis API error:', error)
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menganalisis dokumen',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 