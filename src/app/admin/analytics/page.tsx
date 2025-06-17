'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import AdminNavigation from '@/components/AdminNavigation'
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  BarChart2,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function AdminAnalyticsPage() {
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

  // Mock data for analytics
  const revenueData = [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 19000 },
    { month: 'Mar', amount: 15000 },
    { month: 'Apr', amount: 22000 },
    { month: 'May', amount: 28000 },
    { month: 'Jun', amount: 25000 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <AdminNavigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400">Overview of store performance and metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <select className="bg-black/20 border border-blue-500/20 rounded-lg px-3 py-2 text-white text-sm">
              <option value="7days">Last 7 days</option>
              <option value="30days" selected>Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center text-green-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">+12.5%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(120000000)}</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center text-green-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">+8.2%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white">1,543</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center text-green-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">+5.7%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">New Users</p>
            <p className="text-2xl font-bold text-white">287</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex items-center text-red-400">
                <ArrowDown className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">-2.3%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Conversion Rate</p>
            <p className="text-2xl font-bold text-white">3.42%</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">This Year</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300/50 rounded-full mr-2"></div>
                <span className="text-sm text-gray-300">Last Year</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 flex items-end space-x-6">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-900/30 rounded-t-lg" style={{ height: `${(item.amount / 30000) * 100}%` }}>
                  <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: `${(item.amount / 30000) * 70}%` }}></div>
                </div>
                <div className="text-xs text-gray-400 mt-2">{item.month}</div>
                <div className="text-xs font-medium text-white">{formatCurrency(item.amount * 1000)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Products</h3>
            <div className="space-y-4">
              {[
                { name: 'Mobile Legends Diamonds', sales: 452, amount: 45200000 },
                { name: 'PUBG Mobile UC', sales: 389, amount: 38900000 },
                { name: 'Free Fire Diamonds', sales: 356, amount: 35600000 },
                { name: 'Valorant Points', sales: 298, amount: 29800000 },
                { name: 'Genshin Impact Genesis', sales: 245, amount: 24500000 },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                      <span className="text-blue-400 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatCurrency(product.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {[
                { id: '#ORD-7291', user: 'Budi Santoso', product: 'Mobile Legends Diamonds', amount: 150000, status: 'completed' },
                { id: '#ORD-7290', user: 'Dewi Putri', product: 'PUBG Mobile UC', amount: 250000, status: 'processing' },
                { id: '#ORD-7289', user: 'Ahmad Fauzi', product: 'Free Fire Diamonds', amount: 75000, status: 'completed' },
                { id: '#ORD-7288', user: 'Siti Aminah', product: 'Valorant Points', amount: 180000, status: 'completed' },
                { id: '#ORD-7287', user: 'Rudi Hermawan', product: 'Genshin Impact Genesis', amount: 325000, status: 'failed' },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{order.id}</p>
                    <p className="text-sm text-gray-400">{order.user}</p>
                    <p className="text-xs text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatCurrency(order.amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                      order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 