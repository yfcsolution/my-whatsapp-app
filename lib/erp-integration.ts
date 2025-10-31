// ERP WhatsApp Integration Library
// Use this in your Next.js application to send WhatsApp messages

export interface SendMessageRequest {
  to: string // Phone number with country code (e.g., "+923130541339")
  message?: string // Text message content
  templateName?: string // Template name (e.g., "hello_world")
  templateLanguage?: string // Template language code (e.g., "en_US")
  priority?: "low" | "medium" | "high"
  metadata?: Record<string, any>
}

export interface SendMessageResponse {
  success: boolean
  messageId?: string
  timestamp?: string
  to?: string
  status?: string
  error?: string
  whatsappResponse?: any
}

/**
 * Client-side helper to send WhatsApp messages via server action
 * This keeps the API key secure on the server
 */
export async function sendWhatsAppMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  try {
    // Call your Next.js API route instead of directly calling the ERP API
    const response = await fetch("/api/send-whatsapp-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to send message",
      }
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send a text message via WhatsApp
 */
export async function sendTextMessage(
  to: string,
  message: string,
  priority: "low" | "medium" | "high" = "medium",
): Promise<SendMessageResponse> {
  return sendWhatsAppMessage({
    to,
    message,
    priority,
  })
}

/**
 * Send a template message via WhatsApp
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  templateLanguage = "en_US",
  priority: "low" | "medium" | "high" = "medium",
): Promise<SendMessageResponse> {
  return sendWhatsAppMessage({
    to,
    templateName,
    templateLanguage,
    priority,
  })
}
