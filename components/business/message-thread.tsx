"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useRef } from "react"

interface MessageThreadProps {
  messages: any[]
  conversation: any
  phoneNumber: any
}

export function MessageThread({ messages, conversation, phoneNumber }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b bg-background p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{conversation.customerName?.[0] || conversation.customerPhone.slice(-2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{conversation.customerName || conversation.customerPhone}</h3>
            <p className="text-xs text-muted-foreground">{conversation.customerPhone}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages
              .slice()
              .reverse()
              .map((message) => {
                const isOutbound = message.direction === "outbound"
                return (
                  <div key={message._id} className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isOutbound ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content.text}</p>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                        {isOutbound && (
                          <span className="text-xs opacity-70">
                            {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
