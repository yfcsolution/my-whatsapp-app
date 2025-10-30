"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchIcon, MessageCircleIcon, MoreVerticalIcon, ArchiveIcon, SettingsIcon } from "@/lib/icons"
import { currentUser } from "@/lib/chat-data"
import type { Conversation } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ChatSidebarProps {
  conversations: Conversation[]
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
}

export function ChatSidebar({ conversations, selectedUserId, onSelectUser }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "favourites" | "groups">("all")

  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "unread" as const, label: "Unread" },
    { id: "favourites" as const, label: "Favourites" },
    { id: "groups" as const, label: "Groups" },
  ]

  return (
    <div className="flex w-full max-w-md flex-col border-r bg-white">
      <div className="flex items-center gap-4 border-b bg-gray-50 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-balance">WhatsApp</h2>
        </div>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="rounded-full p-2 hover:bg-gray-200 transition-colors"
          title="Settings"
        >
          <SettingsIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-200 transition-colors">
          <MessageCircleIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-200 transition-colors">
          <MoreVerticalIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="border-b p-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search or start new chat" className="pl-10 bg-gray-50 border-none" />
        </div>
      </div>

      <div className="flex gap-2 border-b px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-whatsapp-green-light text-whatsapp-green-dark"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <button className="flex w-full items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-gray-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp-green">
            <ArchiveIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-balance">Archived</h3>
          </div>
          <div className="h-5 w-5 rounded-full bg-whatsapp-green flex items-center justify-center">
            <span className="text-xs font-semibold text-white">3</span>
          </div>
        </button>

        {conversations.map((conversation) => {
          const isSelected = selectedUserId === conversation.userId
          return (
            <button
              key={conversation.id}
              onClick={() => onSelectUser(conversation.userId)}
              className={`relative flex w-full items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-gray-50 ${
                isSelected ? "bg-gray-100" : ""
              }`}
            >
              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-whatsapp-green" />}
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                  <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                </Avatar>
                {conversation.user.status === "online" && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-whatsapp-green" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-balance truncate">{conversation.user.name}</h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: false })}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-gray-600 text-pretty flex-1">
                      {conversation.lastMessage.senderId === currentUser.id && (
                        <span className="text-gray-500">You: </span>
                      )}
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-whatsapp-green px-1.5 text-xs font-semibold text-white">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </ScrollArea>
    </div>
  )
}
