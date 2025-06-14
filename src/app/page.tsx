'use client'

import { GamepadIcon, Zap, Shield, Headphones, Star, TrendingUp, Crown, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPopularGames, getTopUpGames, getBoostGames } from '@/data/games'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const popularGames = getPopularGames()
  const topUpGames = getTopUpGames()
  const boostGames = getBoostGames()

  // Auto-slide for hero games
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularGames.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [popularGames.length])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const services = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Top Up Instan',
      description: 'Proses top up yang cepat dalam hitungan detik',
      link: '/top-up'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Aman & Terpercaya',
      description: 'Transaksi aman dengan jaminan 100% legal',
      link: '/top-up'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Jasa Boosting',
      description: 'Layanan boost rank dan joki account profesional',
      link: '/boost-services'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Customer Service 24/7',
      description: 'Dukungan pelanggan siap membantu kapan saja',
      link: '/contact'
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section with Featured Game */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-float">
              DoaIbu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Store</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Platform terpercaya untuk top up game dan jasa boosting account game favorit Anda. 
              Proses cepat, aman, dan harga terjangkau untuk semua kalangan gamer.
            </p>
          </div>

          {/* Featured Game Slider */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {popularGames.map((game, index) => (
                  <div key={game.id} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8">
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
                          <div className="space-y-2">
                            {game.hasTopUp && (
                              <Link 
                                href={`/top-up/${game.id}`}
                                className="block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                              >
                                Top Up
                              </Link>
                            )}
                            {game.hasBoost && (
                              <Link 
                                href={`/boost-services/${game.id}`}
                                className="block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                              >
                                Joki
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/top-up" className="gaming-button px-8 py-4 rounded-lg text-white font-semibold text-lg glow inline-block text-center">
              Mulai Top Up
            </Link>
            <Link href="/boost-services" className="border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-block text-center">
              Lihat Joki Services
            </Link>
          </div>
        </div>
      </section>

      {/* Top Up Games Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <GamepadIcon className="w-8 h-8 text-purple-400 mr-3" />
              Game Top Up Populer
            </h2>
            <Link 
              href="/top-up"
              className="text-purple-400 hover:text-white transition-colors flex items-center"
            >
              Lihat Semua
              <TrendingUp className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topUpGames.slice(0, 4).map((game, index) => (
              <Link key={game.id} href={`/top-up/${game.id}`}>
                <div 
                  className="gaming-card rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mb-4">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">{game.icon}</span>
                    </div>
                    {game.isPopular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        🔥 HOT
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{game.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 font-semibold text-sm">{game.rating}</span>
                  </div>
                  <span className="text-sm text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                    Mulai {formatCurrency(game.topUpItems?.[0]?.price || 0)}
                  </span>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold">
                      Top Up Sekarang
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Boost Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Trophy className="w-8 h-8 text-orange-400 mr-3" />
              Joki & Boost Services
            </h2>
            <Link 
              href="/boost-services"
              className="text-orange-400 hover:text-white transition-colors flex items-center"
            >
              Lihat Semua
              <Crown className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boostGames.slice(0, 4).map((game, index) => (
              <Link key={game.id} href={`/boost-services/${game.id}`}>
                <div 
                  className="gaming-card rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in-up border-orange-500/20 hover:border-orange-400/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mb-4">
                    <div className="w-full h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">{game.icon}</span>
                    </div>
                    {game.isPopular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        🏆 PRO
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">{game.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 font-semibold text-sm">{game.rating}</span>
                  </div>
                  <span className="text-sm text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
                    Mulai {formatCurrency(game.boostServices?.[0]?.price || 0)}
                  </span>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-semibold">
                      Boost Sekarang
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Mengapa Memilih DoaIbu Store?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link key={index} href={service.link}>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">{service.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Siap untuk Meningkatkan Pengalaman Gaming Anda?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bergabunglah dengan ribuan gamer yang sudah mempercayai DoaIbu Store
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="gaming-button px-8 py-4 rounded-lg text-white font-semibold text-lg glow inline-block text-center">
              Daftar Sekarang
            </Link>
            <Link href="/dashboard" className="border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-block text-center">
              Lihat Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GamepadIcon className="w-8 h-8 text-purple-400 mr-2" />
                <span className="text-xl font-bold text-white">DoaIbu Store</span>
              </div>
              <p className="text-gray-400">
                Platform terpercaya untuk kebutuhan gaming Anda.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/top-up" className="hover:text-purple-400 transition-colors">Top Up Games</Link></li>
                <li><Link href="/boost-services" className="hover:text-purple-400 transition-colors">Boost Services</Link></li>
                <li><Link href="/boost-services" className="hover:text-purple-400 transition-colors">Joki Account</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/login" className="hover:text-purple-400 transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-purple-400 transition-colors">Register</Link></li>
                <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DoaIbu Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </main>
  )
} 