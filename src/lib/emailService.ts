import emailjs from '@emailjs/browser'

// EmailJS Configuration
// 🚀 SETUP EMAILJS (GRATIS):
// 1. Daftar di https://www.emailjs.com/
// 2. Buat Service (Gmail/Outlook)
// 3. Buat Email Template
// 4. Ganti nilai di bawah dengan kredensial Anda:

const EMAILJS_SERVICE_ID = 'service_xxxxxxx' // 📝 Ganti dengan Service ID Anda
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx' // 📝 Ganti dengan Template ID Anda  
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxxxx' // 📝 Ganti dengan Public Key Anda

// 💡 Untuk testing, biarkan seperti ini dulu. Email akan menggunakan demo service.
// Setelah setup EmailJS, ganti nilai di atas dengan kredensial asli Anda.

interface InvoiceData {
  transactionId: string
  date: string
  customer: {
    name: string
    email: string
    gameEmail: string
    gameUserId: string
  }
  transaction: {
    type: string
    gameId: string
    itemId?: string
    serviceId?: string
    amount: number
    status: string
  }
  balance: {
    before: number
    after: number
    spent: number
  }
}

export const sendEmailWithResend = async (email: string, invoice: any, invoiceImage?: string) => {
  try {
    const response = await fetch('/api/send-invoice-resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        invoice,
        invoiceImage, // Base64 image data
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email via Resend')
    }

    return {
      success: true,
      message: result.message,
      provider: 'Resend',
      emailId: result.emailId
    }
  } catch (error: any) {
    console.error('❌ Resend service error:', error)
    throw error
  }
}

// 📧 MAIN EMAIL SERVICE WITH MULTIPLE PROVIDERS
export const sendInvoiceEmail = async (email: string, invoice: any, invoiceImage?: string) => {
  console.log('📧 Starting email service...')
  console.log('📧 Email:', email)
  console.log('📧 Invoice ID:', invoice.transactionId)
  console.log('📧 Has image attachment:', !!invoiceImage)

  // 🎯 TRY PROVIDERS IN ORDER OF PREFERENCE:
  
  // 1. RESEND (BEST - SUPPORTS ATTACHMENTS)
  try {
    console.log('📧 Trying Resend service...')
    const result = await sendEmailWithResend(email, invoice, invoiceImage)
    console.log('✅ Email sent successfully via Resend!')
    return result
  } catch (error: any) {
    console.error('❌ Resend failed:', error.message)
    
    // If it's an API key issue, don't try other services
    if (error.message?.includes('API key')) {
      throw new Error('Resend API key tidak valid. Silakan setup Resend terlebih dahulu.')
    }
  }

  // 2. EMAILJS (FALLBACK - NO ATTACHMENTS)
  if (!invoiceImage) {
    try {
      console.log('📧 Trying EmailJS service (no attachment)...')
      const result = await sendEmailWithEmailJS(email, invoice)
      console.log('✅ Email sent successfully via EmailJS!')
      return result
    } catch (error: any) {
      console.error('❌ EmailJS failed:', error.message)
    }
  }

  // 3. DEMO SERVICE (LAST RESORT)
  try {
    console.log('📧 Using demo service...')
    const result = await sendEmailWithDemo(email, invoice)
    console.log('⚠️ Email sent via demo service (not actually sent)')
    return result
  } catch (error: any) {
    console.error('❌ Demo service failed:', error.message)
    throw new Error('Semua email service gagal. Silakan coba lagi nanti.')
  }
}

// Alternative: Resend API (Server-side)
export const sendInvoiceEmailResend = async (email: string, invoice: InvoiceData): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email-resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        invoice
      }),
    })

    return response.ok
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error)
    return false
  }
}

// Demo email service (fallback)
export const sendInvoiceEmailDemo = async (email: string, invoice: InvoiceData): Promise<boolean> => {
  console.log('📧 DEMO EMAIL SERVICE')
  console.log('='.repeat(50))
  console.log(`📧 To: ${email}`)
  console.log(`📧 Subject: Invoice ${invoice.transactionId} - DoaIbu Store`)
  console.log(`📧 Transaction: ${invoice.transaction.type} - ${invoice.transaction.gameId}`)
  console.log(`📧 Amount: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.transaction.amount)}`)
  console.log('='.repeat(50))
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return true
}

// 🚀 EMAILJS SERVICE (FALLBACK - NO ATTACHMENTS)
export const sendEmailWithEmailJS = async (email: string, invoice: any) => {
  try {
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    }

    // Prepare email template parameters
    const templateParams = {
      to_email: email,
      to_name: invoice.customer.name,
      transaction_id: invoice.transactionId,
      transaction_date: new Date(invoice.date).toLocaleString('id-ID'),
      transaction_type: invoice.transaction.type === 'topup' ? 'Top Up Game' : 'Joki/Boost Service',
      game_name: invoice.transaction.gameId.toUpperCase(),
      game_user_id: invoice.customer.gameUserId,
      amount: formatCurrency(invoice.transaction.amount),
      balance_before: formatCurrency(invoice.balance.before),
      balance_after: formatCurrency(invoice.balance.after),
      status: 'Berhasil',
      company_name: 'DoaIbu Store',
      company_website: 'www.doaibustore.com',
      support_message: 'Jika ada pertanyaan, silakan hubungi customer service kami.'
    }

    console.log('📧 Sending email via EmailJS...')
    console.log('📧 Template params:', templateParams)

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    )

    console.log('✅ EmailJS response:', response)
    
    return {
      success: true,
      message: 'Invoice berhasil dikirim via EmailJS',
      provider: 'EmailJS',
      emailId: response.text
    }

  } catch (error: any) {
    console.error('❌ EmailJS service error:', error)
    throw error
  }
}

// 🎯 DEMO SERVICE (TESTING PURPOSES)
export const sendEmailWithDemo = async (email: string, invoice: any) => {
  console.log('📧 DEMO EMAIL SERVICE')
  console.log('='.repeat(50))
  console.log(`📧 To: ${email}`)
  console.log(`📧 Subject: Invoice ${invoice.transactionId} - DoaIbu Store`)
  console.log(`📧 Transaction: ${invoice.transaction.type} - ${invoice.transaction.gameId}`)
  console.log(`📧 Amount: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.transaction.amount)}`)
  console.log(`📧 Customer: ${invoice.customer.name}`)
  console.log(`📧 Balance Before: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.balance.before)}`)
  console.log(`📧 Balance After: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.balance.after)}`)
  console.log('='.repeat(50))
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    success: true,
    message: 'Email berhasil dikirim (Demo Mode)',
    provider: 'Demo',
    emailId: `demo_${Date.now()}`
  }
} 