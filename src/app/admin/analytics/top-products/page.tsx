"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import AdminNavigation from '@/components/AdminNavigation'

export default function TopProductsPage() {
  const { admin, isLoading, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken')
      if (!token) return
      const res = await fetch('/api/admin/top-products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const d = await res.json()
        setProducts(d.products)
      }
      setIsLoadingData(false)
    }
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
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Top Products</h1>
          <button onClick={()=>router.back()} className="text-blue-400 hover:underline">Back</button>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
          {products.length ? products.map((p,index)=>(
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                  <span className="text-blue-400 font-bold">{index+1}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sales} sales</p>
                </div>
              </div>
              <div className="text-right text-white font-medium">{formatCurrency(p.revenue)}</div>
            </div>
          )) : (<p className="text-gray-500 text-sm">No data</p>)}
        </div>
      </main>
    </div>
  )
} 