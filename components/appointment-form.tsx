"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Phone, Mail } from "lucide-react"
import { ClinicCalendar } from "./clinic-calendar"

interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  district: string
}

export function AppointmentForm({ doctorId }: { doctorId?: string }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_phone: "",
    patient_email: "",
    clinic_id: "",
    clinic_name: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleClinicSlotSelect = (clinic: Clinic, date: Date, time: string) => {
    setFormData({
      ...formData,
      clinic_id: clinic.id,
      clinic_name: clinic.name,
      appointment_date: date.toISOString().split("T")[0],
      appointment_time: time,
    })
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Failed to book appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Appointment Confirmed!</CardTitle>
          <CardDescription>Your appointment has been successfully booked.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {formData.patient_name}
            </p>
            <p>
              <strong>Clinic:</strong> {formData.clinic_name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(formData.appointment_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {formData.appointment_time}
            </p>
            <p className="text-gray-600 mt-4">You will receive a confirmation SMS shortly.</p>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false)
              setStep(1)
              setFormData({
                patient_name: "",
                patient_phone: "",
                patient_email: "",
                clinic_id: "",
                clinic_name: "",
                appointment_date: "",
                appointment_time: "",
                reason: "",
              })
            }}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <span className="font-medium">Select Clinic & Time</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-green-600 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="font-medium">Your Details</span>
          </div>
        </div>
      </div>

      {step === 1 && <ClinicCalendar onSelectSlot={handleClinicSlotSelect} />}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>
              Appointment at {formData.clinic_name} on {new Date(formData.appointment_date).toLocaleDateString()} at{" "}
              {formData.appointment_time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+232 XX XXX XXXX"
                    className="pl-10"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={formData.patient_email}
                    onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <textarea
                  id="reason"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Briefly describe your health concern..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Booking..." : "Confirm Appointment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
