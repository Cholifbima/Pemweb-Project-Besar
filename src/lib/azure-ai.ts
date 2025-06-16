import OpenAI from 'openai'
import { AzureKeyCredential } from '@azure/core-auth'
import { DocumentAnalysisClient } from '@azure/ai-form-recognizer'
import { BlobServiceClient } from '@azure/storage-blob'
import { azureConfig } from './azure-config'

// Initialize Azure OpenAI Client using standard OpenAI SDK
export const openaiClient = new OpenAI({
  apiKey: azureConfig.openai.apiKey,
  baseURL: `${azureConfig.openai.endpoint}/openai/deployments/${azureConfig.openai.deploymentName}`,
  defaultQuery: { 'api-version': azureConfig.openai.apiVersion },
  defaultHeaders: {
    'api-key': azureConfig.openai.apiKey,
  },
})

// Initialize Azure Document Intelligence Client
export const documentClient = new DocumentAnalysisClient(
  azureConfig.documentIntelligence.endpoint,
  new AzureKeyCredential(azureConfig.documentIntelligence.apiKey)
)

// Initialize Azure Blob Storage Client
export const blobServiceClient = azureConfig.storage.connectionString
  ? BlobServiceClient.fromConnectionString(azureConfig.storage.connectionString)
  : null

// Gaming Customer Service Knowledge Base
const GAMING_KNOWLEDGE_BASE = `
Anda adalah AI Customer Service untuk DoaIbu Store, platform gaming terpercaya di Indonesia.

INFORMASI LAYANAN:
- Top Up Game: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dll
- Joki Services: Rank boosting untuk berbagai game
- Metode Pembayaran: Saldo virtual (demo), e-wallet, bank transfer
- Proses: 1-5 menit otomatis untuk top up, 1-24 jam untuk joki

FREQUENTLY ASKED QUESTIONS:
1. Cara top up diamond Mobile Legends?
   - Pilih game Mobile Legends
   - Masukkan User ID dan Server ID
   - Pilih paket diamond
   - Bayar dengan saldo atau metode lain

2. Joki aman tidak?
   - Ya, kami menggunakan pro player berpengalaman
   - Account tidak akan di-ban
   - Data login aman dan dihapus setelah selesai

3. Berapa lama proses top up?
   - Top up otomatis: 1-5 menit
   - Jika manual: maksimal 30 menit

4. Refund policy?
   - Refund 100% jika item tidak masuk dalam 24 jam
   - Untuk joki, refund jika target tidak tercapai

5. Customer service jam berapa?
   - AI Chatbot: 24/7
   - Human agent: 09:00-21:00 WIB

TONE: Ramah, profesional, membantu, gunakan emoji gaming yang relevan 🎮
BAHASA: Bahasa Indonesia yang mudah dipahami
RESPONS: Singkat tapi informatif, maksimal 3 paragraf
`

// Chat with AI Assistant
export async function chatWithAI(message: string, chatHistory: any[] = []) {
  try {
    const messages = [
      {
        role: 'system' as const,
        content: GAMING_KNOWLEDGE_BASE
      },
      ...chatHistory.map(chat => ({
        role: chat.role as 'user' | 'assistant',
        content: chat.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    const response = await openaiClient.chat.completions.create({
      model: azureConfig.openai.deploymentName,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9
    })

    return {
      success: true,
      message: response.choices[0]?.message?.content || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.',
      usage: response.usage
    }

  } catch (error: any) {
    console.error('Azure OpenAI Error:', error)
    return {
      success: false,
      message: 'Maaf, layanan AI sedang mengalami gangguan. Silakan coba lagi atau hubungi human agent.',
      error: error.message
    }
  }
}

// Analyze uploaded document
export async function analyzeDocument(fileBuffer: ArrayBuffer, fileName: string) {
  try {
    const analysisResult = await documentClient.beginAnalyzeDocument(
      'prebuilt-read',
      fileBuffer
    )

    const result = await analysisResult.pollUntilDone()
    
    if (!result.content) {
      throw new Error('Tidak dapat menganalisis dokumen')
    }

    // Use AI to understand the document and provide gaming-related help
    const aiAnalysis = await chatWithAI(
      `Saya upload dokumen dengan isi: "${result.content.substring(0, 1000)}..." 
      
      Tolong analisis dokumen ini dan berikan solusi yang relevan dengan layanan gaming DoaIbu Store. 
      Jika ini adalah:
      - Screenshot error game: berikan solusi troubleshooting
      - Bukti transfer: konfirmasi proses pembayaran
      - Screenshot akun game: bantu dengan layanan yang sesuai
      - Dokumen lain: berikan saran yang membantu`
    )

    return {
      success: true,
      extractedText: result.content,
      analysis: aiAnalysis.message,
      fileName
    }

  } catch (error: any) {
    console.error('Document Analysis Error:', error)
    return {
      success: false,
      error: error.message,
      message: 'Maaf, tidak dapat menganalisis dokumen. Pastikan format file didukung (PNG, JPG, PDF).'
    }
  }
}

// Upload file to Azure Blob Storage
export async function uploadChatFile(file: File, userId: string): Promise<{success: boolean, url?: string, error?: string}> {
  try {
    // First try local storage as fallback
    const fs = await import('fs')
    const path = await import('path')
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat', userId)
    
    // Ensure directory exists
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadDir, fileName)
    
    // Save file to local storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    await fs.promises.writeFile(filePath, buffer)
    
    // Return local URL
    const localUrl = `/uploads/chat/${userId}/${fileName}`
    
    console.log('✅ File uploaded locally:', localUrl)
    
    return {
      success: true,
      url: localUrl
    }

  } catch (error: any) {
    console.error('File Upload Error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Generate AI response for post-transaction support
export async function getPostTransactionSupport(transactionData: any) {
  const message = `
  Transaksi berhasil untuk ${transactionData.gameId} senilai ${transactionData.amount}.
  User ID: ${transactionData.userGameId}
  
  Berikan pesan selamat yang ramah dan tanyakan apakah ada yang bisa dibantu lebih lanjut.
  Sertakan tips berguna tentang game yang dibeli.
  `

  return await chatWithAI(message)
} 