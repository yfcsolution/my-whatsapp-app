import { getDatabase } from "../mongodb"
import type { PhoneNumber } from "./schema"
import { ObjectId } from "mongodb"

export async function getPhoneNumbers(): Promise<PhoneNumber[]> {
  const db = await getDatabase()
  return db.collection<PhoneNumber>("phone_numbers").find({ isActive: true }).sort({ createdAt: -1 }).toArray()
}

export async function getPhoneNumberById(id: string): Promise<PhoneNumber | null> {
  const db = await getDatabase()
  return db.collection<PhoneNumber>("phone_numbers").findOne({ _id: new ObjectId(id) })
}

export async function createPhoneNumber(
  data: Omit<PhoneNumber, "_id" | "createdAt" | "updatedAt">,
): Promise<PhoneNumber> {
  const db = await getDatabase()
  const now = new Date()

  const phoneNumber: PhoneNumber = {
    ...data,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<PhoneNumber>("phone_numbers").insertOne(phoneNumber)
  return { ...phoneNumber, _id: result.insertedId }
}

export async function updatePhoneNumber(id: string, data: Partial<PhoneNumber>): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<PhoneNumber>("phone_numbers").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
  )
  return result.modifiedCount > 0
}

export async function deletePhoneNumber(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<PhoneNumber>("phone_numbers").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isActive: false,
        updatedAt: new Date(),
      },
    },
  )
  return result.modifiedCount > 0
}
