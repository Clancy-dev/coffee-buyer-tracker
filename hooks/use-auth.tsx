"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { getCurrentUser, loginAction, registerAction, logoutAction, type User } from "@/lib/auth-actions"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (formData: FormData) => Promise<boolean>
  register: (formData: FormData) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      const result = await loginAction(formData)

      if (result.success && result.user) {
        setUser(result.user)
        toast.success("Login successful!")
        router.refresh()
        return true
      } else {
        toast.error(result.error || "Login failed")
        return false
      }
    } catch (error) {
      toast.error("Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      const result = await registerAction(formData)

      if (result.success && result.user) {
        setUser(result.user)
        toast.success("Registration successful!")
        router.refresh()
        return true
      } else {
        toast.error(result.error || "Registration failed")
        return false
      }
    } catch (error) {
      toast.error("Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutAction()
      setUser(null)
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
