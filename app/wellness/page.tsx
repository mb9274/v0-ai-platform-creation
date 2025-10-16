import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WellnessTracker } from "@/components/wellness-tracker"

export default function WellnessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Wellness Tracker</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Monitor your daily health activities and maintain a healthy lifestyle
            </p>
          </div>

          {/* Tracker */}
          <WellnessTracker />
        </div>
      </main>
      <Footer />
    </div>
  )
}
