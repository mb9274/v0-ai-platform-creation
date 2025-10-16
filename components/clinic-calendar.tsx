"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  district: string
  available_days: string[]
  opening_time: string
  closing_time: string
}

interface ClinicCalendarProps {
  onSelectSlot?: (clinic: Clinic, date: Date, time: string) => void
}

export function ClinicCalendar({ onSelectSlot }: ClinicCalendarProps) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClinics()
  }, [])

  const fetchClinics = async () => {
    try {
      const response = await fetch("/api/clinics")
      if (response.ok) {
        const data = await response.json()
        setClinics(data)
        if (data.length > 0) {
          setSelectedClinic(data[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch clinics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isDateAvailable = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date >= today && selectedClinic?.available_days.includes(dayName)
  }

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  const handleDateSelect = (day: number) => {
    if (isDateAvailable(day)) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      setSelectedDate(date)
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedClinic && selectedDate && onSelectSlot) {
      onSelectSlot(selectedClinic, selectedDate, time)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading clinics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Clinic Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Select a Clinic</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className={`cursor-pointer transition-all ${
                selectedClinic?.id === clinic.id ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedClinic(clinic)}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{clinic.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {clinic.opening_time} - {clinic.closing_time}
                    </span>
                  </div>
                </div>
                <Badge className="mt-2 bg-green-100 text-green-800">{clinic.district}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedClinic && (
        <>
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select Date</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-base font-normal">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const available = isDateAvailable(day)
                  const isSelected =
                    selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth()

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      disabled={!available}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all
                        ${available ? "hover:bg-green-100 cursor-pointer" : "text-gray-300 cursor-not-allowed"}
                        ${isSelected ? "bg-green-600 text-white hover:bg-green-700" : ""}
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>Select Time</CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={selectedTime === time ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
