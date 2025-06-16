'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, TrendingUp, Trophy, Zap, Search, Filter, Crown, Target, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { games, getBoostGames, getPopularGames, Game } from '@/data/games'
import banner from '@/assets/banner.png'
// Import game logo images
import logoMobileLegends from '@/assets/logo_mobile_legend.png'
import logoDota from '@/assets/logo_dota.png'
import logoPubg from '@/assets/logo_pubg.png'
import logoFreeFire from '@/assets/logo_free_fire.png'
import logoGenshinImpact from '@/assets/logo_genshin_impact.png'
import logoValorant from '@/assets/logo_valorant.png'
import logoClashRoyale from '@/assets/logo_clash_royale.png'
import logoAsphalt9 from '@/assets/logo_asphalt_9.png'

export default function BoostServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
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
  
  // Listen to mobile menu state changes from a custom event
  useEffect(() => {
    const handleMobileMenuToggle = (e: CustomEvent) => {
      setIsMobileMenuOpen(e.detail.isOpen)
    }
    
    window.addEventListener('mobileMenuToggle' as any, handleMobileMenuToggle as any)
    
    return () => {
      window.removeEventListener('mobileMenuToggle' as any, handleMobileMenuToggle as any)
    }
  }, [])

  // Memoize data to prevent unnecessary re-renders
  const boostGames = useMemo(() => getBoostGames(), [])
  const popularBoostGames = useMemo(() => getPopularGames().filter(game => game.hasBoost), [])
  
  const categories = [
    { id: 'all', name: 'Semua Game', icon: '🎮' },
    { id: 'moba', name: 'MOBA', icon: '⚔️' },
    { id: 'battle-royale', name: 'Battle Royale', icon: '🔫' },
    { id: 'mmorpg', name: 'MMORPG', icon: '🌟' },
    { id: 'fps', name: 'FPS', icon: '🎯' },
    { id: 'card', name: 'Card Game', icon: '🃏' },
  ]

  // Auto-slide for popular games - Fixed dependency
  useEffect(() => {
    if (popularBoostGames.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularBoostGames.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [popularBoostGames.length])

  // Filter games based on search and category - Fixed dependency
  useEffect(() => {
    let filtered = [...boostGames] // Create new array to avoid mutation

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(game => game.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredGames(filtered)
  }, [searchTerm, selectedCategory, boostGames])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`min-h-screen bg-black text-white transition-all duration-300 ease-in-out ${
      isMobileMenuOpen ? 'md:ml-0 ml-[40%]' : 'ml-0'
    }`}>
      {/* Main Content with Modern Gradient Background */}
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        {/* Hero Section with Animated Slider */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6 animate-fade-in">
                🏆 Joki & Boost Services
              </h1>
              <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Tingkatkan rank dan skill gaming kamu dengan bantuan pro player
              </p>
            </div>

            {/* Popular Games Slider - Using Home page structure */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <div className="flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">Joki Terpopuler</h2>
              </div>
              
              <div className="overflow-hidden rounded-xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {popularBoostGames.map((game, index) => (
                    <div key={game.id} className="w-full flex-shrink-0">
                      <Link href={`/boost-services/${game.id}`}>
                        <div className="bg-dark-800/50 backdrop-blur-md border border-green-500/30 rounded-xl p-4 sm:p-8 hover:border-green-400/50 transition-all duration-300">
                          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                              <div className="relative w-16 h-16 sm:w-24 sm:h-24">
                                <Image 
                                  src={getLogoByGameId(game.id)}
                                  alt={game.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="text-center sm:text-left">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.name}</h3>
                                <p className="text-green-300 mb-2 text-sm sm:text-base">{game.description}</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-2 sm:space-x-4">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-yellow-400 font-semibold text-sm">{game.rating}</span>
                                  </div>
                                  <span className="text-dark-400 text-sm">by {game.publisher}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-center sm:text-right">
                              <div className="bg-green-500/20 text-green-400 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2">
                                🔥 POPULER
                              </div>
                              <div className="text-green-300 text-sm sm:text-base">
                                Mulai dari {formatCurrency(game.boostServices?.[0]?.price || 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Manual Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + popularBoostGames.length) % popularBoostGames.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-800/50 hover:bg-dark-800/80 text-white p-2 rounded-full shadow-md transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % popularBoostGames.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-800/50 hover:bg-dark-800/80 text-white p-2 rounded-full shadow-md transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              {/* Slider Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {popularBoostGames.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-green-500 w-6' 
                        : 'bg-dark-400 hover:bg-dark-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-green-500/20 p-6">
            <div className="flex justify-center">
              {/* Category Filter */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                <Filter className="text-dark-400 w-5 h-5 flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-dark-700/50 text-dark-300 hover:bg-dark-600/50'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-green-400 flex items-center">
              <Trophy className="w-8 h-8 text-green-400 mr-3" />
              Pilih Game untuk Boost ({filteredGames.length})
            </h2>
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-2">Game tidak ditemukan</h3>
              <p className="text-dark-400">Coba ubah kata kunci pencarian atau filter kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game, index) => (
                <div key={game.id} className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Link href={`/boost-services/${game.id}`}>
                    <div className="bg-dark-800/50 border border-dark-700 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 group">
                      {/* Game Icon/Logo - Same size as top-up */}
                      <div className="aspect-square bg-dark-700/50 flex items-center justify-center relative overflow-hidden">
                        {/* Game Logo */}
                        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                          <Image 
                            src={getLogoByGameId(game.id)}
                            alt={game.name}
                            fill
                            className="object-cover p-2"
                          />
                        </div>
                        
                        {/* Popular Badge */}
                        {game.isPopular && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🔥 HOT
                          </div>
                        )}
                        
                        {/* Rating Badge */}
                        <div className="absolute top-2 left-2 bg-dark-900/80 backdrop-blur-sm flex items-center px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-yellow-400 font-semibold text-xs">{game.rating}</span>
                        </div>

                        {/* Hover Effect - Joki themed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/90 to-green-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-4">
                          <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
                          <p className="text-sm text-white/90 mb-3">Mulai dari {formatCurrency(game.boostServices?.[0]?.price || 0)}</p>
                          <span className="inline-block bg-dark-900/60 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold">
                            Joki Now
                          </span>
                        </div>
                      </div>

                      {/* Joki Info at Bottom */}
                      <div className="p-3 border-t border-dark-700/50 bg-dark-800/80">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-dark-400 text-xs">Layanan Joki</span>
                          <span className="text-yellow-400 font-bold text-sm">
                            {game.boostServices?.length || 0} jenis
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-dark-400 text-xs">Mulai dari</span>
                          <span className="text-yellow-400 font-bold text-sm">
                            {formatCurrency(game.boostServices?.[0]?.price || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-dark-800/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-400 mb-12">Mengapa Pilih Joki DoaIbu Store?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Pro Player</h3>
                  <p className="text-dark-400">Tim joki berpengalaman dengan skill tinggi</p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Win Rate Tinggi</h3>
                  <p className="text-dark-400">Garansi win rate 90%+ untuk semua layanan</p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Proses Cepat</h3>
                  <p className="text-dark-400">Pengerjaan selesai sesuai estimasi waktu</p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Support 24/7</h3>
                  <p className="text-dark-400">Tim support siap membantu kapan saja</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Banner with gradient background */}
        <div className="w-full relative bg-gradient-to-b from-green-900/10 to-black py-8">
          <div className="w-full max-w-7xl mx-auto">
            <Image 
              src={banner.src} 
              alt="DoaIbu Store Banner"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain max-h-96 md:max-h-[500px]"
              priority
            />
          </div>
        </div>

        {/* Deskripsi dan Informasi */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-dark-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-green-400">Tentang DoaIbu Store</h2>
              <p className="text-dark-300">
                DoaIbu Store adalah Sahabat Para Gamers Dan Platform Top Up Game Termurah di Indonesia. 
                Penuhi Kebutuhan Gaming Mu Bersama DoaIbu Store. Store Specialist Game Mobile Legends No.1 Murah, 
                Aman, Terpercaya Dan Legal 100% (Open 24 Jam). DoaIbu Store Sahabat Para Gamers Kami berdedikasi 
                untuk menyediakan layanan terbaik dan terus menerus inovatif untuk memenuhi kebutuhan gamers. 
                Jangan lewatkan kesempatan untuk mengikuti kami di sosial media dan tetap update dengan informasi 
                terbaru, tips, trik, dan promo-promo menarik lainnya.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-green-400 mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/top-up" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Top Up Games</Link></li>
                  <li><Link href="/boost-services" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Boost Services</Link></li>
                  <li><Link href="/boost-services" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Joki Account</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-green-400 mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Contact Us</Link></li>
                  <li><Link href="/dashboard" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-green-400 mb-4">Account</h3>
                <ul className="space-y-2">
                  <li><Link href="/login" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Login</Link></li>
                  <li><Link href="/register" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Register</Link></li>
                  <li><Link href="/dashboard" className="block bg-dark-800 text-dark-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors">Dashboard</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-900 border-t border-dark-700 py-6 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-dark-400">&copy; 2024 DoaIbu Store. All rights reserved.</p>
          </div>
        </footer>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.3s both;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out both;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  )
} 