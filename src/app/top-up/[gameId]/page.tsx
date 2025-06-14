'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Shield, Zap, CreditCard, User, Smartphone, Mail, CheckCircle, AlertCircle, Crown, Gift } from 'lucide-react'
import { getGameById, TopUpItem } from '@/data/games'
import { showToast } from '@/lib/toast'
import { useUser } from '@/contexts/UserContext'
import Invoice from '@/components/Invoice'

export default function GameTopUpPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const { updateBalance } = useUser()
  
  const [game, setGame] = useState(getGameById(gameId))
  const [selectedItem, setSelectedItem] = useState<TopUpItem | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    serverId: '',
    email: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Select Item, 2: Fill Data, 3: Payment
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState<any>(null)

  useEffect(() => {
    if (!game) {
      router.push('/top-up')
      return
    }
    // Auto-select first popular item or first item
    const popularItem = game.topUpItems?.find(item => item.isPopular)
    const firstItem = game.topUpItems?.[0]
    setSelectedItem(popularItem || firstItem || null)
  }, [game, router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePurchase = async () => {
    console.log('Purchase button clicked!') // Debug log
    if (!selectedItem) {
      console.log('No item selected')
      return
    }

    setLoading(true)
    showToast.loading('Memproses pembelian...')

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'topup',
          gameId: gameId,
          itemId: selectedItem.id,
          amount: selectedItem.price,
          userGameId: formData.userId,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          showToast.error('Silakan login terlebih dahulu')
          router.push('/login')
          return
        }
        throw new Error(data.error || 'Terjadi kesalahan')
      }

      // Show success message with transaction details
      showToast.success(`🎉 Top up ${selectedItem.name} berhasil! ID Transaksi: ${data.transaction.id}`)
      
      // Update balance from response
      if (data.transaction && data.transaction.newBalance !== undefined) {
        updateBalance(data.transaction.newBalance)
      }
      
      // Show invoice
      if (data.invoice) {
        setInvoiceData(data.invoice)
        setShowInvoice(true)
      }
      
      // Reset form
      setFormData({
        userId: '',
        serverId: '',
        email: '',
        phoneNumber: '',
      })
      setStep(1)
      
    } catch (error: any) {
      console.error('Purchase error:', error)
      showToast.error(error.message || 'Terjadi kesalahan saat memproses pembelian')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.userId.trim()) {
      showToast.error('User ID wajib diisi')
      return false
    }
    if (!formData.email.trim()) {
      showToast.error('Email wajib diisi')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showToast.error('Format email tidak valid')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    console.log('Next step button clicked, current step:', step) // Debug log
    if (step === 1 && !selectedItem) {
      showToast.error('Pilih paket top up terlebih dahulu')
      return
    }
    if (step === 2 && !validateForm()) {
      return
    }
    console.log('Moving to step:', step + 1) // Debug log
    setStep(step + 1)
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Game tidak ditemukan...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Link 
          href="/top-up"
          className="inline-flex items-center text-purple-300 hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Kembali ke Top Up
        </Link>

        {/* Game Info Header */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-purple-500/20 p-4 sm:p-8 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-4xl sm:text-6xl animate-bounce">{game.icon}</div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{game.name}</h1>
              <p className="text-purple-300 mb-2 sm:mb-4 text-sm sm:text-base">{game.description}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-6">
                <div className="flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1 sm:mr-2" />
                  <span className="text-yellow-400 font-semibold text-sm sm:text-base">{game.rating}</span>
                </div>
                <span className="text-gray-400 text-sm sm:text-base">by {game.publisher}</span>
                <div className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  ✅ Resmi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-4 sm:mb-8 overflow-x-auto">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNum}
                </div>
                <span className={`ml-1 sm:ml-2 font-medium text-xs sm:text-base ${
                  step >= stepNum ? 'text-white' : 'text-gray-400'
                }`}>
                  {stepNum === 1 && 'Pilih Paket'}
                  {stepNum === 2 && 'Data Akun'}
                  {stepNum === 3 && 'Pembayaran'}
                </span>
                {stepNum < 3 && (
                  <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${
                    step > stepNum ? 'bg-purple-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Package */}
            {step === 1 && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-purple-500/20 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2 sm:mr-3" />
                  Pilih Paket Top Up
                </h2>
                
                {/* Mobile: 2x2 Grid, Desktop: 2 columns */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4">
                  {game.topUpItems?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedItem?.id === item.id
                          ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'bg-gray-800/30 border-gray-600/30 hover:border-purple-500/50'
                      }`}
                    >
                      {item.isPopular && (
                        <div className="absolute -top-1 sm:-top-2 left-2 sm:left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                          🔥 POPULER
                        </div>
                      )}

                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{item.name}</div>
                        {item.bonus && (
                          <div className="text-xs sm:text-sm text-green-400 mb-1 sm:mb-2">
                            +{item.bonus} Bonus!
                          </div>
                        )}
                        <div className="text-base sm:text-lg font-bold text-purple-400 mb-2 sm:mb-3">
                          {formatCurrency(item.price)}
                        </div>
                        {selectedItem?.id === item.id && (
                          <div className="bg-purple-600 text-white py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm font-semibold">
                            ✓ Dipilih
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={!selectedItem}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Lanjut ke Data Akun
                </button>
              </div>
            )}

            {/* Step 2: Account Data */}
            {step === 2 && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <User className="w-6 h-6 text-purple-400 mr-3" />
                  Data Akun Game
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        User ID / Player ID *
                      </label>
                      <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        placeholder="Masukkan User ID"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Server ID (Opsional)
                      </label>
                      <input
                        type="text"
                        name="serverId"
                        value={formData.serverId}
                        onChange={handleInputChange}
                        placeholder="Masukkan Server ID"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contoh@email.com"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nomor HP (Opsional)
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="08123456789"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-blue-300 text-sm">
                        <p className="font-semibold mb-1">Cara menemukan User ID:</p>
                        <p>Buka game → Profile → Salin User ID yang tertera</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 text-purple-400 mr-3" />
                  Pembayaran
                </h2>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <div className="text-green-300">
                      <p className="font-semibold">Pembayaran Demo</p>
                      <p className="text-sm">Ini adalah simulasi pembayaran untuk demo</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Ringkasan Pesanan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game:</span>
                        <span className="text-white">{game.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Paket:</span>
                        <span className="text-white">{selectedItem?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">User ID:</span>
                        <span className="text-white">{formData.userId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-300">Total:</span>
                          <span className="text-green-400">{formatCurrency(selectedItem?.price || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </span>
                    ) : (
                      'Bayar Sekarang'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Package */}
            {selectedItem && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Crown className="w-5 h-5 text-yellow-400 mr-2" />
                  Paket Dipilih
                </h3>
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-1">{selectedItem.name}</div>
                    {selectedItem.bonus && (
                      <div className="text-sm text-green-400 mb-2">
                        +{selectedItem.bonus} Bonus!
                      </div>
                    )}
                    <div className="text-2xl font-bold text-purple-400">
                      {formatCurrency(selectedItem.price)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Keunggulan DoaIbu Store</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-gray-300">Proses otomatis 1-5 menit</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">100% aman & terpercaya</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">Berbagai metode pembayaran</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && invoiceData && (
        <Invoice
          invoice={invoiceData}
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  )
} 