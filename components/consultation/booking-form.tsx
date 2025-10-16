"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, Phone, MessageSquare, Video } from "lucide-react"

export function ConsultationBookingForm() {
  const [formData, setFormData] = useState({
    consultationType: "voice",
    urgency: "routine",
    symptoms: "",
    preferredTime: "",
    preferredDate: "",
    specialization: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate booking API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Consultation booking:", formData)
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-green-600" />
          <span>Book a Consultation</span>
        </CardTitle>
        <CardDescription>Connect with healthcare providers through your preferred method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">How would you like to consult?</Label>
            <RadioGroup
              value={formData.consultationType}
              onValueChange={(value) => handleInputChange("consultationType", value)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="voice" id="voice" />
                <Label htmlFor="voice" className="flex items-center space-x-2 cursor-pointer">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span>Voice Call</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center space-x-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>SMS/Text</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center space-x-2 cursor-pointer">
                  <Video className="h-4 w-4 text-purple-600" />
                  <span>Video Call</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label htmlFor="urgency">How urgent is this consultation?</Label>
            <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine - Within a few days</SelectItem>
                <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                <SelectItem value="emergency">Emergency - Immediate attention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization">Type of healthcare provider needed</Label>
            <Select
              value={formData.specialization}
              onValueChange={(value) => handleInputChange("specialization", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Practice</SelectItem>
                <SelectItem value="maternal">Maternal Health</SelectItem>
                <SelectItem value="pediatric">Child Health</SelectItem>
                <SelectItem value="mental">Mental Health</SelectItem>
                <SelectItem value="chronic">Chronic Disease Management</SelectItem>
                <SelectItem value="emergency">Emergency Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe your symptoms or health concern</Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe what you're experiencing..."
              value={formData.symptoms}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Preferred Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Preferred Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Preferred Time</span>
              </Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => handleInputChange("preferredTime", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  <SelectItem value="anytime">Anytime Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• A Community Health Worker will review your request</li>
              <li>• You'll be matched with an appropriate healthcare provider</li>
              <li>• You'll receive confirmation via your preferred contact method</li>
              <li>• Emergency cases are prioritized and handled immediately</li>
            </ul>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Booking Consultation..." : "Book Consultation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
