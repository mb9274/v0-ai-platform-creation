"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Activity, Droplet, Moon, TrendingUp } from "lucide-react"

export function WellnessTracker() {
  const [metrics, setMetrics] = useState({
    waterIntake: 6,
    waterGoal: 8,
    steps: 5420,
    stepsGoal: 10000,
    sleep: 7,
    sleepGoal: 8,
    heartRate: 72,
  })

  return (
    <div className="space-y-6">
      {/* Daily Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
              <Droplet className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.waterIntake}/{metrics.waterGoal}
            </div>
            <p className="text-xs text-gray-600">glasses today</p>
            <Progress value={(metrics.waterIntake / metrics.waterGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Steps</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.steps.toLocaleString()}</div>
            <p className="text-xs text-gray-600">of {metrics.stepsGoal.toLocaleString()} goal</p>
            <Progress value={(metrics.steps / metrics.stepsGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Sleep</CardTitle>
              <Moon className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.sleep}/{metrics.sleepGoal}
            </div>
            <p className="text-xs text-gray-600">hours last night</p>
            <Progress value={(metrics.sleep / metrics.sleepGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.heartRate}</div>
            <p className="text-xs text-gray-600">bpm (normal)</p>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Healthy range
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Log Activity</CardTitle>
          <CardDescription>Track your daily wellness activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() =>
              setMetrics({ ...metrics, waterIntake: Math.min(metrics.waterIntake + 1, metrics.waterGoal) })
            }
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Droplet className="h-4 w-4 mr-2" />
            Log Water Glass
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <Activity className="h-4 w-4 mr-2" />
            Log Exercise
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <Moon className="h-4 w-4 mr-2" />
            Log Sleep
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
