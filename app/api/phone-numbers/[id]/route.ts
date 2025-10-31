import { NextResponse } from "next/server"
import { getPhoneNumberById, updatePhoneNumber, deletePhoneNumber } from "@/lib/db/phone-numbers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const phoneNumber = await getPhoneNumberById(params.id)

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: "Phone number not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: phoneNumber })
  } catch (error) {
    console.error("[v0] Error fetching phone number:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch phone number" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updated = await updatePhoneNumber(params.id, body)

    if (!updated) {
      return NextResponse.json({ success: false, error: "Phone number not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Phone number updated" })
  } catch (error) {
    console.error("[v0] Error updating phone number:", error)
    return NextResponse.json({ success: false, error: "Failed to update phone number" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deletePhoneNumber(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Phone number not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Phone number deleted" })
  } catch (error) {
    console.error("[v0] Error deleting phone number:", error)
    return NextResponse.json({ success: false, error: "Failed to delete phone number" }, { status: 500 })
  }
}
