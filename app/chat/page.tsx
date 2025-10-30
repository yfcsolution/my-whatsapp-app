"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
import {
  initialMessages,
  getConversations,
  currentUser,
  getAllUsers,
  AI_ASSISTANT_ID,
  getMessagesForUser,
} from "@/lib/chat-data"
import type { Message, Conversation } from "@/lib/types"

const MESSAGES_STORAGE_KEY = "chatMessages"
const SELECTED_USER_STORAGE_KEY = "chatSelectedUserId"

type StoredMessage = Omit<Message, "timestamp"> & { timestamp: string }

function serializeMessages(messages: Message[]): string {
  const payload: StoredMessage[] = messages.map((message) => ({
    ...message,
    timestamp: message.timestamp.toISOString(),
  }))

  return JSON.stringify(payload)
}

function deserializeMessages(raw: string): Message[] {
  const parsed = JSON.parse(raw) as StoredMessage[]

  return parsed.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }))
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [conversations, setConversations] = useState<Conversation[]>(getConversations())
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Fix: Check if we're on client before using localStorage
  useEffect(() => {
    setIsClient(true)
    
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY)
      const storedSelectedUserId = localStorage.getItem(SELECTED_USER_STORAGE_KEY)

      if (storedMessages) {
        try {
          setMessages(deserializeMessages(storedMessages))
        } catch (error) {
          console.error("Error parsing stored messages:", error)
        }
      }

      if (storedSelectedUserId) {
        setSelectedUserId(storedSelectedUserId)
      }
    }
  }, [])

  // Fix: Only save to localStorage on client side
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      localStorage.setItem(MESSAGES_STORAGE_KEY, serializeMessages(messages))
    }
  }, [messages, isClient])

  // Fix: Only save selected user on client side
  useEffect(() => {
    if (isClient && selectedUserId && typeof window !== "undefined") {
      localStorage.setItem(SELECTED_USER_STORAGE_KEY, selectedUserId)
    }
  }, [selectedUserId, isClient])

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
    
    if (userId === AI_ASSISTANT_ID) {
      const userMessages = getMessagesForUser(userId)
      setMessages(userMessages)
    }
  }

  const handleSendMessage = (content: string) => {
    if (!selectedUserId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: currentUser.id,
      receiverId: selectedUserId,
      timestamp: new Date(),
      status: "delivered",
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate AI response for assistant
    if (selectedUserId === AI_ASSISTANT_ID) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "This is an automated response from your AI assistant. How can I help you today?",
          senderId: AI_ASSISTANT_ID,
          receiverId: currentUser.id,
          timestamp: new Date(),
          status: "delivered",
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }
  }

  // Show loading state until client-side checks complete
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        conversations={conversations}
        selectedUserId={selectedUserId}
        onSelectUser={handleSelectUser}
        currentUser={currentUser}
        className="w-80 border-r"
      />
      <ChatWindow
        messages={messages.filter(
          (message) =>
            message.senderId === selectedUserId || message.receiverId === selectedUserId,
        )}
        selectedUser={
          selectedUserId
            ? getAllUsers().find((user) => user.id === selectedUserId)
            : undefined
        }
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        className="flex-1"
      />
    </div>
  )
}
