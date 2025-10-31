// Example: How to use the WhatsApp client in your Next.js components

"use client"

import { useState } from "react"
import { sendTextMessage, sendTemplateMessage } from "@/lib/erp-integration"

export default function SendMessageExample() {
  const [phoneNumber, setPhoneNumber] = useState("+923130541339")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSendTextMessage = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await sendTextMessage(phoneNumber, message, "high")
      setResult(response)
    } catch (error) {
      setResult({ success: false, error: "Failed to send message" })
    } finally {
      setLoading(false)
    }
  }

  const handleSendTemplate = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await sendTemplateMessage(phoneNumber, "hello_world", "en_US", "high")
      setResult(response)
    } catch (error) {
      setResult({ success: false, error: "Failed to send template" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Send WhatsApp Message</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+923130541339"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSendTextMessage}
            disabled={loading || !message}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Text Message"}
          </button>

          <button
            onClick={handleSendTemplate}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Template"}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
