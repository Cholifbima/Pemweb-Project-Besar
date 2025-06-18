'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  Gamepad2,
  TrendingUp,
  Zap
} from 'lucide-react'
import AdminNavigation from '@/components/AdminNavigation'
import GameModal from '@/components/GameModal'

interface Game {
  id: string
  name: string
  category: string
  description?: string
  publisher?: string
  rating: number
  isPopular: boolean
  hasTopUp: boolean
  hasBoost: boolean
  topUpItems: any[]
  boostServices: any[]
  icon?: string
  banner?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminGamesPage() {
  const { admin, isLoading, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchGames()
    }
  }, [isAuthenticated])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/dev/games')
      if (res.ok) {
        const data = await res.json()
        setGames(data)
      }
    } catch (error) {
      console.error('Failed to fetch games:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteGame = async (gameId: string) => {
    if (!confirm('Yakin ingin menghapus game ini?')) return
    
    try {
      const res = await fetch(`/api/dev/games/${gameId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        fetchGames()
      }
    } catch (error) {
      console.error('Failed to delete game:', error)
    }
  }

  const handleSaveGame = async (gameData: any) => {
    try {
      const url = editingGame ? `/api/dev/games/${editingGame.id}` : '/api/dev/games'
      const method = editingGame ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      })
      
      if (res.ok) {
        fetchGames()
        setEditingGame(null)
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('Failed to save game:', error)
    }
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.publisher?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || 
                          game.category === categoryFilter || 
                          (categoryFilter === 'both' && game.category === 'both')
    return matchesSearch && matchesCategory
  })

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
      <AdminNavigation />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Game Management</h1>
            <p className="text-gray-400">Kelola games yang tersedia di platform</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Game
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari game atau publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                <option value="topup">Top Up Only</option>
                <option value="boost">Boost Only</option>
                <option value="both">Top Up & Boost</option>
              </select>
            </div>

            <div className="flex items-center text-gray-400">
              <span className="text-sm">Total: {filteredGames.length} games</span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="text-center text-white">Loading games...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div key={game.id} className="bg-black/20 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6">
                {/* Game Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
                    <p className="text-gray-400 text-sm">by {game.publisher || 'Unknown'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingGame(game)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => deleteGame(game.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Game Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white">{game.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                      {game.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {game.hasTopUp && (
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-xs">Top Up</span>
                      </div>
                    )}
                    {game.hasBoost && (
                      <div className="flex items-center text-yellow-400">
                        <Zap className="w-4 h-4 mr-1" />
                        <span className="text-xs">Boost</span>
                      </div>
                    )}
                    {game.isPopular && (
                      <div className="flex items-center text-red-400">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-xs">Popular</span>
                      </div>
                    )}
                  </div>

                  {game.description && (
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {game.description}
                    </p>
                  )}

                  <div className="flex justify-between text-xs text-gray-400 mt-4">
                    <span>{game.topUpItems?.length || 0} top-up items</span>
                    <span>{game.boostServices?.length || 0} boost services</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredGames.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-12">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>Tidak ada game yang ditemukan</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <GameModal
        game={editingGame}
        isOpen={showCreateModal || !!editingGame}
        onClose={() => {
          setShowCreateModal(false)
          setEditingGame(null)
        }}
        onSave={handleSaveGame}
      />
    </div>
  )
} 