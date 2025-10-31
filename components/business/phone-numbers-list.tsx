"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Trash2 } from "@/lib/icons"
import Link from "next/link"

interface PhoneNumber {
  _id: string
  phoneNumber: string
  displayName: string
  department: string
  isActive: boolean
  createdAt: string
}

interface PhoneNumbersListProps {
  phoneNumbers: PhoneNumber[]
  onRefresh: () => void
}

export function PhoneNumbersList({ phoneNumbers, onRefresh }: PhoneNumbersListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this phone number?")) return

    try {
      const response = await fetch(`/api/phone-numbers/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("[v0] Error deleting phone number:", error)
    }
  }

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      support: "bg-blue-500",
      sales: "bg-green-500",
      main: "bg-purple-500",
      custom: "bg-gray-500",
    }
    return colors[dept] || colors.custom
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No phone numbers yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first WhatsApp Business phone number to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {phoneNumbers.map((phone) => (
        <Card key={phone._id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{phone.displayName}</h3>
                <Badge variant="secondary" className="text-xs">
                  {phone.department}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{phone.phoneNumber}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${phone.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-xs text-muted-foreground">{phone.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link href={`/business/inbox?phone=${phone._id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                Inbox
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => handleDelete(phone._id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
