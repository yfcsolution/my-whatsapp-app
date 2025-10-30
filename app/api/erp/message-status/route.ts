import { NextResponse } from "next/server"

interface MessageStatusResponse {
  messageId: string
  status: "queued" | "sent" | "delivered" | "read" | "failed"
  timestamp: string
  deliveredAt?: string
  readAt?: string
  error?: string
}

export async function GET(request: Request, { params }: { params: { messageId: string } }): Promise<Response> {
  try {
    const messageId = params.messageId

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    // TODO: Fetch actual message status from database
    // For now, return mock data
    const response: MessageStatusResponse = {
      messageId,
      status: "delivered",
      timestamp: new Date().toISOString(),
      deliveredAt: new Date(Date.now() - 60000).toISOString(),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("[Message Status API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch message status" }, { status: 500 })
  }
}
