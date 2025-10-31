import { getDatabase } from "../mongodb"
import type { Analytics } from "./schema"
import { ObjectId } from "mongodb"

export async function recordMessageAnalytics(
  phoneNumberId: ObjectId,
  direction: "inbound" | "outbound",
  timestamp: Date,
): Promise<void> {
  const db = await getDatabase()
  const date = new Date(timestamp.toDateString()) // Start of day
  const hour = timestamp.getHours().toString()

  await db.collection<Analytics>("analytics").updateOne(
    { phoneNumberId, date },
    {
      $inc: {
        "metrics.totalMessages": 1,
        [`metrics.${direction}Messages`]: 1,
        [`metrics.messagesByHour.${hour}`]: 1,
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )
}

export async function getAnalytics(phoneNumberId: string, startDate: Date, endDate: Date): Promise<Analytics[]> {
  const db = await getDatabase()
  return db
    .collection<Analytics>("analytics")
    .find({
      phoneNumberId: new ObjectId(phoneNumberId),
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: 1 })
    .toArray()
}

export async function getDashboardStats(phoneNumberId: string): Promise<{
  todayMessages: number
  todayInbound: number
  todayOutbound: number
  activeConversations: number
  averageResponseTime: number
}> {
  const db = await getDatabase()
  const today = new Date(new Date().toDateString())

  const todayAnalytics = await db.collection<Analytics>("analytics").findOne({
    phoneNumberId: new ObjectId(phoneNumberId),
    date: today,
  })

  const activeConversations = await db.collection("conversations").countDocuments({
    phoneNumberId: new ObjectId(phoneNumberId),
    status: "active",
  })

  return {
    todayMessages: todayAnalytics?.metrics.totalMessages || 0,
    todayInbound: todayAnalytics?.metrics.inboundMessages || 0,
    todayOutbound: todayAnalytics?.metrics.outboundMessages || 0,
    activeConversations,
    averageResponseTime: todayAnalytics?.metrics.averageResponseTime || 0,
  }
}
