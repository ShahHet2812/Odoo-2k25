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
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rewear_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('rewear_user')
      }
    }
    setLoading(false)
  }, [])

  const signup = async (userData: SignupData): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('rewear_users') || '[]')
      const existingUser = existingUsers.find((u: any) => u.email === userData.email)
      
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        points: 10, // Welcome points
        level: 'Bronze Swapper',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalSwaps: 0,
        itemsListed: 0,
        rating: 0,
      }

      // Save user to localStorage
      const updatedUsers = [...existingUsers, { ...newUser, password: userData.password }]
      localStorage.setItem('rewear_users', JSON.stringify(updatedUsers))
      
      // Set current user (without password)
      setUser(newUser)
      localStorage.setItem('rewear_user', JSON.stringify(newUser))

      return { success: true, message: 'Account created successfully!' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'Failed to create account. Please try again.' }
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('rewear_users') || '[]')
      const user = users.find((u: any) => u.email === email && u.password === password)
      
      if (!user) {
        return { success: false, message: 'Invalid email or password' }
      }

      // Remove password from user object before setting
      const { password: _, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      localStorage.setItem('rewear_user', JSON.stringify(userWithoutPassword))

      return { success: true, message: 'Login successful!' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('rewear_users') || '[]')
      const user = users.find((u: any) => u.email === email)
      
      if (!user) {
        return { success: false, message: 'No account found with this email address' }
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('reset_token', resetToken)
      localStorage.setItem('reset_email', email)

      // Create reset link
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`
      
      return { 
        success: true, 
        message: 'Reset link generated successfully!',
        resetLink: resetLink
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { success: false, message: 'Failed to generate reset link. Please try again.' }
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const storedToken = localStorage.getItem('reset_token')
      const resetEmail = localStorage.getItem('reset_email')

      if (!storedToken || !resetEmail || token !== storedToken) {
        return { success: false, message: 'Invalid or expired reset token' }
      }

      // Update user password
      const users = JSON.parse(localStorage.getItem('rewear_users') || '[]')
      const userIndex = users.findIndex((u: any) => u.email === resetEmail)
      
      if (userIndex === -1) {
        return { success: false, message: 'User not found' }
      }

      // Update the user's password
      users[userIndex].password = newPassword
      localStorage.setItem('rewear_users', JSON.stringify(users))

      // Clear reset token and email
      localStorage.removeItem('reset_token')
      localStorage.removeItem('reset_email')

      return { success: true, message: 'Password reset successfully!' }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, message: 'Failed to reset password. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rewear_user')
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