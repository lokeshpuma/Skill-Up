'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { storage, User } from '@/lib/storage'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session on mount
    const savedUser = storage.getUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll check against localStorage users
      const users = JSON.parse(localStorage.getItem('skillup_users') || '[]')
      const foundUser = users.find((u: User) => u.email === email && u.password === password)
      
      if (foundUser) {
        setUser(foundUser)
        storage.setUser(foundUser)
        return { success: true }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('skillup_users') || '[]')
      const existingUser = users.find((u: User) => u.email === email)
      
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('skillup_users', JSON.stringify(users))
      
      setUser(newUser)
      storage.setUser(newUser)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    storage.removeUser()
    // Note: We don't clear all data on logout to preserve course progress
    // In a real app, you might want to clear sensitive data only
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      storage.updateUser(updates)
      
      // Also update in users list
      const users = JSON.parse(localStorage.getItem('skillup_users') || '[]')
      const userIndex = users.findIndex((u: User) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('skillup_users', JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}