"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import AdminNavigation from '@/components/AdminNavigation'
import { format } from 'date-fns'

export default function OrdersPage() {
  const { admin, isLoading, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dateFilter, setDateFilter] = useState<string>('')

  const fetchData = async (date?: string) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return
    const url = new URL('/api/admin/orders', window.location.origin)
    if (date) url.searchParams.set('date', date)
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const d = await res.json()
      setOrders(d.orders)
    }
    setIsLoadingData(false)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <AdminNavigation />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">All Orders</h1>
          <div className="flex items-center space-x-2">
            <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className="bg-black/20 border border-blue-500/20 rounded-lg px-2 py-1 text-white text-sm" />
            <button onClick={()=>fetchData(dateFilter||undefined)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">Filter</button>
            <button onClick={()=>{setDateFilter('');fetchData()}} className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm">Clear</button>
            <button onClick={()=>router.back()} className="text-blue-400 hover:underline text-sm">Back</button>
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/10">
              {orders.map(o=>(
                <tr key={o.id} className="text-white">
                  <td className="px-4 py-2">#{o.id}</td>
                  <td className="px-4 py-2">{o.user}</td>
                  <td className="px-4 py-2">{o.product}</td>
                  <td className="px-4 py-2">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">{format(new Date(o.date), 'dd MMM yyyy HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
} 