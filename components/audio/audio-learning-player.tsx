"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Share2, Globe } from "lucide-react"

interface AudioLearningPlayerProps {
  title: string
  content: string
  audioScript: string
  language?: string
  onLanguageChange?: (language: string) => void
  keyPoints?: string[]
  culturalNotes?: string
}

export function AudioLearningPlayer({
  title,
  content,
  audioScript,
  language = "English",
  onLanguageChange,
  keyPoints = [],
  culturalNotes,
}: AudioLearningPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(language)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const languages = ["English", "Krio", "Temne", "Mende", "Fula", "Limba"]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      // Generate audio using speech synthesis
      await generateAudio()
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      await audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const generateAudio = async () => {
    try {
      setIsLoading(true)

      // Use Web Speech API for audio generation
      if ("speechSynthesis" in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        // Get voice configuration for the selected language
        const response = await fetch("/api/speech/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: audioScript,
            language: currentLanguage.toLowerCase(),
          }),
        })

        const { config } = await response.json()

        const utterance = new SpeechSynthesisUtterance(audioScript)
        utterance.lang = config.lang
        utterance.rate = config.rate * playbackRate
        utterance.pitch = config.pitch
        utterance.volume = isMuted ? 0 : volume

        utterance.onstart = () => {
          setIsPlaying(true)
          setIsLoading(false)
        }
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => {
          setIsPlaying(false)
          setIsLoading(false)
        }

        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Audio generation failed:", error)
      setIsLoading(false)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLanguageChange = async (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    if (onLanguageChange) {
      onLanguageChange(newLanguage)
    }

    // Stop current playback
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const downloadAudio = () => {
    // In a real implementation, this would download the generated audio file
    console.log("Downloading audio for offline use")
  }

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 100) + "...",
        url: window.location.href,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-pink-600" />
            <span>{title}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Globe className="h-3 w-3 mr-1" />
              {currentLanguage}
            </Badge>
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Audio Element (hidden, used for fallback) */}
        <audio ref={audioRef} className="hidden" />

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : "--:--"}</span>
          </div>
          <Progress
            value={duration ? (currentTime / duration) * 100 : 0}
            className="w-full cursor-pointer"
            onClick={(e) => {
              if (audioRef.current && duration) {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const newTime = (clickX / rect.width) * duration
                audioRef.current.currentTime = newTime
              }
            }}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={skipBackward}>
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-16 h-16 rounded-full bg-pink-600 hover:bg-pink-700"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={skipForward}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume and Speed Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="w-20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={downloadAudio}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={shareContent}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Content Display */}
        <div className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{content}</p>
          </div>

          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Points:</h4>
              <ul className="space-y-2">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cultural Notes */}
          {culturalNotes && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Cultural Context:</h4>
              <p className="text-blue-800 text-sm">{culturalNotes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
