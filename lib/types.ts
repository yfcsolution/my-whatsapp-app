// lib/types.ts
export interface User {
  id: string
  name: string
  avatar: string
  lastSeen?: Date
  status: "online" | "offline" | "away"
}

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

export interface Conversation {
  userId: string
  lastMessage: string
  timestamp: Date
  unread: number
}
