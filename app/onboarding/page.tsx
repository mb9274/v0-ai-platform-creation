"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ArrowRight, User, MapPin, Baby, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    district: "",
    language: "",
    pregnancyStatus: "",
    children: "",
    healthConcerns: "",
    learningGoals: "",
  })

  const districts = [
    "Western Area",
    "Bo",
    "Kenema",
    "Kailahun",
    "Kono",
    "Bombali",
    "Tonkolili",
    "Port Loko",
    "Kambia",
    "Moyamba",
    "Bonthe",
    "Pujehun",
    "Falaba",
    "Karene",
  ]

  const languages = ["English", "Krio", "Temne", "Mende", "Fula", "Limba"]

  const validateStep = (currentStep: number): boolean => {
    const newErrors: string[] = []

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.push("Please enter your full name")
      if (!formData.age || Number.parseInt(formData.age) < 1 || Number.parseInt(formData.age) > 120) {
        newErrors.push("Please enter a valid age")
      }
      if (!formData.language) newErrors.push("Please select your preferred language")
    }

    if (currentStep === 2) {
      if (!formData.district) newErrors.push("Please select your district")
      if (!formData.location.trim()) newErrors.push("Please enter your community or town")
      if (!formData.pregnancyStatus) newErrors.push("Please select your pregnancy status")
    }

    if (currentStep === 3) {
      if (!formData.healthConcerns.trim() && !formData.learningGoals.trim()) {
        newErrors.push("Please provide at least one health concern or learning goal")
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (!validateStep(step)) {
      return
    }

    if (step < 3) {
      setStep(step + 1)
      setErrors([]) // Clear errors when moving to next step
    } else {
      localStorage.setItem("healthwise-profile", JSON.stringify(formData))
      console.log("Form submitted:", formData)
      window.location.href = "/dashboard"
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthWise</h1>
                <p className="text-sm text-gray-600">Personal Information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-pink-600" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>Tell us about yourself so we can personalize your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Your age"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Preferred Language <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-pink-600 hover:bg-pink-700">
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location & Health Status */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-pink-600" />
                <span>Location & Health Status</span>
              </CardTitle>
              <CardDescription>Help us understand your location and current health situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    District <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Community/Town <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Your community or town"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Pregnancy Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.pregnancyStatus}
                  onValueChange={(value) => handleInputChange("pregnancyStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pregnant">Currently Pregnant</SelectItem>
                    <SelectItem value="planning">Planning Pregnancy</SelectItem>
                    <SelectItem value="postpartum">Recently Gave Birth</SelectItem>
                    <SelectItem value="not-pregnant">Not Pregnant</SelectItem>
                    <SelectItem value="prefer-not-say">Prefer Not to Say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="children">Number of Children (Optional)</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={(e) => handleInputChange("children", e.target.value)}
                  placeholder="Number of children you have"
                />
              </div>

              <Button onClick={handleNext} className="w-full bg-pink-600 hover:bg-pink-700">
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Learning Goals */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Baby className="h-5 w-5 text-pink-600" />
                <span>Learning Goals</span>
              </CardTitle>
              <CardDescription>
                What would you like to learn about? This helps us customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="healthConcerns">Current Health Concerns</Label>
                <Textarea
                  id="healthConcerns"
                  value={formData.healthConcerns}
                  onChange={(e) => handleInputChange("healthConcerns", e.target.value)}
                  placeholder="Any specific health concerns or questions you have..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningGoals">Learning Goals</Label>
                <Textarea
                  id="learningGoals"
                  value={formData.learningGoals}
                  onChange={(e) => handleInputChange("learningGoals", e.target.value)}
                  placeholder="What topics would you like to learn about? (e.g., pregnancy care, child nutrition, family planning...)"
                  rows={3}
                />
              </div>

              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Please provide at least one health concern or learning goal
              </p>

              <Button onClick={handleNext} className="w-full bg-pink-600 hover:bg-pink-700">
                Start Learning Journey <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        {step > 1 && (
          <div className="mt-4">
            <Button variant="outline" onClick={() => setStep(step - 1)} className="w-full">
              Go Back
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
