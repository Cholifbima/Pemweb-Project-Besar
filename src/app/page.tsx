'use client'

import { ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { getPopularGames, getTopUpGames, getBoostGames } from '@/data/games'
// Import the banner images from assets
import bannerWelcome from '@/assets/banner_welcome.png'
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const popularGames = getTopUpGames()
  const jokiGames = getBoostGames()
  const sliderRef = useRef<HTMLDivElement>(null)
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

  // Banner data
  const banners = [
    {
      id: 1,
      image: bannerWelcome.src, // Using imported asset
      alt: 'Welcome to DoaIbu Store'
    },
    {
      id: 2,
      image: bannerWelcome.src, // Using imported asset
      alt: 'Welcome to DoaIbu Store'
    },
    {
      id: 3,
      image: bannerWelcome.src, // Using imported asset
      alt: 'Welcome to DoaIbu Store'
    }
  ]

  // Auto-slide for banner carousel setiap 4 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [banners.length])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Game list with logo images
  const gameList = [
    { id: 'mobile-legends', name: 'Mobile Legends', logo: logoMobileLegends, publisher: 'Moonton' },
    { id: 'dota-2', name: 'Dota 2', logo: logoDota, publisher: 'Valve' },
    { id: 'pubg-mobile', name: 'PUBG Mobile', logo: logoPubg, publisher: 'Tencent Games' },
    { id: 'free-fire', name: 'Free Fire', logo: logoFreeFire, publisher: 'Garena' },
    { id: 'genshin-impact', name: 'Genshin Impact', logo: logoGenshinImpact, publisher: 'miHoYo' },
    { id: 'valorant', name: 'Valorant', logo: logoValorant, publisher: 'Riot Games' },
    { id: 'clash-royale', name: 'Clash Royale', logo: logoClashRoyale, publisher: 'Supercell' },
    { id: 'asphalt-9', name: 'Asphalt 9', logo: logoAsphalt9, publisher: 'Gameloft' }
  ]

  return (
    <main className={`min-h-screen bg-black text-white transition-all duration-300 ease-in-out ${
      isMobileMenuOpen ? 'md:ml-0 ml-[40%]' : 'ml-0'
    }`}>
      {/* Main Content with Gradient Background */}
      <div className="bg-gradient-to-b from-green-900/40 via-green-800/20 to-black">
        {/* 3. Banner Carousel */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-xl">
              <div 
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {banners.map((banner, index) => (
                  <div key={banner.id} className="w-full flex-shrink-0">
                    <div className="bg-transparent rounded-xl aspect-[16/6] flex items-center justify-center relative">
                      <Image 
                        src={banner.image} 
                        alt={banner.alt}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-800/50 hover:bg-dark-800/80 text-white p-2 rounded-full shadow-md transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-800/50 hover:bg-dark-800/80 text-white p-2 rounded-full shadow-md transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-green-500 w-6' : 'bg-dark-400 hover:bg-dark-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main content area with gradient background from light to dark green */}
        <div className="bg-gradient-to-b from-green-700/30 via-green-800/20 to-green-900/10">
          {/* 4. Produk Populer */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-center text-green-400 mb-8">
                🚨 TOTAL LEBIH DARI 200 GAME 🔥 🚨 ANTI LIBUR + OPEN 25 JAM 🔥<br/>
                💫 Silahkan Temukan Game Kamu Di PENCARIAN 🔍
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {gameList.map((game) => (
                  <Link key={game.id} href={`/top-up/${game.id}`}>
                    <div className="bg-dark-800/50 border border-dark-700 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 hover:border-green-500/50 transition-all duration-300 group">
                      <div className="aspect-square bg-dark-700/50 flex items-center justify-center relative overflow-hidden">
                        {/* Game logo image instead of emoji */}
                        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                          <Image 
                            src={game.logo} 
                            alt={game.name}
                            fill
                            className="object-cover p-2"
                          />
                        </div>
                        {/* New hover effect, completely hidden until hover - same as joki */}
                        <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-green-600/90 to-green-500/90 group-hover:h-full transition-all duration-500 flex flex-col items-center justify-center text-white p-3 overflow-hidden">
                          <div className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 text-center">
                            <h3 className="text-lg font-semibold">{game.name}</h3>
                            <p className="text-sm text-white/90 mb-3">by {game.publisher}</p>
                            <span className="inline-block bg-dark-900 text-green-400 px-4 py-1.5 rounded-full text-sm font-bold">
                              Top Up Now
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Joki Game */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-green-400">
                Jasa Joki Game
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {jokiGames.slice(0, 7).map((game) => (
                  <Link key={game.id} href={`/boost-services/${game.id}`}>
                    <div className="bg-dark-800/50 border border-dark-700 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 group">
                      <div className="aspect-square bg-dark-700/50 flex items-center justify-center relative overflow-hidden">
                        {/* Game logo image instead of emoji */}
                        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                          <Image 
                            src={getLogoByGameId(game.id)} 
                            alt={game.name}
                            fill
                            className="object-cover p-2"
                          />
                        </div>
                        {/* New hover effect, completely hidden until hover */}
                        <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-yellow-500/90 to-green-600/90 group-hover:h-full transition-all duration-500 flex flex-col items-center justify-center text-white p-3 overflow-hidden">
                          <div className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 text-center">
                            <h3 className="text-lg font-semibold">{game.name}</h3>
                            <p className="text-sm text-white/90 mb-3">Mulai dari {formatCurrency(game.boostServices?.[0]?.price || 0)}</p>
                            <span className="inline-block bg-dark-900 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold">
                              Joki Now
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
          
        {/* Full-width Banner after joki section with gradient background to match above sections */}
        <div className="w-full relative bg-gradient-to-b from-green-900/10 to-black">
          <div className="w-full">
            <Image 
              src={banner.src} 
              alt="DoaIbu Store Banner"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* 6. Deskripsi dan Informasi */}
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
      </div>

      {/* 7. Footer */}
      <footer className="bg-dark-900 border-t border-dark-700 py-6 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dark-400">&copy; 2024 DoaIbu Store. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}