'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { GamepadIcon, User, LogOut, Home, Gamepad, Trophy, Phone, Menu, X, Search } from 'lucide-react'
import { showToast } from '@/lib/toast'
import { useUser } from '@/contexts/UserContext'
import Image from 'next/image'
// Import the banner image from assets
import bannerWelcome from '@/assets/banner_welcome.png'

export default function Navigation() {
  const { user, setUser, isLoading } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Hide navigation bar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null
  }

  // Prevent scrolling when mobile menu is open and dispatch custom event
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Apply multiple techniques to fully prevent scrolling
      document.body.classList.add('sidebar-open')
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top
      document.body.classList.remove('sidebar-open')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.documentElement.style.overflow = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    
    // Dispatch custom event for other components to listen
    const event = new CustomEvent('mobileMenuToggle', { detail: { isOpen: isMobileMenuOpen } })
    window.dispatchEvent(event)
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.classList.remove('sidebar-open')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.documentElement.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    showToast.loading('Sedang logout...')
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Clear localStorage token for chat functionality
      localStorage.removeItem('token')
      console.log('✅ Token removed from localStorage')
      
      setUser(null)
      
      showToast.success('Logout berhasil! Sampai jumpa lagi 👋')
      
      setTimeout(() => {
        router.push('/')
        // Force page refresh to clear auth state
        window.location.href = '/'
      }, 1000)
    } catch (error) {
      showToast.error('Gagal logout, coba lagi')
      console.error('Error logging out:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  // Game list for search functionality
  const gameList = [
    { id: 'mobile-legends', name: 'Mobile Legends', icon: '📱', publisher: 'Moonton' },
    { id: 'dota-2', name: 'Dota 2', icon: '🎮', publisher: 'Valve' },
    { id: 'pubg-mobile', name: 'PUBG Mobile', icon: '🔫', publisher: 'Tencent Games' },
    { id: 'free-fire', name: 'Free Fire', icon: '🔥', publisher: 'Garena' },
    { id: 'genshin-impact', name: 'Genshin Impact', icon: '⚔️', publisher: 'miHoYo' },
    { id: 'valorant', name: 'Valorant', icon: '🎯', publisher: 'Riot Games' },
    { id: 'clash-royale', name: 'Clash Royale', icon: '👑', publisher: 'Supercell' },
    { id: 'asphalt-9', name: 'Asphalt 9', icon: '🏎️', publisher: 'Gameloft' }
  ]

  // Search functionality
  const filteredGames = gameList.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(e.target.value.length > 0)
  }
  
  // Hide search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/top-up', label: 'Top Up', icon: Gamepad },
    { href: '/boost-services', label: 'Joki Game', icon: Trophy },
    { href: '/contact', label: 'Contact', icon: Phone },
  ]

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700/50 sticky top-0 z-50 transition-all duration-300" style={{ padding: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src={bannerWelcome.src} 
                alt="DoaIbu Store Logo" 
                width={40} 
                height={40} 
                className="mr-2 rounded-full"
              />
              <span className="text-xl font-bold text-green-400">DoaIbu Store</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-2 md:mx-4">
            <div className="relative" ref={searchInputRef}>
              <input
                type="text"
                placeholder="Cari game favorit kamu..."
                className="w-full bg-dark-700/70 border border-dark-600 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-dark-400 text-sm md:text-base"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
              />
              <button className="absolute right-0 top-0 h-full px-3 text-green-400">
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredGames.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                  <div className="p-1">
                    {filteredGames.map(game => (
                      <div key={game.id} className="py-1">
                        <div className="text-green-400 font-medium px-3 py-1 text-sm">{game.name}</div>
                        <Link 
                          href={`/top-up/${game.id}`}
                          className="flex items-center px-3 py-2 hover:bg-dark-700 rounded-md transition-colors"
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery('')
                          }}
                        >
                          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-green-600/20 rounded-full mr-2 md:mr-3 text-sm md:text-xl">
                            {game.icon}
                          </div>
                          <span className="text-sm md:text-base">Top Up: {game.name}</span>
                        </Link>
                        <Link 
                          href={`/boost-services/${game.id}`}
                          className="flex items-center px-3 py-2 hover:bg-dark-700 rounded-md transition-colors"
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery('')
                          }}
                        >
                          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-yellow-600/20 rounded-full mr-2 md:mr-3 text-sm md:text-xl">
                            {game.icon}
                          </div>
                          <span className="text-sm md:text-base">Joki: {game.name}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-dark-300 hover:text-green-400 px-3 py-2 rounded-md font-medium`}
                >
                  {link.label}
                </Link>
              )
            })}
            {isLoading ? (
              <div className="w-8 h-8 bg-dark-700 rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                <Link href="/dashboard" className="text-dark-300 hover:text-green-400 px-3 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark-300 hover:text-green-400 px-3 py-2 rounded-md font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-dark-300 hover:text-green-400 px-3 py-2 rounded-md font-medium">
                  Masuk
                </Link>
                <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-white p-2 focus:outline-none rounded-md transition-all duration-300 ${
                isMobileMenuOpen 
                  ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                  : 'bg-green-500 shadow-lg shadow-green-500/30'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide from left with overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop - completely black with opacity */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div 
          className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-dark-900 to-dark-800 shadow-2xl transform transition-transform duration-300 ease-in-out h-full border-l border-green-600/20 z-50 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Logo and close button */}
          <div className="py-4 px-3 border-b border-dark-700 flex items-center justify-between bg-dark-900">
            <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <Image 
                src={bannerWelcome.src} 
                alt="DoaIbu Store Logo" 
                width={32} 
                height={32} 
                className="mr-2 rounded-full"
              />
              <span className="text-lg font-bold text-green-400">DoaIbu Store</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-dark-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation Links & User Section */}
          <div className="py-4 overflow-y-auto flex flex-col bg-dark-800 max-h-screen pb-32" style={{ paddingLeft: 0 }}>
            <div className="space-y-1 pr-3 flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-green-600/20 text-green-400'
                        : 'text-dark-300 bg-dark-700/50 hover:bg-dark-600 hover:text-green-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
            
            {/* User Section */}
            <div className="border-t border-dark-700 mt-4 pt-4 px-2 bg-dark-900">
              {isLoading ? (
                <div className="px-4 py-3">
                  <div className="w-full h-8 bg-dark-700 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="px-4 py-3">
                  <div className="mb-4">
                    <p className="text-white font-medium">{(user as any).fullName || user.username}</p>
                    <p className="text-green-400 text-sm font-semibold">{formatCurrency(user.balance)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className={`block text-center py-2 px-4 rounded-lg transition-colors ${
                        isActive('/dashboard')
                          ? 'bg-green-600 text-white'
                          : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 space-y-2">
                  <Link
                    href="/login"
                    className="block text-center py-2 px-4 bg-dark-700 text-green-400 hover:bg-dark-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}