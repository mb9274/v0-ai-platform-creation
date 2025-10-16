"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mic, Play, Pause, Square, Send, Trash2 } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void
  maxDuration?: number
  autoStart?: boolean
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
  autoStart = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingProgress, setRecordingProgress] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (autoStart) {
      startRecording()
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoStart])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setDuration(0)
      setRecordingProgress(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1
          setRecordingProgress((newDuration / maxDuration) * 100)

          // Auto-stop at max duration
          if (newDuration >= maxDuration) {
            stopRecording()
          }

          return newDuration
        })
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setRecordingProgress(0)
    setIsPlaying(false)
  }

  const sendRecording = () => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob, duration)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Message</span>
          <Badge variant={isRecording ? "destructive" : "secondary"}>
            {isRecording ? "Recording" : audioBlob ? "Ready" : "Idle"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Progress */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Recording...</span>
              <span>
                {formatTime(duration)} / {formatTime(maxDuration)}
              </span>
            </div>
            <Progress value={recordingProgress} className="w-full" />
          </div>
        )}

        {/* Audio Element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3">
          {!audioBlob ? (
            // Recording controls
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full ${
                isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          ) : (
            // Playback and action controls
            <>
              <Button variant="outline" size="sm" onClick={playRecording} className="bg-transparent">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div className="text-center">
                <div className="text-lg font-semibold">{formatTime(duration)}</div>
                <div className="text-xs text-gray-500">Voice message</div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={deleteRecording}
                className="bg-transparent text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button onClick={sendRecording} size="sm" className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-600">
          {!audioBlob
            ? isRecording
              ? "Speak clearly into your microphone. Tap stop when finished."
              : "Tap the microphone to start recording your voice message."
            : "Review your message and tap send, or record a new one."}
        </div>
      </CardContent>
    </Card>
  )
}
