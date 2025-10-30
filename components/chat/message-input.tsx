"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SmileIcon, PaperclipIcon, MicIcon, SendIcon } from "@/lib/icons"

interface MessageInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          disabled={disabled}
        >
          <SmileIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          disabled={disabled}
        >
          <PaperclipIcon className="h-6 w-6" />
        </button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Assistant is responding..." : "Type a message"}
          className="flex-1 border-none bg-white rounded-lg py-2.5"
          disabled={disabled}
        />
        {message.trim() ? (
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-whatsapp-green hover:bg-whatsapp-green-dark h-10 w-10"
            disabled={disabled}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        ) : (
          <button
            type="button"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            disabled={disabled}
          >
            <MicIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </form>
  )
}
