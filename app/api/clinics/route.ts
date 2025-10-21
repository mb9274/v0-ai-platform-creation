// import { createClient } from "@/lib/supabase/server"

// Once database tables are created, uncomment the Supabase code below

const FALLBACK_CLINICS = [
  {
    id: "1",
    name: "Princess Christian Maternity Hospital",
    address: "FQRJ+2CP Fourah Bay, Freetown",
    phone: "+232 76 888 999",
    email: "info@pcmh.sl",
    website: "https://pcmh.gov.sl",
    district: "Western Area Urban",
    latitude: 8.4903,
    longitude: -13.2189,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opening_time: "00:00:00",
    closing_time: "23:59:59",
    hours_description: "Open 24 hours",
    specialties: ["Maternal Health", "Prenatal Care", "Postnatal Care", "Emergency Obstetrics", "Neonatal Care"],
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Freetown Maternal Health Center",
    address: "15 Wilkinson Road, Freetown",
    phone: "+232 76 123 456",
    email: "info@fmhc.sl",
    district: "Western Area Urban",
    latitude: 8.4657,
    longitude: -13.2317,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opening_time: "08:00:00",
    closing_time: "17:00:00",
    specialties: ["Maternal Health", "Prenatal Care", "Postnatal Care"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bo Government Hospital",
    address: "Hospital Road, Bo",
    phone: "+232 76 234 567",
    email: "info@bogh.sl",
    district: "Bo",
    latitude: 7.9644,
    longitude: -11.7383,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opening_time: "08:00:00",
    closing_time: "17:00:00",
    specialties: ["Maternal Health", "Prenatal Care", "Postnatal Care"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Kenema Government Hospital",
    address: "Hangha Road, Kenema",
    phone: "+232 76 345 678",
    email: "info@kenemahosp.sl",
    district: "Kenema",
    latitude: 7.8767,
    longitude: -11.19,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opening_time: "08:00:00",
    closing_time: "17:00:00",
    specialties: ["Maternal Health", "Prenatal Care", "Postnatal Care"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Makeni Government Hospital",
    address: "Magburaka Road, Makeni",
    phone: "+232 76 456 789",
    email: "info@makenigh.sl",
    district: "Bombali",
    latitude: 8.8859,
    longitude: -12.0438,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opening_time: "08:00:00",
    closing_time: "17:00:00",
    specialties: ["Maternal Health", "Prenatal Care", "Postnatal Care"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Koidu Government Hospital",
    address: "Sefadu Road, Koidu",
    phone: "+232 76 567 890",
    email: "info@koidugh.sl",
    district: "Kono",
    latitude: 8.6439,
    longitude: -10.9708,
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opening_time: "08:00:00",
    closing_time: "17:00:00",
    specialties: ["Maternal Health", "Prenatal Care", "Postnatal Care"],
    is_featured: false,
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  // To enable database: uncomment the code below and comment out the return statement

  console.log("[v0] Using fallback clinic data (database tables not yet created)")
  return Response.json(FALLBACK_CLINICS)

  /* Uncomment this code once database tables are created:
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("clinics").select("*").order("is_featured.desc, name")

    if (error) {
      console.log("[v0] Database error, using fallback data:", error.message)
      return Response.json(FALLBACK_CLINICS)
    }

    return Response.json(data || FALLBACK_CLINICS)
  } catch (error) {
    console.log("[v0] Error fetching clinics, using fallback data")
    return Response.json(FALLBACK_CLINICS)
  }
  */
}
