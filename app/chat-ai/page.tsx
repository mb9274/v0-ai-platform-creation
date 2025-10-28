"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Loader2 } from "lucide-react"
import { useChat } from "ai"

export default function ChatAIPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/health-assistant",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your HealthWise AI Assistant. I can help answer questions about maternal health, child care, disease prevention, and general wellness. How can I assist you today?",
      },
    ],
  })

  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const languages = ["English", "Krio", "Temne", "Mende"]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">HealthWise AI Assistant</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant answers to your health questions in your preferred language
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {languages.map((lang) => (
              <Badge
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                className={`cursor-pointer ${selectedLanguage === lang ? "bg-green-600" : ""}`}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </Badge>
            ))}
          </div>

          {/* Chat Interface */}
          <Card className="shadow-xl">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <span>AI Health Assistant</span>
              </CardTitle>
              <CardDescription className="text-green-50">
                Ask me anything about maternal health, child care, or general wellness
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`flex-1 rounded-lg p-4 ${
                        message.role === "user" ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-600">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 rounded-lg p-4 bg-gray-100">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask a health question..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 bg-white"
                onClick={() => {
                  const event = {
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>
                  handleInputChange({
                    target: { value: "What are the signs of a healthy pregnancy?" },
                  } as React.ChangeEvent<HTMLInputElement>)
                  setTimeout(() => handleSubmit(event), 100)
                }}
              >
                What are the signs of a healthy pregnancy?
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 bg-white"
                onClick={() => {
                  const event = {
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>
                  handleInputChange({
                    target: { value: "How can I prevent malaria?" },
                  } as React.ChangeEvent<HTMLInputElement>)
                  setTimeout(() => handleSubmit(event), 100)
                }}
              >
                How can I prevent malaria?
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 bg-white"
                onClick={() => {
                  const event = {
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>
                  handleInputChange({
                    target: { value: "What vaccinations does my baby need?" },
                  } as React.ChangeEvent<HTMLInputElement>)
                  setTimeout(() => handleSubmit(event), 100)
                }}
              >
                What vaccinations does my baby need?
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left h-auto py-3 bg-white"
                onClick={() => {
                  const event = {
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>
                  handleInputChange({
                    target: { value: "How do I know if I have postpartum depression?" },
                  } as React.ChangeEvent<HTMLInputElement>)
                  setTimeout(() => handleSubmit(event), 100)
                }}
              >
                How do I know if I have postpartum depression?
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
