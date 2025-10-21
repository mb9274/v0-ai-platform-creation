// import { createClient } from "@/lib/supabase/server"

// Once database tables are created, uncomment the Supabase code below

const FALLBACK_VIDEOS = [
  {
    id: "1",
    title: "Prenatal Care Basics",
    description:
      "Essential prenatal care tips for a healthy pregnancy. Learn about regular checkups, nutrition, and warning signs.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/pregnant-woman-at-doctor.jpg",
    duration_minutes: 15,
    category: "Prenatal Care",
    language: "English",
    views: 1250,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Nutrition During Pregnancy",
    description:
      "What to eat and avoid during pregnancy for optimal health. Discover the best foods for you and your baby.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/healthy-pregnancy-food.png",
    duration_minutes: 20,
    category: "Nutrition",
    language: "English",
    views: 980,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Safe Exercises for Pregnant Women",
    description: "Gentle exercises to stay fit and healthy during pregnancy. Safe movements for each trimester.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/pregnant-woman-exercising.png",
    duration_minutes: 18,
    category: "Exercise",
    language: "English",
    views: 750,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Preparing for Labor and Delivery",
    description: "What to expect during labor and how to prepare. Breathing techniques and pain management strategies.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/woman-in-labor.jpg",
    duration_minutes: 25,
    category: "Labor & Delivery",
    language: "English",
    views: 1500,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Breastfeeding Techniques",
    description: "How to breastfeed your baby successfully. Proper latching, positioning, and common challenges.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/mother-breastfeeding-baby.jpg",
    duration_minutes: 22,
    category: "Breastfeeding",
    language: "English",
    views: 1100,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Postnatal Care for Mother",
    description: "Taking care of yourself after giving birth. Recovery tips, emotional health, and when to seek help.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/mother-with-newborn.jpg",
    duration_minutes: 16,
    category: "Postnatal Care",
    language: "English",
    views: 820,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Newborn Baby Care",
    description:
      "Essential tips for caring for your newborn. Bathing, diapering, sleep schedules, and soothing techniques.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/newborn-baby-care.jpg",
    duration_minutes: 20,
    category: "Baby Care",
    language: "English",
    views: 1350,
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  // To enable database: uncomment the code below and comment out the return statement

  console.log("[v0] Using fallback video data (database tables not yet created)")
  return Response.json(FALLBACK_VIDEOS)

  /* Uncomment this code once database tables are created:
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("pregnancy_videos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Database error, using fallback data:", error.message)
      return Response.json(FALLBACK_VIDEOS)
    }

    return Response.json(data || FALLBACK_VIDEOS)
  } catch (error) {
    console.log("[v0] Error fetching videos, using fallback data")
    return Response.json(FALLBACK_VIDEOS)
  }
  */
}
