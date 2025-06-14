'use client'

import { useState } from 'react'
import { X, Download, Mail, CheckCircle, Calendar, User, CreditCard, GamepadIcon, Crown } from 'lucide-react'

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

interface InvoiceProps {
  invoice: InvoiceData
  isOpen: boolean
  onClose: () => void
}

export default function Invoice({ invoice, isOpen, onClose }: InvoiceProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <GamepadIcon className="w-6 h-6 text-purple-400" />
      case 'boost':
        return <Crown className="w-6 h-6 text-orange-400" />
      default:
        return <CreditCard className="w-6 h-6 text-blue-400" />
    }
  }

  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case 'topup':
        return 'Top Up Game'
      case 'boost':
        return 'Joki/Boost Service'
      default:
        return type
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsDownloading(false)
    
    // In a real app, you would generate and download PDF here
    console.log('📄 Invoice downloaded:', invoice.transactionId)
  }

  const handleSendEmail = async () => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsEmailSent(true)
    
    // In a real app, you would send email here
    console.log('📧 Invoice sent to:', invoice.customer.gameEmail)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">Invoice Transaksi</h2>
              <p className="text-gray-400">ID: {invoice.transactionId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-6">
          {/* Company Info */}
          <div className="text-center border-b border-gray-700 pb-6">
            <h1 className="text-3xl font-bold text-white mb-2">DoaIbu Store</h1>
            <p className="text-gray-400">Platform Gaming Terpercaya</p>
            <p className="text-sm text-gray-500">www.doaibustore.com</p>
          </div>

          {/* Transaction Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                Informasi Transaksi
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tanggal:</span>
                  <span className="text-white">{formatDate(invoice.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 font-semibold">Berhasil</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Metode:</span>
                  <span className="text-white">Saldo Demo</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 text-purple-400 mr-2" />
                Informasi Pelanggan
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nama:</span>
                  <span className="text-white">{invoice.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{invoice.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Email:</span>
                  <span className="text-white">{invoice.customer.gameEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white">{invoice.customer.gameUserId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              {getTransactionTypeIcon(invoice.transaction.type)}
              <span className="ml-2">Detail Layanan</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{getTransactionTypeName(invoice.transaction.type)}</p>
                    <p className="text-gray-400 text-sm">Game: {invoice.transaction.gameId.toUpperCase()}</p>
                    {invoice.transaction.itemId && (
                      <p className="text-gray-400 text-sm">Item ID: {invoice.transaction.itemId}</p>
                    )}
                    {invoice.transaction.serviceId && (
                      <p className="text-gray-400 text-sm">Service ID: {invoice.transaction.serviceId}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{formatCurrency(invoice.transaction.amount)}</p>
                  <p className="text-green-400 text-sm">Berhasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Summary */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Ringkasan Saldo</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Saldo Sebelum:</span>
                <span className="text-white">{formatCurrency(invoice.balance.before)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jumlah Transaksi:</span>
                <span className="text-red-400">-{formatCurrency(invoice.balance.spent)}</span>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-300">Saldo Setelah:</span>
                  <span className="text-green-400">{formatCurrency(invoice.balance.after)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </>
              )}
            </button>

            <button
              onClick={handleSendEmail}
              disabled={isEmailSent}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isEmailSent
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {isEmailSent ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Email Terkirim
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Kirim ke Email
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-700">
            <p>Terima kasih telah menggunakan DoaIbu Store!</p>
            <p>Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan.</p>
            <p className="mt-2 text-yellow-400">⚠️ Ini adalah transaksi demo untuk keperluan demonstrasi</p>
          </div>
        </div>
      </div>
    </div>
  )
} 