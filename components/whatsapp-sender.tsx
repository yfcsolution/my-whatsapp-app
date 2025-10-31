"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

/**
 * Example component to send WhatsApp messages from your Next.js app
 */
export function WhatsAppSender() {
  const [phoneNumber, setPhoneNumber] = useState("+923130541339")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const sendMessage = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/send-whatsapp-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          priority: "high",
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send message",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Send WhatsApp Message</h2>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+923130541339"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>

      <Button onClick={sendMessage} disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Message"}
      </Button>

      {result && (
        <div className={`p-4 rounded-lg ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          <p className="font-semibold">{result.success ? "Success!" : "Error"}</p>
          <p className="text-sm mt-1">{result.success ? `Message sent! ID: ${result.messageId}` : result.error}</p>
        </div>
      )}
    </div>
  )
}
