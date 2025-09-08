import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const contactHistorySchema = z.object({
  contactType: z.enum(["CALL", "EMAIL", "MESSAGE", "MEETING", "OTHER"]).default("OTHER"),
  message: z.string().optional(),
  contactDate: z.string().optional(),
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserFromToken(request)
    const body = await request.json()
    const data = contactHistorySchema.parse(body)

    // Verify buyer belongs to user
    const buyer = await prisma.coffeeBuyer.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 })
    }

    const contactHistory = await prisma.contactHistory.create({
      data: {
        contactType: data.contactType,
        message: data.message || null,
        contactDate: data.contactDate ? new Date(data.contactDate) : new Date(),
        buyerId: params.id,
      },
    })

    // Update buyer's lastContacted
    await prisma.coffeeBuyer.update({
      where: { id: params.id },
      data: {
        lastContacted: contactHistory.contactDate,
        feedback: data.message || buyer.feedback,
      },
    })

    return NextResponse.json({ contactHistory })
  } catch (error) {
    console.error("Create contact history error:", error)
    return NextResponse.json({ error: "Failed to create contact history" }, { status: 500 })
  }
}
