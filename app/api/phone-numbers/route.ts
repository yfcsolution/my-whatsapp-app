import { NextResponse } from "next/server"
import { getPhoneNumbers, createPhoneNumber } from "@/lib/db/phone-numbers"

export async function GET() {
  try {
    const phoneNumbers = await getPhoneNumbers()
    return NextResponse.json({ success: true, data: phoneNumbers })
  } catch (error) {
    console.error("[v0] Error fetching phone numbers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch phone numbers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, displayName, whatsappPhoneNumberId, whatsappAccessToken, department } = body

    if (!phoneNumber || !displayName || !whatsappPhoneNumberId || !whatsappAccessToken) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newPhoneNumber = await createPhoneNumber({
      phoneNumber,
      displayName,
      whatsappPhoneNumberId,
      whatsappAccessToken,
      department: department || "custom",
      isActive: true,
    })

    return NextResponse.json({ success: true, data: newPhoneNumber })
  } catch (error) {
    console.error("[v0] Error creating phone number:", error)
    return NextResponse.json({ success: false, error: "Failed to create phone number" }, { status: 500 })
  }
}
