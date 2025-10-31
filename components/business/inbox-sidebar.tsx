"use client"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface InboxSidebarProps {
  conversations: any[]
  selectedConversation: any
  onSelectConversation: (conversation: any) => void
  phoneNumber: any
  loading: boolean
}

export function InboxSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  phoneNumber,
  loading,
}: InboxSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customerPhone.includes(searchQuery) || conv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 24) {
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="flex w-80 flex-col border-r bg-background">
      <div className="border-b p-4">
        <div className="mb-4 flex items-center gap-2">
          <Link href="/business">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="font-semibold">{phoneNumber?.displayName || "Inbox"}</h2>
            <p className="text-xs text-muted-foreground">{phoneNumber?.phoneNumber}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted ${
                  selectedConversation?._id === conversation._id ? "bg-muted" : ""
                }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {conversation.customerName?.[0] || conversation.customerPhone.slice(-2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{conversation.customerName || conversation.customerPhone}</p>
                    <span className="text-xs text-muted-foreground">{formatTime(conversation.lastMessageAt)}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{conversation.lastMessagePreview}</p>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="mt-1">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
