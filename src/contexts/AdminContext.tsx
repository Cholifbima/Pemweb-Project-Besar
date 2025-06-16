'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Admin {
  id: number
  username: string
  role: string
  isOnline: boolean
  lastSeen: string | null
  createdAt: string
}

interface AdminContextType {
  admin: Admin | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/admin/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
      } else {
        localStorage.removeItem('adminToken')
      }
    } catch (error) {
      console.error('❌ Admin auth check error:', error)
      localStorage.removeItem('adminToken')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        setAdmin(data.admin)
        console.log(`✅ Admin ${data.admin.username} logged in successfully`)
        return true
      } else {
        console.error('❌ Admin login failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('❌ Admin login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token && admin) {
        // Call logout API to set status offline
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log(`🚪 Admin ${admin.username} logged out`)
      }
    } catch (error) {
      console.error('❌ Admin logout error:', error)
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('adminToken')
      setAdmin(null)
    }
  }

  const value: AdminContextType = {
    admin,
    isLoading,
    login,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
} 