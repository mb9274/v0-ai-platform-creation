"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VoiceRecorder } from "@/components/audio/voice-recorder"
import { WifiOff, Send, Clock, CheckCircle } from "lucide-react"
import { syncManager } from "@/lib/offline/sync-manager"

interface OfflineConsultationProps {
  patientId: string
  phoneNumber: string
}

export function OfflineConsultation({ patientId, phoneNumber }: OfflineConsultationProps) {
  const [symptoms, setSymptoms] = useState("")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load pending submissions
    loadPendingSubmissions()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadPendingSubmissions = async () => {
    try {
      const pending = await syncManager.getUnsyncedItems()
      const consultations = pending.filter((item) => item.type === "consultation")
      setPendingSubmissions(consultations)
    } catch (error) {
      console.error("Error loading pending submissions:", error)
    }
  }

  const handleVoiceRecording = (blob: Blob, duration: number) => {
    setAudioBlob(blob)
  }

  const submitConsultation = async () => {
    if (!symptoms.trim() && !audioBlob) {
      alert("Please describe your symptoms or record a voice message")
      return
    }

    setIsSubmitting(true)

    try {
      const consultationData = {
        patientId,
        phoneNumber,
        consultationType: audioBlob ? "voice" : "text",
        symptoms: symptoms.trim(),
        urgency: "routine",
        timestamp: new Date().toISOString(),
        hasAudio: !!audioBlob,
        audioSize: audioBlob?.size || 0,
      }

      if (isOnline) {
        // Try to submit directly
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consultationData),
        })

        if (response.ok) {
          alert("Consultation request submitted successfully!")
          resetForm()
        } else {
          throw new Error("Failed to submit consultation")
        }
      } else {
        // Store for offline sync
        await syncManager.addToSyncQueue("consultation", consultationData)

        // Store audio separately if present
        if (audioBlob) {
          await syncManager.cacheData(`audio_${Date.now()}`, "consultation_audio", audioBlob)
        }

        alert("You are offline. Your consultation request has been saved and will be sent when connection is restored.")
        resetForm()
        loadPendingSubmissions()
      }
    } catch (error) {
      console.error("Error submitting consultation:", error)

      // Fallback to offline storage
      try {
        const consultationData = {
          patientId,
          phoneNumber,
          consultationType: audioBlob ? "voice" : "text",
          symptoms: symptoms.trim(),
          urgency: "routine",
          timestamp: new Date().toISOString(),
        }

        await syncManager.addToSyncQueue("consultation", consultationData)
        alert("Connection failed. Your request has been saved and will be sent when connection is restored.")
        resetForm()
        loadPendingSubmissions()
      } catch (offlineError) {
        console.error("Failed to save offline:", offlineError)
        alert("Failed to submit consultation request. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSymptoms("")
    setAudioBlob(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Connection Status */}
      {!isOnline && (
        <Alert className="border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You are offline. Your consultation request will be saved and sent when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Submissions</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              {pendingSubmissions.length} consultation request(s) waiting to be sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingSubmissions.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <div className="font-medium text-sm">
                      {item.data.consultationType === "voice" ? "Voice" : "Text"} Consultation
                    </div>
                    <div className="text-xs text-gray-600">{new Date(item.data.timestamp).toLocaleString()}</div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              ))}
              {pendingSubmissions.length > 3 && (
                <div className="text-sm text-blue-700 text-center">+{pendingSubmissions.length - 3} more pending</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>
            Provide details about your health concern. You can type or record a voice message.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Written Description</label>
            <Textarea
              placeholder="Describe your symptoms, how long you've had them, and any other relevant information..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
            />
          </div>

          {/* Voice Recording */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice Message (Optional)</label>
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecording}
              maxDuration={180} // 3 minutes
            />
            {audioBlob && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Voice message recorded ({Math.round(audioBlob.size / 1024)}KB)</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={submitConsultation}
            disabled={isSubmitting || (!symptoms.trim() && !audioBlob)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : isOnline ? (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Consultation Request
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Save for Later (Offline)
              </>
            )}
          </Button>

          {/* Offline Instructions */}
          {!isOnline && (
            <div className="text-sm text-gray-600 text-center">
              Your request will be automatically sent when internet connection is restored. For emergencies, please call
              117 directly.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
