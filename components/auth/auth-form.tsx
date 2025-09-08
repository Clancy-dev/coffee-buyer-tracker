"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { X } from "lucide-react"

interface AuthFormData {
  email: string
  password: string
  name?: string
}

interface AuthFormProps {
  onClose: () => void
}

export const AuthForm = ({ onClose }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const { login, register, isLoading } = useAuth()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  useEffect(() => {
    const savedData = localStorage.getItem("auth-form-data")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setValue("email", data.email || "")
        setValue("password", data.password || "")
        setValue("name", data.name || "")
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }, [setValue])

  const watchedValues = watch()
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("auth-form-data", JSON.stringify(watchedValues))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedValues])

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        await login(data.email, data.password)
      } else {
        await register(data.email, data.password)
      }
      // Clear saved form data on successful auth
      localStorage.removeItem("auth-form-data")
      onClose()
    } catch (error) {
      // Error handling is done in the auth hook
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{isLogin ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isLogin ? "Welcome back to Coffee Buyer Tracker" : "Join Coffee Buyer Tracker today"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...registerField("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...registerField("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
