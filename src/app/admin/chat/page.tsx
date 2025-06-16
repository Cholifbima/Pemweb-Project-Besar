'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { Shield, ArrowLeft } from 'lucide-react'
import AdminChatInterface from '@/components/AdminChatInterface'

export default function AdminChatPage() {
  const { admin, isLoading, isAuthenticated } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-blue-400" />
              </button>
              <Shield className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Live Chat Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Logged in as</p>
                <p className="text-white font-medium">{admin.username}</p>
                <span className="text-xs text-blue-400 capitalize">({admin.role})</span>
                {admin.isOnline && (
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-4rem)]">
        <AdminChatInterface />
      </div>
    </div>
  )
} 