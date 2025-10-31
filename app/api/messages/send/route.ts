import { NextResponse } from "next/server"
import { saveMessage } from "@/lib/db/messages"
import { recordMessageAnalytics } from "@/lib/db/analytics"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumberId, to, content, type, whatsappPhoneNumberId, whatsappAccessToken } = body

    if (!phoneNumberId || !to || !content || !whatsappPhoneNumberId || !whatsappAccessToken) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Send via WhatsApp Cloud API
    const whatsappResponse = await fetch(`https://graph.facebook.com/v22.0/${whatsappPhoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace("+", ""),
        type: type || "text",
        text: { body: content.text },
      }),
    })

    if (!whatsappResponse.ok) {
      const error = await whatsappResponse.text()
      console.error("[v0] WhatsApp API error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to send WhatsApp message", details: error },
        { status: 500 },
      )
    }

    const whatsappData = await whatsappResponse.json()

    // Save to database
    const message = await saveMessage({
      phoneNumberId: new ObjectId(phoneNumberId),
      whatsappMessageId: whatsappData.messages[0].id,
      from: to,
      to: to,
      direction: "outbound",
      type: type || "text",
      content,
      status: "sent",
      timestamp: new Date(),
    })

    // Record analytics
    await recordMessageAnalytics(new ObjectId(phoneNumberId), "outbound", new Date())

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
