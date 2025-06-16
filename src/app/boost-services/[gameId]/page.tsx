'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star, Shield, Zap, CreditCard, User, Smartphone, Mail, CheckCircle, AlertCircle, Crown, Trophy, Target, Clock, Users } from 'lucide-react'
import { getGameById, BoostService } from '@/data/games'
import { showToast } from '@/lib/toast'
import { useUser } from '@/contexts/UserContext'
import Invoice from '@/components/Invoice'
// Import game logo images
import logoMobileLegends from '@/assets/logo_mobile_legend.png'
import logoDota from '@/assets/logo_dota.png'
import logoPubg from '@/assets/logo_pubg.png'
import logoFreeFire from '@/assets/logo_free_fire.png'
import logoGenshinImpact from '@/assets/logo_genshin_impact.png'
import logoValorant from '@/assets/logo_valorant.png'
import logoClashRoyale from '@/assets/logo_clash_royale.png'
import logoAsphalt9 from '@/assets/logo_asphalt_9.png'

export default function GameBoostPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const { updateBalance, refreshUser } = useUser()
  
  const [game, setGame] = useState(getGameById(gameId))
  const [selectedService, setSelectedService] = useState<BoostService | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    serverId: '',
    email: '',
    phoneNumber: '',
    currentRank: '',
    targetRank: '',
    loginMethod: 'email', // email or facebook
    loginCredential: '',
    password: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Select Service, 2: Fill Data, 3: Payment
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceData, setInvoiceData] = useState<any>(null)

  // Function to get logo by game ID
  const getLogoByGameId = (id: string) => {
    switch (id) {
      case 'mobile-legends':
        return logoMobileLegends;
      case 'dota2':
      case 'dota-2':
        return logoDota;
      case 'pubg-mobile':
        return logoPubg;
      case 'free-fire':
        return logoFreeFire;
      case 'genshin-impact':
        return logoGenshinImpact;
      case 'valorant':
        return logoValorant;
      case 'clash-royale':
        return logoClashRoyale;
      case 'asphalt-9':
        return logoAsphalt9;
      default:
        return logoMobileLegends; // Default fallback
    }
  }

  useEffect(() => {
    if (!game || !game.hasBoost) {
      router.push('/boost-services')
      return
    }
    // Auto-select first popular service or first service
    const popularService = game.boostServices?.find(service => service.isPopular)
    const firstService = game.boostServices?.[0]
    setSelectedService(popularService || firstService || null)
  }, [game, router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePurchase = async () => {
    if (!selectedService) return

    setLoading(true)
    showToast.loading('Memproses order joki...')

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'boost',
          gameId: gameId,
          serviceId: selectedService.id,
          amount: selectedService.price,
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
      showToast.success(`🎉 Order ${selectedService.name} berhasil! ID Transaksi: ${data.transaction.id}`)
      
      // Update balance from response
      if (data.transaction && data.transaction.newBalance !== undefined) {
        updateBalance(data.transaction.newBalance)
      }
      
      // Refresh user data from server to ensure consistency
      await refreshUser()
      
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
        currentRank: '',
        targetRank: '',
        loginMethod: 'email',
        loginCredential: '',
        password: '',
        notes: '',
      })
      setStep(1)
      
    } catch (error: any) {
      console.error('Purchase error:', error)
      showToast.error(error.message || 'Terjadi kesalahan saat memproses order')
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
    if (!formData.loginCredential.trim()) {
      showToast.error('Data login wajib diisi')
      return false
    }
    if (!formData.password.trim()) {
      showToast.error('Password wajib diisi')
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
    if (step === 1 && !selectedService) {
      showToast.error('Pilih layanan boost terlebih dahulu')
      return
    }
    if (step === 2 && !validateForm()) {
      return
    }
    setStep(step + 1)
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900/40 via-green-800/20 to-black flex items-center justify-center">
        <div className="text-white text-xl">Game tidak ditemukan...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900/40 via-green-800/20 to-black">
      {/* Header */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Link 
          href="/boost-services"
          className="inline-flex items-center text-green-400 hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Kembali ke Boost Services
        </Link>

        {/* Game Info Header */}
        <div className="bg-dark-800/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-green-500/20 p-4 sm:p-8 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <Image 
                src={getLogoByGameId(gameId)}
                alt={game?.name || 'Game Logo'}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{game?.name} Boost</h1>
              <p className="text-green-400 mb-2 sm:mb-4 text-sm sm:text-base">Tingkatkan rank dan skill dengan bantuan pro player</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-6">
                <div className="flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1 sm:mr-2" />
                  <span className="text-yellow-400 font-semibold text-sm sm:text-base">{game.rating}</span>
                </div>
                <span className="text-gray-400 text-sm sm:text-base">by {game.publisher}</span>
                <div className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  🏆 Pro Service
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                <span className={`ml-2 font-medium ${
                  step >= stepNum ? 'text-white' : 'text-gray-400'
                }`}>
                  {stepNum === 1 && 'Pilih Layanan'}
                  {stepNum === 2 && 'Data Akun'}
                  {stepNum === 3 && 'Pembayaran'}
                </span>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-4 rounded transition-all duration-300 ${
                    step > stepNum ? 'bg-green-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="bg-dark-800/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Trophy className="w-6 h-6 text-green-400 mr-3" />
                  Pilih Layanan Boost
                </h2>
                
                <div className="space-y-4">
                  {game.boostServices?.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedService?.id === service.id
                          ? 'bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-400 shadow-lg shadow-green-500/20'
                          : 'bg-dark-700/30 border-dark-600/30 hover:border-green-500/50'
                      }`}
                    >
                      {service.isPopular && (
                        <div className="absolute -top-2 left-4 bg-gradient-to-r from-green-400 to-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                          🔥 POPULER
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                          <p className="text-gray-300 mb-4">{service.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-blue-400 mr-2" />
                              <span className="text-gray-300 text-sm">Durasi: {service.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-green-400 mr-2" />
                              <span className="text-gray-300 text-sm">Pro Player</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-white font-semibold">Fitur Layanan:</h4>
                            <ul className="space-y-1">
                              {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-300">
                                  <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-3xl font-bold text-green-400 mb-2">
                            {formatCurrency(service.price)}
                          </div>
                          {selectedService?.id === service.id && (
                            <div className="bg-green-600 text-white py-1 px-3 rounded-full text-sm font-semibold">
                              ✓ Dipilih
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={!selectedService}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Lanjut ke Data Akun
                </button>
              </div>
            )}

            {/* Step 2: Account Data */}
            {step === 2 && (
              <div className="bg-dark-800/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <User className="w-6 h-6 text-green-400 mr-3" />
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
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
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
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rank Saat Ini
                      </label>
                      <input
                        type="text"
                        name="currentRank"
                        value={formData.currentRank}
                        onChange={handleInputChange}
                        placeholder="Contoh: Epic III"
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Rank
                      </label>
                      <input
                        type="text"
                        name="targetRank"
                        value={formData.targetRank}
                        onChange={handleInputChange}
                        placeholder="Contoh: Mythic"
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
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
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
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
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>

                  <div className="border-t border-gray-600 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Data Login Akun *</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Metode Login
                        </label>
                        <select
                          name="loginMethod"
                          value={formData.loginMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                        >
                          <option value="email">Email</option>
                          <option value="facebook">Facebook</option>
                          <option value="google">Google</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {formData.loginMethod === 'email' ? 'Email Login' : 'Username/Email'}
                        </label>
                        <input
                          type="text"
                          name="loginCredential"
                          value={formData.loginCredential}
                          onChange={handleInputChange}
                          placeholder={formData.loginMethod === 'email' ? 'Email untuk login' : 'Username atau email'}
                          className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password akun game"
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Catatan Tambahan
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Catatan khusus untuk joki (opsional)"
                        rows={3}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-red-300 text-sm">
                        <p className="font-semibold mb-1">Keamanan Data:</p>
                        <p>Data login Anda 100% aman dan akan dihapus setelah joki selesai. Tim joki profesional kami terpercaya.</p>
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
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-dark-800/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 text-green-400 mr-3" />
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
                    <h3 className="text-white font-semibold mb-2">Ringkasan Order</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game:</span>
                        <span className="text-white">{game.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Layanan:</span>
                        <span className="text-white">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Durasi:</span>
                        <span className="text-white">{selectedService?.duration}</span>
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
                          <span className="text-green-400">{formatCurrency(selectedService?.price || 0)}</span>
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
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </span>
                    ) : (
                      'Order Sekarang'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Service */}
            {selectedService && (
              <div className="bg-dark-800/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Crown className="w-5 h-5 text-yellow-400 mr-2" />
                  Layanan Dipilih
                </h3>
                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-white mb-1">{selectedService.name}</div>
                    <div className="text-sm text-green-300 mb-2">{selectedService.duration}</div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(selectedService.price)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-300">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-dark-800/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Keunggulan Joki Kami</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-gray-300">Pro player berpengalaman</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Win rate 90%+ guaranteed</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">100% aman & terpercaya</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-300">Selesai tepat waktu</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">Live progress update</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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