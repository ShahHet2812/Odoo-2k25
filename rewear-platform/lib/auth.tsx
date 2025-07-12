"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  points: number
  level: string
  joinDate: string
  location?: string
  totalSwaps: number
  itemsListed: number
  rating: number
  avatar?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (userData: SignupData) => Promise<{ success: boolean; message: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; resetLink?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  isAuthenticated: boolean
  token: string | null
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('rewear_token')
    const savedUser = localStorage.getItem('rewear_user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('rewear_token')
        localStorage.removeItem('rewear_user')
      }
    }
    setLoading(false)
  }, [])

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }

      return data
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }

  const signup = async (userData: SignupData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (response.success) {
        const { user: newUser, token: newToken } = response.data
        setUser(newUser)
        setToken(newToken)
        localStorage.setItem('rewear_token', newToken)
        localStorage.setItem('rewear_user', JSON.stringify(newUser))
        return { success: true, message: 'Account created successfully!' }
      } else {
        return { success: false, message: response.message || 'Failed to create account' }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create account. Please try again.' }
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (response.success) {
        const { user: userData, token: newToken } = response.data
        setUser(userData)
        setToken(newToken)
        localStorage.setItem('rewear_token', newToken)
        localStorage.setItem('rewear_user', JSON.stringify(userData))
        return { success: true, message: 'Login successful!' }
      } else {
        return { success: false, message: response.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error instanceof Error ? error.message : 'Login failed. Please try again.' }
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
    try {
      const response = await apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      if (response.success) {
        return { 
          success: true, 
          message: 'Password reset email sent successfully!',
          resetLink: response.data?.resetLink
        }
      } else {
        return { success: false, message: response.message || 'Failed to send reset email' }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { success: false, message: error instanceof Error ? error.message : 'Failed to send reset email. Please try again.' }
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiCall(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password: newPassword }),
      })

      if (response.success) {
        const { token: newAuthToken } = response.data
        setToken(newAuthToken)
        localStorage.setItem('rewear_token', newAuthToken)
        return { success: true, message: 'Password reset successfully!' }
      } else {
        return { success: false, message: response.message || 'Failed to reset password' }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, message: error instanceof Error ? error.message : 'Failed to reset password. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('rewear_user')
    localStorage.removeItem('rewear_token')
    router.push('/')
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 