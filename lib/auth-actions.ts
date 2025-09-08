"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export interface User {
  id: string
  email: string
  sortPreference?: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message }
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, error: "Invalid email or password" }
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        sortPreference: user.sortPreference || undefined,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed" }
  }
}

export async function registerAction(formData: FormData): Promise<AuthResult> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validation = registerSchema.safeParse({ email, password })
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed" }
  }
}

export async function logoutAction() {
  cookies().delete("auth-token")
  redirect("/")
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = cookies().get("auth-token")?.value
    if (!token) return null

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      sortPreference: user.sortPreference || undefined,
    }
  } catch (error) {
    return null
  }
}

export async function updateUserPreferences(sortPreference: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    await prisma.user.update({
      where: { id: user.id },
      data: { sortPreference },
    })

    return true
  } catch (error) {
    console.error("Update preferences error:", error)
    return false
  }
}
