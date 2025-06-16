import { NextRequest, NextResponse } from 'next/server'
import { getUserFromTokenLegacy } from '@/lib/auth'
import { chatWithAI } from '@/lib/azure-ai'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 AI Chat API called')
    
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
    const userResult = await getUserFromTokenLegacy(token)
    if (!userResult.success || !userResult.user) {
      console.log('❌ Invalid token or user not found')
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = userResult.user
    const { message, chatHistory = [] } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      )
    }

    console.log('🔍 Processing AI chat for user:', user.username)
    console.log('💬 User message:', message)

    // Get AI response
    const aiResponse = await chatWithAI(message, chatHistory)

    if (!aiResponse.success) {
      console.error('❌ AI Chat Error:', aiResponse.error)
      return NextResponse.json(
        { 
          error: 'Layanan AI sedang mengalami gangguan',
          fallbackMessage: 'Maaf, AI sedang tidak tersedia. Silakan hubungi customer service atau coba lagi nanti.' 
        },
        { status: 500 }
      )
    }

    // Save chat to database (optional - for history)
    try {
      // You can implement chat history storage here if needed
      // For now, we'll just log it
      console.log('💾 Chat logged for user:', user.id)
    } catch (dbError) {
      console.warn('⚠️ Failed to save chat history:', dbError)
      // Don't fail the request if chat history save fails
    }

    console.log('✅ AI Response generated successfully')
    
    return NextResponse.json({
      success: true,
      message: aiResponse.message,
      timestamp: new Date().toISOString(),
      usage: aiResponse.usage
    })

  } catch (error: any) {
    console.error('❌ AI Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat memproses chat',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 