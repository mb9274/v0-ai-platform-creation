import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const articles = [
  {
    id: "1",
    title: "Understanding Maternal Health: A Complete Guide",
    excerpt:
      "Learn about the essential aspects of maternal health, from prenatal care to postpartum recovery. This comprehensive guide covers everything expectant mothers need to know.",
    category: "Maternal Health",
    readTime: "8 min read",
    language: "English",
    hasAudio: true,
  },
  {
    id: "2",
    title: "Malaria Prevention in Sierra Leone",
    excerpt:
      "Discover effective strategies to prevent malaria, including the use of mosquito nets, proper medication, and environmental management.",
    category: "Disease Prevention",
    readTime: "5 min read",
    language: "Krio",
    hasAudio: true,
  },
  {
    id: "3",
    title: "Nutrition During Pregnancy",
    excerpt:
      "A detailed guide on proper nutrition for pregnant women, including essential vitamins, minerals, and dietary recommendations for a healthy pregnancy.",
    category: "Nutrition",
    readTime: "10 min read",
    language: "English",
    hasAudio: true,
  },
  {
    id: "4",
    title: "Child Vaccination Schedule",
    excerpt:
      "Complete vaccination schedule for children from birth to 5 years, including information about each vaccine and its importance.",
    category: "Child Health",
    readTime: "6 min read",
    language: "Temne",
    hasAudio: true,
  },
  {
    id: "5",
    title: "Breastfeeding Best Practices",
    excerpt:
      "Expert advice on breastfeeding techniques, common challenges, and solutions to ensure optimal nutrition for your newborn.",
    category: "Maternal Health",
    readTime: "7 min read",
    language: "English",
    hasAudio: true,
  },
  {
    id: "6",
    title: "Mental Health for New Mothers",
    excerpt:
      "Understanding postpartum depression and anxiety, recognizing symptoms, and finding support for mental health during motherhood.",
    category: "Mental Health",
    readTime: "9 min read",
    language: "Krio",
    hasAudio: true,
  },
]

const categories = ["All", "Maternal Health", "Child Health", "Disease Prevention", "Nutrition", "Mental Health"]

export default function ArticlesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Articles</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Educational content in multiple languages with audio support
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input type="text" placeholder="Search articles..." className="pl-10 py-6 text-lg" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`cursor-pointer ${category === "All" ? "bg-green-600" : ""}`}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
