import Link from 'next/link'
import { Home, Gamepad2 } from 'lucide-react'
import BackButton from '@/components/BackButton'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>
          <p className="text-gray-400">
            Mungkin halaman telah dipindahkan atau URL salah.
          </p>
        </div>

        {/* Gaming Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Gamepad2 className="w-12 h-12 text-green-400" />
          </div>
          <p className="text-green-300 font-medium">
            Kembali ke dunia gaming DoaIbu Store!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Link>
          
          <BackButton />
        </div>

        {/* Additional Links */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-4">Atau coba halaman lain:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/top-up" className="text-green-400 hover:text-green-300 transition-colors">
              Top Up Game
            </Link>
            <Link href="/boost-services" className="text-green-400 hover:text-green-300 transition-colors">
              Joki Services
            </Link>
            <Link href="/contact" className="text-green-400 hover:text-green-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 