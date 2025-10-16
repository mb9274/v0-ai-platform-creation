import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DoctorCard } from "@/components/doctor-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const doctors = [
  {
    id: "1",
    name: "Dr. Aminata Kamara",
    specialty: "Maternal Health Specialist",
    location: "Freetown Central Hospital",
    rating: 4.8,
    reviews: 124,
    availability: "Available Today",
    languages: ["English", "Krio", "Temne"],
  },
  {
    id: "2",
    name: "Dr. Mohamed Sesay",
    specialty: "General Practitioner",
    location: "Bo Government Hospital",
    rating: 4.6,
    reviews: 98,
    availability: "Available Tomorrow",
    languages: ["English", "Krio", "Mende"],
  },
  {
    id: "3",
    name: "Dr. Fatmata Koroma",
    specialty: "Pediatrician",
    location: "Makeni Regional Hospital",
    rating: 4.9,
    reviews: 156,
    availability: "Available Today",
    languages: ["English", "Krio", "Temne", "Limba"],
  },
  {
    id: "4",
    name: "Dr. Ibrahim Bangura",
    specialty: "Obstetrician",
    location: "Kenema Government Hospital",
    rating: 4.7,
    reviews: 112,
    availability: "Available This Week",
    languages: ["English", "Krio", "Mende"],
  },
]

export default function DoctorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with qualified healthcare professionals across Sierra Leone
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="pl-10 py-6 text-lg"
              />
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} {...doctor} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
