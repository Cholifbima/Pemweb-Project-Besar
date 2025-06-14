import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Resend Configuration
// 🚀 SETUP RESEND (GRATIS 3000 EMAIL/BULAN):
// 1. Daftar di https://resend.com/
// 2. Dapatkan API Key
// 3. Ganti 'your-api-key' di bawah dengan API Key Anda

const resend = new Resend('re_i67JrzCR_GjqLb3ggo5Afcf35LTMHjLkm') // ✅ API Key Resend aktif

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, invoice, invoiceImage } = body

    if (!email || !invoice) {
      return NextResponse.json(
        { error: 'Email dan data invoice diperlukan' },
        { status: 400 }
      )
    }

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    }

    // HTML Email Template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.transactionId}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎮 DoaIbu Store</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Platform Gaming Terpercaya</p>
        </div>

        <!-- Invoice Header -->
        <div style="padding: 30px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #6366f1;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 24px;">📄 Invoice Transaksi</h2>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <div>
                <p style="margin: 5px 0;"><strong>ID Transaksi:</strong> ${invoice.transactionId}</p>
                <p style="margin: 5px 0;"><strong>Tanggal:</strong> ${new Date(invoice.date).toLocaleString('id-ID')}</p>
              </div>
              <div style="text-align: right;">
                <span style="background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                  ✅ BERHASIL
                </span>
              </div>
            </div>
          </div>

          <!-- Customer & Transaction Info -->
          <div style="display: flex; gap: 20px; margin-bottom: 25px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px; background: #f8fafc; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #6366f1; font-size: 18px;">👤 Informasi Pelanggan</h3>
              <p style="margin: 8px 0;"><strong>Nama:</strong> ${invoice.customer.name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${invoice.customer.email}</p>
              <p style="margin: 8px 0;"><strong>Game Email:</strong> ${invoice.customer.gameEmail}</p>
              <p style="margin: 8px 0;"><strong>User ID:</strong> ${invoice.customer.gameUserId}</p>
            </div>
          </div>

          <!-- Transaction Details -->
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #6366f1; font-size: 18px;">🎮 Detail Transaksi</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <div>
                <p style="margin: 8px 0;"><strong>Jenis:</strong> ${invoice.transaction.type === 'topup' ? 'Top Up Game' : 'Joki/Boost Service'}</p>
                <p style="margin: 8px 0;"><strong>Game:</strong> ${invoice.transaction.gameId.toUpperCase()}</p>
                ${invoice.transaction.itemId ? `<p style="margin: 8px 0;"><strong>Item:</strong> ${invoice.transaction.itemId}</p>` : ''}
                ${invoice.transaction.serviceId ? `<p style="margin: 8px 0;"><strong>Service:</strong> ${invoice.transaction.serviceId}</p>` : ''}
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #10b981;">
                  ${formatCurrency(invoice.transaction.amount)}
                </p>
              </div>
            </div>
          </div>

          <!-- Balance Summary -->
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px;">💰 Ringkasan Saldo</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Saldo Sebelum:</span>
              <strong>${formatCurrency(invoice.balance.before)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Jumlah Transaksi:</span>
              <strong>-${formatCurrency(invoice.balance.spent)}</strong>
            </div>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 18px;">
              <span>Saldo Setelah:</span>
              <strong>${formatCurrency(invoice.balance.after)}</strong>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #666;">
            <p style="margin: 10px 0;">Terima kasih telah menggunakan DoaIbu Store!</p>
            <p style="margin: 10px 0;">Jika ada pertanyaan, silakan hubungi customer service kami.</p>
            <p style="margin: 15px 0 5px 0;"><strong>Tim DoaIbu Store</strong></p>
            <p style="margin: 5px 0;">www.doaibustore.com</p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
              ⚠️ Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    console.log('📧 Sending email via Resend...')
    console.log('📧 To:', email)
    console.log('📧 Transaction ID:', invoice.transactionId)

    // Prepare email data
    const emailData: any = {
      from: 'DoaIbu Store <noreply@doaibustore.site>', // ✅ Domain sudah verified
      to: email,
      subject: `Invoice ${invoice.transactionId} - DoaIbu Store`,
      html: htmlTemplate,
    }

    // Add attachment if invoice image is provided
    if (invoiceImage) {
      emailData.attachments = [
        {
          filename: `invoice-${invoice.transactionId}.png`,
          content: invoiceImage, // Base64 image data
        },
      ]
      console.log('📎 Invoice image attached')
    }

    // Send email
    const response = await resend.emails.send(emailData)

    console.log('✅ Email sent successfully via Resend:', response)

    return NextResponse.json({
      success: true,
      message: 'Invoice berhasil dikirim ke email',
      email: email,
      emailId: response.id
    })

  } catch (error: any) {
    console.error('❌ Resend email error:', error)
    
    // Handle specific Resend errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API key Resend tidak valid. Silakan periksa konfigurasi.' },
        { status: 401 }
      )
    }
    
    if (error.message?.includes('domain')) {
      return NextResponse.json(
        { error: 'Domain email belum diverifikasi. Gunakan domain yang sudah diverifikasi.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim email: ' + error.message },
      { status: 500 }
    )
  }
} 