import { NextResponse } from "next/server"

interface ERPMessageRequest {
  apiKey: string
  to: string
  message: string
  messageType?: "text" | "template"
  priority?: "low" | "medium" | "high"
  metadata?: Record<string, any>
  templateName?: string
  templateLanguage?: string
}

interface ERPMessageResponse {
  success: boolean
  messageId: string
  timestamp: string
  to: string
  status: "queued" | "sent" | "failed"
  error?: string
}

const VALID_API_KEYS = [process.env.ERP_API_KEY || "erp-test-key-123"]

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing API key",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: "",
          status: "failed",
        } as ERPMessageResponse,
        { status: 401 },
      )
    }

    const body: ERPMessageRequest = await request.json()

    // Validate required fields based on message type
    if (!body.to) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: to",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: "",
          status: "failed",
        } as ERPMessageResponse,
        { status: 400 },
      )
    }

    // Check if it's a template message (has templateName)
    const isTemplate = !!body.templateName

    // For text messages, require message field
    if (!isTemplate && !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: message (required for text messages)",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to,
          status: "failed",
        } as ERPMessageResponse,
        { status: 400 },
      )
    }

    // For template messages, require templateName
    if (isTemplate && !body.templateName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: templateName (required for template messages)",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to,
          status: "failed",
        } as ERPMessageResponse,
        { status: 400 },
      )
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(body.to.replace(/\D/g, ""))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid phone number format",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to,
          status: "failed",
        } as ERPMessageResponse,
        { status: 400 },
      )
    }

    // Validate message length (only for text messages)
    if (!isTemplate && body.message && body.message.length > 4096) {
      return NextResponse.json(
        {
          success: false,
          error: "Message exceeds maximum length of 4096 characters",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to,
          status: "failed",
        } as ERPMessageResponse,
        { status: 400 },
      )
    }

    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!whatsappToken || !whatsappPhoneId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "WhatsApp credentials not configured. Please add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to environment variables.",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to,
          status: "failed",
        } as ERPMessageResponse,
        { status: 500 },
      )
    }

    const phoneNumber = body.to.replace(/\D/g, "").replace(/^0+/, "")

    // Prepare WhatsApp API request body
    const whatsappBody: any = {
      messaging_product: "whatsapp",
      to: phoneNumber,
    }

    if (isTemplate) {
      whatsappBody.type = "template"
      whatsappBody.template = {
        name: body.templateName,
        language: {
          code: body.templateLanguage || "en_US",
        },
      }
    } else {
      // Default to text message
      whatsappBody.type = "text"
      whatsappBody.text = {
        body: body.message,
      }
    }

    console.log("[v0] Sending to WhatsApp API:", JSON.stringify(whatsappBody, null, 2))

    const whatsappResponse = await fetch(`https://graph.facebook.com/v22.0/${whatsappPhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(whatsappBody),
    })

    const whatsappResult = await whatsappResponse.json()

    console.log("[v0] WhatsApp API response:", JSON.stringify(whatsappResult, null, 2))

    if (!whatsappResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: whatsappResult.error?.message || "Failed to send WhatsApp message",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to,
          status: "failed",
        } as ERPMessageResponse,
        { status: whatsappResponse.status },
      )
    }

    const messageId = whatsappResult.messages?.[0]?.id || `erp-${Date.now()}`
    const timestamp = new Date().toISOString()

    const response: ERPMessageResponse = {
      success: true,
      messageId,
      timestamp,
      to: body.to,
      status: "sent",
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error("[ERP API] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        messageId: "",
        timestamp: new Date().toISOString(),
        to: "",
        status: "failed",
      } as ERPMessageResponse,
      { status: 500 },
    )
  }
}

export async function GET(): Promise<Response> {
  return NextResponse.json({
    status: "ERP API is operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      sendMessage: "POST /api/erp/send-message",
      getStatus: "GET /api/erp/message-status/:messageId",
      test: "POST /api/erp/test",
    },
    documentation: "https://your-docs.com/erp-api",
  })
}
