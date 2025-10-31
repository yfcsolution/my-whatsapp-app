// Example: Using Server Actions in Next.js

"use server"

export async function sendWhatsAppMessage(
  to: string,
  message: string,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
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
        priority: "high",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to send message" }
    }

    return { success: true, messageId: data.messageId }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Usage in a component:
// import { sendWhatsAppMessage } from './server-action-example';
// const result = await sendWhatsAppMessage('+923130541339', 'Hello!');
