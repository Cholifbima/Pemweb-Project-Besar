'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, TrendingUp, Gamepad2, Zap, Search, Filter } from 'lucide-react'
import { games, getTopUpGames, getPopularGames, Game } from '@/data/games'

export default function TopUpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  const topUpGames = getTopUpGames()
  const popularGames = getPopularGames().filter(game => game.hasTopUp)
  
  const categories = [
    { id: 'all', name: 'Semua Game', icon: '🎮' },
    { id: 'moba', name: 'MOBA', icon: '⚔️' },
    { id: 'battle-royale', name: 'Battle Royale', icon: '🔫' },
    { id: 'mmorpg', name: 'MMORPG', icon: '🌟' },
    { id: 'fps', name: 'FPS', icon: '🎯' },
    { id: 'card', name: 'Card Game', icon: '🃏' },
    { id: 'racing', name: 'Racing', icon: '🏎️' },
  ]

  // Auto-slide for popular games
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularGames.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [popularGames.length])

  // Filter games based on search and category
  useEffect(() => {
    let filtered = topUpGames

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
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
              🎮 Top Up Game Favorit
            </h1>
            <p className="text-xl text-purple-300 animate-fade-in-delay">
              Isi ulang diamond, UC, dan currency game dengan mudah dan aman
            </p>
          </div>

          {/* Popular Games Slider */}
          <div className="relative mb-16">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Game Terpopuler</h2>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {popularGames.map((game, index) => (
                    <div key={game.id} className="w-full flex-shrink-0">
                      <Link href={`/top-up/${game.id}`}>
                        <div className="relative group cursor-pointer">
                          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                <div className="text-6xl animate-bounce">{game.icon}</div>
                                <div>
                                  <h3 className="text-3xl font-bold text-white mb-2">{game.name}</h3>
                                  <p className="text-purple-300 mb-2">{game.description}</p>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                      <span className="text-yellow-400 font-semibold">{game.rating}</span>
                                    </div>
                                    <span className="text-gray-400">by {game.publisher}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                                  🔥 POPULER
                                </div>
                                <div className="text-purple-300">
                                  Mulai dari {formatCurrency(game.topUpItems?.[0]?.price || 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
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
        </div>
      </div>

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
              <Link key={game.id} href={`/top-up/${game.id}`}>
                <div 
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
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
                      <div className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold">
                        <Zap className="w-4 h-4 mr-2" />
                        Top Up Sekarang
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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