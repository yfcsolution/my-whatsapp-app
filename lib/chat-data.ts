// lib/chat-data.ts - Fixed version

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

export const currentUser: User = {
  id: "user-1",
  name: "You",
  avatar: "/avatars/user.jpg",
  status: "online",
}

export const AI_ASSISTANT_ID = "ai-assistant"

// Fixed: Ensure all arrays are properly initialized
export const allUsers: User[] = [
  {
    id: "user-2",
    name: "John Doe",
    avatar: "/avatars/user-2.jpg",
    status: "online",
    lastSeen: new Date(),
  },
  {
    id: "user-3",
    name: "Jane Smith",
    avatar: "/avatars/user-3.jpg",
    status: "offline",
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: AI_ASSISTANT_ID,
    name: "AI Assistant",
    avatar: "/avatars/ai.jpg",
    status: "online",
  },
]

// ADD THIS LINE TO FIX THE MISSING EXPORT ERROR:
export const users = allUsers;

export const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello there!",
    senderId: "user-2",
    receiverId: "user-1",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    status: "read",
  },
  {
    id: "2",
    content: "Hi! How can I help you?",
    senderId: "user-1",
    receiverId: "user-2",
    timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
    status: "read",
  },
  {
    id: "3",
    content: "Welcome to the AI Assistant! How can I assist you today?",
    senderId: AI_ASSISTANT_ID,
    receiverId: "user-1",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: "read",
  },
]

// Fixed: Add proper error handling
export function getConversations(): Conversation[] {
  try {
    const conversations: Conversation[] = allUsers.map(user => ({
      userId: user.id,
      lastMessage: getLastMessageForUser(user.id) || "No messages yet",
      timestamp: new Date(),
      unread: 0,
    }))
    
    return conversations || []
  } catch (error) {
    console.error("Error getting conversations:", error)
    return []
  }
}

export function getAllUsers(): User[] {
  return allUsers || []
}

export function getMessagesForUser(userId: string): Message[] {
  try {
    if (!initialMessages || !Array.isArray(initialMessages)) {
      return []
    }
    
    const userMessages = initialMessages.filter(
      message => message.senderId === userId || message.receiverId === userId
    )
    
    return userMessages || []
  } catch (error) {
    console.error("Error getting messages for user:", error)
    return []
  }
}

function getLastMessageForUser(userId: string): string {
  try {
    if (!initialMessages || !Array.isArray(initialMessages)) {
      return "No messages yet"
    }
    
    const userMessages = getMessagesForUser(userId)
    if (userMessages.length === 0) {
      return "No messages yet"
    }
    
    const lastMessage = userMessages[userMessages.length - 1]
    return lastMessage?.content || "No messages yet"
  } catch (error) {
    console.error("Error getting last message:", error)
    return "No messages yet"
  }
}
