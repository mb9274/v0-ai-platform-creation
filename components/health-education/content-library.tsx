"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import { Search, Play, Clock, Users, Heart, Baby, Brain, Shield } from "lucide-react"

interface HealthContent {
  id: string
  title: string
  description: string
  category: string
  language: string
  duration: string
  targetAudience: string
  audioUrl: string
  transcript?: string
}

const healthContent: HealthContent[] = [
  {
    id: "1",
    title: "Malaria Prevention and Treatment",
    description: "Learn how to prevent malaria and recognize early symptoms",
    category: "Disease Prevention",
    language: "English",
    duration: "8:30",
    targetAudience: "General",
    audioUrl: "/audio/malaria-prevention.mp3",
  },
  {
    id: "2",
    title: "Safe Pregnancy and Childbirth",
    description: "Essential information for expectant mothers",
    category: "Maternal Health",
    language: "Krio",
    duration: "12:15",
    targetAudience: "Pregnant Women",
    audioUrl: "/audio/safe-pregnancy-krio.mp3",
  },
  {
    id: "3",
    title: "Child Nutrition and Growth",
    description: "Proper nutrition for healthy child development",
    category: "Child Health",
    language: "English",
    duration: "10:45",
    targetAudience: "Parents",
    audioUrl: "/audio/child-nutrition.mp3",
  },
  {
    id: "4",
    title: "Mental Health and Wellbeing",
    description: "Understanding and managing stress and anxiety",
    category: "Mental Health",
    language: "Mende",
    duration: "15:20",
    targetAudience: "General",
    audioUrl: "/audio/mental-health-mende.mp3",
  },
  {
    id: "5",
    title: "Diabetes Management",
    description: "Living well with diabetes through diet and lifestyle",
    category: "Chronic Disease",
    language: "English",
    duration: "11:30",
    targetAudience: "Adults",
    audioUrl: "/audio/diabetes-management.mp3",
  },
  {
    id: "6",
    title: "Emergency First Aid",
    description: "Basic first aid techniques for common emergencies",
    category: "Emergency Care",
    language: "Temne",
    duration: "9:45",
    targetAudience: "General",
    audioUrl: "/audio/first-aid-temne.mp3",
  },
]

const categoryIcons = {
  "Disease Prevention": Shield,
  "Maternal Health": Heart,
  "Child Health": Baby,
  "Mental Health": Brain,
  "Chronic Disease": Heart,
  "Emergency Care": Shield,
}

export function HealthContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [playingContent, setPlayingContent] = useState<string | null>(null)

  const filteredContent = healthContent.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory
    const matchesLanguage = selectedLanguage === "all" || content.language === selectedLanguage

    return matchesSearch && matchesCategory && matchesLanguage
  })

  const categories = Array.from(new Set(healthContent.map((content) => content.category)))
  const languages = Array.from(new Set(healthContent.map((content) => content.language)))

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Education Library</h2>
        <p className="text-gray-600">Audio-first health content in local languages</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search health topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => {
          const IconComponent = categoryIcons[content.category as keyof typeof categoryIcons] || Heart

          return (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {content.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {content.language}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                <CardDescription>{content.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{content.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{content.targetAudience}</span>
                  </div>
                </div>

                {playingContent === content.id ? (
                  <AudioPlayer
                    src={content.audioUrl}
                    title={content.title}
                    description={`${content.duration} • ${content.language}`}
                    autoPlay={true}
                  />
                ) : (
                  <Button
                    onClick={() => setPlayingContent(content.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play Audio
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No health content found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedLanguage("all")
              }}
              className="mt-4 bg-transparent"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
