import { NextResponse } from "next/server"
import { getDashboardStats, getAnalytics } from "@/lib/db/analytics"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phoneNumberId = searchParams.get("phoneNumberId")
    const type = searchParams.get("type") || "dashboard"

    if (!phoneNumberId) {
      return NextResponse.json({ success: false, error: "phoneNumberId is required" }, { status: 400 })
    }

    if (type === "dashboard") {
      const stats = await getDashboardStats(phoneNumberId)
      return NextResponse.json({ success: true, data: stats })
    } else if (type === "detailed") {
      const startDate = searchParams.get("startDate")
      const endDate = searchParams.get("endDate")

      if (!startDate || !endDate) {
        return NextResponse.json(
          { success: false, error: "startDate and endDate are required for detailed analytics" },
          { status: 400 },
        )
      }

      const analytics = await getAnalytics(phoneNumberId, new Date(startDate), new Date(endDate))
      return NextResponse.json({ success: true, data: analytics })
    }

    return NextResponse.json({ success: false, error: "Invalid analytics type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
