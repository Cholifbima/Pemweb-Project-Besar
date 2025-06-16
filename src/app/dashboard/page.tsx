'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Wallet, ShoppingBag, History, Star, GamepadIcon, Crown, Plus, CreditCard, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { showToast } from '@/lib/toast'
import { useUser } from '@/contexts/UserContext'
import Invoice from '@/components/Invoice'

interface Transaction {
  id: string
  type: string
  gameId: string | null
  itemId: string | null
  serviceId: string | null
  amount: number
  userGameId: string | null
  email: string | null
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, updateBalance, refreshUser } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvoice, setShowInvoice] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      // User data is already managed by UserContext
    } catch (error) {
      console.error('Error fetching user data:', error)
      router.push('/login')
    }
  }, [router])

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch('/api/transactions/history')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
        console.log('📊 Transactions loaded:', data.transactions?.length || 0)
      } else {
        console.log('❌ Failed to fetch transactions:', response.status)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserData()
    fetchTransactions()
  }, [fetchUserData, fetchTransactions])

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

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <GamepadIcon className="w-5 h-5 text-green-400" />
      case 'boost':
        return <Crown className="w-5 h-5 text-orange-400" />
      default:
        return <CreditCard className="w-5 h-5 text-blue-400" />
    }
  }

  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case 'topup':
        return 'Top Up'
      case 'boost':
        return 'Joki/Boost'
      default:
        return type
    }
  }

  const handleAddBalance = async () => {
    console.log('Add balance button clicked!') // Debug log
    if (!user) {
      console.log('No user found')
      return
    }
    
    try {
      // Call API to add balance to database
      const response = await fetch('/api/users/add-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100000 // Add 100,000 IDR
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menambah saldo')
      }

      // Update balance in context with the new balance from server
      updateBalance(data.newBalance)
      
      console.log('Balance updated:', data.newBalance) // Debug log
      
      // Show success message
      showToast.success(`💰 Saldo berhasil ditambah ${formatCurrency(100000)}! Saldo baru: ${formatCurrency(data.newBalance)}`)
      
    } catch (error: any) {
      console.error('Error adding balance:', error)
      showToast.error(error.message || 'Gagal menambah saldo')
    }
  }

  const handleViewInvoice = (transaction: Transaction) => {
    // Generate invoice data from transaction
    const invoiceData = {
      transactionId: transaction.id,
      date: transaction.createdAt,
      customer: {
        name: (user as any)?.fullName || user?.username || 'User',
        email: user?.email || '',
        gameEmail: transaction.email,
        gameUserId: transaction.userGameId
      },
      transaction: {
        type: transaction.type,
        gameId: transaction.gameId,
        itemId: transaction.itemId || undefined,
        serviceId: transaction.serviceId || undefined,
        amount: transaction.amount,
        status: transaction.status
      },
      balance: {
        before: user?.balance || 0,
        after: (user?.balance || 0) + transaction.amount,
        spent: transaction.amount
      }
    }
    
    setSelectedTransaction(transaction)
    setShowInvoice(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
                            Selamat Datang, {(user as any).fullName || user.username}! 👋
          </h1>
          <p className="text-green-300">Kelola akun dan transaksi gaming Anda di sini</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">DEMO</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Saldo Akun</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(user.balance)}</p>
              <p className="text-xs text-gray-500 mt-1">Saldo demo untuk testing</p>
            </div>
          </div>

          {/* Total Spent Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-white">{formatCurrency((user as any).totalSpent || 0)}</p>
            </div>
          </div>

          {/* Transactions Count Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <History className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-white">{transactions.length}</p>
            </div>
          </div>

          {/* Member Since Card */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Sejak</p>
                            <p className="text-lg font-bold text-white">
                {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long'
                }) : 'Tidak diketahui'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/top-up" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105">
              <GamepadIcon className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Top Up Game</h3>
              <p className="text-purple-200 text-sm">Isi diamond, UC, dan item game lainnya</p>
            </Link>
            
            <Link href="/boost-services" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105">
              <Crown className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Joki Services</h3>
              <p className="text-orange-200 text-sm">Boost rank dengan bantuan pro player</p>
            </Link>
            
            <div 
              onClick={handleAddBalance}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Top Up Saldo</h3>
              <p className="text-green-200 text-sm">Tambah saldo untuk transaksi (Demo)</p>
            </div>
          </div>
        </div>

        {/* Profile Info & Transaction History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User className="w-6 h-6 text-green-400 mr-3" />
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
                <p className="text-white font-medium">{(user as any).fullName || 'Belum diisi'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Nomor HP</label>
                <p className="text-white font-medium">{(user as any).phoneNumber || 'Belum diisi'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Bergabung</label>
                <p className="text-white font-medium">
                  {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Tidak diketahui'}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-green-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <History className="w-6 h-6 text-blue-400 mr-3" />
              Riwayat Transaksi
            </h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Belum ada transaksi</p>
                <Link href="/top-up" className="text-green-400 hover:text-white transition-colors">
                  Mulai transaksi pertama Anda →
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.slice(0, 10).map((transaction) => (
                  <div 
                    key={transaction.id} 
                    onClick={() => handleViewInvoice(transaction)}
                    className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30 hover:border-green-500/50 cursor-pointer transition-all duration-300 hover:bg-gray-700/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getTransactionTypeIcon(transaction.type)}
                        <div className="ml-3">
                          <p className="text-white font-medium">{getTransactionTypeName(transaction.type)}</p>
                          <p className="text-gray-400 text-sm">ID: {transaction.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(transaction.amount)}</p>
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className="text-sm text-gray-400 ml-1">{getStatusText(transaction.status)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      <p>Game: {transaction.gameId ? transaction.gameId.toUpperCase() : 'ADMIN'}</p>
                      <p>User ID: {transaction.userGameId || '-'}</p>
                      <p>{new Date(transaction.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-xs text-green-400 font-medium">
                      💡 Klik untuk lihat invoice dan kirim email
                    </div>
                  </div>
                ))}
                
                {transactions.length > 10 && (
                  <div className="text-center pt-4">
                    <p className="text-gray-400 text-sm">Menampilkan 10 transaksi terbaru</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && selectedTransaction && (
        <Invoice
          invoice={{
            transactionId: selectedTransaction.id,
            date: selectedTransaction.createdAt,
            customer: {
              name: (user as any)?.fullName || user?.username || 'User',
              email: user?.email || '',
              gameEmail: selectedTransaction.email || '',
              gameUserId: selectedTransaction.userGameId || ''
            },
            transaction: {
              type: selectedTransaction.type,
              gameId: selectedTransaction.gameId || 'ADMIN',
              itemId: selectedTransaction.itemId || undefined,
              serviceId: selectedTransaction.serviceId || undefined,
              amount: selectedTransaction.amount,
              status: selectedTransaction.status
            },
            balance: {
              before: (user?.balance || 0) + selectedTransaction.amount,
              after: user?.balance || 0,
              spent: selectedTransaction.amount
            }
          }}
          isOpen={showInvoice}
          onClose={() => {
            setShowInvoice(false)
            setSelectedTransaction(null)
          }}
        />
      )}
    </div>
  )
} 
