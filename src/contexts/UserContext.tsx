'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  username: string
  fullName: string | null
  balance: number
  email: string
  totalSpent: number
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  updateBalance: (newBalance: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      // Check if we have a token in localStorage first
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Still include cookies as fallback
        headers,
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        setUser(null)
      } else {
        console.error('Unexpected auth check response:', response.status)
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error during auth check:', error)
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuthStatus()
  }

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance })
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const value: UserContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated: !!user && !isLoading,
    refreshUser,
    updateBalance
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
} 