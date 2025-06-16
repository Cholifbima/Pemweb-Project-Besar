'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Headphones, FileText, Star, ArrowLeft } from 'lucide-react'
import AIChatBot from '@/components/AIChatBot'

function SupportContent() {
  const [showAIChat, setShowAIChat] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Get transaction data from URL params or localStorage
    const txId = searchParams.get('txId')
    if (txId) {
      // In a real app, you'd fetch transaction details here
      setTransactionData({
        id: txId,
        game: searchParams.get('game') || 'Mobile Legends',
        amount: searchParams.get('amount') || '20000',
        status: 'success'
      })
    }
  }, [searchParams])

  const handleContactAdmin = () => {
    // Trigger the live chat by dispatching an event
    console.log('Triggering live chat from support page')
    const event = new CustomEvent('openLiveChat')
    window.dispatchEvent(event)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaksi Berhasil! 🎉</h1>
          <p className="text-gray-300">Terima kasih telah menggunakan DoaIbu Store</p>
        </div>

        {/* Transaction Summary */}
        {transactionData && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
              <h3 className="text-white font-semibold mb-4 text-center">Ringkasan Transaksi</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID Transaksi:</span>
                  <span className="text-white font-mono">{transactionData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game:</span>
                  <span className="text-white">{transactionData.game}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-green-400 font-semibold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(parseInt(transactionData.amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 font-semibold">✅ Berhasil</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Ada yang bisa kami bantu? 🤝
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* AI Customer Service */}
            <div 
              onClick={() => setShowAIChat(true)}
              className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Assistant</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Chat dengan AI untuk pertanyaan umum, upload screenshot untuk analisis, dan bantuan cepat 24/7
                </p>
                <div className="flex items-center justify-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Online 24/7
                </div>
              </div>
            </div>

            {/* Human Customer Service */}
            <div 
              onClick={handleContactAdmin}
              className="bg-black/20 backdrop-blur-md rounded-2xl border border-orange-500/20 p-6 hover:border-orange-500/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Bicara langsung dengan agen customer service untuk masalah kompleks atau bantuan personal
                </p>
                <div className="flex items-center justify-center text-yellow-400 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  09:00 - 21:00 WIB
                </div>
              </div>
            </div>

            {/* Help Center */}
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 cursor-pointer transform hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Help Center</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Panduan lengkap, FAQ, dan tutorial untuk semua layanan DoaIbu Store
                </p>
                <div className="text-blue-400 text-sm">
                  Panduan & Tutorial
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-gray-500/20 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Aksi Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
              >
                📊 Lihat Dashboard
              </Link>
              <Link 
                href="/top-up"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
              >
                🎮 Top Up Lagi
              </Link>
              <button 
                onClick={handleContactAdmin}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                💬 Chat Live Admin
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-yellow-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Berikan Rating Anda</h3>
            <p className="text-gray-300 text-center mb-4">
              Bagaimana pengalaman Anda dengan DoaIbu Store?
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            <div className="text-center">
              <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300">
                Kirim Feedback
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link 
              href="/"
              className="inline-flex items-center text-purple-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* AI ChatBot Modal */}
      <AIChatBot 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        onContactAdmin={handleContactAdmin}
      />
    </div>
  )
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <SupportContent />
    </Suspense>
  )
} 