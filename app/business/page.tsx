"use client"

import { useState, useEffect } from "react"
import { PhoneNumbersList } from "@/components/business/phone-numbers-list"
import { AddPhoneNumberDialog } from "@/components/business/add-phone-number-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function BusinessDashboard() {
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchPhoneNumbers()
  }, [])

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch("/api/phone-numbers")
      const data = await response.json()
      if (data.success) {
        setPhoneNumbers(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching phone numbers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPhoneNumber = async (data: any) => {
    try {
      const response = await fetch("/api/phone-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        await fetchPhoneNumbers()
        setShowAddDialog(false)
      }
    } catch (error) {
      console.error("[v0] Error adding phone number:", error)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">WhatsApp Business Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your business phone numbers and messages</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Phone Number
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading phone numbers...</p>
            </div>
          </div>
        ) : (
          <PhoneNumbersList phoneNumbers={phoneNumbers} onRefresh={fetchPhoneNumbers} />
        )}
      </main>

      <AddPhoneNumberDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={handleAddPhoneNumber} />
    </div>
  )
}
