"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProfileSettings() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setName(profile.name || "")
      setEmail(profile.email || "")
      setStatus(profile.status || "")
      setAvatar(profile.avatar || "")
    } else {
      const userName = localStorage.getItem("userName") || "User"
      setName(userName)
    }
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const profile = {
      name,
      email,
      status,
      avatar,
    }
    localStorage.setItem("userProfile", JSON.stringify(profile))
    localStorage.setItem("userName", name)
    
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your personal information and profile picture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt={name} />
              <AvatarFallback className="text-2xl">{name[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-whatsapp-green text-white hover:bg-whatsapp-green-dark transition-colors"
            >
              <Camera className="h-4 w-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status Message</Label>
          <Textarea
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Hey there! I'm using WhatsApp"
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark">
          <Save className="mr-2 h-4 w-4" />
          Save Profile
        </Button>
      </CardContent>
    </Card>
  )
}