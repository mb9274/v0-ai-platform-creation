"use client"

import { Button } from "@/components/ui/button"
import { Heart, Stethoscope, Phone, MessageSquare, Globe, Calendar, Video } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function HealthWisePlatform() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="hero-gradient rounded-[3rem] mt-8 mb-12 p-12 md:p-16 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                YOUR MATERNAL HEALTH <span className="text-teal-900 font-extrabold">MATTERS</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                HealthWise is a one stop solution to learn about maternal health from the best in the field and also
                helps you to get help from the best healthcare providers near you
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-appointment">
                  <Button className="bg-white text-green-700 hover:bg-gray-50 rounded-xl px-8 py-6 text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/videos">
                  <Button className="bg-teal-800 text-white hover:bg-teal-900 rounded-xl px-8 py-6 text-lg font-semibold flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Watch Videos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-teal-800/20 rounded-full w-80 h-80 flex items-center justify-center">
                    <Heart className="h-32 w-32 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="stats-card-light rounded-3xl p-8 text-center shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-teal-700 mb-2">1M+</div>
            <div className="text-gray-600 font-medium">Active Patients</div>
          </div>

          <div className="stats-card-dark rounded-3xl p-8 text-center shadow-lg">
            <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
            <div className="text-white/80 font-medium">Doctors</div>
          </div>

          <div className="stats-card-light rounded-3xl p-8 text-center shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-teal-700 mb-2">1200+</div>
            <div className="text-gray-600 font-medium">Health Sessions</div>
          </div>

          <div className="stats-card-dark rounded-3xl p-8 text-center shadow-lg">
            <div className="text-4xl md:text-5xl font-bold mb-2">5M+</div>
            <div className="text-white/80 font-medium">Resources</div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Maternal Health Support
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/videos" className="block">
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Video className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Video Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Watch pregnancy training videos in multiple languages to learn at your own pace
                </p>
              </div>
            </Link>

            <Link href="/book-appointment" className="block">
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Book Appointments</h3>
                <p className="text-gray-600 leading-relaxed">
                  Schedule appointments with clinics in your area using our integrated calendar
                </p>
              </div>
            </Link>

            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Doctors</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with qualified healthcare providers for consultations
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Access Healthcare Your Way</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/dashboard" className="block">
              <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Web App</h3>
                <p className="text-gray-600 text-sm">Full-featured progressive web app</p>
              </div>
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                <Phone className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">USSD</h3>
              <p className="text-gray-600 text-sm">Dial *123# - no internet needed</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">SMS & WhatsApp</h3>
              <p className="text-gray-600 text-sm">Text-based learning</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                <Phone className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Voice Calls</h3>
              <p className="text-gray-600 text-sm">Audio consultations</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-12 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of mothers and families improving their health literacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button className="bg-white text-green-600 hover:bg-gray-50 rounded-xl px-8 py-6 text-lg font-semibold">
                Start Learning
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-xl px-8 py-6 text-lg font-semibold bg-transparent"
              >
                Explore Platform
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
