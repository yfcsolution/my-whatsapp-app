"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

function SendMessageContent() {
  const searchParams = useSearchParams()
  const phoneId = searchParams.get("phone")

  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [selectedPhone, setSelectedPhone] = useState(phoneId || "")
  const [phoneNumber, setPhoneNumber] = useState<any>(null)
  const [messageType, setMessageType] = useState<"text" | "template">("text")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const [formData, setFormData] = useState({
    to: "",
    message: "",
    templateName: "",
    templateLanguage: "en_US",
  })

  useEffect(() => {
    fetchPhoneNumbers()
  }, [])

  useEffect(() => {
    if (selectedPhone) {
      fetchPhoneNumber()
    }
  }, [selectedPhone])

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch("/api/phone-numbers")
      const data = await response.json()
      if (data.success) {
        setPhoneNumbers(data.data)
        if (!selectedPhone && data.data.length > 0) {
          setSelectedPhone(data.data[0]._id)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching phone numbers:", error)
    }
  }

  const fetchPhoneNumber = async () => {
    try {
      const response = await fetch(`/api/phone-numbers/${selectedPhone}`)
      const data = await response.json()
      if (data.success) {
        setPhoneNumber(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching phone number:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPhone || !phoneNumber) return

    setSending(true)
    setResult(null)

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumberId: selectedPhone,
          to: formData.to,
          content:
            messageType === "text"
              ? { text: formData.message }
              : { templateName: formData.templateName, templateLanguage: formData.templateLanguage },
          type: messageType,
          whatsappPhoneNumberId: phoneNumber.whatsappPhoneNumberId,
          whatsappAccessToken: phoneNumber.whatsappAccessToken,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({ success: true, message: "Message sent successfully!" })
        setFormData({ to: "", message: "", templateName: "", templateLanguage: "en_US" })
      } else {
        setResult({ success: false, message: data.error || "Failed to send message" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred while sending the message" })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/business">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Send Message</h1>
            <p className="text-sm text-muted-foreground">Send WhatsApp messages to customers</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">From Phone Number</Label>
              <Select value={selectedPhone} onValueChange={setSelectedPhone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phone number" />
                </SelectTrigger>
                <SelectContent>
                  {phoneNumbers.map((phone: any) => (
                    <SelectItem key={phone._id} value={phone._id}>
                      {phone.displayName} ({phone.phoneNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To (Customer Phone Number)</Label>
              <Input
                id="to"
                placeholder="+1234567890"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Enter phone number in E.164 format (e.g., +1234567890)</p>
            </div>

            <div className="space-y-2">
              <Label>Message Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={messageType === "text" ? "default" : "outline"}
                  onClick={() => setMessageType("text")}
                  className="flex-1"
                >
                  Text Message
                </Button>
                <Button
                  type="button"
                  variant={messageType === "template" ? "default" : "outline"}
                  onClick={() => setMessageType("template")}
                  className="flex-1"
                >
                  Template Message
                </Button>
              </div>
            </div>

            {messageType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px]"
                  required
                />
                <p className="text-xs text-muted-foreground">Maximum 4096 characters</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    placeholder="e.g., hello_world"
                    value={formData.templateName}
                    onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use an approved template from your WhatsApp Business account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateLanguage">Template Language</Label>
                  <Select
                    value={formData.templateLanguage}
                    onValueChange={(value) => setFormData({ ...formData, templateLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="en_GB">English (UK)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="pt_BR">Portuguese (Brazil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {result && (
              <div
                className={`flex items-center gap-2 rounded-lg border p-4 ${
                  result.success
                    ? "border-green-500 bg-green-50 text-green-900"
                    : "border-red-500 bg-red-50 text-red-900"
                }`}
              >
                {result.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <p className="text-sm font-medium">{result.message}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={sending || !selectedPhone}>
              {sending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card className="mt-6 p-6">
          <h3 className="mb-4 font-semibold">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Phone numbers must be in E.164 format (e.g., +1234567890)</li>
            <li>• Template messages require pre-approved templates from Meta</li>
            <li>• Text messages can be sent to customers within 24 hours of their last message</li>
            <li>• All sent messages are automatically saved to the database</li>
          </ul>
        </Card>
      </main>
    </div>
  )
}

export default function SendMessagePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SendMessageContent />
    </Suspense>
  )
}
