'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, Users, MessageSquare, TrendingUp, LogOut, Menu, X, Home } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminNavigation() {
  const { admin, logout } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/admin/login')
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/chat', label: 'Chat', icon: MessageSquare },
    { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md font-medium flex items-center ${
                    isActive(link.href) ? 'bg-blue-900/30 text-blue-400' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Admin Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {admin && (
              <>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Welcome,</p>
                  <p className="text-white font-medium">{admin.username}</p>
                  <span className="text-xs text-blue-400 capitalize">({admin.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/30 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md font-medium flex items-center ${
                    isActive(link.href) ? 'bg-blue-900/30 text-blue-400' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {link.label}
                </Link>
              )
            })}
            {admin && (
              <button
                onClick={handleLogout}
                className="w-full text-left text-gray-300 hover:text-red-400 block px-3 py-2 rounded-md font-medium flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 