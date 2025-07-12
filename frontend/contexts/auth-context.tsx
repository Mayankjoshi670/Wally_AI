"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  phone: string
}

interface AuthContextType {
  user: User | null
  signIn: (emailOrPhone: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("walmart-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (emailOrPhone: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation - in real app, this would be server-side
    if (emailOrPhone && password.length >= 6) {
      // Check if it's an email or phone number
      const isEmail = emailOrPhone.includes("@")
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: isEmail ? emailOrPhone : `${emailOrPhone}@phone.walmart.com`, // Mock email for phone users
        name: isEmail ? emailOrPhone.split("@")[0] : `User${emailOrPhone.slice(-4)}`,
        phone: isEmail ? "Not provided" : emailOrPhone,
      }

      setUser(userData)
      localStorage.setItem("walmart-user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signUp = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password.length >= 6 && name && phone) {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        phone,
      }

      setUser(userData)
      localStorage.setItem("walmart-user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("walmart-user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
