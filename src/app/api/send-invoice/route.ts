import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, invoice } = body

    if (!email || !invoice) {
      return NextResponse.json(
        { error: 'Email dan data invoice diperlukan' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll simulate a more realistic email service
    // In production, you would use services like:
    // - SendGrid: https://sendgrid.com/
    // - Nodemailer with SMTP
    // - AWS SES
    // - Mailgun
    
    const emailContent = `
Kepada: ${email}
Subject: Invoice Transaksi ${invoice.transactionId} - DoaIbu Store

Halo ${invoice.customer.name},

Terima kasih telah menggunakan DoaIbu Store!

Detail Transaksi:
- ID Transaksi: ${invoice.transactionId}
- Tanggal: ${new Date(invoice.date).toLocaleString('id-ID')}
- Jenis: ${invoice.transaction.type === 'topup' ? 'Top Up Game' : 'Joki/Boost Service'}
- Game: ${invoice.transaction.gameId.toUpperCase()}
- Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(invoice.transaction.amount)}
- Status: Berhasil

Saldo Anda setelah transaksi: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(invoice.balance.after)}

Invoice dalam bentuk gambar telah dilampirkan.

Jika ada pertanyaan, silakan hubungi customer service kami.

Salam,
Tim DoaIbu Store
www.doaibustore.com

---
⚠️ DEMO MODE: Email ini hanya simulasi untuk keperluan demonstrasi.
Dalam implementasi nyata, invoice PNG akan dikirim sebagai attachment.

Untuk testing email yang sesungguhnya, Anda perlu:
1. Setup email service (SendGrid/Nodemailer)
2. Konfigurasi SMTP credentials
3. Generate PNG dari invoice HTML
4. Attach PNG ke email

Email ini akan muncul di console log untuk demo.
    `

    console.log('📧 EMAIL SIMULATION:')
    console.log('='.repeat(50))
    console.log(emailContent)
    console.log('='.repeat(50))
    console.log('📧 Email would be sent to:', email)
    console.log('📎 Invoice PNG would be attached')
    console.log('🔧 To enable real email sending:')
    console.log('   1. Install nodemailer: npm install nodemailer')
    console.log('   2. Setup SMTP credentials')
    console.log('   3. Generate PNG from invoice HTML')
    console.log('   4. Send email with PNG attachment')

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // For demo, we'll always return success
    // In production, this would depend on actual email service response
    return NextResponse.json({
      success: true,
      message: 'Invoice berhasil dikirim ke email (DEMO MODE)',
      email: email,
      note: 'Ini adalah simulasi. Email tidak benar-benar terkirim. Lihat console untuk detail.'
    })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim email' },
      { status: 500 }
    )
  }
} 