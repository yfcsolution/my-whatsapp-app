// WhatsApp Service for sending messages
export class WhatsAppService {
  static async sendMessage(to: string, message: string) {
    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, message }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      return result
    } catch (error: any) {
      console.error("Error sending message:", error)
      return { success: false, error: error.message }
    }
  }

  static async sendRealMessage(to: string, message: string) {
    try {
      // Actual WhatsApp API integration
      const response = await fetch(`/api/send-whatsapp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, message }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message")
      }

      return result
    } catch (error: any) {
      console.error("Error sending real message:", error)
      return { success: false, error: error.message }
    }
  }

  // Method to check if API is available
  static async testConnection() {
    try {
      const response = await fetch("/api/send-whatsapp")
      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
