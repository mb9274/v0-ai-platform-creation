import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

interface DoctorCardProps {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  reviews: number
  availability: string
  languages: string[]
  image?: string
}

export function DoctorCard({
  id,
  name,
  specialty,
  location,
  rating,
  reviews,
  availability,
  languages,
  image,
}: DoctorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-600">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <p className="text-sm text-gray-600">{specialty}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-gray-500">({reviews} reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {availability}
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>
        <Link href={`/book-appointment?doctor=${id}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700">Book Appointment</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
