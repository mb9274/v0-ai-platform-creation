"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, MapPin, Clock, AlertTriangle, Heart } from "lucide-react"

interface EmergencyService {
  id: string
  name: string
  phone: string
  description: string
  availability: string
  responseTime: string
  type: "medical" | "ambulance" | "mental" | "maternal"
}

const emergencyServices: EmergencyService[] = [
  {
    id: "1",
    name: "Emergency Medical Response",
    phone: "117",
    description: "24/7 emergency medical assistance and ambulance dispatch",
    availability: "24/7",
    responseTime: "15-30 minutes",
    type: "medical",
  },
  {
    id: "2",
    name: "Maternal Emergency Hotline",
    phone: "1234",
    description: "Specialized support for pregnancy and childbirth emergencies",
    availability: "24/7",
    responseTime: "Immediate",
    type: "maternal",
  },
  {
    id: "3",
    name: "Mental Health Crisis Line",
    phone: "5678",
    description: "Crisis intervention and mental health support",
    availability: "24/7",
    responseTime: "Immediate",
    type: "mental",
  },
  {
    id: "4",
    name: "Community Health Worker Network",
    phone: "9999",
    description: "Connect with local CHWs for immediate guidance",
    availability: "6AM - 10PM",
    responseTime: "5-15 minutes",
    type: "medical",
  },
]

const typeColors = {
  medical: "bg-red-100 text-red-800",
  ambulance: "bg-orange-100 text-orange-800",
  mental: "bg-blue-100 text-blue-800",
  maternal: "bg-pink-100 text-pink-800",
}

const typeIcons = {
  medical: Heart,
  ambulance: Phone,
  mental: MessageSquare,
  maternal: Heart,
}

export function EmergencyContact() {
  const [callingService, setCallingService] = useState<string | null>(null)

  const handleEmergencyCall = (service: EmergencyService) => {
    setCallingService(service.id)

    // In a real app, this would initiate the call
    console.log(`Calling emergency service: ${service.name} at ${service.phone}`)

    // Simulate call initiation
    setTimeout(() => {
      setCallingService(null)
    }, 3000)
  }

  const handleSMSEmergency = () => {
    // In a real app, this would send an SMS with location
    console.log("Sending emergency SMS with location")
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Emergency Services</h2>
        <p className="text-gray-600">Immediate access to healthcare emergency support</p>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Life-threatening emergency?</strong> Call 117 immediately or use the emergency button below. Your
          location will be automatically shared with emergency responders.
        </AlertDescription>
      </Alert>

      {/* Quick Emergency Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <Button
              onClick={() => handleEmergencyCall(emergencyServices[0])}
              disabled={callingService !== null}
              className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
            >
              {callingService === "1" ? (
                <>
                  <Phone className="h-6 w-6 mr-2 animate-pulse" />
                  Calling Emergency...
                </>
              ) : (
                <>
                  <Phone className="h-6 w-6 mr-2" />
                  Call Emergency (117)
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600 text-center mt-2">Immediate medical emergency response</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <Button
              onClick={handleSMSEmergency}
              variant="outline"
              className="w-full h-16 text-lg border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <MessageSquare className="h-6 w-6 mr-2" />
              Send Emergency SMS
            </Button>
            <p className="text-sm text-gray-600 text-center mt-2">SMS with your location to emergency contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Services List */}
      <div className="grid md:grid-cols-2 gap-6">
        {emergencyServices.map((service) => {
          const IconComponent = typeIcons[service.type]
          const isCurrentlyCalling = callingService === service.id

          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={typeColors[service.type]}>
                          {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {service.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Response: {service.responseTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Location shared</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEmergencyCall(service)}
                    disabled={callingService !== null}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isCurrentlyCalling ? (
                      <>
                        <Phone className="h-4 w-4 mr-2 animate-pulse" />
                        Calling {service.phone}...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Call {service.phone}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Emergency Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Emergency Preparation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-800">
            <li>• Keep emergency contact numbers saved in your phone</li>
            <li>• Share your location with trusted family members</li>
            <li>• Know the nearest health facility to your location</li>
            <li>• Keep basic first aid supplies at home</li>
            <li>• Learn basic first aid techniques through our health education content</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
