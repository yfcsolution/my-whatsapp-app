import type { User, Message, Conversation } from "./types"

export const AI_ASSISTANT_ID = "ai-assistant"

const aiAssistant: User = {
  id: AI_ASSISTANT_ID,
  name: "AI Assistant",
  email: "assistant@groq.com",
  avatar: "https://images.unsplash.com/photo-1529220502050-0d3d71f7121a?w=100&h=100&fit=crop",
  status: "online",
}

export const currentUser: User = {
  id: "current-user",
  name: "You",
  email: "you@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  status: "online",
}

export const users: User[] = [
  aiAssistant,
  {
    id: "user-1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "online",
  },
  {
    id: "user-2",
    name: "Mike Chen",
    email: "mike@example.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    status: "online",
  },
  {
    id: "user-3",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "user-4",
    name: "James Rodriguez",
    email: "james@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
]

export const initialMessages: Message[] = [
  {
    id: "msg-ai-1",
    senderId: AI_ASSISTANT_ID,
    receiverId: "current-user",
    content: "Hey there! I’m your AI assistant. Ask me anything and I’ll help out.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    read: false,
  },
  {
    id: "msg-1",
    senderId: "user-1",
    receiverId: "current-user",
    content: "Hey! How are you doing?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
  {
    id: "msg-2",
    senderId: "current-user",
    receiverId: "user-1",
    content: "I'm doing great! Thanks for asking 😊",
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    read: true,
  },
  {
    id: "msg-3",
    senderId: "user-1",
    receiverId: "current-user",
    content: "That's awesome! Are we still on for the meeting tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    read: true,
  },
  {
    id: "msg-4",
    senderId: "current-user",
    receiverId: "user-1",
    content: "Yes, absolutely! 10 AM works perfectly for me.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: true,
  },
  {
    id: "msg-5",
    senderId: "user-2",
    receiverId: "current-user",
    content: "Did you see the latest updates?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "msg-6",
    senderId: "user-3",
    receiverId: "current-user",
    content: "Thanks for your help yesterday!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
  },
]

export function getConversations(messages: Message[]): Conversation[] {
  const conversationMap = new Map<string, Conversation>()

  messages.forEach((message) => {
    const otherUserId =
      message.senderId === currentUser.id ? message.receiverId : message.senderId
    const user = users.find((u) => u.id === otherUserId)

    if (!user) return

    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, {
        id: otherUserId,
        userId: otherUserId,
        user,
        lastMessage: message,
        unreadCount: 0,
      })
    }

    const conversation = conversationMap.get(otherUserId)!
    if (message.timestamp > (conversation.lastMessage?.timestamp || new Date(0))) {
      conversation.lastMessage = message
    }

    if (message.receiverId === currentUser.id && !message.read) {
      conversation.unreadCount++
    }
  })

  return Array.from(conversationMap.values()).sort((a, b) => {
    const aTime = a.lastMessage?.timestamp.getTime() || 0
    const bTime = b.lastMessage?.timestamp.getTime() || 0
    return bTime - aTime
  })
}

export function getMessagesForUser(messages: Message[], userId: string): Message[] {
  return messages
    .filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === currentUser.id)
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export function getAllUsers(): User[] {
  const customContacts = localStorage.getItem("customContacts")
  const custom = customContacts ? JSON.parse(customContacts) : []
  return [...users, ...custom]
}

export function getUserById(userId: string): User | undefined {
  return getAllUsers().find((u) => u.id === userId)
}
