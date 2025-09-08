import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const buyerSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  lastContacted: z.string().optional(),
  feedback: z.string().optional(),
  expectation: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  socialMediaHandles: z
    .array(
      z.object({
        platform: z.enum(["INSTAGRAM", "X", "TIKTOK", "YOUTUBE", "FACEBOOK", "LINKEDIN", "WHATSAPP"]),
        username: z.string(),
        url: z.string().optional(),
      }),
    )
    .default([]),
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

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)

    const buyers = await prisma.coffeeBuyer.findMany({
      where: { userId },
      include: {
        socialMediaHandles: true,
        contactHistory: {
          orderBy: { contactDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ buyers })
  } catch (error) {
    console.error("Get buyers error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const body = await request.json()
    const data = buyerSchema.parse(body)

    const buyer = await prisma.coffeeBuyer.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        lastContacted: data.lastContacted ? new Date(data.lastContacted) : null,
        feedback: data.feedback || null,
        expectation: data.expectation,
        userId,
        socialMediaHandles: {
          create: data.socialMediaHandles.map((handle) => ({
            platform: handle.platform,
            username: handle.username,
            url: handle.url || null,
          })),
        },
      },
      include: {
        socialMediaHandles: true,
        contactHistory: true,
      },
    })

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error("Create buyer error:", error)
    return NextResponse.json({ error: "Failed to create buyer" }, { status: 500 })
  }
}
