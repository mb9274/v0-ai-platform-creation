"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Heart, Baby, Apple, Shield, Stethoscope, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const QUESTION_CATEGORIES = [
  {
    title: "Pregnancy Care",
    icon: Baby,
    questions: [
      "What are the stages of pregnancy?",
      "When should I go for antenatal checkups?",
      "What are danger signs during pregnancy?",
      "How can I have a healthy pregnancy?",
    ],
  },
  {
    title: "Nutrition",
    icon: Apple,
    questions: [
      "What foods should I eat during pregnancy?",
      "What foods should I avoid while pregnant?",
      "How much water should I drink daily?",
      "What vitamins do I need during pregnancy?",
    ],
  },
  {
    title: "Malaria Prevention",
    icon: Shield,
    questions: [
      "How can I protect myself from malaria?",
      "Why should I sleep under a treated net?",
      "How do I remove standing water?",
      "What are malaria symptoms during pregnancy?",
    ],
  },
  {
    title: "Baby Care",
    icon: Heart,
    questions: [
      "How do I care for my newborn baby?",
      "What should I know about breastfeeding?",
      "When should I start vaccinations?",
      "How do I know if my baby is healthy?",
    ],
  },
  {
    title: "Health Services",
    icon: Stethoscope,
    questions: [
      "Where can I find a clinic near me?",
      "How do I book an appointment?",
      "What services are available at health centers?",
      "When should I go to the hospital?",
    ],
  },
  {
    title: "Emergency Care",
    icon: AlertCircle,
    questions: [
      "What are pregnancy emergency signs?",
      "When should I call for help?",
      "What is the emergency number?",
      "How do I prepare for labor?",
    ],
  },
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setSelectedCategory(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const text = await response.text()
      const assistantMessage: Message = {
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-2xl z-50 transition-all hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
        </Button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-[420px] h-[650px] shadow-2xl z-50 flex flex-col border-2 border-green-100">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarFallback className="bg-white text-green-700 font-bold">
                  <Heart className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-base">HealthWise Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-xs text-green-50">Online • Ready to help</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-green-800 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/30 to-white">
            {messages.length === 0 && (
              <div className="space-y-4">
                {/* Welcome message */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-green-600 text-white">
                      <Heart className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-green-100">
                      <p className="text-sm font-medium text-gray-900 mb-2">👋 Welcome to HealthWise!</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        I'm your maternal health assistant. I can help you with pregnancy care, nutrition, malaria
                        prevention, baby care, and more. Choose a topic below or ask me anything!
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-2">{formatTime(new Date())}</p>
                  </div>
                </div>

                {/* Category selection */}
                {selectedCategory === null ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-600 px-1">Choose a topic:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {QUESTION_CATEGORIES.map((category, index) => {
                        const Icon = category.icon
                        return (
                          <Button
                            key={index}
                            onClick={() => setSelectedCategory(index)}
                            variant="outline"
                            className="h-auto py-3 px-3 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:shadow-md transition-all"
                          >
                            <Icon className="h-5 w-5 text-green-600" />
                            <span className="text-xs font-medium text-center">{category.title}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {QUESTION_CATEGORIES[selectedCategory].title}
                      </Badge>
                      <Button
                        onClick={() => setSelectedCategory(null)}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                      >
                        ← Back
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {QUESTION_CATEGORIES[selectedCategory].questions.map((question, qIndex) => (
                        <Button
                          key={qIndex}
                          onClick={() => handleSuggestedQuestion(question)}
                          variant="outline"
                          className="w-full h-auto py-3 px-4 text-left text-sm justify-start hover:bg-green-50 hover:text-green-700 hover:border-green-300 hover:shadow-sm transition-all"
                          disabled={isLoading}
                        >
                          <span className="text-green-600 mr-2">•</span>
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-green-600 text-white">
                      <Heart className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "flex flex-col items-end" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-sm"
                        : "bg-white text-gray-900 border border-green-100 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${message.role === "user" ? "mr-2" : "ml-2"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-green-600 text-white">
                    <Heart className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-green-100">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                disabled={isLoading}
                className="flex-1 rounded-full border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="rounded-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-10 w-10 shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by HealthWise AI • Always consult a doctor for medical advice
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
