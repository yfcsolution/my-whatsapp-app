"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AppearanceSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    timeFormat: "12h" as "12h" | "24h",
    showSeconds: false,
    showOnlineStatus: true,
    showLastSeen: true,
    showReadReceipts: true,
    compactMode: false,
    fontSize: "medium" as "small" | "medium" | "large",
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    toast({
      title: "Settings saved",
      description: "Your appearance settings have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize how your chat interface looks and behaves</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time-format">Time Format</Label>
            <select
              id="time-format"
              value={settings.timeFormat}
              onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value as "12h" | "24h" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="12h">12-hour (1:30 PM)</option>
              <option value="24h">24-hour (13:30)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <select
              id="font-size"
              value={settings.fontSize}
              onChange={(e) => setSettings({ ...settings, fontSize: e.target.value as "small" | "medium" | "large" })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="show-seconds">Show Seconds in Time</Label>
              <p className="text-sm text-muted-foreground">Display seconds in message timestamps</p>
            </div>
            <Switch
              id="show-seconds"
              checked={settings.showSeconds}
              onCheckedChange={(checked) => setSettings({ ...settings, showSeconds: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="show-online">Show Online Status</Label>
              <p className="text-sm text-muted-foreground">Display when contacts are online</p>
            </div>
            <Switch
              id="show-online"
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) => setSettings({ ...settings, showOnlineStatus: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="show-last-seen">Show Last Seen</Label>
              <p className="text-sm text-muted-foreground">Display last seen timestamps</p>
            </div>
            <Switch
              id="show-last-seen"
              checked={settings.showLastSeen}
              onCheckedChange={(checked) => setSettings({ ...settings, showLastSeen: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="read-receipts">Read Receipts</Label>
              <p className="text-sm text-muted-foreground">Show blue checkmarks when messages are read</p>
            </div>
            <Switch
              id="read-receipts"
              checked={settings.showReadReceipts}
              onCheckedChange={(checked) => setSettings({ ...settings, showReadReceipts: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing for more content on screen</p>
            </div>
            <Switch
              id="compact-mode"
              checked={settings.compactMode}
              onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}