"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Volume2, VolumeX } from "lucide-react"

interface VoiceNavigationProps {
  onCommand?: (command: string, confidence: number) => void
  language?: string
  isEnabled?: boolean
}

// Voice commands for navigation
const VOICE_COMMANDS = {
  en: {
    "book consultation": "book_consultation",
    "emergency help": "emergency",
    "health education": "health_education",
    "my appointments": "appointments",
    "call doctor": "call_doctor",
    "send message": "send_message",
    "go back": "go_back",
    "help me": "help",
    repeat: "repeat",
    yes: "confirm",
    no: "cancel",
  },
  kri: {
    "buk dokta": "book_consultation",
    emergency: "emergency",
    "helth tin dem": "health_education",
    "mi appointment dem": "appointments",
    "kol dokta": "call_doctor",
    "go bak": "go_back",
    "ep mi": "help",
  },
}

export function VoiceNavigation({ onCommand, language = "en", isEnabled = true }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = language === "kri" ? "en-SL" : "en-US"

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript.toLowerCase().trim()
        const confidence = result[0].confidence

        setLastCommand(transcript)
        setConfidence(confidence)

        // Match command
        const commands = VOICE_COMMANDS[language as keyof typeof VOICE_COMMANDS] || VOICE_COMMANDS.en
        const matchedCommand = Object.entries(commands).find(([phrase]) => transcript.includes(phrase.toLowerCase()))

        if (matchedCommand && onCommand) {
          onCommand(matchedCommand[1], confidence)
          speak(`Command recognized: ${matchedCommand[0]}`)
        } else {
          speak("Sorry, I didn't understand that command. Try saying 'help me' for available commands.")
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, onCommand])

  const startListening = () => {
    if (recognitionRef.current && isSupported && isEnabled) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        speak("Listening for your command...")
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if (synthRef.current && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "kri" ? "en-SL" : "en-US"
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const speakHelp = () => {
    const helpText =
      language === "kri"
        ? "Yu kin se: buk dokta, emergency, helth tin dem, mi appointment dem, kol dokta, go bak, ep mi"
        : "You can say: book consultation, emergency help, health education, my appointments, call doctor, go back, help me"

    speak(helpText)
  }

  if (!isSupported) {
    return null
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Voice Navigation</h3>
          <Badge variant={isListening ? "default" : "secondary"}>{isListening ? "Listening" : "Ready"}</Badge>
        </div>

        <div className="flex items-center justify-center space-x-3 mb-3">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!isEnabled || isSpeaking}
            className={`w-12 h-12 rounded-full ${
              isListening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Mic className={`h-6 w-6 ${isListening ? "animate-pulse" : ""}`} />
          </Button>

          <Button variant="outline" size="sm" onClick={speakHelp} disabled={isSpeaking} className="bg-transparent">
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {lastCommand && (
          <div className="text-center">
            <div className="text-sm text-gray-600">Last command:</div>
            <div className="font-medium">"{lastCommand}"</div>
            <div className="text-xs text-gray-500">Confidence: {Math.round(confidence * 100)}%</div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center mt-2">
          {language === "kri" ? "Tok to yu fon fo navigate" : "Speak to your phone to navigate"}
        </div>
      </CardContent>
    </Card>
  )
}
