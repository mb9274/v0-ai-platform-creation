"use client"

import { AlertCircle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { isSupabaseConfigured } from "@/lib/supabase/client"

export function SetupBanner() {
  if (isSupabaseConfigured()) {
    return null
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Setup Required</AlertTitle>
      <AlertDescription className="text-orange-700">
        <p className="mb-2">To enable full functionality, please configure your Supabase integration:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to Project Settings in the top right</li>
          <li>Add Supabase integration</li>
          <li>Run the database schema script from the scripts folder</li>
        </ol>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
          onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
        >
          <Database className="w-4 h-4 mr-2" />
          Open Supabase Dashboard
        </Button>
      </AlertDescription>
    </Alert>
  )
}
