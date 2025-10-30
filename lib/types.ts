export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline"
  lastSeen?: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  userId: string
  user: User
  lastMessage?: Message
  unreadCount: number
}