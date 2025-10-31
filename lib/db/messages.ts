import { getDatabase } from "../mongodb"
import type { Message, Conversation } from "./schema"
import { ObjectId } from "mongodb"

export async function saveMessage(message: Omit<Message, "_id" | "createdAt" | "updatedAt">): Promise<Message> {
  const db = await getDatabase()
  const now = new Date()

  const newMessage: Message = {
    ...message,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Message>("messages").insertOne(newMessage)

  // Update conversation
  await updateConversation(
    message.phoneNumberId,
    message.direction === "inbound" ? message.from : message.to,
    message.content.text || "",
  )

  return { ...newMessage, _id: result.insertedId }
}

export async function getMessages(phoneNumberId: string, customerPhone: string, limit = 50): Promise<Message[]> {
  const db = await getDatabase()
  return db
    .collection<Message>("messages")
    .find({
      phoneNumberId: new ObjectId(phoneNumberId),
      $or: [{ from: customerPhone }, { to: customerPhone }],
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
}

export async function updateMessageStatus(whatsappMessageId: string, status: Message["status"]): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Message>("messages").updateOne(
    { whatsappMessageId },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )
  return result.modifiedCount > 0
}

async function updateConversation(phoneNumberId: ObjectId, customerPhone: string, lastMessage: string): Promise<void> {
  const db = await getDatabase()
  const now = new Date()

  await db.collection<Conversation>("conversations").updateOne(
    { phoneNumberId, customerPhone },
    {
      $set: {
        lastMessageAt: now,
        lastMessagePreview: lastMessage.substring(0, 100),
        updatedAt: now,
      },
      $setOnInsert: {
        unreadCount: 0,
        status: "active",
        createdAt: now,
      },
    },
    { upsert: true },
  )
}

export async function getConversations(
  phoneNumberId: string,
  status: "active" | "archived" | "all" = "active",
): Promise<Conversation[]> {
  const db = await getDatabase()
  const query: any = { phoneNumberId: new ObjectId(phoneNumberId) }

  if (status !== "all") {
    query.status = status
  }

  return db.collection<Conversation>("conversations").find(query).sort({ lastMessageAt: -1 }).toArray()
}

export async function markConversationAsRead(conversationId: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Conversation>("conversations").updateOne(
    { _id: new ObjectId(conversationId) },
    {
      $set: {
        unreadCount: 0,
        updatedAt: new Date(),
      },
    },
  )
  return result.modifiedCount > 0
}
