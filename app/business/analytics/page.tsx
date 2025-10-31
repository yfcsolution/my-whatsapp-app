"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageCircle, Send, Users, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function AnalyticsContent() {
  const searchParams = useSearchParams()
  const phoneId = searchParams.get("phone")

  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [selectedPhone, setSelectedPhone] = useState(phoneId || "")
  const [phoneNumber, setPhoneNumber] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhoneNumbers()
  }, [])

  useEffect(() => {
    if (selectedPhone) {
      fetchPhoneNumber()
      fetchStats()
    }
  }, [selectedPhone])

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch("/api/phone-numbers")
      const data = await response.json()
      if (data.success) {
        setPhoneNumbers(data.data)
        if (!selectedPhone && data.data.length > 0) {
          setSelectedPhone(data.data[0]._id)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching phone numbers:", error)
    }
  }

  const fetchPhoneNumber = async () => {
    try {
      const response = await fetch(`/api/phone-numbers/${selectedPhone}`)
      const data = await response.json()
      if (data.success) {
        setPhoneNumber(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching phone number:", error)
    }
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?phoneNumberId=${selectedPhone}&type=dashboard`)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatResponseTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/business">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">Analytics</h1>
              <p className="text-sm text-muted-foreground">View messaging statistics and insights</p>
            </div>
          </div>
          <Select value={selectedPhone} onValueChange={setSelectedPhone}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select phone number" />
            </SelectTrigger>
            <SelectContent>
              {phoneNumbers.map((phone: any) => (
                <SelectItem key={phone._id} value={phone._id}>
                  {phone.displayName} ({phone.phoneNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="p-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Today's Overview</h2>
              <p className="text-sm text-muted-foreground">
                {phoneNumber?.displayName} ({phoneNumber?.phoneNumber})
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                    <p className="mt-2 text-3xl font-bold">{stats?.todayMessages || 0}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inbound</p>
                    <p className="mt-2 text-3xl font-bold">{stats?.todayInbound || 0}</p>
                  </div>
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <MessageCircle className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outbound</p>
                    <p className="mt-2 text-3xl font-bold">{stats?.todayOutbound || 0}</p>
                  </div>
                  <div className="rounded-full bg-green-500/10 p-3">
                    <Send className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Conversations</p>
                    <p className="mt-2 text-3xl font-bold">{stats?.activeConversations || 0}</p>
                  </div>
                  <div className="rounded-full bg-purple-500/10 p-3">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Response Time</h3>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-500/10 p-4">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{formatResponseTime(stats?.averageResponseTime || 0)}</p>
                    <p className="text-sm text-muted-foreground">Average response time</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Message Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Inbound</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${
                              stats?.todayMessages > 0 ? (stats.todayInbound / stats.todayMessages) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats?.todayInbound || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Outbound</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${
                              stats?.todayMessages > 0 ? (stats.todayOutbound / stats.todayMessages) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats?.todayOutbound || 0}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mt-6 p-6">
              <h3 className="mb-4 font-semibold">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Link href={`/business/inbox?phone=${selectedPhone}`}>
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    View Inbox
                  </Button>
                </Link>
                <Link href={`/business/send?phone=${selectedPhone}`}>
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AnalyticsContent />
    </Suspense>
  )
}
