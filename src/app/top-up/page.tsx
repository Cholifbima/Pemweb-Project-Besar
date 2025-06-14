'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Star, TrendingUp, Gamepad2, Zap, Search, Filter } from 'lucide-react'
import { games, getTopUpGames, getPopularGames, Game } from '@/data/games'

export default function TopUpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Memoize data to prevent unnecessary re-renders
  const topUpGames = useMemo(() => getTopUpGames(), [])
  const popularGames = useMemo(() => getPopularGames().filter(game => game.hasTopUp), [])
  
  const categories = [
    { id: 'all', name: 'Semua Game', icon: '🎮' },
    { id: 'moba', name: 'MOBA', icon: '⚔️' },
    { id: 'battle-royale', name: 'Battle Royale', icon: '🔫' },
    { id: 'mmorpg', name: 'MMORPG', icon: '🌟' },
    { id: 'fps', name: 'FPS', icon: '🎯' },
    { id: 'card', name: 'Card Game', icon: '🃏' },
    { id: 'racing', name: 'Racing', icon: '🏎️' },
  ]

  // Auto-slide for popular games - Fixed dependency
  useEffect(() => {
    if (popularGames.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularGames.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [popularGames.length])

  // Filter games based on search and category - Fixed dependency
  useEffect(() => {
    let filtered = [...topUpGames] // Create new array to avoid mutation

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
  }, [searchTerm, selectedCategory, topUpGames])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section with Animated Slider */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              🎮 Top Up Game Favorit
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
              Isi ulang diamond, UC, dan currency game dengan mudah dan aman
            </p>
          </div>

          {/* Popular Games Slider - Using Home page structure */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Game Terpopuler</h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {popularGames.map((game, index) => (
                  <div key={game.id} className="w-full flex-shrink-0">
                    <Link href={`/top-up/${game.id}`}>
                      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 sm:p-8 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="text-4xl sm:text-6xl animate-bounce">{game.icon}</div>
                            <div className="text-center sm:text-left">
                              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.name}</h3>
                              <p className="text-purple-300 mb-2 text-sm sm:text-base">{game.description}</p>
                              <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-2 sm:space-x-4">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span className="text-yellow-400 font-semibold text-sm">{game.rating}</span>
                                </div>
                                <span className="text-gray-400 text-sm">by {game.publisher}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center sm:text-right">
                            <div className="bg-green-500/20 text-green-400 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2">
                              🔥 POPULER
                            </div>
                            <div className="text-purple-300 text-sm sm:text-base">
                              Mulai dari {formatCurrency(game.topUpItems?.[0]?.price || 0)}
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
              onClick={() => setCurrentSlide((prev) => (prev - 1 + popularGames.length) % popularGames.length)}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % popularGames.length)}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Slider Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {popularGames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-purple-400 w-8' 
                      : 'bg-purple-600/50 hover:bg-purple-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari game favorit kamu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="text-gray-400 w-5 h-5 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
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
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Gamepad2 className="w-8 h-8 text-purple-400 mr-3" />
            Pilih Game ({filteredGames.length})
          </h2>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">Game tidak ditemukan</h3>
            <p className="text-gray-400">Coba ubah kata kunci pencarian atau filter kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <div key={game.id} className="group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div 
                  className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                  onClick={(e) => {
                    console.log('🎮 Game card clicked:', game.name, 'ID:', game.id);
                    console.log('🔗 Target URL:', `/top-up/${game.id}`);
                    console.log('📱 Event target:', e.target);
                    console.log('🖱️ Event currentTarget:', e.currentTarget);
                    
                    // Manual navigation for testing
                    window.location.href = `/top-up/${game.id}`;
                  }}
                >
                  {/* Game Icon and Badge */}
                  <div className="relative mb-4">
                    <div className="text-4xl mb-2 group-hover:animate-bounce">{game.icon}</div>
                    {game.isPopular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        🔥 HOT
                      </div>
                    )}
                  </div>

                  {/* Game Info */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
                  
                  {/* Rating and Publisher */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 font-semibold text-sm">{game.rating}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{game.publisher}</span>
                  </div>

                  {/* Price Range */}
                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Mulai dari</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(game.topUpItems?.[0]?.price || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div 
                      className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('⚡ Top Up button clicked:', game.name);
                        console.log('🔗 Button target URL:', `/top-up/${game.id}`);
                        
                        // Manual navigation for testing
                        window.location.href = `/top-up/${game.id}`;
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Top Up Sekarang
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
  )
} 