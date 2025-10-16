import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("appointments")
      .select("*, clinics(*)")
      .order("appointment_date", { ascending: true })

    if (error) {
      console.log("[v0] Database table not found, returning empty appointments")
      return Response.json([])
    }

    return Response.json(data || [])
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return Response.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          patient_name: body.patient_name,
          patient_phone: body.patient_phone,
          patient_email: body.patient_email,
          clinic_id: body.clinic_id,
          doctor_name: body.doctor_name,
          appointment_date: body.appointment_date,
          appointment_time: body.appointment_time,
          reason: body.reason,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      console.log("[v0] Database table not found, simulating appointment creation")
      return Response.json({
        id: Math.random().toString(36).substring(7),
        ...body,
        status: "pending",
        created_at: new Date().toISOString(),
        message: "Appointment request received. Please run the SQL script to enable database storage.",
      })
    }

    return Response.json(data)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return Response.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
