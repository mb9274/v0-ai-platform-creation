"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react"

interface AudioConsultationProps {
  consultationId: string
  providerId: string
  onEnd?: () => void
}

export function AudioConsultation({ consultationId, providerId, onEnd }: AudioConsultationProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)

      setIsConnected(true)
      setIsRecording(true)

      // Start audio level monitoring
      monitorAudioLevel()
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    setIsConnected(false)
    setIsRecording(false)
    setDuration(0)
    setAudioLevel(0)

    onEnd?.()
  }

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const updateLevel = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average)

      if (isConnected) {
        requestAnimationFrame(updateLevel)
      }
    }

    updateLevel()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Audio Consultation</span>
        </CardTitle>
        <CardDescription>
          {isConnected ? `Connected - ${formatDuration(duration)}` : "Ready to connect"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="text-center">
          <Badge variant={isConnected ? "default" : "secondary"} className="mb-4">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>

          {/* Audio Level Indicator */}
          {isConnected && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex justify-center space-x-4">
          {!isConnected ? (
            <Button onClick={startCall} className="bg-green-600 hover:bg-green-700" size="lg">
              <Phone className="h-5 w-5 mr-2" />
              Start Call
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={toggleMute} className={isMuted ? "bg-red-50 border-red-300" : ""}>
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button variant="destructive" onClick={endCall} size="lg">
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            </>
          )}
        </div>

        {/* Call Information */}
        {isConnected && (
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>Provider ID: {providerId}</p>
            <p>Consultation ID: {consultationId}</p>
            <p className={`font-medium ${isMuted ? "text-red-600" : "text-green-600"}`}>
              {isMuted ? "Microphone Muted" : "Microphone Active"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
