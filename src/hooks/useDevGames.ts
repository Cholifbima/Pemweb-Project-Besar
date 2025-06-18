'use client'

import { useState, useEffect } from 'react'

export interface TopUpItem {
  id: string
  name: string
  amount: number
  price: number
  bonus?: number
  isPopular?: boolean
}

export interface BoostService {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
  features: string[]
  isPopular?: boolean
}

export interface GameResp {
  id: string
  name: string
  category: string
  description?: string
  publisher?: string
  rating: number
  isPopular: boolean
  hasTopUp: boolean
  hasBoost: boolean
  topUpItems: TopUpItem[]
  boostServices: BoostService[]
  icon?: string
  banner?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function useDevGames(category?: string) {
  const [games, setGames] = useState<GameResp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGames()
  }, [category])

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = category ? `/api/dev/games?category=${category}` : '/api/dev/games'
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error('Failed to fetch games')
      }
      
      const data = await res.json()
      setGames(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching games:', err)
    } finally {
      setLoading(false)
    }
  }

  const getGameById = (id: string) => {
    return games.find(game => game.id === id)
  }

  const getTopUpGames = () => {
    return games.filter(game => game.hasTopUp)
  }

  const getBoostGames = () => {
    return games.filter(game => game.hasBoost)
  }

  const getPopularGames = () => {
    return games.filter(game => game.isPopular)
  }

  return {
    games,
    loading,
    error,
    fetchGames,
    getGameById,
    getTopUpGames,
    getBoostGames,
    getPopularGames
  }
} 