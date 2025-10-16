import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Volume2 } from "lucide-react"
import Link from "next/link"

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  language: string
  hasAudio: boolean
  image?: string
}

export function ArticleCard({ id, title, excerpt, category, readTime, language, hasAudio, image }: ArticleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      {image && (
        <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
          <span className="text-4xl">🏥</span>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className="bg-green-600">{category}</Badge>
          {hasAudio && (
            <div className="flex items-center text-xs text-gray-600">
              <Volume2 className="h-3 w-3 mr-1" />
              Audio
            </div>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {readTime}
          </div>
          <span>{language}</span>
        </div>
        <Link href={`/articles/${id}`} className="mt-4">
          <Button variant="outline" className="w-full bg-transparent">
            Read Article
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
