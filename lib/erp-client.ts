// ERP Client Library for easy integration

interface SendMessageOptions {
  apiKey: string
  to: string
  message: string
  messageType?: "text" | "notification" | "alert"
  priority?: "low" | "medium" | "high"
  metadata?: Record<string, any>
}

interface TestOptions {
  apiKey: string
  to: string
  testType?: "connection" | "message" | "full"
}

export class ERPClient {
  private baseUrl: string

  constructor(baseUrl = "/api/erp") {
    this.baseUrl = baseUrl
  }

  /**
   * Send a message via WhatsApp
   */
  async sendMessage(options: SendMessageOptions) {
    try {
      const response = await fetch(`${this.baseUrl}/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send message")
      }

      return await response.json()
    } catch (error: any) {
      console.error("[ERPClient] Send message error:", error)
      throw error
    }
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/message-status?messageId=${messageId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch message status")
      }

      return await response.json()
    } catch (error: any) {
      console.error("[ERPClient] Get status error:", error)
      throw error
    }
  }

  /**
   * Test the ERP integration
   */
  async test(options: TestOptions) {
    try {
      const response = await fetch(`${this.baseUrl}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      return await response.json()
    } catch (error: any) {
      console.error("[ERPClient] Test error:", error)
      throw error
    }
  }

  /**
   * Get API status
   */
  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/send-message`)
      return await response.json()
    } catch (error: any) {
      console.error("[ERPClient] Get status error:", error)
      throw error
    }
  }
}

export default ERPClient
