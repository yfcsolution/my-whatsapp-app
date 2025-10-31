import type { ObjectId } from "mongodb"

// Phone Number Schema
export interface PhoneNumber {
  _id?: ObjectId
  phoneNumber: string // E.164 format
  displayName: string // e.g., "Support", "Sales", "Main"
  whatsappPhoneNumberId: string // WhatsApp Business API Phone Number ID
  whatsappAccessToken: string // Access token for this phone number
  department: "support" | "sales" | "main" | "custom"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Message Schema
export interface Message {
  _id?: ObjectId
  phoneNumberId: ObjectId // Reference to PhoneNumber
  whatsappMessageId: string // WhatsApp message ID
  from: string // Sender phone number
  to: string // Recipient phone number
  direction: "inbound" | "outbound"
  type: "text" | "template" | "image" | "document" | "audio" | "video"
  content: {
    text?: string
    templateName?: string
    templateLanguage?: string
    mediaUrl?: string
    caption?: string
  }
  status: "sent" | "delivered" | "read" | "failed" | "queued"
  metadata?: Record<string, any>
  timestamp: Date
  createdAt: Date
  updatedAt: Date
}

// Conversation Schema
export interface Conversation {
  _id?: ObjectId
  phoneNumberId: ObjectId // Which business phone number
  customerPhone: string // Customer's phone number
  customerName?: string
  lastMessageAt: Date
  lastMessagePreview: string
  unreadCount: number
  status: "active" | "archived" | "closed"
  assignedTo?: string // User ID or agent name
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

// Analytics Schema
export interface Analytics {
  _id?: ObjectId
  phoneNumberId: ObjectId
  date: Date // Daily aggregation
  metrics: {
    totalMessages: number
    inboundMessages: number
    outboundMessages: number
    uniqueCustomers: number
    averageResponseTime: number // in seconds
    messagesByHour: Record<string, number> // "0" to "23"
  }
  createdAt: Date
}
