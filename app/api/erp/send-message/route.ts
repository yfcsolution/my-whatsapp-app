import { NextResponse } from "next/server"

interface ERPMessageRequest {
  apiKey: string
  to: string
  message: string
  messageType?: "text" | "notification" | "alert"
  priority?: "low" | "medium" | "high"
  metadata?: Record<string, any>
}

interface ERPMessageResponse {
  success: boolean
  messageId: string
  timestamp: string
  to: string
  status: "queued" | "sent" | "failed"
  error?: string
}

// Simple API key validation (replace with database lookup in production)
const VALID_API_KEYS = [process.env.ERP_API_KEY || "erp-test-key-123"]

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ERPMessageRequest = await request.json()

    // Validate API key
    if (!body.apiKey || !VALID_API_KEYS.includes(body.apiKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing API key",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to || "",
          status: "failed",
        } as ERPMessageResponse,
        { status: 401 },
      )
    }

    // Validate required fields
    if (!body.to || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: to, message",
          messageId: "",
          timestamp: new Date().toISOString(),
          to: body.to || "",
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

    // Validate message length
    if (body.message.length > 4096) {
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

    const messageId = `erp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()

    // Log the message (in production, save to database)
    console.log("[ERP API] Message received:", {
      messageId,
      to: body.to,
      messageType: body.messageType || "text",
      priority: body.priority || "medium",
      timestamp,
      metadata: body.metadata,
    })

    // TODO: Integrate with actual WhatsApp API
    // For now, return success response
    const response: ERPMessageResponse = {
      success: true,
      messageId,
      timestamp,
      to: body.to,
      status: "queued",
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error("[ERP API] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
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
