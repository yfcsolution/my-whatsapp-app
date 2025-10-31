// Server-side API route for sending WhatsApp messages
// Use this in your Next.js app to send messages from the server

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, templateName, templateLanguage, priority } = body

    // Validate required fields
    if (!to) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    if (!message && !templateName) {
      return NextResponse.json({ success: false, error: "Either message or templateName is required" }, { status: 400 })
    }

    // Call your ERP API
    const erpApiUrl = process.env.ERP_API_URL || "https://v0-yfcsolution-my-whatsapp-app.vercel.app"
    const erpApiKey = process.env.ERP_API_KEY || "my-erp-secret-key-2025"

    const response = await fetch(`${erpApiUrl}/api/erp/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": erpApiKey,
      },
      body: JSON.stringify({
        to,
        message,
        templateName,
        templateLanguage,
        priority: priority || "medium",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to send message" },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
