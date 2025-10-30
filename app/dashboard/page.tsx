"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { ContactsManager } from "@/components/dashboard/contacts-manager"
import { AppearanceSettings } from "@/components/dashboard/appearance-settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, User, Users, Settings, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated !== "true") {
      router.push("/auth")
    }
  }, [router])

  const handleGoToChat = () => {
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-whatsapp-green p-3">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 text-balance">Dashboard</h1>
              <p className="text-gray-600 text-pretty">Customize your chat experience</p>
            </div>
          </div>
          <Button
            onClick={handleGoToChat}
            className="bg-whatsapp-green hover:bg-whatsapp-green-dark"
          >
            Go to Chat
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <ContactsManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AppearanceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}