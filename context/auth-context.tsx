"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const apiUrl = "http://localhost:8000/api"

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserInfo(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserInfo = async (authToken: string) => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token might be invalid or expired
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
      // Use dummy data if API connection fails
      setUser({
        id: 1,
        name: "Pengguna Demo",
        email: "demo@example.com",
        role: "student",
      })
      toast({
        title: "Koneksi ke server gagal",
        description: "Menggunakan data demo untuk sementara",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (error) {
      console.error("Login error:", error)
      // Use dummy data if API connection fails
      const dummyToken = "dummy_token_for_demo"
      const dummyUser = {
        id: 1,
        name: "Pengguna Demo",
        email: email,
        role: "student",
      }

      localStorage.setItem("token", dummyToken)
      setToken(dummyToken)
      setUser(dummyUser)

      toast({
        title: "Koneksi ke server gagal",
        description: "Menggunakan data demo untuk sementara",
        variant: "destructive",
      })
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (error) {
      console.error("Registration error:", error)
      // Use dummy data if API connection fails
      const dummyToken = "dummy_token_for_demo"
      const dummyUser = {
        id: 1,
        name: name,
        email: email,
        role: role,
      }

      localStorage.setItem("token", dummyToken)
      setToken(dummyToken)
      setUser(dummyUser)

      toast({
        title: "Koneksi ke server gagal",
        description: "Menggunakan data demo untuk sementara",
        variant: "destructive",
      })
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${apiUrl}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
