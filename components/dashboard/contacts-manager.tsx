"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Camera, Save, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

export function ContactsManager() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    status: "offline" as "online" | "offline",
  })

  useEffect(() => {
    const savedContacts = localStorage.getItem("customContacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveContact = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    let updatedContacts: User[]

    if (editingContact) {
      updatedContacts = contacts.map((c) =>
        c.id === editingContact.id
          ? { ...editingContact, ...formData }
          : c
      )
    } else {
      const newContact: User = {
        id: `custom-${Date.now()}`,
        ...formData,
      }
      updatedContacts = [...contacts, newContact]
    }

    setContacts(updatedContacts)
    localStorage.setItem("customContacts", JSON.stringify(updatedContacts))

    toast({
      title: editingContact ? "Contact updated" : "Contact added",
      description: `${formData.name} has been ${editingContact ? "updated" : "added"} successfully.`,
    })

    handleCloseDialog()
  }

  const handleEditContact = (contact: User) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      email: contact.email,
      avatar: contact.avatar,
      status: contact.status,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter((c) => c.id !== contactId)
    setContacts(updatedContacts)
    localStorage.setItem("customContacts", JSON.stringify(updatedContacts))

    toast({
      title: "Contact deleted",
      description: "The contact has been removed successfully.",
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
    setFormData({
      name: "",
      email: "",
      avatar: "",
      status: "offline",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contacts Manager</CardTitle>
            <CardDescription>Add and manage your chat contacts</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-whatsapp-green hover:bg-whatsapp-green-dark">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                <DialogDescription>
                  {editingContact ? "Update contact information" : "Create a new contact for your chat list"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.avatar} alt={formData.name} />
                      <AvatarFallback className="text-xl">
                        {formData.name[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="contact-avatar"
                      className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-whatsapp-green text-white hover:bg-whatsapp-green-dark transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <input
                        id="contact-avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-status">Status</Label>
                  <select
                    id="contact-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "online" | "offline" })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <Button onClick={handleSaveContact} className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark">
                  <Save className="mr-2 h-4 w-4" />
                  {editingContact ? "Update Contact" : "Add Contact"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-balance">No contacts yet</h3>
            <p className="text-sm text-gray-500 text-pretty">Add your first contact to start chatting</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-balance truncate">{contact.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      contact.status === "online" ? "bg-whatsapp-green" : "bg-gray-400"
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditContact(contact)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
