"use client"

import { useState } from "react"
import { AudioConsultation } from "@/components/audio/audio-consultation"
import { VoiceRecorder } from "@/components/audio/voice-recorder"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mic, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ConsultationPage() {
  const [consultationType, setConsultationType] = useState<"voice" | "audio" | "text">("voice")
  const [isInConsultation, setIsInConsultation] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Healthcare Consultation</h1>
            <p className="text-gray-600">Connect with healthcare providers</p>
          </div>
        </div>

        {!isInConsultation ? (
          /* Consultation Type Selection */
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                consultationType === "voice" ? "ring-2 ring-green-500 bg-green-50" : ""
              }`}
              onClick={() => setConsultationType("voice")}
            >
              <CardHeader className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Voice Call</CardTitle>
                <CardDescription>Real-time voice consultation with healthcare provider</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                consultationType === "audio" ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setConsultationType("audio")}
            >
              <CardHeader className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <Mic className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Audio Messages</CardTitle>
                <CardDescription>Send and receive audio messages for consultation</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                consultationType === "text" ? "ring-2 ring-purple-500 bg-purple-50" : ""
              }`}
              onClick={() => setConsultationType("text")}
            >
              <CardHeader className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Text Chat</CardTitle>
                <CardDescription>Text-based consultation via chat interface</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : null}

        {/* Consultation Interface */}
        <div className="space-y-6">
          {consultationType === "voice" && (
            <AudioConsultation
              consultationId="cons_123"
              providerId="prov_456"
              onEnd={() => setIsInConsultation(false)}
            />
          )}

          {consultationType === "audio" && (
            <Card>
              <CardHeader>
                <CardTitle>Audio Message Consultation</CardTitle>
                <CardDescription>Record and send audio messages to your healthcare provider</CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceRecorder
                  onRecordingComplete={(audioBlob) => {
                    console.log("Audio recorded:", audioBlob)
                    // Handle audio message sending
                  }}
                />
              </CardContent>
            </Card>
          )}

          {consultationType === "text" && (
            <Card>
              <CardHeader>
                <CardTitle>Text Consultation</CardTitle>
                <CardDescription>Chat with your healthcare provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-500 text-center">Text chat interface would be implemented here</p>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button className="bg-green-600 hover:bg-green-700">Send</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isInConsultation && (
            <div className="text-center">
              <Button onClick={() => setIsInConsultation(true)} className="bg-green-600 hover:bg-green-700" size="lg">
                Start{" "}
                {consultationType === "voice"
                  ? "Voice Call"
                  : consultationType === "audio"
                    ? "Audio Messages"
                    : "Text Chat"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
