'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { Shield, Users, MessageSquare, TrendingUp } from 'lucide-react'
import AdminNavigation from '@/components/AdminNavigation'

export default function AdminDashboardPage() {
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
      {/* Admin Navigation */}
      <AdminNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">$12,345</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Live Chats</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Admin Role</p>
                <p className="text-lg font-bold text-white capitalize">{admin.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
            <p className="text-gray-400 mb-4">Kelola akun pengguna dan saldo</p>
            <button 
              onClick={() => router.push('/admin/users')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Users
            </button>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Live Chat</h3>
            <p className="text-gray-400 mb-4">Tangani pesan dari customer</p>
            <button 
              onClick={() => router.push('/admin/chat')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Open Chat
            </button>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Analytics</h3>
            <p className="text-gray-400 mb-4">Lihat laporan penjualan</p>
            <button 
              onClick={() => router.push('/admin/analytics')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🚀 More Features Coming Soon!</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Kami sedang mengembangkan fitur-fitur baru untuk meningkatkan pengalaman admin dalam mengelola DoaIbu Store.
            Nantikan update selanjutnya!
          </p>
        </div>
      </main>
    </div>
  )
} 