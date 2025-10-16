"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, User, MapPin } from "lucide-react"
import { signUpUser, signInUser } from "@/lib/database/users"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    location: "",
    language: "en",
    role: "patient",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let user
      if (isSignUp) {
        user = await signUpUser({
          phoneNumber: formData.phoneNumber,
          fullName: formData.fullName,
          location: formData.location,
          language: formData.language,
          role: formData.role,
        })
      } else {
        user = await signInUser(formData.phoneNumber)
      }

      // Store user in localStorage for demo purposes
      // In production, you'd use proper session management
      localStorage.setItem("healthconnect_user", JSON.stringify(user))

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "provider") {
        router.push("/provider")
      } else if (user.role === "chw") {
        router.push("/chw")
      } else {
        router.push("/patient")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      if (!isSignUp) {
        // If sign in failed, switch to sign up mode
        setIsSignUp(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-600">Welcome to HealthConnect</CardTitle>
        <CardDescription>
          {isSignUp ? "Create your account to access healthcare services" : "Enter your phone number to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Phone Number</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+232 XX XXX XXXX"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Your district/village"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="kri">Krio</SelectItem>
                    <SelectItem value="men">Mende</SelectItem>
                    <SelectItem value="tem">Temne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="chw">Community Health Worker</SelectItem>
                    <SelectItem value="provider">Healthcare Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Continue"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "New user? Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Alternative Access Methods:</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent">
              Dial *123# (USSD)
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              SMS: Text "HEALTH" to 1234
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
