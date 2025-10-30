"use client"

import { useEffect, useRef } from "react"
import { ChatHeader } from "./chat-header"
import { MessageBubble } from "./message-bubble"
import { MessageInput } from "./message-input"
import { users, currentUser, getMessagesForUser, AI_ASSISTANT_ID } from "@/lib/chat-data"
import type { Message } from "@/lib/types"

interface ChatWindowProps {
  selectedUserId: string | null
  messages: Message[]
  onSendMessage: (content: string) => void
  isAssistantResponding: boolean
}

export function ChatWindow({ selectedUserId, messages, onSendMessage, isAssistantResponding }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedUser = users.find((u) => u.id === selectedUserId)
  const userMessages = selectedUserId ? getMessagesForUser(messages, selectedUserId) : []
  const isAssistantChat = selectedUserId === AI_ASSISTANT_ID
  const showTypingIndicator = isAssistantChat && isAssistantResponding

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [userMessages, showTypingIndicator])

  if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 text-balance">WhatsApp Web</h3>
          <p className="text-sm text-gray-500 text-pretty mt-2 max-w-sm">
            Send and receive messages without keeping your phone online.
          </p>
        </div>
      </div>
    )
  }

  const groupMessages = (msgs: Message[]) => {
    const grouped: Array<{ message: Message; isGrouped: boolean }> = []
    
    msgs.forEach((msg, index) => {
      const prevMsg = msgs[index - 1]
      const isGrouped = prevMsg && 
        prevMsg.senderId === msg.senderId && 
        msg.timestamp.getTime() - prevMsg.timestamp.getTime() < 60000
      
      grouped.push({ message: msg, isGrouped })
    })
    
    return grouped
  }

  const groupedMessages = groupMessages(userMessages)

  return (
    <div className="flex flex-1 flex-col">
      <ChatHeader user={selectedUser} />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundColor: "#efeae2",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="mx-auto max-w-4xl space-y-1">
          {groupedMessages.map(({ message, isGrouped }, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.id}
              isGrouped={isGrouped}
              showAvatar={!isGrouped}
            />
          ))}
          {showTypingIndicator && (
            <div className="flex">
              <div className="rounded-2xl bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
                Assistant is responding...
              </div>
            </div>
          )}
        </div>
      </div>

      <MessageInput onSendMessage={onSendMessage} disabled={showTypingIndicator} />
    </div>
  )
}
