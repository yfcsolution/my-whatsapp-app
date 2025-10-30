import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json()

    // Validate input
    if (!to || !message) {
      return NextResponse.json({ success: false, error: "Missing phone number or message" }, { status: 400 })
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!accessToken || !phoneNumberId) {
      console.error("WhatsApp credentials missing")
      return NextResponse.json(
        {
          success: false,
          error:
            "WhatsApp API credentials not configured. Please add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to environment variables.",
        },
        { status: 500 },
      )
    }

    // Format phone number (remove + if present)
    const formattedPhone = to.replace("+", "")

    // Send message via WhatsApp Cloud API
    const whatsappApiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`

    const response = await fetch(whatsappApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message,
        },
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("WhatsApp API Error:", result)
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || "Failed to send WhatsApp message",
          details: result,
        },
        { status: response.status },
      )
    }

    console.log("WhatsApp message sent successfully:", result)

    return NextResponse.json({
      success: true,
      messageId: result.messages?.[0]?.id || `wa-${Date.now()}`,
      timestamp: new Date().toISOString(),
      to: to,
      status: "sent",
      whatsappResponse: result,
    })
  } catch (error: any) {
    console.error("WhatsApp API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send WhatsApp message",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  const hasCredentials = !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)

  return NextResponse.json({
    status: "WhatsApp API is ready",
    configured: hasCredentials,
    timestamp: new Date().toISOString(),
    instructions: hasCredentials
      ? 'Send POST request with { to: "phone", message: "text" }'
      : "Add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to environment variables",
  })
}
