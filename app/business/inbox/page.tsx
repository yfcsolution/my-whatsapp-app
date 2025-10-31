"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { InboxSidebar } from "@/components/business/inbox-sidebar"
import { MessageThread } from "@/components/business/message-thread"
import { SendMessageForm } from "@/components/business/send-message-form"

function InboxContent() {
  const searchParams = useSearchParams()
  const phoneId = searchParams.get("phone")

  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState<any>(null)

  useEffect(() => {
    if (phoneId) {
      fetchPhoneNumber()
      fetchConversations()
      // Set up polling for real-time updates
      const interval = setInterval(fetchConversations, 5000)
      return () => clearInterval(interval)
    }
  }, [phoneId])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages()
      // Poll for new messages
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const fetchPhoneNumber = async () => {
    try {
      const response = await fetch(`/api/phone-numbers/${phoneId}`)
      const data = await response.json()
      if (data.success) {
        setPhoneNumber(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching phone number:", error)
    }
  }

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations?phoneNumberId=${phoneId}`)
      const data = await response.json()
      if (data.success) {
        setConversations(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedConversation) return

    try {
      const response = await fetch(
        `/api/messages?phoneNumberId=${phoneId}&customerPhone=${selectedConversation.customerPhone}`,
      )
      const data = await response.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (content: string, type = "text") => {
    if (!selectedConversation || !phoneNumber) return

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumberId: phoneId,
          to: selectedConversation.customerPhone,
          content: { text: content },
          type,
          whatsappPhoneNumberId: phoneNumber.whatsappPhoneNumberId,
          whatsappAccessToken: phoneNumber.whatsappAccessToken,
        }),
      })

      if (response.ok) {
        await fetchMessages()
        await fetchConversations()
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  if (!phoneId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Please select a phone number</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <InboxSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        phoneNumber={phoneNumber}
        loading={loading}
      />

      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            <MessageThread messages={messages} conversation={selectedConversation} phoneNumber={phoneNumber} />
            <SendMessageForm onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <InboxContent />
    </Suspense>
  )
}
