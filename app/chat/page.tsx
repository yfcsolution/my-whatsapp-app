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
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAssistantResponding, setIsAssistantResponding] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated !== "true") {
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY)
      if (storedMessages) {
        setMessages(deserializeMessages(storedMessages))
      } else {
        setMessages(initialMessages)
      }
    } catch (error) {
      console.error("Failed to load chat messages", error)
      setMessages(initialMessages)
    }

    const storedSelectedUser = localStorage.getItem(SELECTED_USER_STORAGE_KEY)
    if (storedSelectedUser) {
      setSelectedUserId(storedSelectedUser)
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    setConversations(getConversations(messages))
  }, [messages])

  useEffect(() => {
    if (!isHydrated) return

    try {
      const payload = serializeMessages(messages)
      localStorage.setItem(MESSAGES_STORAGE_KEY, payload)
    } catch (error) {
      console.error("Failed to persist chat messages", error)
    }
  }, [messages, isHydrated])

  useEffect(() => {
    if (!isHydrated) return

    if (selectedUserId) {
      localStorage.setItem(SELECTED_USER_STORAGE_KEY, selectedUserId)
    } else {
      localStorage.removeItem(SELECTED_USER_STORAGE_KEY)
    }
  }, [selectedUserId, isHydrated])

  useEffect(() => {
    if (conversations.length === 0) {
      if (selectedUserId !== null) {
        setSelectedUserId(null)
      }
      return
    }

    const hasSelectedConversation = selectedUserId
      ? conversations.some((conversation) => conversation.userId === selectedUserId)
      : false

    if (!hasSelectedConversation) {
      setSelectedUserId(conversations[0].userId)
    }
  }, [conversations, selectedUserId])

  const handleAssistantReply = async (userMessage: Message) => {
    const assistantMessageId = `msg-${Date.now()}-assistant`
    const placeholder: Message = {
      id: assistantMessageId,
      senderId: AI_ASSISTANT_ID,
      receiverId: currentUser.id,
      content: "",
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, placeholder])
    setIsAssistantResponding(true)

    const conversationMessages = getMessagesForUser([...messages, userMessage], AI_ASSISTANT_ID)
    const payloadMessages = [
      { role: "system", content: "You are an interesting person" },
      ...conversationMessages.map((message) => ({
        role: message.senderId === currentUser.id ? "user" : "assistant",
        content: message.content,
      })),
    ]

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
      })

      if (!response.ok || !response.body) {
        const errorText = !response.ok ? await response.text() : ""
        throw new Error(errorText || "No response body received")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let accumulated = ""
      let streamComplete = false

      while (!streamComplete) {
        const { value, done } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split("\n\n")
        buffer = events.pop() ?? ""

        for (const event of events) {
          const lines = event.split("\n")
          for (const rawLine of lines) {
            const line = rawLine.trim()
            if (!line || !line.startsWith("data:")) {
              continue
            }

            const data = line.slice(5).trim()
            if (data === "[DONE]") {
              streamComplete = true
              break
            }

            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices?.[0]?.delta?.content as string | undefined
              if (delta) {
                accumulated += delta
                const content = accumulated
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantMessageId ? { ...message, content } : message
                  )
                )
              }
            } catch (error) {
              console.error("Failed to parse Groq stream chunk", error, data)
            }
          }

          if (streamComplete) {
            break
          }
        }
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: accumulated.trim() || "I'm here whenever you're ready to chat.",
                timestamp: new Date(),
                read: false,
              }
            : message
        )
      )
    } catch (error) {
      console.error("Groq request failed", error)
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: "I ran into an issue replying. Please try again shortly.",
                timestamp: new Date(),
              }
            : message
        )
      )
    } finally {
      setIsAssistantResponding(false)
    }
  }

  const handleSendMessage = (content: string) => {
    if (!selectedUserId) return

    const trimmedContent = content.trim()

    if (!trimmedContent) return

    if (selectedUserId === AI_ASSISTANT_ID && isAssistantResponding) {
      return
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedUserId,
      content: trimmedContent,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, newMessage])

    if (selectedUserId === AI_ASSISTANT_ID) {
      void handleAssistantReply(newMessage)
      return
    }

    setTimeout(() => {
      const autoReply: Message = {
        id: `msg-${Date.now()}-reply`,
        senderId: selectedUserId,
        receiverId: currentUser.id,
        content: "Thanks for your message! I'll get back to you soon. 👍",
        timestamp: new Date(),
        read: false,
      }
      setMessages((prev) => [...prev, autoReply])
    }, 2000)
  }

  const selectedUser = getAllUsers().find((u) => u.id === selectedUserId)

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />
      <ChatWindow
        selectedUserId={selectedUserId}
        messages={messages}
        onSendMessage={handleSendMessage}
        isAssistantResponding={isAssistantResponding}
      />
    </div>
  )
}
