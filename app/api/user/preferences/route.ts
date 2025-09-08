import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const preferencesSchema = z.object({
  sortPreference: z.string(),
})

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided")
  }

  const token = authHeader.substring(7)
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string
    email: string
  }

  return decoded.userId
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const body = await request.json()
    const { sortPreference } = preferencesSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: userId },
      data: { sortPreference },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        sortPreference: user.sortPreference,
      },
    })
  } catch (error) {
    console.error("Update preferences error:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
