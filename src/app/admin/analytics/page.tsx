'use client'

import React from 'react'
import { useEffect, useState } from 'react'
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
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminAnalyticsPage() {
  const { admin, isLoading, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('adminToken')
      if(!token) return;
      const res = await fetch('/api/admin/analytics', { headers:{ Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const d = await res.json()
        setStats(d)
      }
    }
    if (isAuthenticated) fetchStats()
  }, [isAuthenticated])

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getChangeMeta = (val:number)=>{
    const positive = val>=0
    return {
      icon: positive? ArrowUp: ArrowDown,
      color: positive? 'text-green-400':'text-red-400',
      display: `${positive?'+':''}${Math.abs(val).toFixed(1)}%`
    }
  }

  const revenueMeta = getChangeMeta(stats?.changes?.revenue||0)
  const ordersMeta = getChangeMeta(stats?.changes?.orders||0)
  const usersMeta = getChangeMeta(stats?.changes?.users||0)
  const convMeta = getChangeMeta(stats?.changes?.conversion||0)

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
              <div className={`flex items-center ${revenueMeta.color}`}>
                {React.createElement(revenueMeta.icon,{className:'w-4 h-4 mr-1'})}
                <span className="text-xs font-medium">{revenueMeta.display}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue||0)}</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <div className={`flex items-center ${ordersMeta.color}`}>
                {React.createElement(ordersMeta.icon,{className:'w-4 h-4 mr-1'})}
                <span className="text-xs font-medium">{ordersMeta.display}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white">{stats?.totalOrders?.toLocaleString('id-ID')||0}</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className={`flex items-center ${usersMeta.color}`}>
                {React.createElement(usersMeta.icon,{className:'w-4 h-4 mr-1'})}
                <span className="text-xs font-medium">{usersMeta.display}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">New Users</p>
            <p className="text-2xl font-bold text-white">{stats?.newUsers?.toLocaleString('id-ID')||0}</p>
            <p className="text-xs text-gray-400 mt-2">Compared to last month</p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className={`flex items-center ${convMeta.color}`}>
                {React.createElement(convMeta.icon,{className:'w-4 h-4 mr-1'})}
                <span className="text-xs font-medium">{convMeta.display}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Conversion Rate</p>
            <p className="text-2xl font-bold text-white">{(stats?.conversionRate||0).toFixed(2)}%</p>
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
          
          <div className="h-80">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyRevenue}>
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v)=>`Rp ${(v/1_000_000).toFixed(0)}M`} />
                  <Tooltip formatter={(v)=>formatCurrency(Number(v))} />
                  <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Top Products</h3>
              <button onClick={()=>router.push('/admin/analytics/top-products')} className="text-sm text-blue-400 hover:underline">View more</button>
            </div>
            <div className="space-y-4">
              {stats?.topProducts?.length ? (
                stats.topProducts.map((p:any,index:number)=>(
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                        <span className="text-blue-400 font-bold">{index+1}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-sm text-gray-400">{p.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(p.amount)}</p>
                    </div>
                  </div>
                ))
              ):(<p className="text-gray-500 text-sm">No data</p>)}
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Recent Orders</h3>
              <button onClick={()=>router.push('/admin/analytics/orders')} className="text-sm text-blue-400 hover:underline">View more</button>
            </div>
            {stats?.recentOrders?.length ? stats.recentOrders.map((o:any)=>(
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm text-white/90">
                <div>
                  #{o.id}<br/>
                  <span className="text-gray-400 text-xs">{o.user}&nbsp;•&nbsp;{o.product}</span>
                </div>
                <div className="text-right">
                  {formatCurrency(o.total)}
                </div>
              </div>
            )) : (<p className="text-gray-500 text-sm">No orders</p>)}
          </div>
        </div>
      </main>
    </div>
  )
} 