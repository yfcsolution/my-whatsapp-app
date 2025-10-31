"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddPhoneNumberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AddPhoneNumberDialog({ open, onOpenChange, onSubmit }: AddPhoneNumberDialogProps) {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    displayName: "",
    whatsappPhoneNumberId: "",
    whatsappAccessToken: "",
    department: "custom",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      phoneNumber: "",
      displayName: "",
      whatsappPhoneNumberId: "",
      whatsappAccessToken: "",
      department: "custom",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add WhatsApp Business Number</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="e.g., Support, Sales, Main"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappPhoneNumberId">WhatsApp Phone Number ID</Label>
            <Input
              id="whatsappPhoneNumberId"
              placeholder="From Meta Business Manager"
              value={formData.whatsappPhoneNumberId}
              onChange={(e) => setFormData({ ...formData, whatsappPhoneNumberId: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappAccessToken">WhatsApp Access Token</Label>
            <Input
              id="whatsappAccessToken"
              type="password"
              placeholder="EAA..."
              value={formData.whatsappAccessToken}
              onChange={(e) => setFormData({ ...formData, whatsappAccessToken: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Phone Number</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
