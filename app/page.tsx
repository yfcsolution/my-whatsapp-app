"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const hasSetupProfile = localStorage.getItem("userProfile")

    if (isAuthenticated === "true") {
      if (hasSetupProfile) {
        router.push("/chat")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/business")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
