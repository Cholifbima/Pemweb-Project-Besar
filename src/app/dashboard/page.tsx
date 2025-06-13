'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Wallet, Trophy, ShoppingBag, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface UserData {
  id: number
  email: string
  username: string
  fullName: string | null
  phoneNumber: string | null
  balance: number
  totalSpent: number
  favoriteGames: string | null
  createdAt: string
}

interface Order {
  id: number
  gameId: string
  gameName: string
  serviceType: string
  packageName: string
  price: number
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchOrders()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Error fetching user data:', error)
      router.push('/login')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'processing':
        return 'Diproses'
      case 'pending':
        return 'Menunggu'
      case 'failed':
        return 'Gagal'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Selamat Datang, {user.fullName || user.username}! 👋
          </h1>
          <p className="text-purple-300">Kelola akun dan transaksi gaming Anda di sini</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">DEMO</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Saldo Akun</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(user.balance)}</p>
            </div>
          </div>

          {/* Total Spent Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(user.totalSpent)}</p>
            </div>
          </div>

          {/* Orders Count Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Pesanan</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>

          {/* Member Since Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Sejak</p>
              <p className="text-lg font-bold text-white">
                {new Date(user.createdAt).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User className="w-6 h-6 text-purple-400 mr-3" />
              Informasi Akun
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Username</label>
                <p className="text-white font-medium">{user.username}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Nama Lengkap</label>
                <p className="text-white font-medium">{user.fullName || 'Belum diisi'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">No. Telepon</label>
                <p className="text-white font-medium">{user.phoneNumber || 'Belum diisi'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/top-up')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center"
              >
                <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                Top Up
              </button>
              <button
                onClick={() => router.push('/boost-services')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-center"
              >
                <Trophy className="w-6 h-6 mx-auto mb-2" />
                Joki Rank
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Riwayat Pesanan Terbaru</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Belum ada pesanan</p>
              <p className="text-gray-500 text-sm">Mulai dengan melakukan top up atau joki rank!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="bg-black/30 rounded-xl p-4 border border-purple-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(order.status)}
                        <span className="text-white font-medium">{order.gameName}</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                          {order.serviceType === 'topup' ? 'Top Up' : 'Joki'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{order.packageName}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatCurrency(order.price)}</p>
                      <p className={`text-sm ${
                        order.status === 'completed' ? 'text-green-400' :
                        order.status === 'processing' ? 'text-yellow-400' :
                        order.status === 'pending' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {getStatusText(order.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Star className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Mode Demo Aktif</h3>
              <p className="text-gray-300 text-sm">
                Akun Anda telah dilengkapi dengan saldo demo sebesar <strong>Rp 1.000.000</strong> untuk keperluan demonstrasi. 
                Semua transaksi bersifat simulasi dan tidak menggunakan uang sungguhan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 