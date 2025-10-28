"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Play,
  BookOpen,
  MessageCircle,
  Phone,
  Volume2,
  Globe,
  Baby,
  AlertTriangle,
  Shield,
  Droplets,
  Apple,
  Syringe,
} from "lucide-react"

const HEALTH_TOPICS = [
  {
    id: "malaria-protection",
    title: "Protect Yourself from Malaria",
    description: "Learn how to prevent malaria during pregnancy and protect your baby",
    icon: Shield,
    category: "Malaria Prevention",
    priority: "high",
    week: 1,
    estimatedTime: "15 min",
  },
  {
    id: "treated-nets",
    title: "Sleep Under Treated Nets",
    description: "Why insecticide-treated bed nets are essential for pregnant women",
    icon: Shield,
    category: "Malaria Prevention",
    priority: "high",
    week: 1,
    estimatedTime: "10 min",
  },
  {
    id: "standing-water",
    title: "Remove Standing Water",
    description: "Eliminate mosquito breeding sites around your home",
    icon: Droplets,
    category: "Malaria Prevention",
    priority: "high",
    week: 2,
    estimatedTime: "12 min",
  },
  {
    id: "malaria-prevention",
    title: "Malaria Prevention Strategies",
    description: "Complete guide to preventing malaria in Sierra Leone",
    icon: Shield,
    category: "Malaria Prevention",
    priority: "high",
    week: 2,
    estimatedTime: "20 min",
  },
  {
    id: "pregnancy-nutrition",
    title: "Nutrition During Pregnancy",
    description: "Essential nutrients and foods for a healthy pregnancy",
    icon: Apple,
    category: "Pregnancy Care",
    priority: "high",
    week: 3,
    estimatedTime: "18 min",
  },
  {
    id: "infectious-diseases",
    title: "Infectious Diseases Prevention",
    description: "Protect yourself and your baby from common infections",
    icon: Syringe,
    category: "Healthcare",
    priority: "high",
    week: 3,
    estimatedTime: "15 min",
  },
  {
    id: "pregnancy-care",
    title: "Comprehensive Pregnancy Care",
    description: "Complete guide to prenatal care and healthy pregnancy",
    icon: Baby,
    category: "Pregnancy Care",
    priority: "high",
    week: 4,
    estimatedTime: "25 min",
  },
  {
    id: "antenatal-visits",
    title: "Antenatal Care Visits",
    description: "When and why to visit the clinic during pregnancy",
    icon: Heart,
    category: "Healthcare",
    priority: "high",
    week: 4,
    estimatedTime: "15 min",
  },
  {
    id: "danger-signs",
    title: "Pregnancy Danger Signs",
    description: "Warning signs that require immediate medical attention",
    icon: AlertTriangle,
    category: "Healthcare",
    priority: "high",
    week: 5,
    estimatedTime: "12 min",
  },
  {
    id: "birth-preparation",
    title: "Preparing for Birth",
    description: "What to expect and how to prepare for delivery",
    icon: Baby,
    category: "Pregnancy Care",
    priority: "medium",
    week: 6,
    estimatedTime: "20 min",
  },
]

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null)
  const [learningPlan, setLearningPlan] = useState(null)
  const [currentContent, setCurrentContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Load user profile from localStorage (from onboarding)
    const profile = localStorage.getItem("healthwise-profile")
    if (profile) {
      const parsedProfile = JSON.parse(profile)
      setUserProfile(parsedProfile)
      loadPersonalizedPlan(parsedProfile)
    }
    setIsLoading(false)
  }, [])

  const loadPersonalizedPlan = async (profile) => {
    try {
      const response = await fetch("/api/ai/personalized-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile: profile }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Failed to load personalized plan:", errorText)
        setLearningPlan({ weeklyTopics: HEALTH_TOPICS, urgentAlerts: [] })
        return
      }

      const data = await response.json()
      setLearningPlan(data.plan)
    } catch (error) {
      console.error("[v0] Failed to load personalized plan:", error)
      setLearningPlan({ weeklyTopics: HEALTH_TOPICS, urgentAlerts: [] })
    }
  }

  const loadHealthContent = async (topic) => {
    try {
      const response = await fetch("/api/ai/health-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          language: userProfile?.language || "English",
          userProfile,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Failed to load health content:", errorText)
        return
      }

      const data = await response.json()
      setCurrentContent(data.content)
    } catch (error) {
      console.error("[v0] Failed to load health content:", error)
    }
  }

  const playAudio = async (text) => {
    if ("speechSynthesis" in window) {
      try {
        // Stop any current speech
        window.speechSynthesis.cancel()

        // Get voice configuration
        const response = await fetch("/api/speech/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            language: userProfile?.language?.toLowerCase() || "en",
          }),
        })

        // Check if response is OK before parsing JSON
        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] Failed to get speech config:", errorText)
          // Fall back to default speech synthesis
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = "en-US"
          utterance.onstart = () => setIsPlaying(true)
          utterance.onend = () => setIsPlaying(false)
          utterance.onerror = () => setIsPlaying(false)
          window.speechSynthesis.speak(utterance)
          return
        }

        const { config } = await response.json()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = config.lang
        utterance.rate = config.rate
        utterance.pitch = config.pitch

        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)

        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("[v0] Speech synthesis error:", error)
        setIsPlaying(false)
      }
    }
  }

  const translateContent = async (text, targetLanguage) => {
    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage,
          context: "maternal health education",
        }),
      })

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Translation failed:", errorText)
        return text // Return original text if translation fails
      }

      const data = await response.json()
      return data.translatedText
    } catch (error) {
      console.error("[v0] Translation error:", error)
      return text // Return original text if translation fails
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your personalized health journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthWise for Sierra Leone</h1>
                <p className="text-sm text-gray-600">Welcome back, {userProfile?.name || "Learner"}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Globe className="h-3 w-3 mr-1" />
                {userProfile?.language || "English"}
              </Badge>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Emergency Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Emergency Hotline</p>
                  <p className="text-2xl font-bold">117</p>
                </div>
                <Phone className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">USSD Access</p>
                  <p className="text-2xl font-bold">*737#</p>
                </div>
                <MessageCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100">WhatsApp Bot</p>
                  <p className="text-lg font-bold">+232-XX-XXX</p>
                </div>
                <MessageCircle className="h-8 w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-lime-500 to-lime-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lime-100">Voice Learning</p>
                  <p className="text-lg font-bold">Available</p>
                </div>
                <Volume2 className="h-8 w-8 text-lime-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="learning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learning">Learning Path</TabsTrigger>
            <TabsTrigger value="content">Health Content</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Learning Path Tab */}
          <TabsContent value="learning" className="space-y-6">
            {learningPlan && (
              <>
                {/* Urgent Alerts */}
                {learningPlan.urgentAlerts?.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-800">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Important Health Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {learningPlan.urgentAlerts.map((alert, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-orange-800">{alert}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Weekly Learning Topics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(learningPlan.weeklyTopics || HEALTH_TOPICS).map((topic, index) => {
                    const IconComponent = topic.icon || BookOpen
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow border-green-200">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant={
                                topic.priority === "high"
                                  ? "destructive"
                                  : topic.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className={topic.priority === "high" ? "bg-green-600" : ""}
                            >
                              Week {topic.week}
                            </Badge>
                            <span className="text-sm text-gray-500">{topic.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-lg">{topic.title || topic.topic}</CardTitle>
                          </div>
                          <CardDescription>{topic.description}</CardDescription>
                          {topic.category && (
                            <Badge variant="outline" className="mt-2 w-fit">
                              {topic.category}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => loadHealthContent(topic.title || topic.topic)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Learn
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => playAudio(topic.description)}
                              disabled={isPlaying}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </TabsContent>

          {/* Health Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {currentContent ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Baby className="h-5 w-5 mr-2 text-pink-600" />
                      {currentContent.title}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playAudio(currentContent.audioScript)}
                      disabled={isPlaying}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isPlaying ? "Playing..." : "Listen"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{currentContent.content}</p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Points:</h4>
                    <ul className="space-y-2">
                      {currentContent.keyPoints?.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Items */}
                  {currentContent.actionItems?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What You Can Do:</h4>
                      <div className="space-y-2">
                        {currentContent.actionItems.map((action, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span className="text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cultural Notes */}
                  {currentContent.culturalNotes && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Cultural Context:</h4>
                      <p className="text-blue-800 text-sm">{currentContent.culturalNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Topic to Learn</h3>
                  <p className="text-gray-600">
                    Choose a topic from your learning path to get started with personalized health education.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Your health education journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Maternal Health</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Child Care</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  {userProfile && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span>
                          {userProfile.location}, {userProfile.district}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span>{userProfile.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span>{userProfile.pregnancyStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Children:</span>
                        <span>{userProfile.children || 0}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
                <CardDescription>Connect with other mothers and health workers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600 mb-4">Community features will be available soon. For now, you can:</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency Hotline: 117
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Text USSD: *737#
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
