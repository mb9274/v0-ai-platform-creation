"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Video {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  duration_minutes: number
  category: string
  language: string
  views: number
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [loading, setLoading] = useState(true)

  const categories = [
    "All",
    "Prenatal Care",
    "Nutrition",
    "Exercise",
    "Labor & Delivery",
    "Postnatal Care",
    "Breastfeeding",
    "Baby Care",
  ]

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos")
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = selectedCategory === "All" ? videos : videos.filter((v) => v.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Pregnancy Training Videos</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch educational videos to learn about pregnancy, childbirth, and baby care
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="text-center py-12">Loading videos...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={video.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                      <Button size="lg" className="rounded-full bg-green-600 hover:bg-green-700">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-green-100 text-green-800">{video.category}</Badge>
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{video.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
