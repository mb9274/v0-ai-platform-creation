"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    // Check initial status
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage && isOnline) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className={isOnline ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        <div className="flex items-center space-x-2">
          {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
          <AlertDescription className={isOnline ? "text-green-800" : "text-red-800"}>
            {isOnline ? "Connection restored! You're back online." : "You're offline. Some features may be limited."}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  )
}
