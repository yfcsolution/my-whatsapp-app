import { NextResponse } from "next/server"
import { getConversations } from "@/lib/db/messages"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phoneNumberId = searchParams.get("phoneNumberId")
    const status = (searchParams.get("status") as "active" | "archived" | "all") || "active"

    if (!phoneNumberId) {
      return NextResponse.json({ success: false, error: "phoneNumberId is required" }, { status: 400 })
    }

    const conversations = await getConversations(phoneNumberId, status)
    return NextResponse.json({ success: true, data: conversations })
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch conversations" }, { status: 500 })
  }
}
