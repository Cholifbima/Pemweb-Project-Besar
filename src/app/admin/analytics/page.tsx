'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { 
  Shield, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart,
  ArrowLeft,
  Calendar,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalSales: number
    totalUsers: number
    totalTransactions: number
    averageOrderValue: number
  }
  salesTrend: {
    date: string
    amount: number
    transactions: number
  }[]
  topProducts: {
    name: string
    sales: number
    revenue: number
  }[]
  userGrowth: {
    month: string
    newUsers: number
    totalUsers: number
  }[]
}

export default function AnalyticsPage() {
  const { admin, isLoading, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated, dateRange])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/analytics/export?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-report-${dateRange}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  if (isLoading || loading) {
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
              <h1 className="text-xl font-bold text-white">Analytics & Reports</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-black/20 border border-blue-500/20 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button
                onClick={exportReport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-white">
                  {analytics ? formatCurrency(analytics.overview.totalSales) : 'Rp 0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {analytics ? formatNumber(analytics.overview.totalUsers) : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-white">
                  {analytics ? formatNumber(analytics.overview.totalTransactions) : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">
                  {analytics ? formatCurrency(analytics.overview.averageOrderValue) : 'Rp 0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Sales Trend
              </h2>
            </div>
            
            <div className="space-y-4">
              {analytics?.salesTrend.slice(0, 7).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    {new Date(item.date).toLocaleDateString('id-ID', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ 
                          width: `${analytics ? (item.amount / Math.max(...analytics.salesTrend.map(s => s.amount))) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <PieChart className="w-6 h-6 mr-2" />
                Top Products
              </h2>
            </div>
            
            <div className="space-y-4">
              {analytics?.topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-blue-400">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-400">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400 py-8">
                  <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Users className="w-6 h-6 mr-2" />
                User Growth
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics?.userGrowth.slice(0, 4).map((item, index) => (
                <div key={index} className="p-4 bg-black/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">{item.month}</div>
                  <div className="text-lg font-bold text-white">{formatNumber(item.newUsers)}</div>
                  <div className="text-xs text-gray-400">new users</div>
                  <div className="text-xs text-green-400 mt-1">
                    Total: {formatNumber(item.totalUsers)}
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center text-gray-400 py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No user growth data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-8 bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            🚀 Coming Soon Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="p-3 bg-black/20 rounded-lg">
              <strong className="text-white">Advanced Charts</strong>
              <br />Interactive charts with detailed analytics
            </div>
            <div className="p-3 bg-black/20 rounded-lg">
              <strong className="text-white">Revenue Forecasting</strong>
              <br />AI-powered sales predictions
            </div>
            <div className="p-3 bg-black/20 rounded-lg">
              <strong className="text-white">Customer Insights</strong>
              <br />Detailed user behavior analysis
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 