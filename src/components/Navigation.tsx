'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { GamepadIcon, User, LogOut, Home, Gamepad, Trophy, Phone, Menu, X } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface User {
  id: number
  username: string
  fullName: string | null
  balance: number
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    showToast.loading('Sedang logout...')
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
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

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/top-up', label: 'Top Up', icon: Gamepad },
    { href: '/boost-services', label: 'Joki Game', icon: Trophy },
    { href: '/contact', label: 'Contact', icon: Phone },
  ]

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GamepadIcon className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">DoaIbu Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'text-purple-400 bg-purple-500/20'
                      : 'text-gray-300 hover:text-purple-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu / Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">{user.fullName || user.username}</p>
                    <p className="text-green-400 text-xs font-semibold">{formatCurrency(user.balance)}</p>
                  </div>
                  
                  {/* Dashboard Button */}
                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-purple-400 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <div className="space-y-4">
              {/* Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'text-purple-400 bg-purple-500/20'
                        : 'text-gray-300 hover:text-purple-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}

              {/* User Section */}
              {isLoading ? (
                <div className="px-4 py-3">
                  <div className="w-full h-8 bg-gray-600 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="px-4 py-3 border-t border-purple-500/20">
                  <div className="mb-4">
                    <p className="text-white font-medium">{user.fullName || user.username}</p>
                    <p className="text-green-400 text-sm font-semibold">{formatCurrency(user.balance)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full ${
                        isActive('/dashboard')
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-purple-500/20 space-y-2">
                  <Link
                    href="/login"
                    className="block text-center py-3 text-gray-300 hover:text-purple-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 