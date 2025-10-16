"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-teal-700 p-2 rounded-full">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Health<span className="font-normal">Wise</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
              Overview
            </Link>
            <Link href="/doctors" className="text-gray-600 hover:text-green-600 transition-colors">
              Doctors
            </Link>
            <Link href="/videos" className="text-gray-600 hover:text-green-600 transition-colors">
              Videos
            </Link>
            <Link href="/articles" className="text-gray-600 hover:text-green-600 transition-colors">
              Articles
            </Link>
            <Link href="/wellness" className="text-gray-600 hover:text-green-600 transition-colors">
              Wellness
            </Link>
            <Link href="/chat-ai" className="text-gray-600 hover:text-green-600 transition-colors">
              AI Assistant
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <select className="text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer">
              <option>English</option>
              <option>Krio</option>
              <option>Temne</option>
            </select>
            <Link href="/book-appointment">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
