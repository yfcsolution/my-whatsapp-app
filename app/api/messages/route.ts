import { NextResponse } from "next/server"
import { getMessages } from "@/lib/db/messages"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phoneNumberId = searchParams.get("phoneNumberId")
    const customerPhone = searchParams.get("customerPhone")

    if (!phoneNumberId || !customerPhone) {
      return NextResponse.json(
        { success: false, error: "phoneNumberId and customerPhone are required" },
        { status: 400 },
      )
    }

    const messages = await getMessages(phoneNumberId, customerPhone)
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}
