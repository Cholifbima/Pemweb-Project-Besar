'use client'

import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <button 
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-green-500/20 hover:border-green-500/40 text-green-300 font-semibold rounded-lg transition-all duration-300"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Kembali ke Halaman Sebelumnya
    </button>
  )
} 