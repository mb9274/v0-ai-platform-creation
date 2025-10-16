import { Heart, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">HealthWise</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering mothers and families across Sierra Leone with essential health knowledge in multiple local
              languages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/doctors" className="text-gray-400 hover:text-white transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="text-gray-400 hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-white transition-colors">
                  Health Articles
                </Link>
              </li>
              <li>
                <Link href="/wellness" className="text-gray-400 hover:text-white transition-colors">
                  Wellness Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chat-ai" className="text-gray-400 hover:text-white transition-colors">
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-gray-400 hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+232 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@healthwise.sl</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Freetown, Sierra Leone</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} HealthWise for Sierra Leone. All rights reserved.</p>
          <p className="mt-2">Improving health literacy in multiple local languages</p>
        </div>
      </div>
    </footer>
  )
}
